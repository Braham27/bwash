import { UserButton } from "@clerk/nextjs";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardMobileNav } from "@/components/layout/DashboardMobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-luxury-dark">
      <DashboardSidebar />

      {/* Mobile Header */}
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-luxury-border bg-white/90 px-4 backdrop-blur-xl lg:hidden">
        <DashboardMobileNav />
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Main Content */}
      <main className="lg:pl-64">
        {/* Desktop Header */}
        <div className="hidden lg:flex h-16 items-center justify-end border-b border-luxury-border bg-white/50 px-8">
          <UserButton afterSignOutUrl="/" />
        </div>

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
