import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Product } from "@/lib/types";
import { getPrimaryProductMedia } from "@/lib/product-media";
import { formatPrice } from "@/lib/utils";
import { ProductVisual } from "@/components/ui/product-visual";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  const primaryMedia = getPrimaryProductMedia(product.media);

  return (
    <div className="group surface-panel flex h-full flex-col overflow-hidden rounded-[2rem] transition hover:-translate-y-1">
      <Link href={`/products/${product.slug}`} className="block">
        {primaryMedia?.public_url ? (
          <div className="overflow-hidden rounded-b-none border-b border-white/8 bg-black/20">
            <Image
              src={primaryMedia.public_url}
              alt={primaryMedia.alt_text ?? product.name}
              width={1200}
              height={1200}
              className="aspect-[1.08/1] w-full object-cover"
            />
          </div>
        ) : (
          <ProductVisual
            accent={product.visual.accent}
            glow={product.visual.glow}
            motif={product.visual.motif}
            label={product.category.replace("-", " ")}
            className="min-h-[300px] rounded-b-none"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            {product.badge ? (
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d7a12a]">
                {product.badge}
              </p>
            ) : null}
            <Link href={`/products/${product.slug}`} className="inline-block">
              <h3 className="font-serif-display text-[1.65rem] leading-tight text-white transition group-hover:text-[#f4e0ad]">
                {product.name}
              </h3>
            </Link>
            <p className="mt-3 text-sm leading-7 text-white/64">{product.shortDescription}</p>
          </div>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[#d7a12a] transition group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
        <div className="grid gap-2 rounded-[1.5rem] border border-white/8 bg-black/20 p-4 text-sm text-white/55">
          <div className="flex items-center justify-between">
            <span>La comandă</span>
            <span>{product.leadTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Potrivit pentru</span>
            <span className="text-right">{product.idealFor[0]}</span>
          </div>
        </div>
        <div className="mt-auto flex items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.28em] text-white/35">De la</span>
            <div className="mt-1 text-xl font-semibold text-[#f6d57a]">{formatPrice(product.price)}</div>
          </div>
          <Link href={`/products/${product.slug}`}>
            <Button variant="secondary" className="px-4 py-3 text-xs tracking-[0.22em]">
              Vezi Produs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
