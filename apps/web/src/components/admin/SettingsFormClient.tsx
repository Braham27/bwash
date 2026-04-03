"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

interface SettingsData {
  businessName: string;
  phone: string;
  email: string;
  taxRate: number;
  businessHoursStart: string;
  businessHoursEnd: string;
  businessDays: string[];
  whatsappNumber: string;
  address: string;
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export function SettingsFormClient({ initialData }: { initialData?: SettingsData }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<SettingsData>(
    initialData || {
      businessName: "BWash",
      phone: "",
      email: "",
      taxRate: 7,
      businessHoursStart: "08:00",
      businessHoursEnd: "18:00",
      businessDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
      whatsappNumber: "",
      address: "",
    }
  );

  function updateField(field: string, value: string | number | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleDay(day: string) {
    setForm((prev) => ({
      ...prev,
      businessDays: prev.businessDays.includes(day)
        ? prev.businessDays.filter((d) => d !== day)
        : [...prev.businessDays, day],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Settings saved!");
      router.refresh();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <CardTitle className="mb-4">Business Information</CardTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Business Name" id="businessName" value={form.businessName} onChange={(e) => updateField("businessName", e.target.value)} />
          <Input label="Phone" id="phone" type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
          <Input label="Email" id="email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
          <Input label="WhatsApp Number" id="whatsappNumber" value={form.whatsappNumber} onChange={(e) => updateField("whatsappNumber", e.target.value)} />
          <div className="sm:col-span-2">
            <Input label="Address" id="address" value={form.address} onChange={(e) => updateField("address", e.target.value)} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <CardTitle className="mb-4">Tax & Hours</CardTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Tax Rate (%)" id="taxRate" type="number" step="0.01" value={form.taxRate.toString()} onChange={(e) => updateField("taxRate", parseFloat(e.target.value) || 0)} />
          <Input label="Hours Start" id="businessHoursStart" type="time" value={form.businessHoursStart} onChange={(e) => updateField("businessHoursStart", e.target.value)} />
          <Input label="Hours End" id="businessHoursEnd" type="time" value={form.businessHoursEnd} onChange={(e) => updateField("businessHoursEnd", e.target.value)} />
        </div>

        {/* Business Days */}
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-white/70">Business Days</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`rounded-lg px-3 py-2 text-xs font-medium capitalize transition ${
                  form.businessDays.includes(day)
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : "bg-luxury-card text-white/40 border border-luxury-border hover:text-white/60"
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>Save Settings</Button>
      </div>
    </form>
  );
}
