import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, testimonials } from "@bwash/database";
import { eq } from "drizzle-orm";
import { z } from "zod";

const testimonialSchema = z.object({
  name: z.string().min(1).max(100),
  vehicleType: z.string().max(200).optional(),
  text: z.string().min(1).max(1000),
  rating: z.number().int().min(1).max(5),
});

async function requireAdmin(clerkId: string) {
  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) return null;
  return user;
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = await requireAdmin(clerkId);
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const data = testimonialSchema.parse(body);

    const [testimonial] = await db
      .insert(testimonials)
      .values({
        name: data.name,
        vehicleType: data.vehicleType || null,
        text: data.text,
        rating: data.rating,
      })
      .returning();

    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error("Testimonial creation error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
