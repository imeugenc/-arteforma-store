import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hasValidInternalSecret, INTERNAL_ACCESS_COOKIE } from "@/lib/internal";
import { saveReview } from "@/lib/reviews";

const schema = z.object({
  reviewId: z.string().uuid().optional(),
  customerName: z.string().min(2, "Numele clientului este obligatoriu."),
  rating: z.coerce.number().int().min(1).max(5),
  reviewText: z.string().min(12, "Textul recenziei este prea scurt."),
  productSlug: z.string().optional(),
  visible: z.boolean(),
  featured: z.boolean(),
  reviewDate: z.string().optional(),
});

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(INTERNAL_ACCESS_COOKIE)?.value;

  if (!hasValidInternalSecret(token)) {
    return NextResponse.json({ ok: false, message: "Acces neautorizat." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const parsed = schema.parse({
      reviewId: formData.get("reviewId") || undefined,
      customerName: formData.get("customerName"),
      rating: formData.get("rating"),
      reviewText: formData.get("reviewText"),
      productSlug: formData.get("productSlug")?.toString() || undefined,
      visible: formData.get("visible") === "on",
      featured: formData.get("featured") === "on",
      reviewDate: formData.get("reviewDate")?.toString() || undefined,
    });

    await saveReview(parsed);

    return NextResponse.redirect(new URL("/internal/reviews?saved=1", request.url), { status: 303 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Recenzia nu a putut fi salvată.";
    return NextResponse.redirect(
      new URL(`/internal/reviews?error=${encodeURIComponent(message)}`, request.url),
      { status: 303 },
    );
  }
}
