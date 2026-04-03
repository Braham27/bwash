"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface MembershipActionsProps {
  membershipId: string;
  status: string;
}

export function MembershipActions({ membershipId, status }: MembershipActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAction(action: "pause" | "cancel" | "resume") {
    setLoading(action);
    try {
      const res = await fetch("/api/memberships", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId, action }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update membership");
      }
      toast.success(`Membership ${action === "pause" ? "paused" : action === "cancel" ? "cancelled" : "resumed"}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-4 flex gap-3 border-t border-luxury-border pt-4">
      {status === "active" && (
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleAction("pause")}
            disabled={loading !== null}
          >
            {loading === "pause" ? "Pausing..." : "Pause"}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleAction("cancel")}
            disabled={loading !== null}
          >
            {loading === "cancel" ? "Cancelling..." : "Cancel"}
          </Button>
        </>
      )}
      {status === "paused" && (
        <>
          <Button
            size="sm"
            onClick={() => handleAction("resume")}
            disabled={loading !== null}
          >
            {loading === "resume" ? "Resuming..." : "Resume Membership"}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleAction("cancel")}
            disabled={loading !== null}
          >
            {loading === "cancel" ? "Cancelling..." : "Cancel"}
          </Button>
        </>
      )}
    </div>
  );
}
