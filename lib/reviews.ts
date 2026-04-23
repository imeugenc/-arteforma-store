import { revalidatePath } from "next/cache";
import { getAdminProducts, getCatalogProducts } from "@/lib/admin-catalog";
import { categories } from "@/lib/catalog";
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
  categorySlug?: string;
  visible: boolean;
  featured: boolean;
  reviewDate?: string;
};

const REVIEW_CATEGORY_LABELS: Record<string, string> = {
  "desk-setup": "Desk / Birou",
  "crypto-trading": "Crypto",
  "auto-moto": "Auto / Moto",
  gifts: "Cadouri",
  custom: "Custom",
  "funny-viral": "Funny / Viral",
};

function getReviewCategoryChoicesBase() {
  const derived: Array<{ slug: string; name: string }> = categories.map((category) => ({
    slug: category.slug,
    name: REVIEW_CATEGORY_LABELS[category.slug] ?? category.name,
  }));

  if (!derived.some((item) => item.slug === "custom")) {
    derived.push({ slug: "custom", name: "Custom" });
  }

  return derived;
}

function isKnownReviewCategory(value?: string | null) {
  if (!value) {
    return false;
  }

  return getReviewCategoryChoicesBase().some((option) => option.slug === value);
}

async function resolveReviewCategory(rawValue?: string | null) {
  if (!rawValue) {
    return { categorySlug: null, categoryLabel: null };
  }

  if (isKnownReviewCategory(rawValue)) {
    return {
      categorySlug: rawValue,
      categoryLabel: REVIEW_CATEGORY_LABELS[rawValue] ?? rawValue,
    };
  }

  const [adminProducts, catalogProducts] = await Promise.all([getAdminProducts(), getCatalogProducts()]);
  const allProducts = [...(adminProducts ?? []), ...catalogProducts];
  const matched = allProducts.find((product) => product.slug === rawValue);

  if (matched) {
    return {
      categorySlug: matched.category,
      categoryLabel: REVIEW_CATEGORY_LABELS[matched.category] ?? matched.category,
    };
  }

  return {
    categorySlug: null,
    categoryLabel: "Categorie necunoscută / produs retras",
  };
}

async function normalizeReview(row: ReviewRow): Promise<ReviewRecord> {
  const category = await resolveReviewCategory(row.product_slug);

  return {
    id: row.id,
    created_at: row.created_at,
    customer_name: row.customer_name,
    rating: row.rating,
    review_text: row.review_text,
    category_slug: category.categorySlug,
    category_label: category.categoryLabel,
    legacy_reference: row.product_slug,
    visible: row.visible,
    featured: row.featured,
    review_date: row.review_date,
  };
}

async function revalidateReviewPaths(target?: string | null) {
  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath("/shop");
  revalidatePath("/internal/reviews");

  if (!target) {
    return;
  }

  if (isKnownReviewCategory(target)) {
    revalidatePath(`/categories/${target}`);
    const products = await getCatalogProducts();

    products
      .filter((product) => product.category === target)
      .forEach((product) => {
        revalidatePath(`/products/${product.slug}`);
      });

    return;
  }

  revalidatePath(`/products/${target}`);
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

  return Promise.all(((result.data ?? []) as ReviewRow[]).map(normalizeReview));
}

export async function getVisibleReviewsForProduct(productSlug: string) {
  const supabase = getSupabaseAdminClient();
  const catalogProducts = await getCatalogProducts();
  const matchedProduct = catalogProducts.find((product) => product.slug === productSlug);
  const categorySlug = matchedProduct?.category ?? null;

  if (!supabase) {
    return testimonials.map((item, index) => ({
      id: `fallback-${productSlug}-${index}`,
      customer_name: item.name,
      rating: 5,
      review_text: item.quote,
      category_slug: null,
      category_label: null,
      legacy_reference: null,
    }));
  }

  const specificResult = await supabase
    .from("reviews")
    .select("*")
    .eq("visible", true)
    .eq("product_slug", categorySlug)
    .order("featured", { ascending: false })
    .order("review_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (specificResult.error) {
    return testimonials.map((item, index) => ({
      id: `fallback-${productSlug}-${index}`,
      customer_name: item.name,
      rating: 5,
      review_text: item.quote,
      category_slug: null,
      category_label: null,
      legacy_reference: null,
    }));
  }

  const specific = await Promise.all(((specificResult.data ?? []) as ReviewRow[]).map(normalizeReview));

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
      category_slug: null,
      category_label: null,
      legacy_reference: null,
    }));
  }

  const general = await Promise.all(((generalResult.data ?? []) as ReviewRow[]).map(normalizeReview));

  if (general.length) {
    return general;
  }

  return testimonials.map((item, index) => ({
    id: `fallback-${productSlug}-${index}`,
    customer_name: item.name,
    rating: 5,
    review_text: item.quote,
    category_slug: null,
    category_label: null,
    legacy_reference: null,
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
      category_slug: null,
      category_label: null,
      legacy_reference: null,
      visible: true,
      featured: index === 0,
      review_date: null,
      created_at: new Date().toISOString(),
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
      category_slug: null,
      category_label: null,
      legacy_reference: null,
      visible: true,
      featured: index === 0,
      review_date: null,
      created_at: new Date().toISOString(),
    }));
  }

  const reviews = await Promise.all(((result.data ?? []) as ReviewRow[]).map(normalizeReview));

  if (reviews.length) {
    return reviews;
  }

  return testimonials.map((item, index) => ({
    id: `fallback-store-${index}`,
    customer_name: item.name,
    rating: 5,
    review_text: item.quote,
    category_slug: null,
    category_label: null,
    legacy_reference: null,
    visible: true,
    featured: index === 0,
    review_date: null,
    created_at: new Date().toISOString(),
  }));
}

export function getReviewFormDefaults(review?: ReviewRecord) {
  return {
    reviewId: review?.id ?? "",
    customerName: review?.customer_name ?? "",
    rating: review?.rating ?? 5,
    reviewText: review?.review_text ?? "",
    categorySlug: review?.category_slug ?? "",
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

  const safeCategorySlug =
    values.categorySlug?.trim() && isKnownReviewCategory(values.categorySlug)
      ? values.categorySlug.trim()
      : null;

  const payload = {
    customer_name: values.customerName.trim(),
    rating: values.rating,
    review_text: values.reviewText.trim(),
    product_slug: safeCategorySlug,
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

  await revalidateReviewPaths(result.data.product_slug);
  return result.data;
}

export async function submitPublicReview({
  customerName,
  rating,
  reviewText,
  categorySlug,
}: {
  customerName: string;
  rating: number;
  reviewText: string;
  categorySlug?: string;
}) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase nu este configurat.");
  }

  const safeCategorySlug =
    categorySlug?.trim() && isKnownReviewCategory(categorySlug)
      ? categorySlug.trim()
      : null;

  const payload = {
    customer_name: customerName.trim(),
    rating,
    review_text: reviewText.trim(),
    product_slug: safeCategorySlug,
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

  await revalidateReviewPaths(result.data.product_slug);
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

  await revalidateReviewPaths(existing.data.product_slug);
}

export async function getReviewProductChoices() {
  const currentProducts = await getCatalogProducts();
  const currentCategories = new Set<string>(currentProducts.map((product) => product.category));

  return getReviewCategoryChoicesBase().filter(
    (option) => option.slug === "custom" || currentCategories.has(option.slug),
  );
}
