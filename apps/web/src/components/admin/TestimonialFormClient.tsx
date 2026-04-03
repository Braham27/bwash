"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Plus, Star } from "lucide-react";
import { toast } from "sonner";

export function TestimonialFormClient() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    vehicleInfo: "",
    comment: "",
    rating: 5,
  });

  function updateField(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.comment) {
      toast.error("Name and comment are required");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Testimonial added!");
      setIsOpen(false);
      setForm({ name: "", vehicleInfo: "", comment: "", rating: 5 });
      router.refresh();
    } catch {
      toast.error("Failed to add testimonial");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm">
        <Plus className="h-4 w-4" /> Add Review
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Testimonial">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Customer Name *" id="name" placeholder="John D." value={form.name} onChange={(e) => updateField("name", e.target.value)} />
          <Input label="Vehicle Info" id="vehicleInfo" placeholder="2024 BMW X5" value={form.vehicleInfo} onChange={(e) => updateField("vehicleInfo", e.target.value)} />

          {/* Star Rating */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/70">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => updateField("rating", star)}
                  className="p-0.5"
                >
                  <Star
                    className={`h-6 w-6 transition ${
                      star <= form.rating ? "text-gold fill-gold" : "text-white/20"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="mb-1.5 block text-sm font-medium text-white/70">
              Comment *
            </label>
            <textarea
              id="comment"
              rows={3}
              value={form.comment}
              onChange={(e) => updateField("comment", e.target.value)}
              className="input-luxury w-full resize-none"
              placeholder="Great service..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Add Review</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
