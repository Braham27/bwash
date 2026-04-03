"use client";

import { useState, useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import {
  Eye,
  Mail,
  MessageSquare,
  Download,
  Loader2,
  Check,
  X,
  Printer,
} from "lucide-react";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  items: InvoiceItem[];
  subtotal: string;
  taxRate: string | null;
  taxAmount: string | null;
  tipAmount: string | null;
  total: string;
  paymentStatus: string;
  paymentMethod: string | null;
  paidAt: Date | null;
  notes: string | null;
  createdAt: Date;
}

const paymentVariant: Record<string, "warning" | "success" | "danger" | "info"> = {
  pending: "warning",
  paid: "success",
  partial: "warning",
  refunded: "info",
  failed: "danger",
};

function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const [showPreview, setShowPreview] = useState(false);
  const [sending, setSending] = useState<"email" | "sms" | null>(null);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSend(method: "email" | "sms") {
    setSending(method);
    setResult(null);
    try {
      const res = await fetch("/api/invoices/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: invoice.id, method }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ type: "error", message: data.error || "Failed to send" });
      } else {
        setResult({
          type: "success",
          message: method === "email" ? "Invoice sent to your email!" : "Invoice sent via SMS!",
        });
      }
    } catch {
      setResult({ type: "error", message: "Something went wrong" });
    } finally {
      setSending(null);
      setTimeout(() => setResult(null), 4000);
    }
  }

  return (
    <>
      {/* Action buttons inline */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowPreview(true)}
          className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
          title="Preview"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleSend("email")}
          disabled={sending !== null}
          className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-blue-400 disabled:opacity-40"
          title="Send via Email"
        >
          {sending === "email" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={() => handleSend("sms")}
          disabled={sending !== null}
          className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-green-400 disabled:opacity-40"
          title="Send via SMS"
        >
          {sending === "sms" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MessageSquare className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Toast */}
      {result && (
        <div
          className={`fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-xl backdrop-blur-sm ${
            result.type === "success"
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {result.type === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
          {result.message}
        </div>
      )}

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={`Invoice #${invoice.invoiceNumber}`}
        className="max-w-xl"
      >
        <InvoicePreviewContent invoice={invoice} onSend={handleSend} sending={sending} />
      </Modal>
    </>
  );
}

function InvoicePreviewContent({
  invoice,
  onSend,
  sending,
}: {
  invoice: Invoice;
  onSend: (method: "email" | "sms") => void;
  sending: "email" | "sms" | null;
}) {
  const printRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    if (!printRef.current) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html>
      <head>
        <title>Invoice ${invoice.invoiceNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 40px; color: #111; }
          .header { display: flex; justify-content: space-between; margin-bottom: 32px; }
          .brand { font-size: 28px; font-weight: bold; }
          .brand span { color: #C9A84C; }
          .meta { font-size: 13px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { text-align: left; border-bottom: 2px solid #ddd; padding: 10px 0; font-size: 12px; text-transform: uppercase; color: #888; }
          td { padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; }
          .total-row td { border-bottom: none; font-weight: bold; font-size: 16px; }
          .total-amount { color: #C9A84C; font-size: 20px; }
          .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
          .status-paid { background: #dcfce7; color: #166534; }
          .status-pending { background: #fef9c3; color: #854d0e; }
          .footer { margin-top: 40px; font-size: 12px; color: #999; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">B<span>Wash</span></div>
            <div class="meta">Premium Mobile Car Wash</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:18px;font-weight:bold;">Invoice #${invoice.invoiceNumber}</div>
            <div class="meta">${formatDate(invoice.createdAt)}</div>
            <div class="status status-${invoice.paymentStatus}">${invoice.paymentStatus}</div>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Service</th><th style="text-align:right">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr>
          </thead>
          <tbody>
            ${invoice.items
              .map(
                (item) =>
                  `<tr><td>${item.description}</td><td style="text-align:right">${item.quantity}</td><td style="text-align:right">${formatCurrency(item.unitPrice)}</td><td style="text-align:right">${formatCurrency(item.total)}</td></tr>`
              )
              .join("")}
          </tbody>
        </table>
        <div style="text-align:right;margin-top:20px;">
          <div class="meta">Subtotal: ${formatCurrency(invoice.subtotal)}</div>
          ${invoice.taxAmount ? `<div class="meta">Tax (${(parseFloat(invoice.taxRate || "0") * 100).toFixed(1)}%): ${formatCurrency(invoice.taxAmount)}</div>` : ""}
          ${invoice.tipAmount && parseFloat(invoice.tipAmount) > 0 ? `<div class="meta">Tip: ${formatCurrency(invoice.tipAmount)}</div>` : ""}
          <div class="total-amount" style="margin-top:8px">Total: ${formatCurrency(invoice.total)}</div>
        </div>
        ${invoice.notes ? `<div style="margin-top:24px;padding:16px;background:#f9f9f9;border-radius:8px;font-size:13px;color:#666;">${invoice.notes}</div>` : ""}
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} BWash. All rights reserved.</p>
          <p>Payment methods: Zelle, Cash App, Apple Pay, credit/debit card, or cash.</p>
        </div>
      </body>
      </html>
    `);
    w.document.close();
    w.print();
  }

  return (
    <div>
      <div ref={printRef}>
        {/* Status + date */}
        <div className="flex items-center justify-between mb-5">
          <div className="text-xs text-white/40">{formatDate(invoice.createdAt)}</div>
          <Badge variant={paymentVariant[invoice.paymentStatus] || "default"}>
            {invoice.paymentStatus}
          </Badge>
        </div>

        {/* Items table */}
        <div className="border border-luxury-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-luxury-border bg-white/[0.02]">
                <th className="text-left px-4 py-3 text-[11px] font-medium tracking-wider uppercase text-white/40">
                  Service
                </th>
                <th className="text-right px-4 py-3 text-[11px] font-medium tracking-wider uppercase text-white/40">
                  Qty
                </th>
                <th className="text-right px-4 py-3 text-[11px] font-medium tracking-wider uppercase text-white/40">
                  Price
                </th>
                <th className="text-right px-4 py-3 text-[11px] font-medium tracking-wider uppercase text-white/40">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-luxury-border last:border-0"
                >
                  <td className="px-4 py-3 text-white/80">{item.description}</td>
                  <td className="px-4 py-3 text-right text-white/50">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-white/50">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-4 py-3 text-right text-white font-medium">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-white/40">
            <span>Subtotal</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.taxAmount && parseFloat(invoice.taxAmount) > 0 && (
            <div className="flex justify-between text-white/40">
              <span>
                Tax ({(parseFloat(invoice.taxRate || "0") * 100).toFixed(1)}%)
              </span>
              <span>{formatCurrency(invoice.taxAmount)}</span>
            </div>
          )}
          {invoice.tipAmount && parseFloat(invoice.tipAmount) > 0 && (
            <div className="flex justify-between text-white/40">
              <span>Tip</span>
              <span>{formatCurrency(invoice.tipAmount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-luxury-border pt-3 text-base font-bold">
            <span className="text-white">Total</span>
            <span className="text-gold">{formatCurrency(invoice.total)}</span>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-4 rounded-lg bg-white/[0.03] p-3 text-xs text-white/40">
            {invoice.notes}
          </div>
        )}

        {/* Payment info */}
        {invoice.paidAt && (
          <div className="mt-3 text-xs text-green-400/60">
            Paid on {formatDate(invoice.paidAt)}
            {invoice.paymentMethod && ` via ${invoice.paymentMethod.replace("_", " ")}`}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-2 border-t border-luxury-border pt-4">
        <button
          onClick={() => onSend("email")}
          disabled={sending !== null}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-4 py-2.5 text-sm font-medium text-blue-400 transition hover:bg-blue-500/20 disabled:opacity-40"
        >
          {sending === "email" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          Send Email
        </button>
        <button
          onClick={() => onSend("sms")}
          disabled={sending !== null}
          className="inline-flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-2.5 text-sm font-medium text-green-400 transition hover:bg-green-500/20 disabled:opacity-40"
        >
          {sending === "sms" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MessageSquare className="h-4 w-4" />
          )}
          Send SMS
        </button>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
      </div>
    </div>
  );
}
