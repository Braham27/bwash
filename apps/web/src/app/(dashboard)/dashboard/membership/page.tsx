import { db } from "@/lib/db";
import { memberships, membershipPlans, packages, vehicles } from "@bwash/database";
import { eq } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth-utils";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import { CreditCard, Calendar, Package } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MembershipActions } from "@/components/dashboard/MembershipActions";
import { SubscribeButton } from "@/components/dashboard/SubscribeButton";

export default async function MembershipPage() {
  const user = await getAuthenticatedUser();

  const userMemberships = await db
    .select({
      membership: memberships,
      plan: membershipPlans,
      package: packages,
    })
    .from(memberships)
    .innerJoin(membershipPlans, eq(memberships.planId, membershipPlans.id))
    .innerJoin(packages, eq(membershipPlans.packageId, packages.id))
    .where(eq(memberships.userId, user.id));

  // Fetch available plans
  const availablePlans = await db
    .select({
      plan: membershipPlans,
      package: packages,
    })
    .from(membershipPlans)
    .innerJoin(packages, eq(membershipPlans.packageId, packages.id))
    .where(eq(membershipPlans.isActive, true));

  // Fetch user vehicles for subscription
  const userVehicles = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.userId, user.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Membership</h1>
        <p className="mt-1 text-sm text-white/50">Manage your wash plans</p>
      </div>

      {/* Active Membership */}
      {userMemberships.length > 0 ? (
        <div className="space-y-4">
          {userMemberships.map(({ membership: m, plan, package: pkg }) => (
            <Card key={m.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-gold/10 p-3">
                    <CreditCard className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <p className="text-sm text-white/50">{pkg.name} • {plan.interval}</p>
                  </div>
                </div>
                <Badge
                  variant={m.status === "active" ? "success" : m.status === "paused" ? "warning" : "danger"}
                >
                  {m.status}
                </Badge>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3 border-t border-luxury-border pt-6">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Price</p>
                  <p className="mt-1 text-lg font-bold text-gold">{formatCurrency(m.price)}/mo</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Start Date</p>
                  <p className="mt-1 text-sm">{formatDate(m.startDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Next Service</p>
                  <p className="mt-1 text-sm">{m.nextServiceDate ? formatDate(m.nextServiceDate) : "—"}</p>
                </div>
              </div>
              <MembershipActions membershipId={m.id} status={m.status} />
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<CreditCard className="h-8 w-8" />}
          title="No active membership"
          description="Subscribe to a wash plan and save on regular services."
        />
      )}

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-bold mb-4">Available Plans</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availablePlans.map(({ plan, package: pkg }) => (
            <Card key={plan.id} hover className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-5 w-5 text-gold" />
                <h3 className="font-semibold">{plan.name}</h3>
              </div>
              <p className="text-sm text-white/50">{plan.description}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Sedan</span>
                  <span className="font-medium text-gold">{formatCurrency(plan.sedanPrice)}/mo</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">SUV</span>
                  <span className="font-medium text-gold">{formatCurrency(plan.suvPrice)}/mo</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Truck</span>
                  <span className="font-medium text-gold">{formatCurrency(plan.truckPrice)}/mo</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/30 capitalize">
                {pkg.name} • {plan.interval}
              </p>
              <SubscribeButton
                planId={plan.id}
                vehicles={userVehicles.map((v) => ({ id: v.id, label: `${v.year || ""} ${v.make} ${v.model}`.trim(), vehicleType: v.vehicleType }))}
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
