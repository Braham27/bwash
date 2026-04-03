import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, serviceAreas } from "@bwash/database";
import { eq } from "drizzle-orm";
import { z } from "zod";

const areaSchema = z.object({
  name: z.string().min(1).max(200),
  zipCode: z.string().min(3).max(20),
  city: z.string().min(1).max(100),
  state: z.string().min(2).max(2),
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
    const data = areaSchema.parse(body);

    const [area] = await db.insert(serviceAreas).values(data).returning();

    return NextResponse.json({ success: true, area });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error("Area creation error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
