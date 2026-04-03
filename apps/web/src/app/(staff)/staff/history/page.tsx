import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, bookings, packages } from "@bwash/database";
import { eq, and, desc } from "drizzle-orm";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Clock } from "lucide-react";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

export default async function StaffHistoryPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!user) redirect("/sign-in");

  const completedJobs = await db
    .select({
      booking: bookings,
      package: packages,
    })
    .from(bookings)
    .innerJoin(packages, eq(bookings.packageId, packages.id))
    .where(
      and(
        eq(bookings.staffId, user.id),
        eq(bookings.status, "completed")
      )
    )
    .orderBy(desc(bookings.completedAt))
    .limit(50);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Job History</h1>
        <p className="mt-1 text-sm text-white/50">{completedJobs.length} completed jobs</p>
      </div>

      {completedJobs.length === 0 ? (
        <EmptyState
          icon={<Clock className="h-8 w-8" />}
          title="No completed jobs"
          description="Your completed jobs will appear here."
        />
      ) : (
        <div className="space-y-3">
          {completedJobs.map(({ booking: b, package: pkg }) => (
            <Card key={b.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{pkg.name}</p>
                  <p className="text-xs text-white/40 mt-1 capitalize">
                    {b.vehicleType} • {formatDate(b.completedAt!)} • {formatTime(b.preferredTime)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gold text-sm">{formatCurrency(b.price)}</p>
                  <Badge variant="success" className="text-xs mt-1">Completed</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
