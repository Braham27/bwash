"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marcus J.",
    text: "BWash transformed my SUV. It looked brand new after the Deluxe Detail. Highly recommend!",
    rating: 5,
    vehicle: "SUV",
  },
  {
    name: "Sarah T.",
    text: "So convenient having them come to my office. The Premium Wash is worth every penny.",
    rating: 5,
    vehicle: "Sedan",
  },
  {
    name: "David R.",
    text: "Fast, professional, and my truck has never been cleaner. These guys know what they're doing.",
    rating: 5,
    vehicle: "Truck",
  },
  {
    name: "Michelle K.",
    text: "Great service and very affordable. I've been using the monthly membership and love it.",
    rating: 4,
    vehicle: "Sedan",
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Testimonials
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              What Our Clients Say
            </h2>

            {/* Rating summary */}
            <div className="mt-6 inline-flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-5 w-5 fill-gold text-gold" />
                ))}
              </div>
              <span className="text-sm text-white/50">
                <strong className="text-white">4.9</strong> out of 5 based on 200+ reviews
              </span>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.1}>
              <div className="card-luxury-hover relative p-6">
                <Quote className="absolute right-4 top-4 h-8 w-8 text-gold/10" />

                <div className="mb-3 flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${
                        s <= t.rating ? "fill-gold text-gold" : "text-white/20"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-white/70 leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-luxury-border pt-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/40">{t.vehicle} Owner</p>
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
