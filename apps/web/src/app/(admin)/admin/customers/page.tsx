import { db } from "@/lib/db";
import { users, bookings, vehicles } from "@bwash/database";
import { eq, desc, sql, count } from "drizzle-orm";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { formatDate } from "@/lib/utils";

export default async function AdminCustomersPage() {
  const customers = await db
    .select({
      user: users,
      bookingCount: sql<number>`(SELECT count(*)::int FROM bookings WHERE bookings.user_id = ${users.id})`,
      vehicleCount: sql<number>`(SELECT count(*)::int FROM vehicles WHERE vehicles.user_id = ${users.id})`,
    })
    .from(users)
    .where(eq(users.role, "customer"))
    .orderBy(desc(users.createdAt));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="mt-1 text-sm text-white/50">
          {customers.length} registered customer{customers.length !== 1 ? "s" : ""}
        </p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Vehicles</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-white/40 py-8">
                    No customers yet
                  </TableCell>
                </TableRow>
              ) : (
                customers.map(({ user: u, bookingCount, vehicleCount }) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      {u.firstName} {u.lastName}
                    </TableCell>
                    <TableCell className="text-sm text-white/60">{u.email}</TableCell>
                    <TableCell className="text-sm text-white/60">{u.phone || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={bookingCount > 0 ? "gold" : "default"}>{bookingCount}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{vehicleCount}</TableCell>
                    <TableCell className="text-sm text-white/40">{formatDate(u.createdAt)}</TableCell>
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
