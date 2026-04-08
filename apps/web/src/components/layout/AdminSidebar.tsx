"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Package,
  FileText,
  UserCog,
  CreditCard,
  MapPin,
  MessageSquare,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/bookings", icon: Calendar, label: "Bookings" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
  { href: "/admin/services", icon: Package, label: "Services" },
  { href: "/admin/invoices", icon: FileText, label: "Invoices" },
  { href: "/admin/staff", icon: UserCog, label: "Staff" },
  { href: "/admin/memberships", icon: CreditCard, label: "Memberships" },
  { href: "/admin/areas", icon: MapPin, label: "Service Areas" },
  { href: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex h-full w-64 flex-col border-r border-luxury-border bg-luxury-card">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-luxury-border">
        <span className="text-xl font-bold text-gold">BWash</span>
        <span className="text-xs text-foreground/30 uppercase tracking-wider">Admin</span>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                isActive
                  ? "bg-gold/10 text-gold font-medium"
                  : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground/80"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
