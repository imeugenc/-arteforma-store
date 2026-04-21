import { Metadata } from "next";
import { products } from "@/lib/catalog";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/catalog/product-card";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Magazin obiecte premium printate 3D",
  description:
    "Descoperă obiecte premium printate 3D pentru birou, piese crypto, siluete auto, cadouri și produse pregătite pentru personalizare, realizate la comandă în România.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Magazin"
        title="Obiecte gândite să stea la vedere în spațiul cuiva."
        description="Prețuri clare în RON, prezentare premium, producție la comandă în România și piese alese pentru identitate, nu pentru volum generic."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
