"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Save, Camera, ImageIcon } from "lucide-react";

export function StaffJobNotes({
  bookingId,
  existingNotes,
  status,
}: {
  bookingId: string;
  existingNotes: string;
  status: string;
}) {
  const [notes, setNotes] = useState(existingNotes);
  const [isSaving, setIsSaving] = useState(false);
  const isEditable = status === "assigned" || status === "in_progress";

  async function saveNotes() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/staff/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, staffNotes: notes }),
      });
      if (!res.ok) throw new Error();
      toast.success("Notes saved");
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      {/* Staff Notes */}
      <Card className="p-6">
        <CardTitle className="mb-4">Job Notes</CardTitle>
        {isEditable ? (
          <div className="space-y-3">
            <textarea
              rows={4}
              placeholder="Add notes about the job... (issues found, work performed, recommendations)"
              className="input-luxury resize-none w-full"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button onClick={saveNotes} isLoading={isSaving} size="sm">
              <Save className="h-4 w-4" />
              Save Notes
            </Button>
          </div>
        ) : notes ? (
          <p className="text-sm text-white/70 whitespace-pre-wrap">{notes}</p>
        ) : (
          <p className="text-sm text-white/30 italic">No notes added</p>
        )}
      </Card>

      {/* Photo Upload Placeholder */}
      <Card className="p-6">
        <CardTitle className="mb-4">Service Photos</CardTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border-2 border-dashed border-luxury-border p-8 text-center">
            <Camera className="mx-auto h-10 w-10 text-white/20 mb-3" />
            <p className="text-sm font-medium text-white/50">Before Photos</p>
            <p className="text-xs text-white/30 mt-1">
              {isEditable ? "Photo upload coming soon" : "No photos uploaded"}
            </p>
            {isEditable && (
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 opacity-50 cursor-not-allowed"
                disabled
              >
                <Camera className="h-3.5 w-3.5" />
                Upload Photos
              </Button>
            )}
          </div>
          <div className="rounded-xl border-2 border-dashed border-luxury-border p-8 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-white/20 mb-3" />
            <p className="text-sm font-medium text-white/50">After Photos</p>
            <p className="text-xs text-white/30 mt-1">
              {isEditable ? "Photo upload coming soon" : "No photos uploaded"}
            </p>
            {isEditable && (
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 opacity-50 cursor-not-allowed"
                disabled
              >
                <Camera className="h-3.5 w-3.5" />
                Upload Photos
              </Button>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}
