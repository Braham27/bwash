import { db } from "@/lib/db";
import { businessSettings } from "@bwash/database";
import { Card, CardTitle } from "@/components/ui/Card";
import { SettingsFormClient } from "@/components/admin/SettingsFormClient";

export default async function AdminSettingsPage() {
  const allSettings = await db.select().from(businessSettings);

  // Convert key-value rows to a settings object
  const settingsMap: Record<string, string> = {};
  for (const row of allSettings) {
    settingsMap[row.key] = row.value;
  }

  const initialData = allSettings.length > 0 ? {
    businessName: settingsMap["business_name"] || "BWash",
    phone: settingsMap["phone"] || "",
    email: settingsMap["email"] || "",
    taxRate: parseFloat(settingsMap["tax_rate"] || "7"),
    businessHoursStart: settingsMap["business_hours_start"] || "08:00",
    businessHoursEnd: settingsMap["business_hours_end"] || "18:00",
    businessDays: settingsMap["business_days"] ? JSON.parse(settingsMap["business_days"]) : ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    whatsappNumber: settingsMap["whatsapp_number"] || "",
    address: settingsMap["address"] || "",
  } : undefined;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Business Settings</h1>
        <p className="mt-1 text-sm text-foreground/50">Configure business hours, taxes, and contact info</p>
      </div>

      <SettingsFormClient initialData={initialData} />
    </div>
  );
}
