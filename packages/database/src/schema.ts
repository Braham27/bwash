import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  pgEnum,
  jsonb,
  date,
  time,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// ENUMS
// ============================================

export const userRoleEnum = pgEnum("user_role", [
  "customer",
  "staff",
  "admin",
  "super_admin",
  "operator", // Future: multi-operator
]);

export const vehicleTypeEnum = pgEnum("vehicle_type", [
  "sedan",
  "suv",
  "truck",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "new",
  "confirmed",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "zelle",
  "cash_app",
  "apple_pay",
  "credit_card",
  "debit_card",
  "cash",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "partial",
  "refunded",
  "failed",
]);

export const membershipStatusEnum = pgEnum("membership_status", [
  "active",
  "paused",
  "cancelled",
  "expired",
]);

export const membershipIntervalEnum = pgEnum("membership_interval", [
  "weekly",
  "biweekly",
  "monthly",
]);

// ============================================
// USERS
// ============================================

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkId: varchar("clerk_id", { length: 255 }).unique().notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    avatarUrl: text("avatar_url"),
    role: userRoleEnum("role").default("customer").notNull(),
    operatorId: uuid("operator_id").references(() => operators.id), // Future: multi-operator
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("users_clerk_id_idx").on(table.clerkId),
    index("users_email_idx").on(table.email),
    index("users_role_idx").on(table.role),
  ]
);

export const usersRelations = relations(users, ({ many, one }) => ({
  vehicles: many(vehicles),
  bookings: many(bookings),
  invoices: many(invoices),
  memberships: many(memberships),
  notifications: many(notifications),
  assignedBookings: many(bookings, { relationName: "staffBookings" }),
  operator: one(operators, {
    fields: [users.operatorId],
    references: [operators.id],
  }),
}));

// ============================================
// VEHICLES
// ============================================

export const vehicles = pgTable(
  "vehicles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    make: varchar("make", { length: 100 }).notNull(),
    model: varchar("model", { length: 100 }).notNull(),
    year: integer("year"),
    color: varchar("color", { length: 50 }),
    licensePlate: varchar("license_plate", { length: 20 }),
    vehicleType: vehicleTypeEnum("vehicle_type").notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("vehicles_user_id_idx").on(table.userId)]
);

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  user: one(users, { fields: [vehicles.userId], references: [users.id] }),
  bookings: many(bookings),
}));

// ============================================
// PACKAGES (Services)
// ============================================

export const packages = pgTable("packages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  description: text("description"),
  sedanPrice: decimal("sedan_price", { precision: 10, scale: 2 }).notNull(),
  suvPrice: decimal("suv_price", { precision: 10, scale: 2 }).notNull(),
  truckPrice: decimal("truck_price", { precision: 10, scale: 2 }).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  operatorId: uuid("operator_id").references(() => operators.id), // Future: multi-operator
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const packagesRelations = relations(packages, ({ many }) => ({
  features: many(packageFeatures),
  bookings: many(bookings),
}));

export const packageFeatures = pgTable(
  "package_features",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    packageId: uuid("package_id")
      .references(() => packages.id, { onDelete: "cascade" })
      .notNull(),
    feature: varchar("feature", { length: 255 }).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (table) => [index("package_features_package_id_idx").on(table.packageId)]
);

export const packageFeaturesRelations = relations(
  packageFeatures,
  ({ one }) => ({
    package: one(packages, {
      fields: [packageFeatures.packageId],
      references: [packages.id],
    }),
  })
);

// ============================================
// BOOKINGS
// ============================================

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id),
    vehicleId: uuid("vehicle_id").references(() => vehicles.id),
    packageId: uuid("package_id")
      .references(() => packages.id)
      .notNull(),
    staffId: uuid("staff_id").references(() => users.id), // assigned staff

    // Guest booking fields (when not logged in)
    guestName: varchar("guest_name", { length: 200 }),
    guestEmail: varchar("guest_email", { length: 255 }),
    guestPhone: varchar("guest_phone", { length: 20 }),

    // Booking details
    vehicleType: vehicleTypeEnum("vehicle_type").notNull(),
    address: text("address").notNull(),
    preferredDate: date("preferred_date").notNull(),
    preferredTime: time("preferred_time").notNull(),
    notes: text("notes"),
    accessNotes: text("access_notes"),

    // Status & pricing
    status: bookingStatusEnum("status").default("new").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    tipAmount: decimal("tip_amount", { precision: 10, scale: 2 }).default("0"),
    paymentMethod: paymentMethodEnum("payment_method"),
    paymentStatus: paymentStatusEnum("payment_status")
      .default("pending")
      .notNull(),

    // Photos
    beforePhotos: jsonb("before_photos").$type<string[]>().default([]),
    afterPhotos: jsonb("after_photos").$type<string[]>().default([]),
    staffNotes: text("staff_notes"),

    // Timestamps
    confirmedAt: timestamp("confirmed_at"),
    assignedAt: timestamp("assigned_at"),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    cancelledAt: timestamp("cancelled_at"),

    operatorId: uuid("operator_id").references(() => operators.id), // Future
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("bookings_user_id_idx").on(table.userId),
    index("bookings_staff_id_idx").on(table.staffId),
    index("bookings_status_idx").on(table.status),
    index("bookings_preferred_date_idx").on(table.preferredDate),
  ]
);

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
  vehicle: one(vehicles, {
    fields: [bookings.vehicleId],
    references: [vehicles.id],
  }),
  package: one(packages, {
    fields: [bookings.packageId],
    references: [packages.id],
  }),
  staff: one(users, {
    fields: [bookings.staffId],
    references: [users.id],
    relationName: "staffBookings",
  }),
  statusHistory: many(bookingStatusHistory),
  invoice: one(invoices),
}));

// ============================================
// BOOKING STATUS HISTORY
// ============================================

export const bookingStatusHistory = pgTable(
  "booking_status_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookingId: uuid("booking_id")
      .references(() => bookings.id, { onDelete: "cascade" })
      .notNull(),
    status: bookingStatusEnum("status").notNull(),
    changedBy: uuid("changed_by").references(() => users.id),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("booking_status_history_booking_id_idx").on(table.bookingId),
  ]
);

export const bookingStatusHistoryRelations = relations(
  bookingStatusHistory,
  ({ one }) => ({
    booking: one(bookings, {
      fields: [bookingStatusHistory.bookingId],
      references: [bookings.id],
    }),
    changedByUser: one(users, {
      fields: [bookingStatusHistory.changedBy],
      references: [users.id],
    }),
  })
);

// ============================================
// INVOICES
// ============================================

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    invoiceNumber: varchar("invoice_number", { length: 50 }).unique().notNull(),
    bookingId: uuid("booking_id")
      .references(() => bookings.id)
      .notNull(),
    userId: uuid("user_id").references(() => users.id),

    // Line items
    items: jsonb("items")
      .$type<
        {
          description: string;
          quantity: number;
          unitPrice: number;
          total: number;
        }[]
      >()
      .notNull(),

    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    taxRate: decimal("tax_rate", { precision: 5, scale: 4 }).default("0"),
    taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0"),
    tipAmount: decimal("tip_amount", { precision: 10, scale: 2 }).default("0"),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),

    paymentMethod: paymentMethodEnum("payment_method"),
    paymentStatus: paymentStatusEnum("payment_status")
      .default("pending")
      .notNull(),
    paidAt: timestamp("paid_at"),

    notes: text("notes"),
    operatorId: uuid("operator_id").references(() => operators.id), // Future
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("invoices_user_id_idx").on(table.userId),
    index("invoices_booking_id_idx").on(table.bookingId),
    index("invoices_payment_status_idx").on(table.paymentStatus),
  ]
);

export const invoicesRelations = relations(invoices, ({ one }) => ({
  booking: one(bookings, {
    fields: [invoices.bookingId],
    references: [bookings.id],
  }),
  user: one(users, { fields: [invoices.userId], references: [users.id] }),
}));

// ============================================
// MEMBERSHIP PLANS
// ============================================

export const membershipPlans = pgTable("membership_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  packageId: uuid("package_id")
    .references(() => packages.id)
    .notNull(),
  interval: membershipIntervalEnum("interval").notNull(),
  sedanPrice: decimal("sedan_price", { precision: 10, scale: 2 }).notNull(),
  suvPrice: decimal("suv_price", { precision: 10, scale: 2 }).notNull(),
  truckPrice: decimal("truck_price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  operatorId: uuid("operator_id").references(() => operators.id), // Future
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const membershipPlansRelations = relations(
  membershipPlans,
  ({ one, many }) => ({
    package: one(packages, {
      fields: [membershipPlans.packageId],
      references: [packages.id],
    }),
    memberships: many(memberships),
  })
);

// ============================================
// MEMBERSHIPS (Customer subscriptions)
// ============================================

export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    planId: uuid("plan_id")
      .references(() => membershipPlans.id)
      .notNull(),
    vehicleId: uuid("vehicle_id").references(() => vehicles.id),
    status: membershipStatusEnum("status").default("active").notNull(),
    startDate: date("start_date").notNull(),
    nextServiceDate: date("next_service_date"),
    endDate: date("end_date"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    operatorId: uuid("operator_id").references(() => operators.id), // Future
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("memberships_user_id_idx").on(table.userId),
    index("memberships_status_idx").on(table.status),
  ]
);

export const membershipsRelations = relations(memberships, ({ one }) => ({
  user: one(users, { fields: [memberships.userId], references: [users.id] }),
  plan: one(membershipPlans, {
    fields: [memberships.planId],
    references: [membershipPlans.id],
  }),
  vehicle: one(vehicles, {
    fields: [memberships.vehicleId],
    references: [vehicles.id],
  }),
}));

// ============================================
// SERVICE AREAS
// ============================================

export const serviceAreas = pgTable("service_areas", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  zipCode: varchar("zip_code", { length: 10 }).notNull(),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  isActive: boolean("is_active").default(true).notNull(),
  operatorId: uuid("operator_id").references(() => operators.id), // Future
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// BUSINESS SETTINGS
// ============================================

export const businessSettings = pgTable("business_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 100 }).unique().notNull(),
  value: text("value").notNull(),
  description: text("description"),
  operatorId: uuid("operator_id").references(() => operators.id), // Future
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// TESTIMONIALS
// ============================================

export const testimonials = pgTable("testimonials", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  rating: integer("rating").notNull(),
  text: text("text").notNull(),
  vehicleType: varchar("vehicle_type", { length: 50 }),
  isPublished: boolean("is_published").default(false).notNull(),
  avatarUrl: text("avatar_url"),
  operatorId: uuid("operator_id").references(() => operators.id), // Future
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// NOTIFICATIONS
// ============================================

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    type: varchar("type", { length: 50 }).notNull(), // booking, payment, membership, system
    isRead: boolean("is_read").default(false).notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("notifications_user_id_idx").on(table.userId),
    index("notifications_is_read_idx").on(table.isRead),
  ]
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// ============================================
// FUTURE: OPERATORS (Multi-tenant)
// ============================================

export const operators = pgTable("operators", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  logoUrl: text("logo_url"),
  isActive: boolean("is_active").default(true).notNull(),
  settings: jsonb("settings").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const operatorsRelations = relations(operators, ({ many }) => ({
  staff: many(users),
  packages: many(packages),
  serviceAreas: many(serviceAreas),
}));
