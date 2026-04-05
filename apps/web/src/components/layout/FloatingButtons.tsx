"use client";

import { Phone, MessageCircle } from "lucide-react";

export function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <a
        href="https://wa.me/13055559274"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-110 hover:shadow-xl"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <a
        href="tel:+13055559274"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-white shadow-lg shadow-gold/30 transition-all duration-300 hover:scale-110 hover:shadow-xl"
        aria-label="Call us"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
