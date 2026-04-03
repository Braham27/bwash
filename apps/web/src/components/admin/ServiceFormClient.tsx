"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function ServiceFormClient() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    sedanPrice: "",
    suvPrice: "",
    truckPrice: "",
    duration: "60",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "name") {
      setForm((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.sedanPrice || !form.suvPrice || !form.truckPrice) {
      toast.error("Please fill required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sedanPrice: parseFloat(form.sedanPrice),
          suvPrice: parseFloat(form.suvPrice),
          truckPrice: parseFloat(form.truckPrice),
          duration: parseInt(form.duration),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Package created!");
      setIsOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to create package");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm">
        <Plus className="h-4 w-4" /> Add Package
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="New Wash Package">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Package Name *" id="name" placeholder="Ultra Premium" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
          <Input label="Slug" id="slug" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} />
          <Input label="Description" id="description" placeholder="Description..." value={form.description} onChange={(e) => updateField("description", e.target.value)} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Sedan Price *" id="sedanPrice" type="number" step="0.01" value={form.sedanPrice} onChange={(e) => updateField("sedanPrice", e.target.value)} />
            <Input label="SUV Price *" id="suvPrice" type="number" step="0.01" value={form.suvPrice} onChange={(e) => updateField("suvPrice", e.target.value)} />
            <Input label="Truck Price *" id="truckPrice" type="number" step="0.01" value={form.truckPrice} onChange={(e) => updateField("truckPrice", e.target.value)} />
          </div>
          <Input label="Duration (min)" id="duration" type="number" value={form.duration} onChange={(e) => updateField("duration", e.target.value)} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Create Package</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
