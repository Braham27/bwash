const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "BWash <noreply@bwash.com>";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email:", params.subject);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: params.to,
        subject: params.subject,
        html: params.html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Email send failed:", err);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

// ============================================
// Email templates
// ============================================

function wrapTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="color:#FFFFFF;font-size:28px;margin:0;">
            <span style="color:#FFFFFF;">B</span><span style="color:#C9A84C;">Wash</span>
          </h1>
          <p style="color:#888;font-size:14px;margin:4px 0 0;">Premium Mobile Car Wash</p>
        </div>
        <div style="background:#111111;border:1px solid #2A2A2A;border-radius:12px;padding:32px;">
          ${content}
        </div>
        <p style="color:#555;font-size:12px;text-align:center;margin-top:24px;">
          © ${new Date().getFullYear()} BWash. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;
}

export async function sendBookingConfirmation(
  to: string,
  data: { name: string; date: string; time: string; packageName: string; address: string; price: string }
) {
  return sendEmail({
    to,
    subject: "BWash — Booking Confirmation",
    html: wrapTemplate(`
      <h2 style="color:#C9A84C;margin:0 0 16px;font-size:20px;">Booking Received!</h2>
      <p style="color:#CCC;margin:0 0 24px;line-height:1.6;">
        Hi ${data.name}, thank you for choosing BWash. Here are your booking details:
      </p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#888;padding:8px 0;border-bottom:1px solid #2A2A2A;">Service</td><td style="color:#FFF;padding:8px 0;text-align:right;border-bottom:1px solid #2A2A2A;">${data.packageName}</td></tr>
        <tr><td style="color:#888;padding:8px 0;border-bottom:1px solid #2A2A2A;">Date</td><td style="color:#FFF;padding:8px 0;text-align:right;border-bottom:1px solid #2A2A2A;">${data.date}</td></tr>
        <tr><td style="color:#888;padding:8px 0;border-bottom:1px solid #2A2A2A;">Time</td><td style="color:#FFF;padding:8px 0;text-align:right;border-bottom:1px solid #2A2A2A;">${data.time}</td></tr>
        <tr><td style="color:#888;padding:8px 0;border-bottom:1px solid #2A2A2A;">Location</td><td style="color:#FFF;padding:8px 0;text-align:right;border-bottom:1px solid #2A2A2A;">${data.address}</td></tr>
        <tr><td style="color:#888;padding:8px 0;">Total</td><td style="color:#C9A84C;padding:8px 0;text-align:right;font-weight:bold;font-size:18px;">$${data.price}</td></tr>
      </table>
      <p style="color:#888;margin:24px 0 0;font-size:13px;line-height:1.6;">
        We'll reach out to confirm your appointment. If you have any questions, reply to this email.
      </p>
    `),
  });
}

export async function sendInvoiceEmail(
  to: string,
  data: { name: string; invoiceNumber: string; total: string; items: string; date: string }
) {
  return sendEmail({
    to,
    subject: `BWash — Invoice ${data.invoiceNumber}`,
    html: wrapTemplate(`
      <h2 style="color:#C9A84C;margin:0 0 16px;font-size:20px;">Invoice ${data.invoiceNumber}</h2>
      <p style="color:#CCC;margin:0 0 24px;line-height:1.6;">
        Hi ${data.name}, here is your invoice from BWash.
      </p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#888;padding:8px 0;border-bottom:1px solid #2A2A2A;">Date</td><td style="color:#FFF;padding:8px 0;text-align:right;border-bottom:1px solid #2A2A2A;">${data.date}</td></tr>
        <tr><td style="color:#888;padding:8px 0;border-bottom:1px solid #2A2A2A;">Service</td><td style="color:#FFF;padding:8px 0;text-align:right;border-bottom:1px solid #2A2A2A;">${data.items}</td></tr>
        <tr><td style="color:#888;padding:8px 0;">Total Due</td><td style="color:#C9A84C;padding:8px 0;text-align:right;font-weight:bold;font-size:18px;">$${data.total}</td></tr>
      </table>
      <p style="color:#888;margin:24px 0 0;font-size:13px;line-height:1.6;">
        Payment methods: Zelle, Cash App, Apple Pay, credit/debit card, or cash.
      </p>
    `),
  });
}

export async function sendPaymentConfirmation(
  to: string,
  data: { name: string; amount: string; invoiceNumber: string }
) {
  return sendEmail({
    to,
    subject: "BWash — Payment Received",
    html: wrapTemplate(`
      <h2 style="color:#C9A84C;margin:0 0 16px;font-size:20px;">Payment Confirmed</h2>
      <p style="color:#CCC;margin:0 0 24px;line-height:1.6;">
        Hi ${data.name}, we received your payment of <strong style="color:#C9A84C;">$${data.amount}</strong> for invoice ${data.invoiceNumber}.
      </p>
      <p style="color:#888;font-size:13px;line-height:1.6;">
        Thank you for choosing BWash. We look forward to your next visit!
      </p>
    `),
  });
}

export async function sendMembershipWelcome(
  to: string,
  data: { name: string; planName: string; interval: string; price: string }
) {
  return sendEmail({
    to,
    subject: "BWash — Welcome to Your Membership!",
    html: wrapTemplate(`
      <h2 style="color:#C9A84C;margin:0 0 16px;font-size:20px;">Membership Active!</h2>
      <p style="color:#CCC;margin:0 0 24px;line-height:1.6;">
        Hi ${data.name}, welcome to the BWash ${data.planName} plan!
      </p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#888;padding:8px 0;border-bottom:1px solid #2A2A2A;">Plan</td><td style="color:#FFF;padding:8px 0;text-align:right;border-bottom:1px solid #2A2A2A;">${data.planName}</td></tr>
        <tr><td style="color:#888;padding:8px 0;border-bottom:1px solid #2A2A2A;">Frequency</td><td style="color:#FFF;padding:8px 0;text-align:right;border-bottom:1px solid #2A2A2A;">${data.interval}</td></tr>
        <tr><td style="color:#888;padding:8px 0;">Price</td><td style="color:#C9A84C;padding:8px 0;text-align:right;font-weight:bold;font-size:18px;">$${data.price}/${data.interval}</td></tr>
      </table>
      <p style="color:#888;margin:24px 0 0;font-size:13px;line-height:1.6;">
        Your membership is now active. You can manage it from your dashboard.
      </p>
    `),
  });
}
