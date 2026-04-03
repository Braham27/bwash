"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  label: string;
  vehicleType: string;
}

interface SubscribeButtonProps {
  planId: string;
  vehicles: Vehicle[];
}

export function SubscribeButton({ planId, vehicles }: SubscribeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleId, setVehicleId] = useState("");

  async function handleSubscribe() {
    if (!vehicleType) {
      toast.error("Please select a vehicle type");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, vehicleId: vehicleId || undefined, vehicleType }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to subscribe");
      }
      toast.success("Membership activated! Welcome aboard.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!showForm) {
    return (
      <Button size="sm" className="mt-4 w-full" onClick={() => setShowForm(true)}>
        Subscribe
      </Button>
    );
  }

  return (
    <div className="mt-4 space-y-3 border-t border-luxury-border pt-4">
      <Select
        label="Vehicle Type"
        id={`vtype-${planId}`}
        options={[
          { value: "sedan", label: "Sedan" },
          { value: "suv", label: "SUV" },
          { value: "truck", label: "Truck" },
        ]}
        placeholder="Select vehicle type"
        value={vehicleType}
        onChange={(e) => setVehicleType(e.target.value)}
      />
      {vehicles.length > 0 && (
        <Select
          label="Saved Vehicle (optional)"
          id={`vehicle-${planId}`}
          options={vehicles.map((v) => ({ value: v.id, label: v.label }))}
          placeholder="Select a vehicle"
          value={vehicleId}
          onChange={(e) => {
            setVehicleId(e.target.value);
            const selected = vehicles.find((v) => v.id === e.target.value);
            if (selected) setVehicleType(selected.vehicleType);
          }}
        />
      )}
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSubscribe} disabled={loading}>
          {loading ? "Subscribing..." : "Confirm"}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setShowForm(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
