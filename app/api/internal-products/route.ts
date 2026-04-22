import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { INTERNAL_ACCESS_COOKIE } from "@/lib/internal";
import { parseListInput, saveAdminProduct } from "@/lib/admin-catalog";

const categorySchema = z.enum([
  "auto-moto",
  "crypto-trading",
  "desk-setup",
  "gifts",
  "funny-viral",
]);

const schema = z.object({
  productId: z.string().uuid().optional(),
  name: z.string().min(3, "Numele produsului este obligatoriu."),
  slug: z.string().min(3, "Slug-ul este obligatoriu."),
  category: categorySchema,
  shortDescription: z.string().min(12, "Descrierea scurtă este prea scurtă."),
  longDescription: z.string().min(24, "Descrierea lungă este prea scurtă."),
  price: z.coerce.number().int().min(1, "Preț invalid."),
  badge: z.string().optional(),
  featured: z.boolean(),
  enabled: z.boolean(),
  sizes: z.string().optional(),
  colors: z.string().optional(),
  materials: z.string().optional(),
  customization: z.string().optional(),
  idealFor: z.string().optional(),
});

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(INTERNAL_ACCESS_COOKIE)?.value;

  if (env.INTERNAL_ORDERS_TOKEN && token !== env.INTERNAL_ORDERS_TOKEN) {
    return NextResponse.json({ ok: false, message: "Acces neautorizat." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const parsed = schema.parse({
      productId: formData.get("productId") || undefined,
      name: formData.get("name"),
      slug: formData.get("slug"),
      category: formData.get("category"),
      shortDescription: formData.get("shortDescription"),
      longDescription: formData.get("longDescription"),
      price: formData.get("price"),
      badge: formData.get("badge") || undefined,
      featured: formData.get("featured") === "on",
      enabled: formData.get("enabled") === "on",
      sizes: formData.get("sizes")?.toString(),
      colors: formData.get("colors")?.toString(),
      materials: formData.get("materials")?.toString(),
      customization: formData.get("customization")?.toString(),
      idealFor: formData.get("idealFor")?.toString(),
    });

    await saveAdminProduct({
      productId: parsed.productId,
      name: parsed.name,
      slug: parsed.slug,
      category: parsed.category,
      shortDescription: parsed.shortDescription,
      longDescription: parsed.longDescription,
      price: parsed.price,
      badge: parsed.badge,
      featured: parsed.featured,
      enabled: parsed.enabled,
      sizes: parseListInput(parsed.sizes ?? ""),
      colors: parseListInput(parsed.colors ?? ""),
      materials: parseListInput(parsed.materials ?? ""),
      customization: parseListInput(parsed.customization ?? ""),
      idealFor: parseListInput(parsed.idealFor ?? ""),
    });

    return NextResponse.redirect(new URL("/internal/products?saved=1", request.url));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Produsul nu a putut fi salvat.";
    return NextResponse.redirect(
      new URL(`/internal/products?error=${encodeURIComponent(message)}`, request.url),
    );
  }
}
