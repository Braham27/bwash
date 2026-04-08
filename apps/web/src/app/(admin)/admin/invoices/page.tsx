import { db } from "@/lib/db";
import { invoices, users, bookings } from "@bwash/database";
import { eq, desc, sql } from "drizzle-orm";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AdminInvoiceActions } from "@/components/admin/AdminInvoiceActions";

const paymentVariant: Record<string, "warning" | "success" | "danger" | "info" | "default"> = {
  pending: "warning",
  paid: "success",
  partial: "warning",
  refunded: "info",
  failed: "danger",
};

export default async function AdminInvoicesPage() {
  const allInvoices = await db
    .select({
      invoice: invoices,
      user: users,
    })
    .from(invoices)
    .leftJoin(users, eq(invoices.userId, users.id))
    .orderBy(desc(invoices.createdAt));

  const [{ total }] = await db
    .select({ total: sql<number>`COALESCE(SUM(${invoices.total}), 0)` })
    .from(invoices)
    .where(eq(invoices.paymentStatus, "paid"));

  const [{ pending }] = await db
    .select({ pending: sql<number>`COALESCE(SUM(${invoices.total}), 0)` })
    .from(invoices)
    .where(eq(invoices.paymentStatus, "pending"));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Invoices</h1>
        <p className="mt-1 text-sm text-gray-500">Manage invoices and payments</p>
      </div>

      {/* Revenue Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Total Collected</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(total)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{formatCurrency(pending)}</p>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                allInvoices.map(({ invoice: inv, user: u }) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-sm">{inv.invoiceNumber}</TableCell>
                    <TableCell className="text-sm">
                      {u ? `${u.firstName} ${u.lastName}` : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{formatDate(inv.createdAt)}</TableCell>
                    <TableCell className="text-sm">{formatCurrency(inv.subtotal)}</TableCell>
                    <TableCell className="text-sm">{formatCurrency(inv.taxAmount || "0")}</TableCell>
                    <TableCell className="font-bold text-gold text-sm">{formatCurrency(inv.total)}</TableCell>
                    <TableCell>
                      <Badge variant={paymentVariant[inv.paymentStatus] || "default"}>
                        {inv.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <AdminInvoiceActions invoiceId={inv.id} currentStatus={inv.paymentStatus} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
