"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

const nextStatus: Record<string, string[]> = {
  new: ["confirmed", "cancelled"],
  confirmed: ["assigned", "cancelled"],
  assigned: ["in_progress", "cancelled"],
  in_progress: ["completed"],
  completed: [],
  cancelled: [],
};

interface StaffOption {
  id: string;
  name: string;
}

export function AdminBookingActions({
  bookingId,
  currentStatus,
  staffList = [],
}: {
  bookingId: string;
  currentStatus: string;
  staffList?: StaffOption[];
}) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [showStaffPicker, setShowStaffPicker] = useState(false);
  const available = nextStatus[currentStatus] || [];

  async function updateStatus(newStatus: string, staffId?: string) {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus, staffId }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Booking updated to ${newStatus.replace("_", " ")}`);
      setShowStaffPicker(false);
      router.refresh();
    } catch {
      toast.error("Failed to update booking");
    } finally {
      setIsUpdating(false);
    }
  }

  async function createInvoice() {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      toast.success("Invoice created successfully");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create invoice");
    } finally {
      setIsUpdating(false);
    }
  }

  if (available.length === 0 && currentStatus !== "completed") {
    return <span className="text-xs text-foreground/30">—</span>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1">
        {available.map((status) => {
          if (status === "assigned") {
            return (
              <Button
                key={status}
                size="sm"
                variant="secondary"
                onClick={() => setShowStaffPicker(!showStaffPicker)}
                isLoading={isUpdating}
                className="text-xs capitalize"
              >
                Assign Staff
              </Button>
            );
          }
          return (
            <Button
              key={status}
              size="sm"
              variant={status === "cancelled" ? "ghost" : "secondary"}
              onClick={() => updateStatus(status)}
              isLoading={isUpdating}
              className="text-xs capitalize"
            >
              {status.replace("_", " ")}
            </Button>
          );
        })}
        {currentStatus === "completed" && (
          <Button
            size="sm"
            variant="primary"
            onClick={createInvoice}
            isLoading={isUpdating}
            className="text-xs"
          >
            Create Invoice
          </Button>
        )}
      </div>

      {showStaffPicker && (
        <div className="flex gap-2 items-center">
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="input-luxury text-xs py-1 px-2 flex-1"
          >
            <option value="">Select staff...</option>
            {staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            variant="primary"
            disabled={!selectedStaff}
            onClick={() => updateStatus("assigned", selectedStaff)}
            isLoading={isUpdating}
            className="text-xs"
          >
            Assign
          </Button>
        </div>
      )}
    </div>
  );
}
