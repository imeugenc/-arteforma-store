import { NextResponse } from "next/server";
import { z } from "zod";
import { submitPublicReview } from "@/lib/reviews";

const schema = z.object({
  customerName: z.string().min(2, "Numele este obligatoriu."),
  rating: z.coerce.number().int().min(1).max(5),
  reviewText: z.string().min(12, "Textul recenziei este prea scurt."),
  categorySlug: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = schema.parse({
      customerName: formData.get("customerName"),
      rating: formData.get("rating"),
      reviewText: formData.get("reviewText"),
      categorySlug: formData.get("categorySlug")?.toString() || undefined,
    });

    await submitPublicReview(parsed);

    return NextResponse.redirect(new URL("/reviews?submitted=1", request.url), {
      status: 303,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Recenzia nu a putut fi trimisă.";

    return NextResponse.redirect(
      new URL(`/reviews?error=${encodeURIComponent(message)}`, request.url),
      { status: 303 },
    );
  }
}
