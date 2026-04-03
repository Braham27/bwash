"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden">
      {/* Gold gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold-dark/20 via-gold/10 to-gold-dark/20" />
      <div className="absolute inset-0 bg-luxury-dark/80" />

      <div className="relative section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <Sparkles className="mx-auto mb-6 h-10 w-10 text-gold" />
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Book your wash today and{" "}
              <span className="text-gradient-gold">drive clean!</span>
            </h2>
            <p className="mt-4 text-lg text-white/50">
              Schedule your premium mobile car wash in under 60 seconds.
            </p>
            <div className="mt-8">
              <Link href="/book" className="btn-primary px-10 py-4 text-base group">
                Schedule Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
