"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-luxury-dark" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gold/5 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Trust badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-5 py-2">
            <Star className="h-4 w-4 fill-gold text-gold" />
            <span className="text-sm font-medium text-gold">
              Trusted by 500+ customers in Miami
            </span>
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Premium Mobile Car Wash{" "}
            <span className="text-gradient-gold">at Your Doorstep</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 sm:text-xl">
            We bring the shine to you — fast, reliable, and professional.
            Experience luxury car care without leaving your home or office.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/book"
              className="btn-primary px-8 py-4 text-base group"
            >
              Book Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/services" className="btn-secondary px-8 py-4 text-base">
              View Packages
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 border-t border-luxury-border pt-10 max-w-lg mx-auto">
            {[
              { value: "500+", label: "Happy Clients" },
              { value: "4.9", label: "Star Rating" },
              { value: "2K+", label: "Washes Done" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-gold sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs text-gray-400 sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
