import { z } from "zod";

export const bookingFormSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  address: z.string().min(5, "Address is required"),
  vehicleType: z.enum(["sedan", "suv", "truck"], {
    required_error: "Select a vehicle type",
  }),
  packageId: z.string().uuid("Select a package"),
  preferredDate: z.string().min(1, "Select a date"),
  preferredTime: z.string().min(1, "Select a time"),
  notes: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

export const vehicleFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1990).max(2030).optional(),
  color: z.string().optional(),
  licensePlate: z.string().optional(),
  vehicleType: z.enum(["sedan", "suv", "truck"], {
    required_error: "Select a vehicle type",
  }),
});

export type VehicleFormData = z.infer<typeof vehicleFormSchema>;

export const invoiceFormSchema = z.object({
  bookingId: z.string().uuid(),
  items: z
    .array(
      z.object({
        description: z.string().min(1),
        quantity: z.coerce.number().positive(),
        unitPrice: z.coerce.number().positive(),
      })
    )
    .min(1, "At least one line item required"),
  taxRate: z.coerce.number().min(0).max(1).optional(),
  notes: z.string().optional(),
  paymentMethod: z
    .enum(["zelle", "cash_app", "apple_pay", "credit_card", "debit_card", "cash"])
    .optional(),
});

export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

export const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
