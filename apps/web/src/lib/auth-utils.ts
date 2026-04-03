import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@bwash/database";
import { eq } from "drizzle-orm";

/**
 * Get the current user from the database, creating a record if one doesn't exist.
 * This handles the case where a Clerk user exists but the webhook hasn't fired yet.
 * Redirects to /sign-in only if the user is not authenticated with Clerk at all.
 */
export async function getAuthenticatedUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (existingUser) return existingUser;

  // User is authenticated with Clerk but has no DB record — auto-create
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) redirect("/sign-in");

  const [newUser] = await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      email,
      firstName: clerkUser.firstName || "User",
      lastName: clerkUser.lastName || "",
      phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
      avatarUrl: clerkUser.imageUrl,
      role: (clerkUser.publicMetadata?.role as "customer" | "staff" | "admin" | "super_admin") || "customer",
    })
    .onConflictDoNothing({ target: users.clerkId })
    .returning();

  // If onConflictDoNothing returned nothing, the row was already inserted by another request
  if (!newUser) {
    const [retryUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);
    if (!retryUser) redirect("/sign-in");
    return retryUser;
  }

  return newUser;
}
