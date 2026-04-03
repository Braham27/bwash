import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, vehicles } from "@bwash/database";
import { eq } from "drizzle-orm";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { VehicleFormClient } from "@/components/dashboard/VehicleFormClient";
import { Car } from "lucide-react";

export default async function VehiclesPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!user) redirect("/sign-in");

  const userVehicles = await db.select().from(vehicles).where(eq(vehicles.userId, user.id));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Vehicles</h1>
          <p className="mt-1 text-sm text-white/50">Manage your saved vehicles</p>
        </div>
        <VehicleFormClient />
      </div>

      {userVehicles.length === 0 ? (
        <EmptyState
          icon={<Car className="h-8 w-8" />}
          title="No vehicles saved"
          description="Add your first vehicle to speed up future bookings."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userVehicles.map((v) => (
            <Card key={v.id} hover className="p-5">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-gold/10 p-2">
                  <Car className="h-5 w-5 text-gold" />
                </div>
                {v.isDefault && <Badge variant="gold">Default</Badge>}
              </div>
              <div className="mt-4">
                <p className="text-lg font-semibold">
                  {v.year} {v.make} {v.model}
                </p>
                <p className="mt-1 text-sm text-white/50 capitalize">
                  {v.vehicleType}
                  {v.color && ` • ${v.color}`}
                  {v.licensePlate && ` • ${v.licensePlate}`}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
