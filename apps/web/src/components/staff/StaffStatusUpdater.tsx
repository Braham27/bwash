"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Play, CheckCircle2 } from "lucide-react";

export function StaffStatusUpdater({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const nextAction = currentStatus === "assigned"
    ? { status: "in_progress", label: "Start Job", icon: Play, color: "bg-amber-500 hover:bg-amber-600" }
    : { status: "completed", label: "Mark Complete", icon: CheckCircle2, color: "bg-emerald-500 hover:bg-emerald-600" };

  async function handleUpdate() {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/staff/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: nextAction.status }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Job ${nextAction.status === "completed" ? "completed" : "started"}!`);
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Card className="p-6">
      <CardTitle className="mb-4">Update Status</CardTitle>
      <Button
        onClick={handleUpdate}
        isLoading={isUpdating}
        className={`w-full py-4 text-base font-semibold text-white ${nextAction.color}`}
      >
        <nextAction.icon className="h-5 w-5" />
        {nextAction.label}
      </Button>
    </Card>
  );
}
