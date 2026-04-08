import { db } from "@/lib/db";
import { users, bookings } from "@bwash/database";
import { eq, desc, sql } from "drizzle-orm";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { formatDate } from "@/lib/utils";
import { StaffFormClient } from "@/components/admin/StaffFormClient";

export default async function AdminStaffPage() {
  const staffMembers = await db
    .select({
      user: users,
      jobCount: sql<number>`(SELECT count(*)::int FROM bookings WHERE bookings.assigned_staff_id = ${users.id})`,
      completedCount: sql<number>`(SELECT count(*)::int FROM bookings WHERE bookings.assigned_staff_id = ${users.id} AND bookings.status = 'completed')`,
    })
    .from(users)
    .where(eq(users.role, "staff"))
    .orderBy(desc(users.createdAt));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="mt-1 text-sm text-foreground/50">
            {staffMembers.length} staff member{staffMembers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <StaffFormClient />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Assigned Jobs</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-foreground/40 py-8">
                    No staff members yet
                  </TableCell>
                </TableRow>
              ) : (
                staffMembers.map(({ user: u, jobCount, completedCount }) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      {u.firstName} {u.lastName}
                    </TableCell>
                    <TableCell className="text-sm text-foreground/60">{u.email}</TableCell>
                    <TableCell className="text-sm text-foreground/60">{u.phone || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="gold">{jobCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">{completedCount}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-foreground/40">{formatDate(u.createdAt)}</TableCell>
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
