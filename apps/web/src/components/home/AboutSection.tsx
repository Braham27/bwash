"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Shield, Droplets, Award } from "lucide-react";

export function AboutSection() {
  return (
    <section className="section-padding bg-luxury-dark">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">About Us</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              The <span className="text-gradient-gold">BWash</span> Difference
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              BWash is a professional mobile car wash service delivering
              high-quality cleaning directly to your home or workplace. We
              combine convenience with premium results.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "Professional Grade",
              description:
                "Our trained staff use premium products and techniques to deliver showroom-quality results every time.",
            },
            {
              icon: Droplets,
              title: "Eco-Friendly",
              description:
                "We use water-efficient cleaning methods and biodegradable products that are gentle on the environment.",
            },
            {
              icon: Award,
              title: "Satisfaction Guaranteed",
              description:
                "If you're not completely satisfied, we'll re-clean your vehicle at no additional charge.",
            },
          ].map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.15}>
              <div className="card-luxury-hover text-center p-8">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10">
                  <item.icon className="h-7 w-7 text-gold" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">
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
