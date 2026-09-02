/**
 * Resend API Email Service for Srevia Herbs
 * Uses Resend (https://resend.com) to send transactional emails to admin & customers.
 */

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  apiKey?: string;
  from?: string;
}

export const RESEND_DEFAULT_FROM = "SREVIA HERBS <onboarding@resend.dev>";
export const ADMIN_RECEIVER_EMAIL = "kathirvelankvr@gmail.com";

/**
 * Sends an email using the Resend API
 */
export async function sendEmailWithResend({
  to,
  subject,
  html,
  apiKey,
  from = RESEND_DEFAULT_FROM,
}: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  // Use provided apiKey or fallback to VITE_RESEND_API_KEY environment variable
  const activeApiKey = (apiKey || import.meta.env.VITE_RESEND_API_KEY || '').trim();

  if (!activeApiKey) {
    console.warn("Resend API key is missing. Set VITE_RESEND_API_KEY in environment or pass apiKey.");
    return { success: false, error: "Resend API key is not configured yet." };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${activeApiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, id: data.id };
    } else {
      console.error("Resend API error:", data);
      return { success: false, error: data.message || "Failed to send email via Resend" };
    }
  } catch (err: any) {
    console.error("Resend API network error:", err);
    return { success: false, error: err.message || "Network error sending email via Resend" };
  }
}

/**
 * Sends contact form notifications to Kathirvelan (Admin) via Vercel serverless /api/contact endpoint or Resend API
 */
export async function sendContactNotificationViaResend(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  apiKey?: string;
}): Promise<{ adminSuccess: boolean; customerSuccess: boolean }> {
  try {
    // 1. Try Vercel Serverless Function /api/contact (Bypasses CORS & handles Resend key securely on server)
    const serverlessRes = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (serverlessRes.ok) {
      return { adminSuccess: true, customerSuccess: true };
    }
  } catch (e) {
    console.warn("Serverless /api/contact unavailable, falling back to direct Resend call...");
  }

  // 2. Fallback to direct Resend API call to Kathirvelan
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; color: #242824; max-width: 600px; margin: 0 auto; border: 1px solid #A8B9A3; border-radius: 12px; padding: 24px; background-color: #FCFBF7;">
      <div style="background-color: #1F3D2E; color: #FCFBF7; padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #B89B5E;">SREVIA HERBS — New Customer Inquiry</h2>
      </div>
      <p style="font-size: 14px;"><strong>Customer Name:</strong> ${data.name}</p>
      <p style="font-size: 14px;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      <p style="font-size: 14px;"><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
      <p style="font-size: 14px;"><strong>Subject:</strong> ${data.subject}</p>
      <hr style="border: 0; border-top: 1px solid #A8B9A3; margin: 16px 0;" />
      <p style="font-size: 14px; font-weight: bold; color: #1F3D2E;">Message Content:</p>
      <div style="background-color: #F4F0E7; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.6;">
        ${data.message.replace(/\n/g, '<br/>')}
      </div>
      <div style="margin-top: 24px; text-align: center; font-size: 12px; color: #666;">
        <p>Sent automatically from Srevia Herbs Online Store</p>
      </div>
    </div>
  `;

  const adminRes = await sendEmailWithResend({
    to: ADMIN_RECEIVER_EMAIL,
    subject: `New Inquiry from ${data.name}: ${data.subject}`,
    html: adminHtml,
    apiKey: data.apiKey,
  });

  // 2. Acknowledgement Email to Customer
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; color: #242824; max-width: 600px; margin: 0 auto; border: 1px solid #A8B9A3; border-radius: 12px; padding: 24px; background-color: #FCFBF7;">
      <div style="background-color: #1F3D2E; color: #FCFBF7; padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #B89B5E;">SREVIA HERBS</h2>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #A8B9A3;">Where Purity Meets Beauty</p>
      </div>
      <h3 style="color: #1F3D2E;">Thank you for contacting us, ${data.name}!</h3>
      <p style="font-size: 14px; line-height: 1.6;">
        We have received your message regarding <strong>"${data.subject}"</strong>. Kathirvelan from the Srevia Herbs team will review your inquiry and get back to you shortly.
      </p>
      <div style="background-color: #F4F0E7; padding: 16px; border-radius: 8px; font-size: 13px; margin: 16px 0;">
        <p style="margin: 0; font-weight: bold; color: #1F3D2E;">Your Message Summary:</p>
        <p style="margin: 8px 0 0 0;">${data.message.replace(/\n/g, '<br/>')}</p>
      </div>
      <p style="font-size: 13px; color: #555;">
        Need urgent assistance? Feel free to message us on WhatsApp at <strong>+91 9025132739</strong>.
      </p>
      <hr style="border: 0; border-top: 1px solid #A8B9A3; margin: 20px 0;" />
      <div style="text-align: center; font-size: 11px; color: #888;">
        <p>© 2025 Srevia Herbs. All rights reserved.</p>
      </div>
    </div>
  `;

  const customerRes = await sendEmailWithResend({
    to: data.email,
    subject: `Message Received — SREVIA HERBS`,
    html: customerHtml,
    apiKey: data.apiKey,
  });

  return {
    adminSuccess: adminRes.success,
    customerSuccess: customerRes.success,
  };
}
