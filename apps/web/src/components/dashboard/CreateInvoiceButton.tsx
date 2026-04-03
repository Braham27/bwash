"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Plus, Loader2, Check, AlertCircle } from "lucide-react";

interface EligibleBooking {
  id: string;
  packageName: string;
  vehicleType: string;
  preferredDate: string;
  price: string;
}

export function CreateInvoiceButton({
  bookings,
}: {
  bookings: EligibleBooking[];
}) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState<string | null>(null);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleCreate(bookingId: string) {
    setCreating(bookingId);
    setResult(null);
    try {
      const res = await fetch("/api/invoices/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ type: "error", message: data.error || "Failed to create" });
      } else {
        setResult({
          type: "success",
          message: `Invoice #${data.invoice.invoiceNumber} created!`,
        });
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch {
      setResult({ type: "error", message: "Something went wrong" });
    } finally {
      setCreating(null);
    }
  }

  if (bookings.length === 0) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-white/30 cursor-not-allowed"
        title="Complete a booking first to create an invoice"
      >
        <Plus className="h-4 w-4" />
        Create Invoice
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/20"
      >
        <Plus className="h-4 w-4" />
        Create Invoice
      </button>

      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setResult(null);
        }}
        title="Create Invoice"
        className="max-w-lg"
      >
        <p className="text-sm text-white/40 mb-4">
          Select a completed booking to generate an invoice:
        </p>

        {result && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
              result.type === "success"
                ? "border-green-500/30 bg-green-500/10 text-green-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {result.type === "success" ? (
              <Check className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            {result.message}
          </div>
        )}

        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-luxury-border bg-white/[0.02] p-4 transition hover:border-gold/20"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {b.packageName}
                </p>
                <p className="text-xs text-white/40">
                  {b.vehicleType} &middot;{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(b.preferredDate))}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-bold text-gold">
                  ${parseFloat(b.price).toFixed(2)}
                </span>
                <button
                  onClick={() => handleCreate(b.id)}
                  disabled={creating !== null}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gold/10 border border-gold/20 px-3 py-2 text-xs font-medium text-gold transition hover:bg-gold/20 disabled:opacity-40"
                >
                  {creating === b.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  Create
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
