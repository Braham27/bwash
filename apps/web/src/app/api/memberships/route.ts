import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, memberships, membershipPlans, packages, vehicles } from "@bwash/database";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { notifyMembershipActivated } from "@/lib/notifications";
import { sendMembershipWelcome } from "@/lib/email";
import { formatCurrency } from "@/lib/utils";

const subscribeSchema = z.object({
  planId: z.string().uuid(),
  vehicleId: z.string().uuid().optional(),
  vehicleType: z.enum(["sedan", "suv", "truck"]),
});

const manageSchema = z.object({
  membershipId: z.string().uuid(),
  action: z.enum(["pause", "cancel", "resume"]),
});

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userMemberships = await db
      .select({ membership: memberships, plan: membershipPlans, package: packages })
      .from(memberships)
      .innerJoin(membershipPlans, eq(memberships.planId, membershipPlans.id))
      .innerJoin(packages, eq(membershipPlans.packageId, packages.id))
      .where(eq(memberships.userId, user.id));

    return NextResponse.json({ memberships: userMemberships });
  } catch (error) {
    console.error("Membership fetch error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await request.json();
    const data = subscribeSchema.parse(body);

    // Get the plan
    const [plan] = await db
      .select({ plan: membershipPlans, package: packages })
      .from(membershipPlans)
      .innerJoin(packages, eq(membershipPlans.packageId, packages.id))
      .where(and(eq(membershipPlans.id, data.planId), eq(membershipPlans.isActive, true)))
      .limit(1);

    if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

    // Check for existing active membership with same plan
    const [existing] = await db
      .select()
      .from(memberships)
      .where(
        and(
          eq(memberships.userId, user.id),
          eq(memberships.planId, data.planId),
          eq(memberships.status, "active")
        )
      )
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "You already have an active membership for this plan" }, { status: 409 });
    }

    // Calculate price based on vehicle type
    const priceMap = {
      sedan: plan.plan.sedanPrice,
      suv: plan.plan.suvPrice,
      truck: plan.plan.truckPrice,
    };
    const price = priceMap[data.vehicleType];

    // Calculate next service date
    const startDate = new Date();
    const intervalDays = { weekly: 7, biweekly: 14, monthly: 30 };
    const nextService = new Date(startDate);
    nextService.setDate(nextService.getDate() + intervalDays[plan.plan.interval]);

    const [membership] = await db
      .insert(memberships)
      .values({
        userId: user.id,
        planId: data.planId,
        vehicleId: data.vehicleId || null,
        status: "active",
        startDate: startDate.toISOString().split("T")[0],
        nextServiceDate: nextService.toISOString().split("T")[0],
        price,
      })
      .returning();

    // Send notification + email
    notifyMembershipActivated(user.id, plan.plan.name).catch(() => {});
    sendMembershipWelcome(user.email, {
      name: user.firstName,
      planName: plan.plan.name,
      interval: plan.plan.interval,
      price: formatCurrency(price),
    }).catch(() => {});

    return NextResponse.json({ success: true, membership });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error("Membership subscribe error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await request.json();
    const { membershipId, action } = manageSchema.parse(body);

    // Verify ownership
    const [membership] = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.id, membershipId), eq(memberships.userId, user.id)))
      .limit(1);

    if (!membership) {
      return NextResponse.json({ error: "Membership not found" }, { status: 404 });
    }

    const statusMap = {
      pause: "paused" as const,
      cancel: "cancelled" as const,
      resume: "active" as const,
    };

    const newStatus = statusMap[action];

    // Validate transitions
    if (action === "pause" && membership.status !== "active") {
      return NextResponse.json({ error: "Can only pause active memberships" }, { status: 400 });
    }
    if (action === "resume" && membership.status !== "paused") {
      return NextResponse.json({ error: "Can only resume paused memberships" }, { status: 400 });
    }
    if (action === "cancel" && membership.status === "cancelled") {
      return NextResponse.json({ error: "Already cancelled" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { status: newStatus };
    if (action === "cancel") updateData.endDate = new Date().toISOString().split("T")[0];

    await db.update(memberships).set(updateData).where(eq(memberships.id, membershipId));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error("Membership manage error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
