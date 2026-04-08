"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Crown, Check, ArrowRight, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Weekly Basic",
    interval: "week",
    description: "Basic wash once a week — keep your car spotless effortlessly.",
    package: "Basic Wash",
    prices: { sedan: 120, suv: 160, truck: 200 },
    perks: [
      "Exterior hand wash every week",
      "Tire cleaning included",
      "Priority scheduling",
      "Cancel anytime",
    ],
    popular: false,
  },
  {
    name: "Biweekly Premium",
    interval: "2 weeks",
    description: "Full premium wash every two weeks at a discounted rate.",
    package: "Premium Wash",
    prices: { sedan: 95, suv: 115, truck: 135 },
    perks: [
      "Interior + exterior every 2 weeks",
      "Window & dashboard cleaning",
      "Savings vs. single bookings",
      "Cancel anytime",
    ],
    popular: true,
  },
  {
    name: "Monthly Deluxe",
    interval: "month",
    description: "Complete deluxe detail once a month for showroom shine.",
    package: "Deluxe Detail",
    prices: { sedan: 75, suv: 85, truck: 100 },
    perks: [
      "Full deep-clean detail monthly",
      "Wax protection & tire shine",
      "Best value per detail",
      "Cancel anytime",
    ],
    popular: false,
  },
];

export function MembershipPlans() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Save More
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Monthly <span className="text-gradient-gold">Membership</span> Plans
            </h2>
            <p className="mt-4 text-lg text-foreground/50 max-w-2xl mx-auto">
              Subscribe and save. Get recurring washes at a fraction of the
              one-time price — delivered on your schedule.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.15}>
              <div
                className={cn(
                  "relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1",
                  plan.popular
                    ? "border-gold/50 bg-gradient-to-b from-gold/10 to-luxury-surface shadow-2xl shadow-gold/10"
                    : "border-luxury-border bg-luxury-surface hover:border-gold/30"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gold px-4 py-1 text-xs font-bold text-white">
                      BEST VALUE
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div
                    className={cn(
                      "mx-auto flex h-12 w-12 items-center justify-center rounded-xl mb-4",
                      plan.popular ? "bg-gold/20" : "bg-foreground/5"
                    )}
                  >
                    <Repeat
                      className={cn(
                        "h-6 w-6",
                        plan.popular ? "text-gold" : "text-foreground/40"
                      )}
                    />
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-1 text-xs text-foreground/40 uppercase tracking-wider">
                    {plan.package} • every {plan.interval}
                  </p>
                  <p className="mt-3 text-sm text-foreground/50">
                    {plan.description}
                  </p>
                </div>

                {/* Prices */}
                <div className="mt-8 space-y-3">
                  {(["sedan", "suv", "truck"] as const).map((type) => (
                    <div
                      key={type}
                      className="flex items-center justify-between rounded-lg bg-luxury-gray/50 px-4 py-2.5"
                    >
                      <span className="text-sm capitalize text-foreground/70">
                        {type}
                      </span>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gold">
                          ${plan.prices[type]}
                        </span>
                        <span className="text-xs text-foreground/40">
                          /{plan.interval}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Perks */}
                <ul className="mt-8 space-y-3">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                      <span className="text-foreground/70">{perk}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/sign-up"
                  className={cn(
                    "mt-8 flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-semibold transition-all duration-300 group",
                    plan.popular
                      ? "bg-gold text-white hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
                      : "border border-gold/30 text-gold hover:bg-gold/10"
                  )}
                >
                  <Crown className="h-4 w-4" />
                  Subscribe
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
