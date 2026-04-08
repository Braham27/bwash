"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Check, Star, Crown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const packages = [
  {
    name: "Basic Wash",
    description: "A thorough exterior hand wash to keep your car looking clean.",
    prices: { sedan: 35, suv: 45, truck: 55 },
    features: ["Exterior hand wash", "Tire cleaning", "Hand drying"],
    icon: Star,
    popular: false,
  },
  {
    name: "Premium Wash",
    description: "Complete interior and exterior cleaning for a like-new feel.",
    prices: { sedan: 55, suv: 65, truck: 75 },
    features: [
      "Everything in Basic Wash",
      "Interior vacuum",
      "Window cleaning",
      "Dashboard wipe",
    ],
    icon: Star,
    popular: true,
  },
  {
    name: "Deluxe Detail",
    description: "The ultimate detailing experience with premium wax protection.",
    prices: { sedan: 85, suv: 95, truck: 110 },
    features: [
      "Everything in Premium Wash",
      "Deep interior cleaning",
      "Wax protection",
      "Tire shine",
    ],
    icon: Crown,
    popular: false,
  },
];

export function PricingCards() {
  return (
    <section className="section-padding pt-0">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <ScrollReveal key={pkg.name} delay={i * 0.15}>
              <div
                className={cn(
                  "relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1",
                  pkg.popular
                    ? "border-gold/50 bg-gradient-to-b from-gold/5 to-white shadow-lg shadow-gold/10"
                    : "border-luxury-border bg-white hover:border-gold/30 hover:shadow-lg"
                )}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gold px-4 py-1 text-xs font-bold text-white">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <pkg.icon
                    className={cn(
                      "mx-auto h-10 w-10 mb-4",
                      pkg.popular ? "text-gold" : "text-gray-300"
                    )}
                  />
                  <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                  <p className="mt-2 text-sm text-gray-500">{pkg.description}</p>
                </div>

                {/* Prices */}
                <div className="mt-8 space-y-3">
                  {(["sedan", "suv", "truck"] as const).map((type) => (
                    <div
                      key={type}
                      className="flex items-center justify-between rounded-lg bg-luxury-gray px-4 py-2.5"
                    >
                      <span className="text-sm capitalize text-gray-600">{type}</span>
                      <span className="text-lg font-bold text-gold">
                        ${pkg.prices[type]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <ul className="mt-8 space-y-3">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                      <span className="text-gray-600">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/book"
                  className={cn(
                    "mt-8 flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-semibold transition-all duration-300 group",
                    pkg.popular
                      ? "bg-gold text-white hover:bg-gold-light hover:shadow-lg hover:shadow-gold/25"
                      : "border border-gold/30 text-gold hover:bg-gold/5"
                  )}
                >
                  Book Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
