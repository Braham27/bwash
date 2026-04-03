import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log("🌱 Seeding database...");

  // Seed packages
  const [basicWash] = await db
    .insert(schema.packages)
    .values({
      name: "Basic Wash",
      slug: "basic-wash",
      description:
        "A thorough exterior hand wash to keep your car looking clean and fresh.",
      sedanPrice: "35.00",
      suvPrice: "45.00",
      truckPrice: "55.00",
      sortOrder: 1,
    })
    .returning();

  const [premiumWash] = await db
    .insert(schema.packages)
    .values({
      name: "Premium Wash",
      slug: "premium-wash",
      description:
        "Complete interior and exterior cleaning for a like-new feel.",
      sedanPrice: "55.00",
      suvPrice: "65.00",
      truckPrice: "75.00",
      sortOrder: 2,
    })
    .returning();

  const [deluxeDetail] = await db
    .insert(schema.packages)
    .values({
      name: "Deluxe Detail",
      slug: "deluxe-detail",
      description:
        "The ultimate detailing experience with deep cleaning and premium wax protection.",
      sedanPrice: "85.00",
      suvPrice: "95.00",
      truckPrice: "110.00",
      sortOrder: 3,
    })
    .returning();

  console.log("✅ Packages seeded");

  // Seed package features
  await db.insert(schema.packageFeatures).values([
    { packageId: basicWash.id, feature: "Exterior hand wash", sortOrder: 1 },
    { packageId: basicWash.id, feature: "Tire cleaning", sortOrder: 2 },
    { packageId: basicWash.id, feature: "Hand drying", sortOrder: 3 },

    {
      packageId: premiumWash.id,
      feature: "Everything in Basic Wash",
      sortOrder: 1,
    },
    { packageId: premiumWash.id, feature: "Interior vacuum", sortOrder: 2 },
    { packageId: premiumWash.id, feature: "Window cleaning", sortOrder: 3 },
    { packageId: premiumWash.id, feature: "Dashboard wipe", sortOrder: 4 },

    {
      packageId: deluxeDetail.id,
      feature: "Everything in Premium Wash",
      sortOrder: 1,
    },
    {
      packageId: deluxeDetail.id,
      feature: "Deep interior cleaning",
      sortOrder: 2,
    },
    { packageId: deluxeDetail.id, feature: "Wax protection", sortOrder: 3 },
    { packageId: deluxeDetail.id, feature: "Tire shine", sortOrder: 4 },
  ]);

  console.log("✅ Package features seeded");

  // Seed testimonials
  await db.insert(schema.testimonials).values([
    {
      name: "Marcus J.",
      rating: 5,
      text: "BWash transformed my SUV. It looked brand new after the Deluxe Detail. Highly recommend!",
      vehicleType: "SUV",
      isPublished: true,
    },
    {
      name: "Sarah T.",
      rating: 5,
      text: "So convenient having them come to my office. The Premium Wash is worth every penny.",
      vehicleType: "Sedan",
      isPublished: true,
    },
    {
      name: "David R.",
      rating: 5,
      text: "Fast, professional, and my truck has never been cleaner. These guys know what they're doing.",
      vehicleType: "Truck",
      isPublished: true,
    },
    {
      name: "Michelle K.",
      rating: 4,
      text: "Great service and very affordable. I've been using the monthly membership and love it.",
      vehicleType: "Sedan",
      isPublished: true,
    },
  ]);

  console.log("✅ Testimonials seeded");

  // Seed service areas
  await db.insert(schema.serviceAreas).values([
    { name: "Downtown", zipCode: "33101", city: "Miami", state: "FL" },
    { name: "Brickell", zipCode: "33129", city: "Miami", state: "FL" },
    { name: "Coral Gables", zipCode: "33134", city: "Coral Gables", state: "FL" },
    { name: "Doral", zipCode: "33166", city: "Doral", state: "FL" },
    { name: "Miami Beach", zipCode: "33139", city: "Miami Beach", state: "FL" },
  ]);

  console.log("✅ Service areas seeded");

  // Seed business settings
  await db.insert(schema.businessSettings).values([
    {
      key: "business_name",
      value: "BWash",
      description: "Business display name",
    },
    {
      key: "business_phone",
      value: "+1 (305) 555-WASH",
      description: "Business phone number",
    },
    {
      key: "business_email",
      value: "info@bwash.com",
      description: "Business email",
    },
    {
      key: "whatsapp_number",
      value: "+13055559274",
      description: "WhatsApp contact number",
    },
    {
      key: "business_hours",
      value: JSON.stringify({
        monday: "8:00 AM - 6:00 PM",
        tuesday: "8:00 AM - 6:00 PM",
        wednesday: "8:00 AM - 6:00 PM",
        thursday: "8:00 AM - 6:00 PM",
        friday: "8:00 AM - 6:00 PM",
        saturday: "9:00 AM - 5:00 PM",
        sunday: "Closed",
      }),
      description: "Business operating hours",
    },
    {
      key: "tax_rate",
      value: "0.07",
      description: "Tax rate (7%)",
    },
  ]);

  console.log("✅ Business settings seeded");

  // Seed membership plans
  await db.insert(schema.membershipPlans).values([
    {
      name: "Weekly Basic",
      description: "Basic wash once a week",
      packageId: basicWash.id,
      interval: "weekly",
      sedanPrice: "120.00",
      suvPrice: "160.00",
      truckPrice: "200.00",
    },
    {
      name: "Biweekly Premium",
      description: "Premium wash every two weeks",
      packageId: premiumWash.id,
      interval: "biweekly",
      sedanPrice: "95.00",
      suvPrice: "115.00",
      truckPrice: "135.00",
    },
    {
      name: "Monthly Deluxe",
      description: "Full deluxe detail once a month",
      packageId: deluxeDetail.id,
      interval: "monthly",
      sedanPrice: "75.00",
      suvPrice: "85.00",
      truckPrice: "100.00",
    },
  ]);

  console.log("✅ Membership plans seeded");

  // Seed default operator for future multi-tenant
  await db.insert(schema.operators).values({
    name: "BWash",
    slug: "bwash",
    email: "admin@bwash.com",
    phone: "+13055559274",
  });

  console.log("✅ Default operator seeded");
  console.log("🎉 Database seeded successfully!");
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
