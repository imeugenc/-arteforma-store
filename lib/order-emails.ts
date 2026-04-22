import { Resend } from "resend";
import { siteConfig } from "@/lib/site";
import type { OrderConfirmationPayload } from "@/lib/orders";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const resendFrom = process.env.RESEND_FROM_EMAIL || "ArteForma <onboarding@resend.dev>";

export async function sendPaidOrderEmails(payload: OrderConfirmationPayload) {
  if (!resend || !payload.customerEmail) {
    return;
  }

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;background:#0a0a0a;color:#f3f0e8;padding:32px;">
      <div style="max-width:640px;margin:0 auto;background:#121212;border:1px solid rgba(215,161,42,0.18);border-radius:24px;padding:28px;">
        <p style="margin:0 0 10px;color:#d7a12a;letter-spacing:0.28em;text-transform:uppercase;font-size:12px;">ArteForma</p>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">Comanda ta a fost confirmată.</h1>
        <p style="margin:0 0 14px;color:#d7d2c4;">Salut, ${payload.customerName || "și mulțumim"}.</p>
        <p style="margin:0 0 14px;color:#d7d2c4;">Plata a fost confirmată și comanda ta a intrat în fluxul nostru de producție.</p>
        <p style="margin:0 0 14px;color:#d7d2c4;">ID comandă: <strong>${payload.orderId}</strong></p>
        <p style="margin:0 0 14px;color:#d7d2c4;">Total: <strong>${payload.totalAmount} ${payload.currency}</strong></p>
        <p style="margin:0 0 14px;color:#d7d2c4;">Timp de producție: ${payload.leadTime}</p>
        <div style="margin:20px 0;padding:16px;border-radius:16px;background:#0d0d0d;border:1px solid rgba(255,255,255,0.06);">
          ${payload.items
            .map(
              (item) => `
                <div style="display:flex;justify-content:space-between;gap:16px;padding:8px 0;color:#d7d2c4;">
                  <div>
                    <div style="color:#f3f0e8;">${item.name}</div>
                    ${item.variantSummary ? `<div style="font-size:13px;color:#a9a08d;">${item.variantSummary}</div>` : ""}
                  </div>
                  <div style="white-space:nowrap;">${item.quantity}x</div>
                </div>
              `,
            )
            .join("")}
        </div>
        <p style="margin:0 0 14px;color:#d7d2c4;">Dacă vrei să adaugi un detaliu important comenzii, ne poți scrie la ${siteConfig.email}.</p>
        <p style="margin:20px 0 0;color:#a9a08d;font-size:14px;">ArteForma, Brașov</p>
      </div>
    </div>
  `;

  const internalHtml = `
    <div style="font-family:Arial,sans-serif;background:#0a0a0a;color:#f3f0e8;padding:32px;">
      <div style="max-width:640px;margin:0 auto;background:#121212;border:1px solid rgba(215,161,42,0.18);border-radius:24px;padding:28px;">
        <p style="margin:0 0 10px;color:#d7a12a;letter-spacing:0.28em;text-transform:uppercase;font-size:12px;">ArteForma</p>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">Comandă nouă plătită</h1>
        <p style="margin:0 0 14px;color:#d7d2c4;">ID comandă: <strong>${payload.orderId}</strong></p>
        <p style="margin:0 0 14px;color:#d7d2c4;">Client: ${payload.customerName}</p>
        <p style="margin:0 0 14px;color:#d7d2c4;">Email: ${payload.customerEmail}</p>
        <p style="margin:0 0 14px;color:#d7d2c4;">Total: <strong>${payload.totalAmount} ${payload.currency}</strong></p>
        <div style="margin:20px 0;padding:16px;border-radius:16px;background:#0d0d0d;border:1px solid rgba(255,255,255,0.06);">
          ${payload.items
            .map(
              (item) => `
                <div style="display:flex;justify-content:space-between;gap:16px;padding:8px 0;color:#d7d2c4;">
                  <div>
                    <div style="color:#f3f0e8;">${item.name}</div>
                    ${item.variantSummary ? `<div style="font-size:13px;color:#a9a08d;">${item.variantSummary}</div>` : ""}
                  </div>
                  <div style="white-space:nowrap;">${item.quantity}x</div>
                </div>
              `,
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: resendFrom,
    to: [payload.customerEmail],
    replyTo: siteConfig.email,
    subject: "Comanda ta ArteForma a fost confirmată",
    html: customerHtml,
  });

  await resend.emails.send({
    from: resendFrom,
    to: [siteConfig.email],
    replyTo: payload.customerEmail,
    subject: `Comandă nouă plătită – ${payload.orderId}`,
    html: internalHtml,
  });
}
