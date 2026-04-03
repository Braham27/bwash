"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function AreaFormClient() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    zipCode: "",
    city: "",
    state: "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.zipCode || !form.city || !form.state) {
      toast.error("Please fill all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Service area added!");
      setIsOpen(false);
      setForm({ name: "", zipCode: "", city: "", state: "" });
      router.refresh();
    } catch {
      toast.error("Failed to add area");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm">
        <Plus className="h-4 w-4" /> Add Area
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Service Area">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Area Name *" id="name" placeholder="Downtown Miami" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
          <Input label="Zip Code *" id="zipCode" placeholder="33101" value={form.zipCode} onChange={(e) => updateField("zipCode", e.target.value)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="City *" id="city" placeholder="Miami" value={form.city} onChange={(e) => updateField("city", e.target.value)} />
            <Input label="State *" id="state" placeholder="FL" maxLength={2} value={form.state} onChange={(e) => updateField("state", e.target.value)} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Add Area</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
