"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

const vehicleTypes = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "truck", label: "Truck" },
];

const packages = [
  { value: "basic-wash", label: "Basic Wash", sedan: 35, suv: 45, truck: 55 },
  { value: "premium-wash", label: "Premium Wash", sedan: 55, suv: 65, truck: 75 },
  { value: "deluxe-detail", label: "Deluxe Detail", sedan: 85, suv: 95, truck: 110 },
];

const timeSlots = [
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
];

export function BookingForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    vehicleType: "",
    packageSlug: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
    accessNotes: "",
    tipAmount: "",
  });

  const tipPresets = [5, 10, 15, 20];

  const selectedPkg = packages.find((p) => p.value === form.packageSlug);
  const price = selectedPkg && form.vehicleType
    ? selectedPkg[form.vehicleType as keyof typeof selectedPkg]
    : null;

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.vehicleType) newErrors.vehicleType = "Select a vehicle type";
    if (!form.packageSlug) newErrors.packageSlug = "Select a package";
    if (!form.preferredDate) newErrors.preferredDate = "Select a date";
    if (!form.preferredTime) newErrors.preferredTime = "Select a time";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tipAmount: form.tipAmount ? parseFloat(form.tipAmount) : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit booking");
      }

      setIsSuccess(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <Card className="text-center py-16">
        <CheckCircle className="mx-auto h-16 w-16 text-gold mb-6" />
        <h2 className="text-2xl font-bold">Thank You!</h2>
        <p className="mt-3 text-foreground/50 max-w-md mx-auto">
          Your appointment request has been received. We will contact you
          shortly to confirm your booking.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={() => { setIsSuccess(false); setForm({ fullName: "", phone: "", email: "", address: "", vehicleType: "", packageSlug: "", preferredDate: "", preferredTime: "", notes: "", accessNotes: "", tipAmount: "" }); }}>
            Book Another
          </Button>
          <Button variant="secondary" onClick={() => router.push("/")}>
            Return Home
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Full Name"
            id="fullName"
            placeholder="John Doe"
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            error={errors.fullName}
          />
          <Input
            label="Phone Number"
            id="phone"
            type="tel"
            placeholder="(305) 555-1234"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            error={errors.phone}
          />
        </div>

        <Input
          label="Email"
          id="email"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          error={errors.email}
        />

        <Input
          label="Address / Location"
          id="address"
          placeholder="123 Main St, Miami, FL 33101"
          value={form.address}
          onChange={(e) => updateField("address", e.target.value)}
          error={errors.address}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <Select
            label="Vehicle Type"
            id="vehicleType"
            options={vehicleTypes}
            placeholder="Select vehicle type"
            value={form.vehicleType}
            onChange={(e) => updateField("vehicleType", e.target.value)}
            error={errors.vehicleType}
          />
          <Select
            label="Select Package"
            id="packageSlug"
            options={packages.map((p) => ({ value: p.value, label: p.label }))}
            placeholder="Select a package"
            value={form.packageSlug}
            onChange={(e) => updateField("packageSlug", e.target.value)}
            error={errors.packageSlug}
          />
        </div>

        {price && (
          <div className="rounded-lg bg-gold/10 border border-gold/20 px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-foreground/70">Estimated Price</span>
            <span className="text-xl font-bold text-gold">${price as number}</span>
          </div>
        )}

        {/* Tip Section */}
        {price && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground/70">
              Add a Tip (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {tipPresets.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => updateField("tipAmount", form.tipAmount === String(amount) ? "" : String(amount))}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-all",
                    form.tipAmount === String(amount)
                      ? "bg-gold text-white"
                      : "border border-gold/30 text-gold hover:bg-gold/10"
                  )}
                >
                  ${amount}
                </button>
              ))}
              <Input
                id="customTip"
                type="number"
                placeholder="Custom"
                value={tipPresets.includes(Number(form.tipAmount)) ? "" : form.tipAmount}
                onChange={(e) => updateField("tipAmount", e.target.value)}
                className="w-24"
                min="0"
                max="500"
              />
            </div>
            {form.tipAmount && (
              <div className="rounded-lg bg-gold/5 border border-gold/10 px-4 py-2 flex items-center justify-between">
                <span className="text-sm text-foreground/50">Total with tip</span>
                <span className="text-lg font-bold text-gold">
                  ${(price as number) + parseFloat(form.tipAmount || "0")}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Preferred Date"
            id="preferredDate"
            type="date"
            value={form.preferredDate}
            onChange={(e) => updateField("preferredDate", e.target.value)}
            error={errors.preferredDate}
            min={new Date().toISOString().split("T")[0]}
          />
          <Select
            label="Preferred Time"
            id="preferredTime"
            options={timeSlots}
            placeholder="Select a time"
            value={form.preferredTime}
            onChange={(e) => updateField("preferredTime", e.target.value)}
            error={errors.preferredTime}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="notes" className="block text-sm font-medium text-foreground/70">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            rows={2}
            placeholder="Special requests, preferred contact method..."
            className="input-luxury resize-none"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="accessNotes" className="block text-sm font-medium text-foreground/70">
            Gate Code / Access Instructions (optional)
          </label>
          <textarea
            id="accessNotes"
            rows={2}
            placeholder="Gate code #1234, park in visitor spot, ring doorbell..."
            className="input-luxury resize-none"
            value={form.accessNotes}
            onChange={(e) => updateField("accessNotes", e.target.value)}
          />
        </div>

        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
          Submit Booking Request
        </Button>
      </form>
    </Card>
  );
}
