import nodemailer from "nodemailer";
import { env } from "@/lib/env";
import { siteConfig } from "@/lib/site";

function getSmtpConfig() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD) {
    return null;
  }

  return {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ?? 587,
    secure: env.SMTP_SECURE ?? false,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  };
}

export function isEmailConfigured() {
  return Boolean(getSmtpConfig());
}

export async function sendEmail({
  subject,
  html,
  text,
  replyTo,
  attachments,
}: {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}) {
  const config = getSmtpConfig();

  if (!config) {
    throw new Error("Fluxul de email nu este configurat încă.");
  }

  const transporter = nodemailer.createTransport(config);

  await transporter.sendMail({
    from: env.SMTP_FROM ?? `ArteForma <${siteConfig.email}>`,
    to: env.CUSTOM_ORDERS_TO_EMAIL ?? siteConfig.email,
    replyTo,
    subject,
    html,
    text,
    attachments,
  });
}
