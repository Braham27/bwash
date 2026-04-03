import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, invoices, bookings, packages, businessSettings } from "@bwash/database";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { generateInvoiceNumber, formatDate } from "@/lib/utils";
import { notifyInvoiceCreated, notifyPaymentReceived } from "@/lib/notifications";
import { sendInvoiceEmail, sendPaymentConfirmation } from "@/lib/email";

const updateSchema = z.object({
  invoiceId: z.string().uuid(),
  paymentStatus: z.enum(["pending", "paid", "partial", "refunded", "failed"]),
  paymentMethod: z.enum(["zelle", "cash_app", "apple_pay", "credit_card", "debit_card", "cash"]).optional(),
});

const createSchema = z.object({
  bookingId: z.string().uuid(),
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
    const { bookingId } = createSchema.parse(body);

    // Fetch the booking with package
    const [result] = await db
      .select({ booking: bookings, package: packages })
      .from(bookings)
      .innerJoin(packages, eq(bookings.packageId, packages.id))
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!result) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    // Check if invoice already exists for this booking
    const [existingInvoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.bookingId, bookingId))
      .limit(1);

    if (existingInvoice) {
      return NextResponse.json({ error: "Invoice already exists for this booking" }, { status: 409 });
    }

    // Get tax rate from business settings
    const [taxSetting] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.key, "tax_rate"))
      .limit(1);

    const taxRate = taxSetting ? parseFloat(taxSetting.value) : 0.07;
    const subtotal = parseFloat(result.booking.price);
    const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + taxAmount) * 100) / 100;

    const items = [
      {
        description: `${result.package.name} — ${result.booking.vehicleType}`,
        quantity: 1,
        unitPrice: subtotal,
        total: subtotal,
      },
    ];

    const [invoice] = await db
      .insert(invoices)
      .values({
        invoiceNumber: generateInvoiceNumber(),
        bookingId,
        userId: result.booking.userId,
        items,
        subtotal: subtotal.toFixed(2),
        taxRate: taxRate.toFixed(4),
        taxAmount: taxAmount.toFixed(2),
        total: total.toFixed(2),
        paymentStatus: "pending",
      })
      .returning();

    // Send notification + email for invoice
    if (result.booking.userId) {
      notifyInvoiceCreated(result.booking.userId, total.toFixed(2), invoice.invoiceNumber).catch(() => {});
      // Get user email
      const [invoiceUser] = await db.select().from(users).where(eq(users.id, result.booking.userId)).limit(1);
      if (invoiceUser) {
        sendInvoiceEmail(invoiceUser.email, {
          name: invoiceUser.firstName,
          invoiceNumber: invoice.invoiceNumber,
          total: total.toFixed(2),
          items: `${result.package.name} — ${result.booking.vehicleType}`,
          date: formatDate(new Date()),
        }).catch(() => {});
      }
    }

    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error("Invoice creation error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = await requireAdmin(clerkId);
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { invoiceId, paymentStatus, paymentMethod } = updateSchema.parse(body);

    const updateData: Record<string, unknown> = { paymentStatus };
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    if (paymentStatus === "paid") updateData.paidAt = new Date();

    await db.update(invoices).set(updateData).where(eq(invoices.id, invoiceId));

    // Send payment notification + email
    if (paymentStatus === "paid") {
      const [inv] = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1);
      if (inv?.userId) {
        notifyPaymentReceived(inv.userId, inv.total, inv.invoiceNumber).catch(() => {});
        const [payUser] = await db.select().from(users).where(eq(users.id, inv.userId)).limit(1);
        if (payUser) {
          sendPaymentConfirmation(payUser.email, {
            name: payUser.firstName,
            amount: inv.total,
            invoiceNumber: inv.invoiceNumber,
          }).catch(() => {});
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error("Invoice update error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
