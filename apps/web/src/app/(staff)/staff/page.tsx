import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, bookings, packages } from "@bwash/database";
import { eq, and, desc, sql } from "drizzle-orm";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import { Calendar, MapPin, Clock, Package, User } from "lucide-react";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

const statusVariant: Record<string, "info" | "success" | "warning" | "danger" | "gold"> = {
  assigned: "gold",
  in_progress: "warning",
  confirmed: "success",
  completed: "success",
};

export default async function StaffJobsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!user) redirect("/sign-in");

  // Fetch active jobs assigned to this staff member
  const activeJobs = await db
    .select({
      booking: bookings,
      package: packages,
      customer: users,
    })
    .from(bookings)
    .innerJoin(packages, eq(bookings.packageId, packages.id))
    .leftJoin(users, eq(bookings.userId, users.id))
    .where(
      and(
        eq(bookings.staffId, user.id),
        sql`${bookings.status} IN ('assigned', 'in_progress')`
      )
    )
    .orderBy(bookings.preferredDate, bookings.preferredTime);

  // Today's completed
  const todayStr = new Date().toISOString().split("T")[0];
  const completedToday = await db
    .select({
      booking: bookings,
      package: packages,
    })
    .from(bookings)
    .innerJoin(packages, eq(bookings.packageId, packages.id))
    .where(
      and(
        eq(bookings.staffId, user.id),
        eq(bookings.status, "completed"),
        sql`DATE(${bookings.completedAt}) = ${todayStr}`
      )
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <p className="mt-1 text-sm text-gray-500">
          {activeJobs.length} active • {completedToday.length} completed today
        </p>
      </div>

      {/* Active Jobs */}
      {activeJobs.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-8 w-8" />}
          title="No active jobs"
          description="You'll see your assigned jobs here when new ones come in."
        />
      ) : (
        <div className="space-y-4">
          {activeJobs.map(({ booking: b, package: pkg, customer }) => (
            <Link key={b.id} href={`/staff/jobs/${b.id}`}>
              <Card hover className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-gold/10 p-3">
                      <Package className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-semibold">{pkg.name}</p>
                      <Badge variant={statusVariant[b.status]} className="mt-1">
                        {b.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-gold">{formatCurrency(b.price)}</p>
                </div>

                <div className="grid gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    <span>
                      {customer ? `${customer.firstName} ${customer.lastName}` : b.guestName || "Guest"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {formatDate(b.preferredDate)} at {formatTime(b.preferredTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{b.address}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Completed Today */}
      {completedToday.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4">Completed Today</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {completedToday.map(({ booking: b, package: pkg }) => (
              <Card key={b.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{pkg.name}</p>
                    <p className="text-xs text-gray-400 capitalize">
                      {b.vehicleType} • {formatTime(b.preferredTime)}
                    </p>
                  </div>
                  <Badge variant="success">Done</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
