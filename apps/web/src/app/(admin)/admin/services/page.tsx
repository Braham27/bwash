import { db } from "@/lib/db";
import { packages, packageFeatures } from "@bwash/database";
import { eq, asc } from "drizzle-orm";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { formatCurrency } from "@/lib/utils";
import { ServiceFormClient } from "@/components/admin/ServiceFormClient";
import { Package, Check, X } from "lucide-react";

export default async function AdminServicesPage() {
  const allPackages = await db
    .select()
    .from(packages)
    .orderBy(asc(packages.sortOrder));

  const allFeatures = await db
    .select()
    .from(packageFeatures)
    .orderBy(asc(packageFeatures.sortOrder));

  const featuresByPackage = allFeatures.reduce((acc, f) => {
    if (!acc[f.packageId]) acc[f.packageId] = [];
    acc[f.packageId].push(f);
    return acc;
  }, {} as Record<string, typeof allFeatures>);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Services & Pricing</h1>
          <p className="mt-1 text-sm text-white/50">Manage wash packages and pricing</p>
        </div>
        <ServiceFormClient />
      </div>

      <div className="grid gap-6">
        {allPackages.map((pkg) => (
          <Card key={pkg.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gold/10 p-3">
                  <Package className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{pkg.name}</h3>
                  <p className="text-sm text-white/50">{pkg.description}</p>
                </div>
              </div>
              <Badge variant={pkg.isActive ? "success" : "danger"}>
                {pkg.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-luxury-border">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Sedan</p>
                <p className="text-xl font-bold text-gold mt-1">{formatCurrency(pkg.sedanPrice)}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">SUV</p>
                <p className="text-xl font-bold text-gold mt-1">{formatCurrency(pkg.suvPrice)}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Truck</p>
                <p className="text-xl font-bold text-gold mt-1">{formatCurrency(pkg.truckPrice)}</p>
              </div>
            </div>

            {/* Features */}
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Features</p>
              <div className="grid gap-1 sm:grid-cols-2">
                {(featuresByPackage[pkg.id] || []).map((f) => (
                  <div key={f.id} className="flex items-center gap-2 text-sm">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-white/70">
                      {f.feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
