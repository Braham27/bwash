import Link from "next/link";
import { Sparkles, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-luxury-border bg-luxury-dark">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-gold" />
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-foreground">B</span>
                <span className="text-gold">Wash</span>
              </span>
            </Link>
            <p className="text-foreground/50 text-sm leading-relaxed">
              Premium mobile car wash service delivering high-quality cleaning
              directly to your home or workplace.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Services & Pricing" },
                { href: "/book", label: "Book Now" },
                { href: "/sign-in", label: "Customer Login" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/50 transition hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-foreground/50">
                <Phone className="h-4 w-4 text-gold/70" />
                <span>(305) 555-WASH</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground/50">
                <Mail className="h-4 w-4 text-gold/70" />
                <span>info@bwash.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground/50">
                <MapPin className="h-4 w-4 text-gold/70" />
                <span>Serving Miami-Dade County</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-luxury-border pt-8 text-center">
          <p className="text-sm text-foreground/30">
            &copy; {new Date().getFullYear()} BWash. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
