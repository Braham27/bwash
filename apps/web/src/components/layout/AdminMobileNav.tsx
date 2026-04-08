"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
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

export function AdminMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="rounded-lg p-2 hover:bg-foreground/5 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-luxury-black/95 backdrop-blur-sm lg:hidden"
          >
            <div className="flex h-16 items-center justify-between px-6 border-b border-luxury-border">
              <span className="text-xl font-bold text-gold">BWash Admin</span>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1 p-4">
              {navItems.map((item) => {
                const isActive = item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${
                      isActive ? "bg-gold/10 text-gold font-medium" : "text-foreground/50 hover:text-foreground/80"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
