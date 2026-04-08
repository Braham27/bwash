"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export function AdminInvoiceActions({
  invoiceId,
  currentStatus,
}: {
  invoiceId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function markPaid() {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId, paymentStatus: "paid" }),
      });
      if (!res.ok) throw new Error();
      toast.success("Invoice marked as paid");
      router.refresh();
    } catch {
      toast.error("Failed to update invoice");
    } finally {
      setIsUpdating(false);
    }
  }

  if (currentStatus === "paid") return <span className="text-xs text-foreground/30">Paid</span>;

  return (
    <Button size="sm" onClick={markPaid} isLoading={isUpdating} className="text-xs">
      Mark Paid
    </Button>
  );
}
