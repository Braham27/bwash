import { PricingCards } from "@/components/services/PricingCards";
import { ServiceComparison } from "@/components/services/ServiceComparison";
import { MembershipPlans } from "@/components/services/MembershipPlans";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services & Pricing | BWash",
  description:
    "View our premium mobile car wash packages. Basic Wash, Premium Wash, and Deluxe Detail services for Sedans, SUVs, and Trucks.",
};

export default function ServicesPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="section-padding text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Services & Pricing
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Choose Your <span className="text-gradient-gold">Package</span>
          </h1>
          <p className="mt-4 text-lg text-foreground/50">
            Transparent pricing for every vehicle type. No hidden fees, no
            surprises — just premium results.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <PricingCards />

      {/* Comparison */}
      <ServiceComparison />

      {/* Membership Plans */}
      <MembershipPlans />
    </div>
  );
}
