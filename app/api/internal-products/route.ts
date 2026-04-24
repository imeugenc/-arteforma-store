import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hasValidInternalSecret, INTERNAL_ACCESS_COOKIE } from "@/lib/internal";
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
  slug: z.string().optional(),
  category: categorySchema,
  shortDescription: z.string().min(12, "Descrierea scurtă este prea scurtă."),
  longDescription: z.string().min(24, "Descrierea lungă este prea scurtă."),
  price: z.coerce.number().int().min(1, "Preț invalid."),
  badge: z.string().optional(),
  featured: z.boolean(),
  enabled: z.boolean(),
  sizes: z.string().optional(),
  colors: z.union([z.string(), z.array(z.string())]).optional(),
  materials: z.union([z.string(), z.array(z.string())]).optional(),
  customization: z.string().optional(),
  idealFor: z.string().optional(),
  standardShippingEnabled: z.boolean(),
  freeShippingEligible: z.boolean(),
  pickupOnly: z.boolean(),
  oversizedOrSpecialShipping: z.boolean(),
  shippingNote: z.string().optional(),
});

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(INTERNAL_ACCESS_COOKIE)?.value;

  if (!hasValidInternalSecret(token)) {
    return NextResponse.json({ ok: false, message: "Acces neautorizat." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const colorValues = formData
      .getAll("colors")
      .map((value) => value.toString().trim())
      .filter(Boolean);
    const materialValues = formData
      .getAll("materials")
      .map((value) => value.toString().trim())
      .filter(Boolean);

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
      colors: colorValues.length > 1 ? colorValues : colorValues[0] || "",
      materials: materialValues.length > 1 ? materialValues : materialValues[0] || "",
      customization: formData.get("customization")?.toString(),
      idealFor: formData.get("idealFor")?.toString(),
      standardShippingEnabled: formData.get("standardShippingEnabled") === "on",
      freeShippingEligible: formData.get("freeShippingEligible") === "on",
      pickupOnly: formData.get("pickupOnly") === "on",
      oversizedOrSpecialShipping: formData.get("oversizedOrSpecialShipping") === "on",
      shippingNote: formData.get("shippingNote")?.toString(),
    });

    const saved = await saveAdminProduct({
      productId: parsed.productId,
      name: parsed.name,
      slug: parsed.slug ?? "",
      category: parsed.category,
      shortDescription: parsed.shortDescription,
      longDescription: parsed.longDescription,
      price: parsed.price,
      badge: parsed.badge,
      featured: parsed.featured,
      enabled: parsed.enabled,
      sizes: parseListInput(parsed.sizes ?? ""),
      colors: parseListInput(Array.isArray(parsed.colors) ? parsed.colors.join("\n") : parsed.colors ?? ""),
      materials: parseListInput(Array.isArray(parsed.materials) ? parsed.materials.join("\n") : parsed.materials ?? ""),
      customization: parseListInput(parsed.customization ?? ""),
      idealFor: parseListInput(parsed.idealFor ?? ""),
      standardShippingEnabled: parsed.standardShippingEnabled,
      freeShippingEligible: parsed.freeShippingEligible,
      pickupOnly: parsed.pickupOnly,
      oversizedOrSpecialShipping: parsed.oversizedOrSpecialShipping,
      shippingNote: parsed.shippingNote,
    });

    return NextResponse.redirect(
      new URL(`/internal/products?saved=1#product-${saved.id}`, request.url),
      { status: 303 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Produsul nu a putut fi salvat.";
    return NextResponse.redirect(
      new URL(`/internal/products?error=${encodeURIComponent(message)}`, request.url),
      { status: 303 },
    );
  }
}
