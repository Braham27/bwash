import { db } from "@/lib/db";
import { serviceAreas } from "@bwash/database";
import { asc } from "drizzle-orm";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { MapPin } from "lucide-react";
import { AreaFormClient } from "@/components/admin/AreaFormClient";

export default async function AdminAreasPage() {
  const areas = await db
    .select()
    .from(serviceAreas)
    .orderBy(asc(serviceAreas.name));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Service Areas</h1>
          <p className="mt-1 text-sm text-gray-500">Manage operational zones and zip codes</p>
        </div>
        <AreaFormClient />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead>Zip Code</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                    No service areas configured
                  </TableCell>
                </TableRow>
              ) : (
                areas.map((area) => (
                  <TableRow key={area.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gold" />
                        <span className="font-medium text-sm">{area.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{area.zipCode}</TableCell>
                    <TableCell className="text-sm text-gray-500">{area.city}</TableCell>
                    <TableCell className="text-sm text-gray-500">{area.state}</TableCell>
                    <TableCell>
                      <Badge variant={area.isActive ? "success" : "danger"}>
                        {area.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
