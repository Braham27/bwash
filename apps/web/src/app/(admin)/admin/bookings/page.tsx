import { db } from "@/lib/db";
import { bookings, users, packages } from "@bwash/database";
import { eq, desc, sql, or } from "drizzle-orm";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { AdminBookingActions } from "@/components/admin/AdminBookingActions";

const statusVariant: Record<string, "info" | "success" | "warning" | "danger" | "gold"> = {
  new: "info",
  confirmed: "success",
  assigned: "gold",
  in_progress: "warning",
  completed: "success",
  cancelled: "danger",
};

export default async function AdminBookingsPage() {
  // Fetch staff members for assignment dropdown
  const staffMembers = await db
    .select({ id: users.id, firstName: users.firstName, lastName: users.lastName })
    .from(users)
    .where(or(eq(users.role, "staff"), eq(users.role, "admin"), eq(users.role, "super_admin")));

  const staffList = staffMembers.map((s) => ({
    id: s.id,
    name: `${s.firstName} ${s.lastName}`,
  }));

  const allBookings = await db
    .select({
      booking: bookings,
      user: users,
      package: packages,
    })
    .from(bookings)
    .leftJoin(users, eq(bookings.userId, users.id))
    .innerJoin(packages, eq(bookings.packageId, packages.id))
    .orderBy(desc(bookings.createdAt));

  const statusCounts = await db
    .select({
      status: bookings.status,
      count: sql<number>`count(*)::int`,
    })
    .from(bookings)
    .groupBy(bookings.status);

  const countsMap = Object.fromEntries(statusCounts.map((s) => [s.status, s.count]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Bookings Management</h1>
        <p className="mt-1 text-sm text-foreground/50">View and manage all bookings</p>
      </div>

      {/* Status Summary */}
      <div className="flex flex-wrap gap-3">
        {["new", "confirmed", "assigned", "in_progress", "completed", "cancelled"].map((s) => (
          <div key={s} className="flex items-center gap-2 rounded-lg bg-luxury-card px-4 py-2 border border-luxury-border">
            <Badge variant={statusVariant[s]}>{s.replace("_", " ")}</Badge>
            <span className="text-sm font-medium">{countsMap[s] || 0}</span>
          </div>
        ))}
      </div>

      {/* Bookings Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Date / Time</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-foreground/40 py-8">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                allBookings.map(({ booking: b, user: u, package: pkg }) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <p className="font-medium text-sm">
                        {u ? `${u.firstName} ${u.lastName}` : b.guestName || "Guest"}
                      </p>
                      <p className="text-xs text-foreground/40">
                        {u?.email || b.guestEmail || "—"}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm">{pkg.name}</TableCell>
                    <TableCell>
                      <p className="text-sm">{formatDate(b.preferredDate)}</p>
                      <p className="text-xs text-foreground/40">{formatTime(b.preferredTime)}</p>
                    </TableCell>
                    <TableCell className="text-sm capitalize">{b.vehicleType}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[b.status]}>{b.status.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={b.paymentStatus === "paid" ? "success" : b.paymentStatus === "pending" ? "warning" : "danger"}
                      >
                        {b.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-gold text-sm">
                      {formatCurrency(b.price)}
                    </TableCell>
                    <TableCell>
                      <AdminBookingActions bookingId={b.id} currentStatus={b.status} staffList={staffList} />
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
