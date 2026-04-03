import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, bookings, bookingStatusHistory } from "@bwash/database";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const updateSchema = z.object({
  bookingId: z.string().uuid(),
  status: z.enum(["in_progress", "completed"]).optional(),
  notes: z.string().optional(),
  staffNotes: z.string().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
    if (!user || (user.role !== "staff" && user.role !== "admin" && user.role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { bookingId, status, notes, staffNotes } = updateSchema.parse(body);

    // Verify the booking is actually assigned to this staff member
    const [booking] = await db
      .select()
      .from(bookings)
      .where(and(eq(bookings.id, bookingId), eq(bookings.staffId, user.id)))
      .limit(1);

    if (!booking) {
      return NextResponse.json({ error: "Booking not found or not assigned to you" }, { status: 404 });
    }

    // If only saving staff notes (no status change)
    if (!status && staffNotes !== undefined) {
      await db.update(bookings).set({ staffNotes }).where(eq(bookings.id, bookingId));
      return NextResponse.json({ success: true });
    }

    if (!status) {
      return NextResponse.json({ error: "Status or staffNotes required" }, { status: 400 });
    }

    // Validate status transition
    if (status === "in_progress" && booking.status !== "assigned") {
      return NextResponse.json({ error: "Can only start assigned jobs" }, { status: 400 });
    }
    if (status === "completed" && booking.status !== "in_progress") {
      return NextResponse.json({ error: "Can only complete in-progress jobs" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { status };
    if (status === "in_progress") updateData.startedAt = new Date();
    if (status === "completed") updateData.completedAt = new Date();

    await db.update(bookings).set(updateData).where(eq(bookings.id, bookingId));

    await db.insert(bookingStatusHistory).values({
      bookingId,
      status,
      changedBy: user.id,
      notes: notes || null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error("Staff job update error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
