import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings, packages } from "@bwash/database";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { notifyBookingCreated } from "@/lib/notifications";
import { sendBookingConfirmation } from "@/lib/email";
import { formatDate, formatTime } from "@/lib/utils";

const bookingSchema = z.object({
  fullName: z.string().min(2).max(200),
  phone: z.string().min(7).max(20),
  email: z.string().email().max(255),
  address: z.string().min(5).max(500),
  vehicleType: z.enum(["sedan", "suv", "truck"]),
  packageSlug: z.string().min(1),
  preferredDate: z.string().min(1),
  preferredTime: z.string().min(1),
  notes: z.string().max(1000).optional(),
  accessNotes: z.string().max(500).optional(),
  tipAmount: z.number().min(0).max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = bookingSchema.parse(body);

    // Find package
    const [pkg] = await db
      .select()
      .from(packages)
      .where(eq(packages.slug, data.packageSlug))
      .limit(1);

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 400 });
    }

    // Calculate price
    const priceMap = {
      sedan: pkg.sedanPrice,
      suv: pkg.suvPrice,
      truck: pkg.truckPrice,
    };
    const price = priceMap[data.vehicleType];

    // Check if user is authenticated
    const { userId: clerkId } = await auth();
    let userId: string | null = null;

    if (clerkId) {
      // Look up internal user ID from clerkId
      const { users } = await import("@bwash/database");
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkId))
        .limit(1);
      if (user) userId = user.id;
    }

    // Create booking
    const [booking] = await db
      .insert(bookings)
      .values({
        userId,
        packageId: pkg.id,
        vehicleType: data.vehicleType,
        address: data.address,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        notes: data.notes || null,
        accessNotes: data.accessNotes || null,
        price,
        tipAmount: data.tipAmount ? data.tipAmount.toFixed(2) : "0.00",
        guestName: userId ? null : data.fullName,
        guestEmail: userId ? null : data.email,
        guestPhone: userId ? null : data.phone,
        status: "new",
        paymentStatus: "pending",
      })
      .returning();

    // Send notification + email
    if (userId) {
      notifyBookingCreated(userId, booking.id).catch(() => {});
    }
    sendBookingConfirmation(data.email, {
      name: data.fullName,
      date: formatDate(data.preferredDate),
      time: formatTime(data.preferredTime),
      packageName: pkg.name,
      address: data.address,
      price: parseFloat(price).toFixed(2),
    }).catch(() => {});

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
