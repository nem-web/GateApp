"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const subject = formData.get("subject")?.toString().trim() || "";
  const message = formData.get("message")?.toString().trim() || "";
  const turnstileToken =
    formData.get("cf-turnstile-response")?.toString() || "";

  if (!name || !email || !subject || !message) {
    return { error: "Please fill out all fields." };
  }

  // Verify Cloudflare Turnstile
  const verifyResponse = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: process.env.CLOUDFLARE_TURNSTILE_SECRET!,
        response: turnstileToken,
      }),
    }
  );

  const verifyData = await verifyResponse.json();

  if (!verifyData.success) {
    return {
      error: "Bot verification failed. Please try again.",
    };
  }

  const safeMessage = escapeHtml(message);

  const adminHtml = `
    <h2>New Contact Form Submission</h2>

    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>

    <hr />

    <p><strong>Message:</strong></p>
    <p>${safeMessage.replace(/\n/g, "<br>")}</p>
  `;

  try {
    // Email to you
    const { error } = await resend.emails.send({
      from: "GatePrep <noreply@mailhook.gateprep.tech>",
      to: "contact@gateprep.tech",
      subject: `New Contact Form Submission: ${subject}`,
      replyTo: email,
      html: adminHtml,
    });

    if (error) {
      console.error(error);
      return {
        error: "Failed to send message. Please try again later.",
      };
    }

    // Auto reply to user
    await resend.emails.send({
      from: "GatePrep Support <support@mailhook.gateprep.tech>",
      to: email,
      subject: "We received your message",
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>Hi ${escapeHtml(name)},</h2>

          <p>
            Thank you for contacting GatePrep.
          </p>

          <p>
            Our team has received your message and
            will get back to you as soon as possible.
          </p>

          <p>
            Regards,<br/>
            GatePrep Team
          </p>
        </div>
      `,
    });

    return {
      success: true,
      message:
        "Message sent successfully! We'll get back to you soon.",
    };
  } catch (err) {
    console.error(err);

    return {
      error: "Failed to send message. Please try again later.",
    };
  }
}

