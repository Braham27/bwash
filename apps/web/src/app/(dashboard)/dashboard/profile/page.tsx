import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@bwash/database";
import { eq } from "drizzle-orm";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ProfilePage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const clerkUser = await currentUser();
  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
  if (!user) redirect("/sign-in");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="mt-1 text-sm text-white/50">View and manage your account details</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {clerkUser?.imageUrl ? (
              <img
                src={clerkUser.imageUrl}
                alt={user.firstName}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-gold/20"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gold/10">
                <User className="h-8 w-8 text-gold" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {user.firstName} {user.lastName}
              </h2>
              <Badge variant="gold" className="mt-1 capitalize">
                {user.role}
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-white/30" />
                <span className="text-white/70">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-white/30" />
                <span className="text-white/70">{user.phone || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-white/30" />
                <span className="text-white/70">Joined {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <CardTitle className="mb-4">Account Settings</CardTitle>
        <p className="text-sm text-white/50">
          To update your name, email, password, or profile picture, use the Clerk account
          manager by clicking on your avatar in the top right corner.
        </p>
      </Card>
    </div>
  );
}
