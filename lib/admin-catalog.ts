import { revalidatePath } from "next/cache";
import { env } from "@/lib/env";
import { products as fallbackProducts } from "@/lib/catalog";
import { getPrimaryProductMedia } from "@/lib/product-media";
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import type { Product, ProductAdminRecord, ProductCategory, ProductMediaRecord } from "@/lib/types";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string;
  long_description: string;
  price: number;
  badge: string | null;
  seo_title: string | null;
  seo_description: string | null;
  featured: boolean;
  enabled: boolean;
  sizes: unknown;
  colors: unknown;
  materials: unknown;
  customization: unknown;
  ideal_for: unknown;
  visual: unknown;
  created_at: string;
  updated_at: string;
};

type ProductMediaRow = {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
  kind: string;
  created_at: string;
};

export type ProductFormValues = {
  productId?: string;
  name: string;
  slug: string;
  category: ProductCategory;
  shortDescription: string;
  longDescription: string;
  price: number;
  badge?: string;
  featured: boolean;
  enabled: boolean;
  sizes: string[];
  colors: string[];
  materials: string[];
  customization: string[];
  idealFor: string[];
};

const defaultVisuals: Record<ProductCategory, Product["visual"]> = {
  "auto-moto": { accent: "#d5a23a", glow: "#f6d57a", motif: "AUTO" },
  "crypto-trading": { accent: "#f2b52d", glow: "#ffe08d", motif: "BTC" },
  "desk-setup": { accent: "#d6a03c", glow: "#fce8a7", motif: "DESK" },
  gifts: { accent: "#f0bc53", glow: "#fff2be", motif: "GIFT" },
  "funny-viral": { accent: "#d6a43f", glow: "#fee4a0", motif: "ART" },
};

function toStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()));
  }

  return [];
}

function toVisual(value: unknown, category: ProductCategory, slug: string) {
  const fallback = defaultVisuals[category];

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      ...fallback,
      motif: slug.split("-")[0]?.toUpperCase() || fallback.motif,
    };
  }

  const candidate = value as Record<string, unknown>;

  return {
    accent: typeof candidate.accent === "string" ? candidate.accent : fallback.accent,
    glow: typeof candidate.glow === "string" ? candidate.glow : fallback.glow,
    motif:
      typeof candidate.motif === "string"
        ? candidate.motif
        : slug.split("-")[0]?.toUpperCase() || fallback.motif,
  };
}

function buildPublicMediaUrl(path: string) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return "";
  }

  return supabase.storage.from(env.SUPABASE_PRODUCT_MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

function normalizeMediaRow(row: ProductMediaRow): ProductMediaRecord {
  return {
    id: row.id,
    product_id: row.product_id,
    storage_path: row.storage_path,
    alt_text: row.alt_text,
    sort_order: row.sort_order,
    kind: row.kind,
    created_at: row.created_at,
    public_url: buildPublicMediaUrl(row.storage_path),
  };
}

function normalizeProductRow(row: ProductRow, media: ProductMediaRecord[]): ProductAdminRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as ProductCategory,
    short_description: row.short_description,
    long_description: row.long_description,
    price: row.price,
    badge: row.badge,
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    featured: row.featured,
    enabled: row.enabled,
    sizes: toStringArray(row.sizes),
    colors: toStringArray(row.colors),
    materials: toStringArray(row.materials),
    customization: toStringArray(row.customization),
    ideal_for: toStringArray(row.ideal_for),
    visual: toVisual(row.visual, row.category as ProductCategory, row.slug),
    created_at: row.created_at,
    updated_at: row.updated_at,
    media,
  };
}

function listToText(values: string[]) {
  return values.join("\n");
}

export function parseListInput(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildFallbackProduct(record: ProductAdminRecord, base?: Product): Product {
  const productBase = base ?? {
    slug: record.slug,
    name: record.name,
    category: record.category,
    price: record.price,
    shortDescription: record.short_description,
    longDescription: record.long_description,
    story: record.short_description,
    sizes: record.sizes,
    colors: record.colors,
    materials: record.materials,
    sizeLabel: "Dimensiune",
    colorLabel: "Finisaj",
    materialLabel: "Material",
    personalizationLabel: "Personalizare opțională",
    leadTime: "2–5 zile lucrătoare",
    idealFor: (record.ideal_for.length ? record.ideal_for : ["Birou / setup"]) as Product["idealFor"],
    customization: record.customization,
    shippingNote: "Livrare în România",
    packagingNote: "Fiecare comandă este pregătită atent pentru transport și livrare în siguranță.",
    seoTitle: `${record.name} | ArteForma`,
    seoDescription: record.short_description,
    badge: record.badge ?? undefined,
    featured: record.featured,
    enabled: record.enabled,
    visual: record.visual ?? defaultVisuals[record.category],
  };

  return {
    ...productBase,
    id: record.id,
    slug: record.slug,
    name: record.name,
    category: record.category,
    shortDescription: record.short_description,
    longDescription: record.long_description,
    price: record.price,
    sizes: record.sizes,
    colors: record.colors,
    materials: record.materials,
    customization: record.customization.length ? record.customization : productBase.customization,
    idealFor: (record.ideal_for.length ? record.ideal_for : productBase.idealFor) as Product["idealFor"],
    badge: record.badge ?? productBase.badge,
    featured: record.featured,
    enabled: record.enabled,
    seoTitle: record.seo_title ?? productBase.seoTitle,
    seoDescription: record.seo_description ?? productBase.seoDescription,
    visual: record.visual ?? productBase.visual,
    media: record.media,
  };
}

export async function getAdminProducts() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return null;
  }

  const [productsResult, mediaResult] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: true }),
    supabase.from("product_media").select("*").order("sort_order", { ascending: true }),
  ]);

  if (productsResult.error) {
    throw new Error(productsResult.error.message);
  }

  if (mediaResult.error) {
    throw new Error(mediaResult.error.message);
  }

  const mediaByProduct = new Map<string, ProductMediaRecord[]>();

  for (const row of (mediaResult.data ?? []) as ProductMediaRow[]) {
    const normalized = normalizeMediaRow(row);
    mediaByProduct.set(row.product_id, [...(mediaByProduct.get(row.product_id) ?? []), normalized]);
  }

  return ((productsResult.data ?? []) as ProductRow[]).map((row) =>
    normalizeProductRow(row, mediaByProduct.get(row.id) ?? []),
  );
}

export async function getAdminMedia() {
  const products = await getAdminProducts();

  if (!products) {
    return null;
  }

  return products.flatMap((product) =>
    (product.media ?? []).map((media) => ({
      ...media,
      product_name: product.name,
      product_slug: product.slug,
    })),
  );
}

export function getProductFormDefaults(product?: ProductAdminRecord) {
  if (!product) {
    return {
      productId: "",
      name: "",
      slug: "",
      category: "desk-setup" as ProductCategory,
      shortDescription: "",
      longDescription: "",
      price: 129,
      badge: "",
      featured: false,
      enabled: true,
      sizes: "",
      colors: "",
      materials: "",
      customization: "",
      idealFor: "",
    };
  }

  return {
    productId: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    shortDescription: product.short_description,
    longDescription: product.long_description,
    price: product.price,
    badge: product.badge ?? "",
    featured: product.featured,
    enabled: product.enabled,
    sizes: listToText(product.sizes),
    colors: listToText(product.colors),
    materials: listToText(product.materials),
    customization: listToText(product.customization),
    idealFor: listToText(product.ideal_for),
  };
}

export async function getCatalogProducts() {
  const adminProducts = await getAdminProducts();

  if (!adminProducts?.length) {
    return fallbackProducts.filter((product) => product.enabled !== false);
  }

  const mapped = new Map<string, Product>(
    adminProducts.map((record) => {
      const base = fallbackProducts.find((product) => product.slug === record.slug);
      return [record.slug, buildFallbackProduct(record, base)];
    }),
  );

  const merged = fallbackProducts.map((product) => mapped.get(product.slug) ?? product);

  for (const product of mapped.values()) {
    if (!merged.find((item) => item.slug === product.slug)) {
      merged.push(product);
    }
  }

  return merged.filter((product) => product.enabled !== false);
}

export async function getCatalogProductBySlug(slug: string) {
  const products = await getCatalogProducts();
  return products.find((product) => product.slug === slug && product.enabled !== false) ?? null;
}

export async function getCatalogProductsByCategory(category: ProductCategory) {
  const products = await getCatalogProducts();
  return products.filter((product) => product.category === category && product.enabled !== false);
}

export async function getCatalogFeaturedProducts() {
  const adminProducts = await getAdminProducts();

  if (adminProducts?.length) {
    const adminFeatured = adminProducts
      .filter((product) => product.featured && product.enabled !== false)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .map((record) => {
        const base = fallbackProducts.find((product) => product.slug === record.slug);
        return buildFallbackProduct(record, base);
      });

    if (adminFeatured.length) {
      return adminFeatured.slice(0, 6);
    }
  }

  const products = await getCatalogProducts();
  const fallbackFeatured = products.filter((product) => product.featured && product.enabled !== false);

  return (fallbackFeatured.length ? fallbackFeatured : products.filter((product) => product.enabled !== false)).slice(0, 6);
}

function toSeoTitle(name: string) {
  return `${name} | ArteForma`;
}

async function revalidateCatalogPaths(slug: string, category: ProductCategory) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/internal");
  revalidatePath("/internal/products");
  revalidatePath("/internal/media");
  revalidatePath(`/products/${slug}`);
  revalidatePath(`/categories/${category}`);
}

export async function saveAdminProduct(values: ProductFormValues) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase nu este configurat.");
  }

  const slug = await resolveProductSlug({
    productId: values.productId,
    requestedSlug: values.slug,
    name: values.name,
  });

  const payload = {
    slug,
    name: values.name.trim(),
    category: values.category,
    short_description: values.shortDescription.trim(),
    long_description: values.longDescription.trim(),
    price: values.price,
    badge: values.badge?.trim() || null,
    seo_title: toSeoTitle(values.name.trim()),
    seo_description: values.shortDescription.trim(),
    featured: values.featured,
    enabled: values.enabled,
    sizes: values.sizes,
    colors: values.colors,
    materials: values.materials,
    customization: values.customization,
    ideal_for: values.idealFor,
    updated_at: new Date().toISOString(),
  };

  const query = values.productId
    ? supabase
        .from("products")
        .update(payload)
        .eq("id", values.productId)
        .select("id, slug, category")
        .single()
    : supabase.from("products").insert(payload).select("id, slug, category").single();

  const result = await query;

  if (result.error || !result.data) {
    throw new Error(result.error?.message ?? "Produsul nu a putut fi salvat.");
  }

  await revalidateCatalogPaths(result.data.slug, result.data.category as ProductCategory);
  return result.data;
}

async function resolveProductSlug({
  productId,
  requestedSlug,
  name,
}: {
  productId?: string;
  requestedSlug?: string;
  name: string;
}) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase nu este configurat.");
  }

  const base = slugify(requestedSlug || name) || "produs";
  const existingResult = await supabase.from("products").select("id, slug");

  if (existingResult.error) {
    throw new Error(existingResult.error.message);
  }

  const rows = (existingResult.data ?? []) as Array<{ id: string; slug: string }>;
  const staticSlugs = new Set(fallbackProducts.map((product) => product.slug));
  const slugTakenByAnotherProduct = (candidate: string) =>
    rows.some((row) => row.slug === candidate && row.id !== productId);
  const currentProductOwnsSlug = (candidate: string) =>
    Boolean(productId && rows.some((row) => row.id === productId && row.slug === candidate));

  if (productId) {
    if (slugTakenByAnotherProduct(base) || (staticSlugs.has(base) && !currentProductOwnsSlug(base))) {
      throw new Error("Slug-ul este deja folosit de alt produs. Alege un slug diferit.");
    }

    return base;
  }

  let candidate = base;
  let suffix = 2;

  while (slugTakenByAnotherProduct(candidate) || staticSlugs.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export async function seedCatalogProductsFromCode() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase nu este configurat.");
  }

  const existingResult = await supabase.from("products").select("slug");

  if (existingResult.error) {
    throw new Error(existingResult.error.message);
  }

  const existingSlugs = new Set((existingResult.data ?? []).map((item) => item.slug));
  const missing = fallbackProducts.filter((product) => !existingSlugs.has(product.slug));

  if (!missing.length) {
    return 0;
  }

  const insertPayload = missing.map((product) => ({
    slug: product.slug,
    name: product.name,
    category: product.category,
    short_description: product.shortDescription,
    long_description: product.longDescription,
    price: product.price,
    badge: product.badge ?? null,
    seo_title: product.seoTitle,
    seo_description: product.seoDescription,
    featured: product.featured ?? false,
    enabled: product.enabled !== false,
    sizes: product.sizes,
    colors: product.colors,
    materials: product.materials,
    customization: product.customization,
    ideal_for: product.idealFor,
    visual: product.visual,
  }));

  const insertResult = await supabase.from("products").insert(insertPayload);

  if (insertResult.error) {
    throw new Error(insertResult.error.message);
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/internal/products");

  return missing.length;
}

async function ensureMediaBucket() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase nu este configurat.");
  }

  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    throw new Error(error.message);
  }

  if (!buckets.find((bucket) => bucket.name === env.SUPABASE_PRODUCT_MEDIA_BUCKET)) {
    const createResult = await supabase.storage.createBucket(env.SUPABASE_PRODUCT_MEDIA_BUCKET, {
      public: true,
      fileSizeLimit: "8MB",
    });

    if (createResult.error) {
      throw new Error(createResult.error.message);
    }
  }

  return supabase;
}

function buildStoragePath(productSlug: string, fileName: string) {
  const extension = fileName.includes(".") ? fileName.split(".").pop() : "jpg";
  return `${productSlug}/${Date.now()}-${slugify(fileName.replace(/\.[^/.]+$/, ""))}.${extension}`;
}

export async function uploadProductMedia(values: {
  productId: string;
  file: File;
  altText?: string;
  sortOrder?: number;
  kind?: string;
}) {
  const supabase = await ensureMediaBucket();
  const productResult = await supabase
    .from("products")
    .select("slug, category")
    .eq("id", values.productId)
    .single();

  if (productResult.error || !productResult.data) {
    throw new Error(productResult.error?.message ?? "Produsul selectat nu a fost găsit.");
  }

  const storagePath = buildStoragePath(productResult.data.slug, values.file.name);
  const fileBuffer = Buffer.from(await values.file.arrayBuffer());

  const uploadResult = await supabase.storage
    .from(env.SUPABASE_PRODUCT_MEDIA_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: values.file.type || "image/jpeg",
      upsert: false,
    });

  if (uploadResult.error) {
    throw new Error(uploadResult.error.message);
  }

  const insertResult = await supabase.from("product_media").insert({
    product_id: values.productId,
    storage_path: storagePath,
    alt_text: values.altText?.trim() || null,
    sort_order: values.sortOrder ?? 0,
    kind: values.kind?.trim() || "gallery",
  });

  if (insertResult.error) {
    throw new Error(insertResult.error.message);
  }

  await revalidateCatalogPaths(
    productResult.data.slug,
    productResult.data.category as ProductCategory,
  );
}

export async function updateProductMedia(values: {
  mediaId: string;
  altText?: string;
  sortOrder?: number;
  kind?: string;
  replacementFile?: File | null;
}) {
  const supabase = await ensureMediaBucket();

  const mediaResult = await supabase
    .from("product_media")
    .select("id, product_id, storage_path")
    .eq("id", values.mediaId)
    .single();

  if (mediaResult.error || !mediaResult.data) {
    throw new Error(mediaResult.error?.message ?? "Imaginea nu a fost găsită.");
  }

  let storagePath = mediaResult.data.storage_path;

  if (values.replacementFile && values.replacementFile.size > 0) {
    const productResult = await supabase.from("products").select("slug").eq("id", mediaResult.data.product_id).single();

    if (productResult.error || !productResult.data) {
      throw new Error(productResult.error?.message ?? "Produsul imaginii nu a fost găsit.");
    }

    const nextPath = buildStoragePath(productResult.data.slug, values.replacementFile.name);
    const buffer = Buffer.from(await values.replacementFile.arrayBuffer());
    const uploadResult = await supabase.storage
      .from(env.SUPABASE_PRODUCT_MEDIA_BUCKET)
      .upload(nextPath, buffer, {
        contentType: values.replacementFile.type || "image/jpeg",
        upsert: false,
      });

    if (uploadResult.error) {
      throw new Error(uploadResult.error.message);
    }

    await supabase.storage.from(env.SUPABASE_PRODUCT_MEDIA_BUCKET).remove([storagePath]);
    storagePath = nextPath;
  }

  const updateResult = await supabase
    .from("product_media")
    .update({
      storage_path: storagePath,
      alt_text: values.altText?.trim() || null,
      sort_order: values.sortOrder ?? 0,
      kind: values.kind?.trim() || "gallery",
    })
    .eq("id", values.mediaId);

  if (updateResult.error) {
    throw new Error(updateResult.error.message);
  }

  const product = await supabase
    .from("products")
    .select("slug, category")
    .eq("id", mediaResult.data.product_id)
    .single();

  if (!product.error && product.data) {
    await revalidateCatalogPaths(product.data.slug, product.data.category as ProductCategory);
  }
}

export async function deleteProductMedia(mediaId: string) {
  const supabase = await ensureMediaBucket();

  const mediaResult = await supabase
    .from("product_media")
    .select("product_id, storage_path")
    .eq("id", mediaId)
    .single();

  if (mediaResult.error || !mediaResult.data) {
    throw new Error(mediaResult.error?.message ?? "Imaginea nu a fost găsită.");
  }

  await supabase.storage.from(env.SUPABASE_PRODUCT_MEDIA_BUCKET).remove([mediaResult.data.storage_path]);

  const deleteResult = await supabase.from("product_media").delete().eq("id", mediaId);

  if (deleteResult.error) {
    throw new Error(deleteResult.error.message);
  }

  const product = await supabase
    .from("products")
    .select("slug, category")
    .eq("id", mediaResult.data.product_id)
    .single();

  if (!product.error && product.data) {
    await revalidateCatalogPaths(product.data.slug, product.data.category as ProductCategory);
  }
}

export function canUseAdminCatalog() {
  return isSupabaseConfigured();
}
