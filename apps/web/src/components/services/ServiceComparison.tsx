"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Check, X } from "lucide-react";

const features = [
  { name: "Exterior hand wash", basic: true, premium: true, deluxe: true },
  { name: "Tire cleaning", basic: true, premium: true, deluxe: true },
  { name: "Hand drying", basic: true, premium: true, deluxe: true },
  { name: "Interior vacuum", basic: false, premium: true, deluxe: true },
  { name: "Window cleaning", basic: false, premium: true, deluxe: true },
  { name: "Dashboard wipe", basic: false, premium: true, deluxe: true },
  { name: "Deep interior cleaning", basic: false, premium: false, deluxe: true },
  { name: "Wax protection", basic: false, premium: false, deluxe: true },
  { name: "Tire shine", basic: false, premium: false, deluxe: true },
];

function FeatureIcon({ included }: { included: boolean }) {
  return included ? (
    <Check className="h-5 w-5 text-gold" />
  ) : (
    <X className="h-5 w-5 text-white/20" />
  );
}

export function ServiceComparison() {
  return (
    <section className="section-padding bg-luxury-dark">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Package Comparison</h2>
            <p className="mt-3 text-white/50">
              See what&apos;s included in each package at a glance.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="overflow-x-auto rounded-2xl border border-luxury-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-luxury-border bg-luxury-gray/50">
                  <th className="px-6 py-4 text-left text-white/70 font-medium">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-white/70 font-medium">
                    Basic
                  </th>
                  <th className="px-6 py-4 text-center font-medium">
                    <span className="text-gold">Premium</span>
                  </th>
                  <th className="px-6 py-4 text-center text-white/70 font-medium">
                    Deluxe
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-border">
                {features.map((f) => (
                  <tr
                    key={f.name}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-3.5 text-white/80">{f.name}</td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="inline-flex justify-center">
                        <FeatureIcon included={f.basic} />
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="inline-flex justify-center">
                        <FeatureIcon included={f.premium} />
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="inline-flex justify-center">
                        <FeatureIcon included={f.deluxe} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
