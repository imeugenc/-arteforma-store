import Link from "next/link";
import Script from "next/script";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalogProductBySlug, getCatalogProducts } from "@/lib/admin-catalog";
import { getPrimaryProductMedia } from "@/lib/product-media";
import { formatPrice } from "@/lib/utils";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { AddToCartForm } from "@/components/catalog/add-to-cart-form";
import { Button } from "@/components/ui/button";
import { buildMetadata, productStructuredData } from "@/lib/seo";
import { getMaterialDetails } from "@/lib/materials";
import { getVisibleReviewsForProduct } from "@/lib/reviews";

export async function generateStaticParams() {
  const products = await getCatalogProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    return {};
  }

  const primaryMedia = getPrimaryProductMedia(product.media);

  return buildMetadata({
    title: product.seoTitle,
    description: product.seoDescription,
    path: `/products/${product.slug}`,
    image: primaryMedia?.public_url,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const materialDetails = getMaterialDetails(product.materials);
  const primaryMedia = getPrimaryProductMedia(product.media);
  const reviews = await getVisibleReviewsForProduct(product.slug);
  const galleryMedia = product.media?.length
    ? [...product.media].sort((left, right) => {
        if (left.kind === "cover" && right.kind !== "cover") {
          return -1;
        }

        if (right.kind === "cover" && left.kind !== "cover") {
          return 1;
        }

        return left.sort_order - right.sort_order;
      })
    : [];

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <Script
        id={`product-schema-${product.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            productStructuredData({
              name: product.name,
              description: product.seoDescription,
              price: product.price,
              slug: product.slug,
              image: primaryMedia?.public_url,
            }),
          ),
        }}
      />
      <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <ProductGallery
          productName={product.name}
          media={galleryMedia}
          visual={product.visual}
          badge={product.badge}
        />

        <div className="space-y-6">
          <div className="space-y-5">
            {product.badge ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-[#d7a12a]">
                {product.badge}
              </p>
            ) : null}
            <h1 className="font-serif-display text-[2.25rem] leading-tight text-white sm:text-[2.9rem]">
              {product.name}
            </h1>
            <p className="text-sm leading-8 text-white/70 sm:text-[15px]">{product.shortDescription}</p>
            <div className="flex flex-wrap items-end gap-4">
              <div className="text-3xl font-semibold text-[#f6d57a]">{formatPrice(product.price)}</div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/32">Realizat la comandă în România</p>
            </div>
          </div>

          <div className="surface-panel rounded-[2rem] p-6">
            <ul className="space-y-3 text-sm text-white/72">
              <li>Timp de producție: {product.leadTime}</li>
              <li>Livrare în România</li>
              <li>Fiecare comandă este pregătită atent pentru transport și livrare în siguranță.</li>
            </ul>
          </div>

          <AddToCartForm product={product} />
        </div>
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="surface-panel rounded-[2rem] p-6">
            <h2 className="font-serif-display text-2xl text-white">Despre acest produs</h2>
            <p className="mt-4 leading-8 text-white/68">{product.longDescription}</p>
          </div>

          <div className="surface-panel rounded-[2rem] p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-serif-display text-2xl text-white">Opțiuni disponibile</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/64">
                  Alegi dimensiunea, finisajul și materialul direct din comandă. Dacă vrei altă variantă decât cele afișate, o discutăm separat.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <OptionBlock title={product.sizeLabel ?? "Dimensiuni"} values={product.sizes} />
              <OptionBlock title={product.colorLabel ?? "Culori"} values={product.colors} />
              <OptionBlock title={product.materialLabel ?? "Materiale"} values={product.materials} />
            </div>
          </div>

          <div className="surface-panel rounded-[2rem] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-serif-display text-2xl text-white">Finisaje și materiale pentru produsul acesta</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/64">
                  Aici vezi doar opțiunile relevante pentru modelul acesta. Ghidul complet despre materialele și finisajele ArteForma este în pagina Despre.
                </p>
              </div>
              <Link href="/about" className="text-sm font-medium text-[#f3dfae] transition hover:text-white">
                Vezi ghidul complet
              </Link>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {materialDetails.map((material) => (
                <MaterialCard key={material.title} material={material} />
              ))}
            </div>
          </div>

          <div className="surface-panel rounded-[2rem] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-[#d7a12a]">Recenzii</p>
            <h2 className="mt-3 font-serif-display text-3xl text-white">Cum sunt percepute piesele după livrare</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {reviews.map((review) => (
                <blockquote
                  key={review.id}
                  className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5"
                >
                  <p className="text-sm leading-7 text-white/74">„{review.review_text}”</p>
                  <footer className="mt-4">
                    <p className="text-sm font-medium text-white">{review.customer_name}</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/36">
                      {review.rating}/5
                    </p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <InfoCard title="Potrivită pentru" items={product.idealFor} />
            <InfoCard title="Detalii produs" items={product.customization} />
            <InfoCard
              title="Producție și livrare"
              items={[
                `Timp de producție: ${product.leadTime}`,
                "Livrare în România",
                "Pregătită atent pentru transport și livrare în siguranță.",
              ]}
            />
          </div>

          <div className="surface-panel rounded-[2rem] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-[#d7a12a]">Personalizare și extra opționale</p>
            <h2 className="mt-3 font-serif-display text-3xl text-white">
              Poți adăuga personalizare și ambalare premium direct din comandă.
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-white/68">
              <li>Personalizare disponibilă pentru produsele care au câmp dedicat.</li>
              <li>Costul suplimentar apare clar în coș și în checkout.</li>
              <li>Ambalarea premium se poate adăuga separat pentru comenzile care merg direct într-un cadou.</li>
            </ul>
          </div>

          <div className="surface-panel-strong rounded-[2rem] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-[#d7a12a]">Adaptare personalizată</p>
            <h2 className="mt-3 font-serif-display text-3xl text-white">
              Vrei o variantă apropiată de modelul tău sau de ideea ta?
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/68">
              Trimite-ne ideea, referința sau contextul în care va fi folosit produsul, iar noi revenim cu o variantă realistă și potrivită pentru produsul final.
            </p>
            <div className="mt-6">
              <Link href="/custom-orders">
                <Button
                  variant="secondary"
                  className="border-[#d7a12a]/24 bg-[#d7a12a]/8 text-[#f3dfae] hover:text-white"
                >
                  Creează un produs personalizat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OptionBlock({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d7a12a]">{title}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/72">
        {values.map((value) => (
          <span key={value} className="rounded-full border border-white/8 px-3 py-2">
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

function MaterialCard({
  material,
}: {
  material: { title: string; aspect: string; resistance: string; use: string };
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d7a12a]">{material.title}</p>
      <div className="mt-4 space-y-3 text-sm leading-7 text-white/68">
        <p>
          <span className="text-white">Aspect:</span> {material.aspect}
        </p>
        <p>
          <span className="text-white">Rezistență:</span> {material.resistance}
        </p>
        <p>
          <span className="text-white">Utilizare:</span> {material.use}
        </p>
      </div>
    </div>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="surface-panel rounded-[2rem] p-5">
      <h3 className="font-serif-display text-xl text-white">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-white/65">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
