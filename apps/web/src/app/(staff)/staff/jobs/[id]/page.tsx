import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { users, bookings, packages, bookingStatusHistory } from "@bwash/database";
import { eq, and, desc } from "drizzle-orm";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Calendar, MapPin, Clock, Package, User, Phone, FileText, Car } from "lucide-react";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { StaffStatusUpdater } from "@/components/staff/StaffStatusUpdater";
import { StaffJobNotes } from "@/components/staff/StaffJobNotes";

const statusVariant: Record<string, "info" | "success" | "warning" | "danger" | "gold"> = {
  new: "info",
  confirmed: "success",
  assigned: "gold",
  in_progress: "warning",
  completed: "success",
  cancelled: "danger",
};

export default async function StaffJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!user) redirect("/sign-in");

  const [result] = await db
    .select({
      booking: bookings,
      package: packages,
      customer: users,
    })
    .from(bookings)
    .innerJoin(packages, eq(bookings.packageId, packages.id))
    .leftJoin(users, eq(bookings.userId, users.id))
    .where(and(eq(bookings.id, id), eq(bookings.staffId, user.id)));

  if (!result) notFound();

  const { booking: b, package: pkg, customer } = result;

  // Status history
  const history = await db
    .select({
      entry: bookingStatusHistory,
      changedByUser: users,
    })
    .from(bookingStatusHistory)
    .leftJoin(users, eq(bookingStatusHistory.changedBy, users.id))
    .where(eq(bookingStatusHistory.bookingId, b.id))
    .orderBy(desc(bookingStatusHistory.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{pkg.name}</h1>
          <Badge variant={statusVariant[b.status]} className="mt-1">
            {b.status.replace("_", " ")}
          </Badge>
        </div>
        <p className="text-2xl font-bold text-gold">{formatCurrency(b.price)}</p>
      </div>

      {/* Job Details */}
      <Card className="p-6">
        <CardTitle className="mb-4">Job Details</CardTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 text-white/30 mt-0.5" />
            <div>
              <p className="text-xs text-white/40">Customer</p>
              <p className="text-sm font-medium">
                {customer ? `${customer.firstName} ${customer.lastName}` : b.guestName || "Guest"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-4 w-4 text-white/30 mt-0.5" />
            <div>
              <p className="text-xs text-white/40">Phone</p>
              <p className="text-sm">{customer?.phone || b.guestPhone || "—"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-white/30 mt-0.5" />
            <div>
              <p className="text-xs text-white/40">Scheduled</p>
              <p className="text-sm">{formatDate(b.preferredDate)} at {formatTime(b.preferredTime)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Car className="h-4 w-4 text-white/30 mt-0.5" />
            <div>
              <p className="text-xs text-white/40">Vehicle</p>
              <p className="text-sm capitalize">{b.vehicleType}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 sm:col-span-2">
            <MapPin className="h-4 w-4 text-white/30 mt-0.5" />
            <div>
              <p className="text-xs text-white/40">Address</p>
              <p className="text-sm">{b.address}</p>
            </div>
          </div>
          {b.notes && (
            <div className="flex items-start gap-3 sm:col-span-2">
              <FileText className="h-4 w-4 text-white/30 mt-0.5" />
              <div>
                <p className="text-xs text-white/40">Notes</p>
                <p className="text-sm text-white/70">{b.notes}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Access Notes */}
      {b.accessNotes && (
        <Card className="p-6">
          <CardTitle className="mb-3">Access / Gate Info</CardTitle>
          <p className="text-sm text-white/70">{b.accessNotes}</p>
        </Card>
      )}

      {/* Staff Notes + Photo Upload */}
      <StaffJobNotes bookingId={b.id} existingNotes={b.staffNotes || ""} status={b.status} />

      {/* Status Update */}
      {(b.status === "assigned" || b.status === "in_progress") && (
        <StaffStatusUpdater bookingId={b.id} currentStatus={b.status} />
      )}

      {/* Status History */}
      {history.length > 0 && (
        <Card className="p-6">
          <CardTitle className="mb-4">Status History</CardTitle>
          <div className="space-y-3">
            {history.map(({ entry, changedByUser }) => (
              <div key={entry.id} className="flex items-center justify-between border-b border-luxury-border pb-3 last:border-0">
                <div>
                  <Badge variant={statusVariant[entry.status]} className="text-xs">
                    {entry.status.replace("_", " ")}
                  </Badge>
                  {entry.notes && (
                    <p className="text-xs text-white/40 mt-1">{entry.notes}</p>
                  )}
                </div>
                <div className="text-right text-xs text-white/40">
                  <p>{changedByUser ? `${changedByUser.firstName} ${changedByUser.lastName}` : "System"}</p>
                  <p>{formatDate(entry.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
