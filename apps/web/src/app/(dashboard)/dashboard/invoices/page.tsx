import { db } from "@/lib/db";
import { invoices, bookings, packages } from "@bwash/database";
import { eq, desc, and, notInArray } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth-utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileText } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InvoiceActions } from "@/components/dashboard/InvoiceActions";
import { CreateInvoiceButton } from "@/components/dashboard/CreateInvoiceButton";

const paymentVariant: Record<string, "warning" | "success" | "danger" | "info"> = {
  pending: "warning",
  paid: "success",
  partial: "warning",
  refunded: "info",
  failed: "danger",
};

export default async function InvoicesPage() {
  const user = await getAuthenticatedUser();

  const userInvoices = await db
    .select()
    .from(invoices)
    .where(eq(invoices.userId, user.id))
    .orderBy(desc(invoices.createdAt));

  // Booking IDs that already have invoices
  const invoicedBookingIds = userInvoices
    .map((inv) => inv.bookingId)
    .filter(Boolean) as string[];

  // Completed bookings without invoices
  const eligibleQuery = db
    .select({
      id: bookings.id,
      packageName: packages.name,
      vehicleType: bookings.vehicleType,
      preferredDate: bookings.preferredDate,
      price: bookings.price,
    })
    .from(bookings)
    .innerJoin(packages, eq(bookings.packageId, packages.id))
    .where(
      and(
        eq(bookings.userId, user.id),
        eq(bookings.status, "completed"),
        ...(invoicedBookingIds.length > 0
          ? [notInArray(bookings.id, invoicedBookingIds)]
          : [])
      )
    )
    .orderBy(desc(bookings.completedAt));

  const eligibleBookings = await eligibleQuery;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Invoices</h1>
          <p className="mt-1 text-sm text-white/50">
            Create, preview, and send your invoices
          </p>
        </div>
        <CreateInvoiceButton
          bookings={eligibleBookings.map((b) => ({
            id: b.id,
            packageName: b.packageName,
            vehicleType: b.vehicleType,
            preferredDate: b.preferredDate,
            price: b.price,
          }))}
        />
      </div>

      {userInvoices.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="No invoices yet"
          description={
            eligibleBookings.length > 0
              ? `You have ${eligibleBookings.length} completed booking${eligibleBookings.length > 1 ? "s" : ""} ready for invoicing. Click "Create Invoice" above to get started.`
              : "Book a car wash service, and once it's completed you'll be able to generate invoices here."
          }
          action={
            eligibleBookings.length === 0 ? (
              <a
                href="/book"
                className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/20"
              >
                Book a Service
              </a>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {userInvoices.map((inv) => (
            <Card key={inv.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-emerald-500/10 p-3">
                    <FileText className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Invoice #{inv.invoiceNumber}</p>
                    <p className="mt-1 text-xs text-white/40">
                      {formatDate(inv.createdAt)}
                    </p>
                    <p className="mt-0.5 text-xs text-white/30">
                      {(inv.items as { description: string }[])
                        .map((i) => i.description)
                        .join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={paymentVariant[inv.paymentStatus] || "default"}>
                    {inv.paymentStatus}
                  </Badge>
                  <p className="text-lg font-bold text-gold">
                    {formatCurrency(inv.total)}
                  </p>
                  <InvoiceActions
                    invoice={{
                      id: inv.id,
                      invoiceNumber: inv.invoiceNumber,
                      items: inv.items as {
                        description: string;
                        quantity: number;
                        unitPrice: number;
                        total: number;
                      }[],
                      subtotal: inv.subtotal,
                      taxRate: inv.taxRate,
                      taxAmount: inv.taxAmount,
                      tipAmount: inv.tipAmount,
                      total: inv.total,
                      paymentStatus: inv.paymentStatus,
                      paymentMethod: inv.paymentMethod,
                      paidAt: inv.paidAt,
                      notes: inv.notes,
                      createdAt: inv.createdAt,
                    }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
