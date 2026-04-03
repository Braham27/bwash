import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, invoices, bookings, packages, businessSettings } from "@bwash/database";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { generateInvoiceNumber, formatDate } from "@/lib/utils";
import { notifyInvoiceCreated } from "@/lib/notifications";
import { sendInvoiceEmail } from "@/lib/email";

const createSchema = z.object({
  bookingId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await request.json();
    const { bookingId } = createSchema.parse(body);

    // Booking must belong to this user and be completed
    const [result] = await db
      .select({ booking: bookings, package: packages })
      .from(bookings)
      .innerJoin(packages, eq(bookings.packageId, packages.id))
      .where(and(eq(bookings.id, bookingId), eq(bookings.userId, user.id)))
      .limit(1);

    if (!result) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    if (result.booking.status !== "completed") {
      return NextResponse.json({ error: "Invoice can only be created for completed bookings" }, { status: 400 });
    }

    // Check if invoice already exists
    const [existing] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.bookingId, bookingId))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "Invoice already exists for this booking" }, { status: 409 });
    }

    // Tax rate from settings
    const [taxSetting] = await db
      .select()
      .from(businessSettings)
      .where(eq(businessSettings.key, "tax_rate"))
      .limit(1);

    const taxRate = taxSetting ? parseFloat(taxSetting.value) : 0.07;
    const subtotal = parseFloat(result.booking.price);
    const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
    const tipAmt = parseFloat(result.booking.tipAmount || "0");
    const total = Math.round((subtotal + taxAmount + tipAmt) * 100) / 100;

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
        userId: user.id,
        items,
        subtotal: subtotal.toFixed(2),
        taxRate: taxRate.toFixed(4),
        taxAmount: taxAmount.toFixed(2),
        tipAmount: tipAmt.toFixed(2),
        total: total.toFixed(2),
        paymentStatus: result.booking.paymentStatus,
        paymentMethod: result.booking.paymentMethod,
        paidAt: result.booking.paymentStatus === "paid" ? new Date() : null,
      })
      .returning();

    // Notification + email
    notifyInvoiceCreated(user.id, total.toFixed(2), invoice.invoiceNumber).catch(() => {});
    sendInvoiceEmail(user.email, {
      name: user.firstName,
      invoiceNumber: invoice.invoiceNumber,
      total: total.toFixed(2),
      items: `${result.package.name} — ${result.booking.vehicleType}`,
      date: formatDate(new Date()),
    }).catch(() => {});

    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 });
    }
    console.error("Invoice creation error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
