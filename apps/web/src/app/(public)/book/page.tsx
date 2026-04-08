import { BookingForm } from "@/components/booking/BookingForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Now | BWash",
  description:
    "Schedule your premium mobile car wash. Choose your package, pick your time, and we'll bring the shine to you.",
};

export default function BookPage() {
  return (
    <div className="pt-24">
      <section className="section-padding">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              Book Your Wash
            </p>
            <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
              Schedule Your <span className="text-gradient-gold">Service</span>
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Fill out the form below and we&apos;ll confirm your appointment
              shortly. Quick, easy, and hassle-free.
            </p>
          </div>

          <BookingForm />

          {/* Payment Methods */}
          <div className="mt-12 card-luxury text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Options</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {["Zelle", "Cash App", "Apple Pay", "Credit/Debit", "Cash"].map(
                (method) => (
                  <div
                    key={method}
                    className="rounded-lg border border-luxury-border bg-luxury-gray px-4 py-2 text-sm text-gray-600"
                  >
                    {method}
                  </div>
                )
              )}
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Payment is collected after service completion. No upfront charges.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
