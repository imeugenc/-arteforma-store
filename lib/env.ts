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

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  STRIPE_SECRET_KEY: optionalString,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: optionalString,
  STRIPE_WEBHOOK_SECRET: optionalString,
  SUPABASE_URL: optionalUrl,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
  SUPABASE_CUSTOM_ORDERS_TABLE: z.string().default("custom_orders"),
  SUPABASE_CUSTOM_ORDERS_BUCKET: z.string().default("custom-order-files"),
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
