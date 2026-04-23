import { revalidatePath } from "next/cache";
import { getAdminProducts, getCatalogProducts } from "@/lib/admin-catalog";
import { getSupabaseAdminClient } from "@/lib/supabase";
import type { ReviewRecord } from "@/lib/types";
import { testimonials } from "@/lib/site";

type ReviewRow = {
  id: string;
  created_at: string;
  customer_name: string;
  rating: number;
  review_text: string;
  product_slug: string | null;
  visible: boolean;
  featured: boolean;
  review_date: string | null;
};

function isMissingReviewsTable(message?: string) {
  if (!message) {
    return false;
  }

  const normalized = message.toLowerCase();
  return normalized.includes("reviews") && (normalized.includes("schema cache") || normalized.includes("could not find the table"));
}

export type ReviewFormValues = {
  reviewId?: string;
  customerName: string;
  rating: number;
  reviewText: string;
  productSlug?: string;
  visible: boolean;
  featured: boolean;
  reviewDate?: string;
};

function normalizeReview(row: ReviewRow): ReviewRecord {
  return {
    id: row.id,
    created_at: row.created_at,
    customer_name: row.customer_name,
    rating: row.rating,
    review_text: row.review_text,
    product_slug: row.product_slug,
    visible: row.visible,
    featured: row.featured,
    review_date: row.review_date,
  };
}

function revalidateReviewPaths(productSlug?: string | null) {
  revalidatePath("/");
  revalidatePath("/internal/reviews");

  if (productSlug) {
    revalidatePath(`/products/${productSlug}`);
  }
}

async function sanitizeReviewProductSlug(productSlug?: string) {
  const normalized = productSlug?.trim();

  if (!normalized) {
    return null;
  }

  const products = await getAdminProducts();

  if (products === null) {
    return normalized;
  }

  return products.some((product) => product.slug === normalized) ? normalized : null;
}

export async function getAdminReviews() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return null;
  }

  const result = await supabase.from("reviews").select("*").order("created_at", { ascending: false });

  if (result.error) {
    if (isMissingReviewsTable(result.error.message)) {
      return [];
    }

    throw new Error(result.error.message);
  }

  return ((result.data ?? []) as ReviewRow[]).map(normalizeReview);
}

export async function getVisibleReviewsForProduct(productSlug: string) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return testimonials.map((item, index) => ({
      id: `fallback-${productSlug}-${index}`,
      customer_name: item.name,
      rating: 5,
      review_text: item.quote,
      role: item.role,
    }));
  }

  const specificResult = await supabase
    .from("reviews")
    .select("*")
    .eq("visible", true)
    .eq("product_slug", productSlug)
    .order("featured", { ascending: false })
    .order("review_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (specificResult.error) {
    return testimonials.map((item, index) => ({
      id: `fallback-${productSlug}-${index}`,
      customer_name: item.name,
      rating: 5,
      review_text: item.quote,
      role: item.role,
    }));
  }

  const specific = ((specificResult.data ?? []) as ReviewRow[]).map(normalizeReview);

  if (specific.length) {
    return specific;
  }

  const generalResult = await supabase
    .from("reviews")
    .select("*")
    .eq("visible", true)
    .is("product_slug", null)
    .order("featured", { ascending: false })
    .order("review_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(6);

  if (generalResult.error) {
    return testimonials.map((item, index) => ({
      id: `fallback-${productSlug}-${index}`,
      customer_name: item.name,
      rating: 5,
      review_text: item.quote,
      role: item.role,
    }));
  }

  const general = ((generalResult.data ?? []) as ReviewRow[]).map(normalizeReview);

  if (general.length) {
    return general;
  }

  return testimonials.map((item, index) => ({
    id: `fallback-${productSlug}-${index}`,
    customer_name: item.name,
    rating: 5,
    review_text: item.quote,
    role: item.role,
  }));
}

export async function getVisibleStoreReviews() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return testimonials.map((item, index) => ({
      id: `fallback-store-${index}`,
      customer_name: item.name,
      rating: 5,
      review_text: item.quote,
      product_slug: null,
      visible: true,
      featured: index === 0,
      review_date: null,
      created_at: new Date().toISOString(),
      role: item.role,
    }));
  }

  const result = await supabase
    .from("reviews")
    .select("*")
    .eq("visible", true)
    .order("featured", { ascending: false })
    .order("review_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (result.error) {
    return testimonials.map((item, index) => ({
      id: `fallback-store-${index}`,
      customer_name: item.name,
      rating: 5,
      review_text: item.quote,
      product_slug: null,
      visible: true,
      featured: index === 0,
      review_date: null,
      created_at: new Date().toISOString(),
      role: item.role,
    }));
  }

  const reviews = ((result.data ?? []) as ReviewRow[]).map(normalizeReview);

  if (reviews.length) {
    return reviews;
  }

  return testimonials.map((item, index) => ({
    id: `fallback-store-${index}`,
    customer_name: item.name,
    rating: 5,
    review_text: item.quote,
    product_slug: null,
    visible: true,
    featured: index === 0,
    review_date: null,
    created_at: new Date().toISOString(),
    role: item.role,
  }));
}

export function getReviewFormDefaults(review?: ReviewRecord) {
  return {
    reviewId: review?.id ?? "",
    customerName: review?.customer_name ?? "",
    rating: review?.rating ?? 5,
    reviewText: review?.review_text ?? "",
    productSlug: review?.product_slug ?? "",
    visible: review?.visible ?? true,
    featured: review?.featured ?? false,
    reviewDate: review?.review_date ?? "",
  };
}

export async function saveReview(values: ReviewFormValues) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase nu este configurat.");
  }

  const safeProductSlug = await sanitizeReviewProductSlug(values.productSlug);

  const payload = {
    customer_name: values.customerName.trim(),
    rating: values.rating,
    review_text: values.reviewText.trim(),
    product_slug: safeProductSlug,
    visible: values.visible,
    featured: values.featured,
    review_date: values.reviewDate?.trim() || null,
  };

  const query = values.reviewId
    ? supabase
        .from("reviews")
        .update(payload)
        .eq("id", values.reviewId)
        .select("id, product_slug")
        .single()
    : supabase.from("reviews").insert(payload).select("id, product_slug").single();

  const result = await query;

  if (result.error || !result.data) {
    if (result.error && isMissingReviewsTable(result.error.message)) {
      throw new Error(
        "Tabela de recenzii nu există încă în Supabase. Rulează schema pentru reviews și reîncarcă pagina.",
      );
    }

    throw new Error(result.error?.message ?? "Recenzia nu a putut fi salvată.");
  }

  revalidateReviewPaths(result.data.product_slug);
  return result.data;
}

export async function submitPublicReview({
  customerName,
  rating,
  reviewText,
  productSlug,
}: {
  customerName: string;
  rating: number;
  reviewText: string;
  productSlug?: string;
}) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase nu este configurat.");
  }

  const safeProductSlug = await sanitizeReviewProductSlug(productSlug);

  const payload = {
    customer_name: customerName.trim(),
    rating,
    review_text: reviewText.trim(),
    product_slug: safeProductSlug,
    visible: false,
    featured: false,
    review_date: new Date().toISOString().slice(0, 10),
  };

  const result = await supabase.from("reviews").insert(payload).select("id, product_slug").single();

  if (result.error || !result.data) {
    if (result.error && isMissingReviewsTable(result.error.message)) {
      throw new Error(
        "Tabela de recenzii nu există încă în Supabase. Rulează schema pentru reviews și reîncarcă pagina.",
      );
    }

    throw new Error(result.error?.message ?? "Recenzia nu a putut fi trimisă.");
  }

  revalidateReviewPaths(result.data.product_slug);
  return result.data;
}

export async function deleteReview(reviewId: string) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase nu este configurat.");
  }

  const existing = await supabase
    .from("reviews")
    .select("id, product_slug")
    .eq("id", reviewId)
    .single();

  if (existing.error || !existing.data) {
    if (existing.error && isMissingReviewsTable(existing.error.message)) {
      throw new Error(
        "Tabela de recenzii nu există încă în Supabase. Rulează schema pentru reviews și reîncarcă pagina.",
      );
    }

    throw new Error(existing.error?.message ?? "Recenzia nu a fost găsită.");
  }

  const deleted = await supabase.from("reviews").delete().eq("id", reviewId);

  if (deleted.error) {
    if (isMissingReviewsTable(deleted.error.message)) {
      throw new Error(
        "Tabela de recenzii nu există încă în Supabase. Rulează schema pentru reviews și reîncarcă pagina.",
      );
    }

    throw new Error(deleted.error.message);
  }

  revalidateReviewPaths(existing.data.product_slug);
}

export async function getReviewProductChoices() {
  const products = await getCatalogProducts();

  return products.map((product) => ({
    slug: product.slug,
    name: product.name,
  }));
}
