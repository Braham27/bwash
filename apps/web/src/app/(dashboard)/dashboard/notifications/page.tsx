import { db } from "@/lib/db";
import { notifications } from "@bwash/database";
import { eq, desc } from "drizzle-orm";
import { getAuthenticatedUser } from "@/lib/auth-utils";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Bell, Calendar, CreditCard, Shield, Info, type LucideIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { MarkAllReadButton } from "@/components/dashboard/MarkAllReadButton";

const typeIcons: Record<string, LucideIcon> = {
  booking: Calendar,
  payment: CreditCard,
  membership: Shield,
  system: Info,
};

export default async function NotificationsPage() {
  const user = await getAuthenticatedUser();

  const items = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  const unreadCount = items.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="mt-1 text-sm text-foreground/50">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && <MarkAllReadButton />}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-8 w-8" />}
          title="No notifications"
          description="You're all caught up! Notifications about bookings and updates will appear here."
        />
      ) : (
        <div className="space-y-3">
          {items.map((n) => {
            const Icon = typeIcons[n.type] || Bell;
            return (
              <Card
                key={n.id}
                className={`p-4 transition-colors ${!n.isRead ? "border-gold/30 bg-gold/5" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`rounded-lg p-2.5 ${!n.isRead ? "bg-gold/10" : "bg-foreground/5"}`}>
                    <Icon className={`h-4 w-4 ${!n.isRead ? "text-gold" : "text-foreground/30"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className={`text-sm font-medium ${!n.isRead ? "text-foreground" : "text-foreground/60"}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-foreground/40 mt-0.5">{n.message}</p>
                      </div>
                      {!n.isRead && <Badge variant="gold" className="text-[10px] shrink-0">New</Badge>}
                    </div>
                    <p className="text-xs text-foreground/25 mt-2">{formatDate(n.createdAt)}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
