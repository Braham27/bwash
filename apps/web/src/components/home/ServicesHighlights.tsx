"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Car, Sparkles, Crown, ArrowRight } from "lucide-react";

const highlights = [
  {
    icon: Car,
    title: "Exterior Wash",
    description:
      "Thorough hand wash, tire cleaning, and premium drying for a spotless shine.",
    starting: "$35",
  },
  {
    icon: Sparkles,
    title: "Interior Detailing",
    description:
      "Deep vacuum, dashboard wipe, window cleaning, and interior refresh.",
    starting: "$55",
  },
  {
    icon: Crown,
    title: "Full Service Wash",
    description:
      "The complete package — deep clean inside and out with wax protection and tire shine.",
    starting: "$85",
  },
];

export function ServicesHighlights() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Our Services
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Premium Packages for Every Need
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {highlights.map((svc, i) => (
            <ScrollReveal key={svc.title} delay={i * 0.15}>
              <div className="card-luxury-hover group relative overflow-hidden p-8">
                {/* Glow */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/5 blur-3xl transition-all duration-500 group-hover:bg-gold/10" />

                <div className="relative">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10 transition-colors duration-300 group-hover:bg-gold/20">
                    <svc.icon className="h-7 w-7 text-gold" />
                  </div>

                  <h3 className="text-xl font-semibold">{svc.title}</h3>
                  <p className="mt-3 text-sm text-white/50 leading-relaxed">
                    {svc.description}
                  </p>

                  <div className="mt-6 flex items-end justify-between">
                    <div>
                      <span className="text-xs text-white/40">Starting at</span>
                      <p className="text-2xl font-bold text-gold">{svc.starting}</p>
                    </div>
                    <Link
                      href="/services"
                      className="flex items-center gap-1 text-sm font-medium text-gold transition-all group-hover:gap-2"
                    >
                      Details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
