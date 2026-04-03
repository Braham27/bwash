"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
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

export function DashboardMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        <Sparkles className="h-5 w-5 text-gold" />
        <span className="font-bold">
          <span className="text-white">B</span>
          <span className="text-gold">Wash</span>
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-20 bg-luxury-dark/95 backdrop-blur-xl p-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all",
                    isActive
                      ? "bg-gold/10 text-gold"
                      : "text-white/50 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 border-t border-luxury-border pt-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-sm text-white/40"
            >
              ← Back to Website
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
