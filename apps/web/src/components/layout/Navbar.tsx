"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, X, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/book", label: "Book Now" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-luxury-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Droplets className="h-6 w-6 text-gold transition-transform duration-300 group-hover:rotate-12" />
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-gray-900">B</span>
            <span className="text-gold">Wash</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                pathname === link.href
                  ? "text-gold bg-gold/10"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              {link.label}
            </Link>
          ))}

          <SignedIn>
            <Link
              href="/dashboard"
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                pathname.startsWith("/dashboard")
                  ? "text-gold bg-gold/10"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              Dashboard
            </Link>
          </SignedIn>
        </div>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-3 md:flex">
          <SignedOut>
            <Link href="/sign-in" className="btn-ghost text-sm">
              Login
            </Link>
            <Link href="/book" className="btn-primary text-sm">
              Book Now
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 ring-2 ring-gold/30",
                },
              }}
            />
          </SignedIn>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-b border-luxury-border bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-1 px-4 pb-6 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block rounded-lg px-4 py-3 text-base font-medium transition-all duration-200",
                    pathname === link.href
                      ? "text-gold bg-gold/10"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <SignedIn>
                <Link
                  href="/dashboard"
                  className="block rounded-lg px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
              </SignedIn>

              <div className="pt-4 border-t border-luxury-border">
                <SignedOut>
                  <Link href="/sign-in" className="block rounded-lg px-4 py-3 text-base font-medium text-gray-600">
                    Login
                  </Link>
                  <Link href="/book" className="btn-primary mt-2 w-full text-center">
                    Book Now
                  </Link>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <UserButton afterSignOutUrl="/" />
                    <span className="text-sm text-gray-600">Account</span>
                  </div>
                </SignedIn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
