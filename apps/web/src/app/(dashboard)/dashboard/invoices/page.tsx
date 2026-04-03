import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, invoices } from "@bwash/database";
import { eq, desc } from "drizzle-orm";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileText } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const paymentVariant: Record<string, "warning" | "success" | "danger" | "info"> = {
  pending: "warning",
  paid: "success",
  partial: "warning",
  refunded: "info",
  failed: "danger",
};

export default async function InvoicesPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!user) redirect("/sign-in");

  const userInvoices = await db
    .select()
    .from(invoices)
    .where(eq(invoices.userId, user.id))
    .orderBy(desc(invoices.createdAt));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">My Invoices</h1>
        <p className="mt-1 text-sm text-white/50">View your payment history</p>
      </div>

      {userInvoices.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="No invoices yet"
          description="Your invoices will appear here after your first completed service."
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
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={paymentVariant[inv.paymentStatus] || "default"}>
                    {inv.paymentStatus}
                  </Badge>
                  <p className="text-lg font-bold text-gold">
                    {formatCurrency(inv.total)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
