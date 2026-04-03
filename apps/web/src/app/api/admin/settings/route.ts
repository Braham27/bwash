import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, businessSettings } from "@bwash/database";
import { eq } from "drizzle-orm";
import { z } from "zod";

const settingsSchema = z.object({
  businessName: z.string().min(1).max(200),
  phone: z.string().max(20),
  email: z.string().email(),
  taxRate: z.number().min(0).max(100),
  businessHoursStart: z.string(),
  businessHoursEnd: z.string(),
  businessDays: z.array(z.string()),
  whatsappNumber: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
});

async function requireAdmin(clerkId: string) {
  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) return null;
  return user;
}

async function upsertSetting(key: string, value: string, description?: string) {
  const [existing] = await db
    .select()
    .from(businessSettings)
    .where(eq(businessSettings.key, key))
    .limit(1);

  if (existing) {
    await db
      .update(businessSettings)
      .set({ value, updatedAt: new Date() })
      .where(eq(businessSettings.key, key));
  } else {
    await db.insert(businessSettings).values({ key, value, description: description || null });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = await requireAdmin(clerkId);
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const data = settingsSchema.parse(body);

    // Upsert each setting as key-value pair
    await upsertSetting("business_name", data.businessName, "Business display name");
    await upsertSetting("phone", data.phone, "Business phone number");
    await upsertSetting("email", data.email, "Business email address");
    await upsertSetting("tax_rate", (data.taxRate / 100).toFixed(4), "Tax rate as decimal");
    await upsertSetting("business_hours_start", data.businessHoursStart, "Daily start time");
    await upsertSetting("business_hours_end", data.businessHoursEnd, "Daily end time");
    await upsertSetting("business_days", JSON.stringify(data.businessDays), "Operating days");
    if (data.whatsappNumber) await upsertSetting("whatsapp_number", data.whatsappNumber, "WhatsApp contact");
    if (data.address) await upsertSetting("address", data.address, "Business address");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
