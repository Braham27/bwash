import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, bookings, packages } from "@bwash/database";
import { eq, desc } from "drizzle-orm";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import { Calendar, MapPin, Clock, RotateCcw } from "lucide-react";
import { formatCurrency, formatDate, formatTime, BOOKING_STATUS_COLORS } from "@/lib/utils";

const statusVariant: Record<string, "info" | "success" | "warning" | "danger" | "gold"> = {
  new: "info",
  confirmed: "success",
  assigned: "gold",
  in_progress: "warning",
  completed: "success",
  cancelled: "danger",
};

export default async function BookingsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!user) redirect("/sign-in");

  const userBookings = await db
    .select({
      booking: bookings,
      package: packages,
    })
    .from(bookings)
    .innerJoin(packages, eq(bookings.packageId, packages.id))
    .where(eq(bookings.userId, user.id))
    .orderBy(desc(bookings.createdAt));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="mt-1 text-sm text-white/50">View and track your appointments</p>
        </div>
        <Link href="/book" className="btn-primary text-sm">Book New</Link>
      </div>

      {userBookings.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-8 w-8" />}
          title="No bookings yet"
          description="Book your first car wash and enjoy the premium BWash experience."
          action={<Link href="/book" className="btn-primary text-sm">Book Now</Link>}
        />
      ) : (
        <div className="space-y-4">
          {userBookings.map(({ booking: b, package: pkg }) => (
            <Card key={b.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-gold/10 p-3 hidden sm:block">
                    <Calendar className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold">{pkg.name}</p>
                      <Badge variant={statusVariant[b.status] || "default"}>
                        {b.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(b.preferredDate)} at {formatTime(b.preferredTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {(b.address ?? "").length > 50 ? `${(b.address ?? "").slice(0, 50)}...` : (b.address ?? "")}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-white/30 capitalize">
                      {b.vehicleType}
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="text-lg font-bold text-gold">{formatCurrency(b.price)}</p>
                  <p className="text-xs text-white/40 capitalize">{b.paymentStatus}</p>
                  {b.status === "completed" && (
                    <Link
                      href={`/book?rebook=${b.id}&package=${pkg.slug}&vehicle=${b.vehicleType}&address=${encodeURIComponent(b.address ?? "")}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gold hover:text-gold/80 transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Rebook
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
