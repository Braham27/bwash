"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MapPin, DollarSign, ThumbsUp, Clock } from "lucide-react";

const reasons = [
  {
    icon: MapPin,
    title: "We Come to You",
    description: "No need to drive to a car wash. We bring premium service directly to your location.",
  },
  {
    icon: DollarSign,
    title: "Affordable Pricing",
    description: "Premium quality doesn't have to break the bank. Transparent pricing with no hidden fees.",
  },
  {
    icon: ThumbsUp,
    title: "Professional Results",
    description: "Our trained technicians deliver showroom-quality results every single time.",
  },
  {
    icon: Clock,
    title: "Fast & Reliable",
    description: "Book online in seconds, and we'll be there at your preferred time. Simple and efficient.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-luxury-dark">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Why BWash
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Why Choose Us
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <div className="group text-center p-6">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/20 bg-gold/5 transition-all duration-300 group-hover:bg-gold/10 group-hover:border-gold/40 group-hover:scale-110">
                  <item.icon className="h-7 w-7 text-gold" />
                </div>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
