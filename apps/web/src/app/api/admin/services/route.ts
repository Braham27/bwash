import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, packages } from "@bwash/database";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

const packageSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().optional(),
  sedanPrice: z.number().min(0),
  suvPrice: z.number().min(0),
  truckPrice: z.number().min(0),
  duration: z.number().int().min(15).default(60),
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
    const data = packageSchema.parse(body);

    const [maxOrder] = await db
      .select({ max: sql<number>`COALESCE(MAX(${packages.sortOrder}), 0)` })
      .from(packages);

    const [pkg] = await db
      .insert(packages)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        sedanPrice: data.sedanPrice.toFixed(2),
        suvPrice: data.suvPrice.toFixed(2),
        truckPrice: data.truckPrice.toFixed(2),
        sortOrder: (maxOrder?.max || 0) + 1,
      })
      .returning();

    return NextResponse.json({ success: true, package: pkg });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error("Service creation error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
