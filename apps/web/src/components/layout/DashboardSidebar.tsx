"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Car,
  Calendar,
  FileText,
  CreditCard,
  User,
  Sparkles,
  Bell,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "Bookings", icon: Calendar },
  { href: "/dashboard/vehicles", label: "Vehicles", icon: Car },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/membership", label: "Membership", icon: CreditCard },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-luxury-border bg-luxury-dark">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-luxury-border px-6">
        <Sparkles className="h-5 w-5 text-gold" />
        <span className="text-lg font-bold">
          <span className="text-gray-900">B</span>
          <span className="text-gold">Wash</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gold/10 text-gold"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to website */}
      <div className="border-t border-luxury-border p-4">
        <Link
          href="/"
          className="block rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:text-gray-600"
        >
          ← Back to Website
        </Link>
      </div>
    </aside>
  );
}
