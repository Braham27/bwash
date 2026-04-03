import { db } from "@/lib/db";
import { testimonials } from "@bwash/database";
import { desc } from "drizzle-orm";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Star } from "lucide-react";
import { TestimonialFormClient } from "@/components/admin/TestimonialFormClient";

export default async function AdminTestimonialsPage() {
  const allTestimonials = await db
    .select()
    .from(testimonials)
    .orderBy(desc(testimonials.createdAt));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="mt-1 text-sm text-white/50">Manage customer reviews for the website</p>
        </div>
        <TestimonialFormClient />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTestimonials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-white/40 py-8">
                    No testimonials yet
                  </TableCell>
                </TableRow>
              ) : (
                allTestimonials.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <p className="font-medium text-sm">{t.name}</p>
                      {t.vehicleType && (
                        <p className="text-xs text-white/40">{t.vehicleType}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < t.rating ? "text-gold fill-gold" : "text-white/10"
                            }`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-white/60 truncate">{t.text}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={t.isPublished ? "success" : "danger"}>
                        {t.isPublished ? "Visible" : "Hidden"}
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
