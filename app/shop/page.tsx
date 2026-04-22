import { Metadata } from "next";
import { categories } from "@/lib/catalog";
import { getCatalogProducts } from "@/lib/admin-catalog";
import { SectionHeading } from "@/components/ui/section-heading";
import { ShopBrowser } from "@/components/catalog/shop-browser";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Magazin obiecte printate 3D",
  description:
    "Descoperă obiecte printate 3D pentru birou, decor, auto, crypto și cadouri, realizate la comandă în România.",
  path: "/shop",
});

export default async function ShopPage() {
  const products = await getCatalogProducts();

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="surface-panel-strong rounded-[2.4rem] p-8 lg:p-10">
        <SectionHeading
          eyebrow="Magazin"
          title="Piese pentru birou, decor, cadouri și proiecte custom realizate în Brașov."
          description="Prețuri clare în RON, producție în 2–5 zile lucrătoare și o navigare mai simplă după categorie, buget sau tipul de produs pe care îl cauți."
        />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          "Realizat la comandă în România",
          "Plată securizată",
          "Ambalare premium pentru cadou",
          "Comenzi custom analizate manual",
        ].map((item) => (
          <div key={item} className="surface-panel rounded-[1.5rem] px-4 py-4 text-sm text-white/68">
            {item}
          </div>
        ))}
      </div>
      <div className="mt-10">
        <ShopBrowser products={products} categories={categories} />
      </div>
    </div>
  );
}
