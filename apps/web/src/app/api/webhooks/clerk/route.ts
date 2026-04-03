import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/lib/db";
import { users } from "@bwash/database";
import { eq } from "drizzle-orm";

interface WebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    phone_numbers: { phone_number: string }[];
    public_metadata: Record<string, unknown>;
  };
}

export async function POST(request: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const headerPayload = Object.fromEntries(request.headers);
  const svixId = headerPayload["svix-id"];
  const svixTimestamp = headerPayload["svix-timestamp"];
  const svixSignature = headerPayload["svix-signature"];

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await request.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created") {
    const email = data.email_addresses[0]?.email_address;
    if (!email) return NextResponse.json({ error: "No email" }, { status: 400 });

    const role = (data.public_metadata?.role as string) || "customer";

    await db.insert(users).values({
      clerkId: data.id,
      email,
      firstName: data.first_name || "User",
      lastName: data.last_name || "",
      phone: data.phone_numbers[0]?.phone_number || null,
      avatarUrl: data.image_url,
      role: role as "customer" | "staff" | "admin" | "super_admin",
    });
  }

  if (type === "user.updated") {
    const email = data.email_addresses[0]?.email_address;
    if (!email) return NextResponse.json({ error: "No email" }, { status: 400 });

    await db
      .update(users)
      .set({
        email,
        firstName: data.first_name || "User",
        lastName: data.last_name || "",
        phone: data.phone_numbers[0]?.phone_number || null,
        avatarUrl: data.image_url,
        updatedAt: new Date(),
      })
      .where(eq(users.clerkId, data.id));
  }

  if (type === "user.deleted") {
    await db.delete(users).where(eq(users.clerkId, data.id));
  }

  return NextResponse.json({ success: true });
}
