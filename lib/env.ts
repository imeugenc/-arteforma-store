import { z } from "zod";

const optionalString = z.preprocess((value) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
}, z.string().optional());

const optionalUrl = z.preprocess((value) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
}, z.string().url().optional());

const optionalNumber = z.preprocess((value) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
}, z.coerce.number().int().positive().optional());

const optionalBoolean = z.preprocess((value) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  if (typeof value === "string") {
    return value === "true";
  }

  return value;
}, z.boolean().optional());

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  STRIPE_SECRET_KEY: optionalString,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: optionalString,
  STRIPE_WEBHOOK_SECRET: optionalString,
  SMTP_HOST: optionalString,
  SMTP_PORT: optionalNumber,
  SMTP_SECURE: optionalBoolean,
  SMTP_USER: optionalString,
  SMTP_PASSWORD: optionalString,
  SMTP_FROM: optionalString,
  CUSTOM_ORDERS_TO_EMAIL: optionalString,
  SUPABASE_URL: optionalUrl,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
  SUPABASE_ORDERS_TABLE: z.string().default("orders"),
  SUPABASE_ORDER_ITEMS_TABLE: z.string().default("order_items"),
  INTERNAL_ORDERS_TOKEN: optionalString,
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error("Invalid environment configuration");
}

export const env = parsed.data;

export const isProduction = process.env.NODE_ENV === "production";
