import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, vehicles } from "@bwash/database";
import { eq } from "drizzle-orm";
import { z } from "zod";

const vehicleSchema = z.object({
  make: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.string().optional().transform((v) => (v ? parseInt(v) : undefined)),
  color: z.string().max(50).optional(),
  licensePlate: z.string().max(20).optional(),
  vehicleType: z.enum(["sedan", "suv", "truck"]),
});

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const data = vehicleSchema.parse(body);

    const [vehicle] = await db
      .insert(vehicles)
      .values({
        userId: user.id,
        make: data.make,
        model: data.model,
        year: data.year,
        color: data.color || null,
        licensePlate: data.licensePlate || null,
        vehicleType: data.vehicleType,
      })
      .returning();

    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error("Vehicle creation error:", error);
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}
