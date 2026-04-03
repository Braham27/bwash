import { db } from "@/lib/db";
import { notifications } from "@bwash/database";

type NotificationType = "booking" | "payment" | "membership" | "system";

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  metadata?: Record<string, unknown>;
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    await db.insert(notifications).values({
      userId: params.userId,
      title: params.title,
      message: params.message,
      type: params.type,
      metadata: params.metadata || null,
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

export async function notifyBookingCreated(userId: string, bookingId: string) {
  await createNotification({
    userId,
    title: "Booking Received",
    message: "Your car wash booking has been received. We'll confirm it shortly!",
    type: "booking",
    metadata: { bookingId },
  });
}

export async function notifyBookingConfirmed(userId: string, bookingId: string, date: string) {
  await createNotification({
    userId,
    title: "Booking Confirmed",
    message: `Your car wash on ${date} has been confirmed.`,
    type: "booking",
    metadata: { bookingId },
  });
}

export async function notifyBookingAssigned(userId: string, bookingId: string, staffName: string) {
  await createNotification({
    userId,
    title: "Staff Assigned",
    message: `${staffName} has been assigned to your car wash.`,
    type: "booking",
    metadata: { bookingId },
  });
}

export async function notifyBookingStarted(userId: string, bookingId: string) {
  await createNotification({
    userId,
    title: "Wash In Progress",
    message: "Your car wash has started! We'll notify you when it's done.",
    type: "booking",
    metadata: { bookingId },
  });
}

export async function notifyBookingCompleted(userId: string, bookingId: string) {
  await createNotification({
    userId,
    title: "Wash Complete!",
    message: "Your car wash is done. Thank you for choosing BWash!",
    type: "booking",
    metadata: { bookingId },
  });
}

export async function notifyPaymentReceived(userId: string, amount: string, invoiceNumber: string) {
  await createNotification({
    userId,
    title: "Payment Received",
    message: `We received your payment of $${amount}. Invoice: ${invoiceNumber}`,
    type: "payment",
    metadata: { invoiceNumber },
  });
}

export async function notifyInvoiceCreated(userId: string, total: string, invoiceNumber: string) {
  await createNotification({
    userId,
    title: "Invoice Ready",
    message: `Your invoice #${invoiceNumber} for $${total} is ready.`,
    type: "payment",
    metadata: { invoiceNumber },
  });
}

export async function notifyMembershipActivated(userId: string, planName: string) {
  await createNotification({
    userId,
    title: "Membership Active",
    message: `Your ${planName} membership is now active. Enjoy your washes!`,
    type: "membership",
    metadata: { planName },
  });
}

export async function notifyStaffNewJob(staffId: string, bookingId: string, date: string) {
  await createNotification({
    userId: staffId,
    title: "New Job Assigned",
    message: `A new car wash job has been assigned to you for ${date}.`,
    type: "booking",
    metadata: { bookingId },
  });
}
