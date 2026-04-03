import { db } from "@/lib/db";
import { bookings, users, invoices, memberships, vehicles } from "@bwash/database";
import { eq, sql, gte, and, count } from "drizzle-orm";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Calendar,
  Users as UsersIcon,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Car,
} from "lucide-react";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Key stats
  const [
    [{ totalBookings }],
    [{ activeBookings }],
    [{ totalCustomers }],
    [{ revenue }],
    [{ totalVehicles }],
    [{ activeMemberships }],
  ] = await Promise.all([
    db.select({ totalBookings: count() }).from(bookings),
    db
      .select({ activeBookings: count() })
      .from(bookings)
      .where(
        sql`${bookings.status} IN ('new', 'confirmed', 'assigned', 'in_progress')`
      ),
    db.select({ totalCustomers: count() }).from(users).where(eq(users.role, "customer")),
    db
      .select({ revenue: sql<number>`COALESCE(SUM(${invoices.total}), 0)` })
      .from(invoices)
      .where(eq(invoices.paymentStatus, "paid")),
    db.select({ totalVehicles: count() }).from(vehicles),
    db
      .select({ activeMemberships: count() })
      .from(memberships)
      .where(eq(memberships.status, "active")),
  ]);

  // Recent bookings
  const recentBookings = await db
    .select({ booking: bookings, user: users })
    .from(bookings)
    .leftJoin(users, eq(bookings.userId, users.id))
    .orderBy(sql`${bookings.createdAt} DESC`)
    .limit(5);

  const stats = [
    { label: "Total Bookings", value: totalBookings, icon: Calendar, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Active Jobs", value: activeBookings, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Customers", value: totalCustomers, icon: UsersIcon, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Revenue", value: formatCurrency(revenue), icon: DollarSign, color: "text-gold", bg: "bg-gold/10" },
    { label: "Vehicles", value: totalVehicles, icon: Car, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Memberships", value: activeMemberships, icon: TrendingUp, color: "text-pink-400", bg: "bg-pink-400/10" },
  ];

  const statusVariant: Record<string, "info" | "success" | "warning" | "danger" | "gold"> = {
    new: "info",
    confirmed: "success",
    assigned: "gold",
    in_progress: "warning",
    completed: "success",
    cancelled: "danger",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">Business overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-center gap-4">
              <div className={`rounded-xl p-3 ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <div>
        <h2 className="text-lg font-bold mb-4">Recent Bookings</h2>
        <Card className="divide-y divide-luxury-border">
          {recentBookings.length === 0 ? (
            <div className="p-8 text-center text-white/40">No bookings yet</div>
          ) : (
            recentBookings.map(({ booking: b, user: u }) => (
              <div key={b.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-sm">
                    {u ? `${u.firstName} ${u.lastName}` : b.guestName || "Guest"}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    {formatDate(b.preferredDate)} at {formatTime(b.preferredTime)} • {b.vehicleType}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusVariant[b.status] || "default"}>
                    {b.status.replace("_", " ")}
                  </Badge>
                  <span className="text-sm font-bold text-gold">{formatCurrency(b.price)}</span>
                </div>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
