import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@bwash/database";
import { eq } from "drizzle-orm";
import { UserButton } from "@clerk/nextjs";
import { StaffSidebar } from "@/components/layout/StaffSidebar";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!user || (user.role !== "staff" && user.role !== "admin" && user.role !== "super_admin")) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen bg-white text-gray-900">
      <StaffSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-luxury-border px-6">
          <h2 className="text-sm font-medium lg:hidden text-gold">BWash Staff</h2>
          <div className="hidden lg:block" />
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8 ring-2 ring-gold/20",
              },
            }}
          />
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
