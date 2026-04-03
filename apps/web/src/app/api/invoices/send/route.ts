import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, invoices } from "@bwash/database";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { sendInvoiceEmail } from "@/lib/email";
import { formatDate } from "@/lib/utils";

const sendSchema = z.object({
  invoiceId: z.string().uuid(),
  method: z.enum(["email", "sms"]),
});

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get current user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await request.json();
    const { invoiceId, method } = sendSchema.parse(body);

    // Fetch the invoice — must belong to this user
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.id, invoiceId), eq(invoices.userId, user.id)))
      .limit(1);

    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

    if (method === "email") {
      const items = (invoice.items as { description: string }[])
        .map((i) => i.description)
        .join(", ");

      const sent = await sendInvoiceEmail(user.email, {
        name: user.firstName,
        invoiceNumber: invoice.invoiceNumber,
        total: invoice.total,
        items,
        date: formatDate(invoice.createdAt),
      });

      if (!sent) {
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
      }

      return NextResponse.json({ success: true, method: "email" });
    }

    if (method === "sms") {
      if (!user.phone) {
        return NextResponse.json(
          { error: "No phone number on file. Please update your profile." },
          { status: 400 }
        );
      }

      const items = (invoice.items as { description: string }[])
        .map((i) => i.description)
        .join(", ");

      const message =
        `BWash Invoice #${invoice.invoiceNumber}\n` +
        `Amount: $${invoice.total}\n` +
        `Services: ${items}\n` +
        `Status: ${invoice.paymentStatus}\n` +
        `Pay via Zelle, Cash App, Apple Pay, or card.`;

      const sent = await sendSms(user.phone, message);
      if (!sent) {
        return NextResponse.json(
          { error: "SMS sending is not configured. Contact support." },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, method: "sms" });
    }

    return NextResponse.json({ error: "Invalid method" }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error("Invoice send error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/* ── SMS via Twilio (graceful no-op when unconfigured) ── */
async function sendSms(to: string, body: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!sid || !token || !from) {
    console.warn("Twilio not configured — skipping SMS");
    return false;
  }

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: to, From: from, Body: body }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Twilio SMS failed:", err);
      return false;
    }
    return true;
  } catch (error) {
    console.error("SMS send error:", error);
    return false;
  }
}
