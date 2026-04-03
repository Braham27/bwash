"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function StaffFormClient() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      toast.error("Please fill required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      toast.success("Staff member invited!");
      setIsOpen(false);
      setForm({ firstName: "", lastName: "", email: "", phone: "" });
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add staff";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm">
        <Plus className="h-4 w-4" /> Add Staff
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Staff Member">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First Name *" id="firstName" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
            <Input label="Last Name *" id="lastName" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
          </div>
          <Input label="Email *" id="email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
          <Input label="Phone" id="phone" type="tel" placeholder="+1 (555) 123-4567" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
          <p className="text-xs text-white/40">
            An invitation will be sent to create their account with staff access.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Send Invite</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
