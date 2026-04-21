import { z } from "zod";

export const customOrderSchema = z.object({
  name: z.string().trim().min(2, "Te rugăm să introduci numele tău."),
  email: z.string().trim().email("Te rugăm să introduci o adresă de email validă."),
  phone: z.string().trim().max(32).optional().or(z.literal("")),
  type: z.string().trim().min(2, "Te rugăm să alegi tipul obiectului."),
  description: z
    .string()
    .trim()
    .min(20, "Spune-ne puțin mai clar ce vrei să realizăm.")
    .max(2000, "Te rugăm să păstrezi solicitarea sub 2000 de caractere."),
  desiredSize: z.string().trim().max(120).optional().or(z.literal("")),
  colors: z.string().trim().max(160).optional().or(z.literal("")),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  deadline: z.string().trim().max(80).optional().or(z.literal("")),
});

export const checkoutItemSchema = z.object({
  slug: z.string().trim().min(1),
  name: z.string().trim().min(1),
  price: z.number().int().positive(),
  quantity: z.number().int().min(1).max(20),
  size: z.string().trim().max(120).optional(),
  color: z.string().trim().max(120).optional(),
  material: z.string().trim().max(120).optional(),
  personalization: z.string().trim().max(160).optional(),
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1).max(50),
});
