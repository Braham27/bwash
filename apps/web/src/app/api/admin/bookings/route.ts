import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, bookings, bookingStatusHistory } from "@bwash/database";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  notifyBookingConfirmed,
  notifyBookingAssigned,
  notifyBookingStarted,
  notifyBookingCompleted,
  notifyStaffNewJob,
} from "@/lib/notifications";

const updateSchema = z.object({
  bookingId: z.string().uuid(),
  status: z.enum(["confirmed", "assigned", "in_progress", "completed", "cancelled"]),
  staffId: z.string().uuid().optional(),
  notes: z.string().optional(),
});

async function requireAdmin(clerkId: string) {
  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) return null;
  return user;
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = await requireAdmin(clerkId);
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { bookingId, status, staffId, notes } = updateSchema.parse(body);

    const statusTimestampMap: Record<string, string> = {
      confirmed: "confirmedAt",
      assigned: "assignedAt",
      in_progress: "startedAt",
      completed: "completedAt",
      cancelled: "cancelledAt",
    };

    const updateData: Record<string, unknown> = {
      status,
      ...(staffId ? { staffId } : {}),
      ...(statusTimestampMap[status] ? { [statusTimestampMap[status]]: new Date() } : {}),
    };

    await db.update(bookings).set(updateData).where(eq(bookings.id, bookingId));

    await db.insert(bookingStatusHistory).values({
      bookingId,
      status,
      changedBy: admin.id,
      notes: notes || null,
    });

    // Send notifications
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
    if (booking?.userId) {
      if (status === "confirmed") {
        notifyBookingConfirmed(booking.userId, bookingId, booking.preferredDate).catch(() => {});
      }
      if (status === "assigned" && staffId) {
        const [staff] = await db.select().from(users).where(eq(users.id, staffId)).limit(1);
        const staffName = staff ? `${staff.firstName} ${staff.lastName}` : "A staff member";
        notifyBookingAssigned(booking.userId, bookingId, staffName).catch(() => {});
        notifyStaffNewJob(staffId, bookingId, booking.preferredDate).catch(() => {});
      }
      if (status === "in_progress") {
        notifyBookingStarted(booking.userId, bookingId).catch(() => {});
      }
      if (status === "completed") {
        notifyBookingCompleted(booking.userId, bookingId).catch(() => {});
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error("Admin booking update error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
