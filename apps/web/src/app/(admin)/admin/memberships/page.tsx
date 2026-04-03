import { db } from "@/lib/db";
import { membershipPlans, memberships, users, packages } from "@bwash/database";
import { eq, desc, sql, count } from "drizzle-orm";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminMembershipsPage() {
  const plans = await db
    .select({
      plan: membershipPlans,
      package: packages,
      subscriberCount: sql<number>`(SELECT count(*)::int FROM memberships WHERE memberships.plan_id = ${membershipPlans.id} AND memberships.status = 'active')`,
    })
    .from(membershipPlans)
    .innerJoin(packages, eq(membershipPlans.packageId, packages.id));

  const activeMemberships = await db
    .select({
      membership: memberships,
      user: users,
      plan: membershipPlans,
    })
    .from(memberships)
    .innerJoin(users, eq(memberships.userId, users.id))
    .innerJoin(membershipPlans, eq(memberships.planId, membershipPlans.id))
    .orderBy(desc(memberships.createdAt));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Memberships</h1>
        <p className="mt-1 text-sm text-white/50">Manage membership plans and subscribers</p>
      </div>

      {/* Plans */}
      <div>
        <h2 className="text-lg font-bold mb-4">Plans</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map(({ plan, package: pkg, subscriberCount }) => (
            <Card key={plan.id} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{plan.name}</h3>
                <Badge variant={plan.isActive ? "success" : "danger"}>
                  {plan.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-sm text-white/50">{plan.description}</p>
              <div className="mt-3 flex items-center justify-between border-t border-luxury-border pt-3">
                <span className="text-xs text-white/40">{pkg.name} • {plan.interval}</span>
                <span className="text-sm font-medium text-gold">{subscriberCount} subscribers</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscribers */}
      <div>
        <h2 className="text-lg font-bold mb-4">All Subscribers</h2>
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Next Service</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeMemberships.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-white/40 py-8">
                      No subscribers yet
                    </TableCell>
                  </TableRow>
                ) : (
                  activeMemberships.map(({ membership: m, user: u, plan }) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium text-sm">
                        {u.firstName} {u.lastName}
                      </TableCell>
                      <TableCell className="text-sm">{plan.name}</TableCell>
                      <TableCell className="font-bold text-gold text-sm">
                        {formatCurrency(m.price)}/mo
                      </TableCell>
                      <TableCell>
                        <Badge variant={m.status === "active" ? "success" : m.status === "paused" ? "warning" : "danger"}>
                          {m.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-white/60">{formatDate(m.startDate)}</TableCell>
                      <TableCell className="text-sm text-white/60">
                        {m.nextServiceDate ? formatDate(m.nextServiceDate) : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
