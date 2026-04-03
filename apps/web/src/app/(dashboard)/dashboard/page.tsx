import { db } from "@/lib/db";
import { bookings, vehicles, invoices, memberships, packages } from "@bwash/database";
import { eq, desc, and } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth-utils";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  Calendar,
  Car,
  FileText,
  CreditCard,
  ArrowRight,
  Clock,
  MapPin,
  RotateCcw,
} from "lucide-react";
import { formatCurrency, formatDate, BOOKING_STATUS_COLORS } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();

  // Fetch dashboard data
  const upcomingBookings = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.userId, user.id),
        eq(bookings.status, "confirmed")
      )
    )
    .orderBy(desc(bookings.preferredDate))
    .limit(3);

  const userVehicles = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.userId, user.id))
    .limit(5);

  const recentInvoices = await db
    .select()
    .from(invoices)
    .where(eq(invoices.userId, user.id))
    .orderBy(desc(invoices.createdAt))
    .limit(3);

  const userMemberships = await db
    .select()
    .from(memberships)
    .where(eq(memberships.userId, user.id))
    .limit(1);

  const completedBookings = await db
    .select({ booking: bookings, package: packages })
    .from(bookings)
    .innerJoin(packages, eq(bookings.packageId, packages.id))
    .where(
      and(
        eq(bookings.userId, user.id),
        eq(bookings.status, "completed")
      )
    )
    .orderBy(desc(bookings.completedAt))
    .limit(3);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          Welcome back, <span className="text-gradient-gold">{user.firstName}</span>
        </h1>
        <p className="mt-1 text-white/50">
          Here&apos;s an overview of your BWash account.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Calendar,
            label: "Upcoming",
            value: upcomingBookings.length,
            color: "text-blue-400",
          },
          {
            icon: Car,
            label: "Vehicles",
            value: userVehicles.length,
            color: "text-purple-400",
          },
          {
            icon: FileText,
            label: "Invoices",
            value: recentInvoices.length,
            color: "text-emerald-400",
          },
          {
            icon: CreditCard,
            label: "Membership",
            value: userMemberships.length > 0 ? "Active" : "None",
            color: "text-gold",
          },
        ].map((stat) => (
          <Card key={stat.label} className="flex items-center gap-4 p-5">
            <div className={`rounded-xl bg-white/5 p-3 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Upcoming Bookings</CardTitle>
          <Link href="/dashboard/bookings" className="text-sm text-gold hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {upcomingBookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-10 w-10 text-white/20 mb-3" />
            <p className="text-sm text-white/40">No upcoming bookings</p>
            <Link href="/book" className="btn-primary mt-4 inline-flex text-sm">
              Book a Wash
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-lg border border-luxury-border bg-luxury-gray/30 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-gold/10 p-2">
                    <Clock className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {formatDate(b.preferredDate)}
                    </p>
                    <p className="text-xs text-white/40 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {(b.address ?? "").slice(0, 40)}...
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gold">
                    {formatCurrency(b.price)}
                  </span>
                  <Badge
                    variant="gold"
                    className={BOOKING_STATUS_COLORS[b.status]}
                  >
                    {b.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Saved Vehicles */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Quick Rebook</CardTitle>
          <Link href="/dashboard/bookings" className="text-sm text-gold hover:underline flex items-center gap-1">
            All Bookings <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {completedBookings.length === 0 ? (
          <div className="text-center py-8">
            <RotateCcw className="mx-auto h-10 w-10 text-white/20 mb-3" />
            <p className="text-sm text-white/40">No completed bookings to rebook</p>
            <Link href="/book" className="btn-primary mt-4 inline-flex text-sm">
              Book Your First Wash
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {completedBookings.map(({ booking: b, package: pkg }) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-lg border border-luxury-border bg-luxury-gray/30 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-gold/10 p-2">
                    <RotateCcw className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{pkg.name}</p>
                    <p className="text-xs text-white/40 capitalize">
                      {b.vehicleType} &bull; {formatCurrency(b.price)}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/book?rebook=${b.id}&package=${pkg.slug}&vehicle=${b.vehicleType}&address=${encodeURIComponent(b.address ?? "")}`}
                  className="btn-primary text-xs px-4 py-2"
                >
                  Rebook
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Saved Vehicles */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Saved Vehicles</CardTitle>
          <Link href="/dashboard/vehicles" className="text-sm text-gold hover:underline flex items-center gap-1">
            Manage <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {userVehicles.length === 0 ? (
          <div className="text-center py-8">
            <Car className="mx-auto h-10 w-10 text-white/20 mb-3" />
            <p className="text-sm text-white/40">No vehicles saved</p>
            <Link href="/dashboard/vehicles" className="btn-secondary mt-4 inline-flex text-sm">
              Add Vehicle
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {userVehicles.map((v) => (
              <div
                key={v.id}
                className="rounded-lg border border-luxury-border bg-luxury-gray/30 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {v.year} {v.make} {v.model}
                  </p>
                  {v.isDefault && <Badge variant="gold">Default</Badge>}
                </div>
                <p className="mt-1 text-xs text-white/40 capitalize">
                  {v.vehicleType} {v.color && `• ${v.color}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/book" className="card-luxury-hover flex items-center gap-4 p-5 group">
          <div className="rounded-xl bg-gold/10 p-3">
            <Calendar className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="font-medium">Book a Wash</p>
            <p className="text-xs text-white/40">Schedule your next service</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
        </Link>

        <Link href="/dashboard/vehicles" className="card-luxury-hover flex items-center gap-4 p-5 group">
          <div className="rounded-xl bg-purple-500/10 p-3">
            <Car className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="font-medium">Add Vehicle</p>
            <p className="text-xs text-white/40">Save a new vehicle</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
        </Link>

        <Link href="/dashboard/invoices" className="card-luxury-hover flex items-center gap-4 p-5 group">
          <div className="rounded-xl bg-emerald-500/10 p-3">
            <FileText className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-medium">View Invoices</p>
            <p className="text-xs text-white/40">Check payment history</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
        </Link>
      </div>
    </div>
  );
}
