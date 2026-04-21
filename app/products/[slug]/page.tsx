import Link from "next/link";
import Script from "next/script";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import { ProductVisual } from "@/components/ui/product-visual";
import { AddToCartForm } from "@/components/catalog/add-to-cart-form";
import { buildMetadata, productStructuredData } from "@/lib/seo";

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return buildMetadata({
    title: product.seoTitle,
    description: product.seoDescription,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

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
            }),
          ),
        }}
      />
      <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-5">
          <ProductVisual
            accent={product.visual.accent}
            glow={product.visual.glow}
            motif={product.visual.motif}
            label={product.badge ?? "ArteForma"}
            className="min-h-[560px]"
          />
          <div className="grid gap-5 sm:grid-cols-3">
            {["detaliu", "finisaj", "context"].map((tag, index) => (
              <ProductVisual
                key={tag}
                accent={product.visual.accent}
                glow={product.visual.glow}
                motif={`${product.visual.motif}-${index + 1}`}
                label={tag}
                className="min-h-[170px]"
              />
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-5">
            {product.badge ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-[#d7a12a]">
                {product.badge}
              </p>
            ) : null}
            <h1 className="font-serif-display text-4xl leading-tight text-white sm:text-5xl">
              {product.name}
            </h1>
            <p className="text-lg leading-8 text-white/70">{product.shortDescription}</p>
            <div className="flex flex-wrap items-end gap-4">
              <div className="text-3xl font-semibold text-[#f6d57a]">{formatPrice(product.price)}</div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/32">Realizat la comandă în România</p>
            </div>
          </div>

          <div className="surface-panel rounded-[2rem] p-6">
            <ul className="space-y-3 text-sm text-white/72">
              <li>Timp de producție: {product.leadTime}</li>
              <li>{product.shippingNote}</li>
              <li>{product.packagingNote}</li>
            </ul>
          </div>

          <AddToCartForm product={product} />

          <div className="surface-panel rounded-[2rem] p-6">
            <h2 className="font-serif-display text-2xl text-white">Despre această piesă</h2>
            <p className="mt-4 leading-8 text-white/68">{product.longDescription}</p>
            <p className="mt-4 border-l border-[#d7a12a]/30 pl-4 text-sm leading-7 text-[#f0ddb0]">
              {product.story}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <InfoCard title="Potrivită pentru" items={product.idealFor} />
            <InfoCard title="Personalizare" items={product.customization} />
            <InfoCard
              title="Producție și livrare"
              items={[
                "Realizat la comandă în România",
                product.leadTime,
                product.shippingNote,
              ]}
            />
          </div>

          <div className="surface-panel-strong rounded-[2rem] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-[#d7a12a]">Vrei o versiune custom?</p>
            <p className="mt-3 text-white/72">
              Vrei altă dimensiune, altă siluetă, propriul logo sau o interpretare mai personală a acestei piese?
            </p>
            <Link
              href="/custom-orders"
              className="mt-5 inline-flex text-sm font-semibold uppercase tracking-[0.22em] text-white"
            >
              Pornește o cerere custom
            </Link>
          </div>
        </div>
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
