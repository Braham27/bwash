import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, bookings, packages } from "@bwash/database";
import { eq, and, sql, gte } from "drizzle-orm";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Calendar, Clock, MapPin } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

export default async function StaffSchedulePage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!user) redirect("/sign-in");

  const todayStr = new Date().toISOString().split("T")[0];

  const upcomingJobs = await db
    .select({
      booking: bookings,
      package: packages,
    })
    .from(bookings)
    .innerJoin(packages, eq(bookings.packageId, packages.id))
    .where(
      and(
        eq(bookings.staffId, user.id),
        sql`${bookings.status} IN ('assigned', 'confirmed', 'in_progress')`,
        gte(bookings.preferredDate, todayStr)
      )
    )
    .orderBy(bookings.preferredDate, bookings.preferredTime);

  // Group by date
  const groupedByDate = upcomingJobs.reduce((acc, job) => {
    const date = job.booking.preferredDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(job);
    return acc;
  }, {} as Record<string, typeof upcomingJobs>);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Schedule</h1>
        <p className="mt-1 text-sm text-foreground/50">Upcoming assigned jobs</p>
      </div>

      {upcomingJobs.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-8 w-8" />}
          title="No upcoming jobs"
          description="Your schedule is clear for now."
        />
      ) : (
        Object.entries(groupedByDate).map(([date, jobs]) => (
          <div key={date}>
            <h2 className="text-sm font-semibold text-gold mb-3">
              {date === todayStr ? "Today" : formatDate(date)}
            </h2>
            <div className="space-y-3">
              {jobs.map(({ booking: b, package: pkg }) => (
                <Card key={b.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{pkg.name}</p>
                      <div className="flex items-center gap-3 text-xs text-foreground/40 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(b.preferredTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {b.address.length > 40 ? `${b.address.slice(0, 40)}...` : b.address}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={b.status === "in_progress" ? "warning" : b.status === "assigned" ? "gold" : "info"}
                    >
                      {b.status.replace("_", " ")}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
