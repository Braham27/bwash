"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function VehicleFormClient() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
    licensePlate: "",
    vehicleType: "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.make || !form.model || !form.vehicleType) {
      toast.error("Please fill required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add vehicle");
      toast.success("Vehicle added!");
      setIsOpen(false);
      setForm({ make: "", model: "", year: "", color: "", licensePlate: "", vehicleType: "" });
      router.refresh();
    } catch {
      toast.error("Failed to add vehicle");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm">
        <Plus className="h-4 w-4" /> Add Vehicle
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Vehicle">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Make *" id="make" placeholder="Toyota" value={form.make} onChange={(e) => updateField("make", e.target.value)} />
            <Input label="Model *" id="model" placeholder="Camry" value={form.model} onChange={(e) => updateField("model", e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Year" id="year" type="number" placeholder="2024" value={form.year} onChange={(e) => updateField("year", e.target.value)} />
            <Input label="Color" id="color" placeholder="Black" value={form.color} onChange={(e) => updateField("color", e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="License Plate" id="licensePlate" placeholder="ABC-1234" value={form.licensePlate} onChange={(e) => updateField("licensePlate", e.target.value)} />
            <Select label="Vehicle Type *" id="vehicleType" options={[
              { value: "sedan", label: "Sedan" },
              { value: "suv", label: "SUV" },
              { value: "truck", label: "Truck" },
            ]} placeholder="Select type" value={form.vehicleType} onChange={(e) => updateField("vehicleType", e.target.value)} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Save Vehicle</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
