import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, categories } from "@/lib/catalog";
import { getCatalogProductsByCategory } from "@/lib/admin-catalog";
import { ProductCategory } from "@/lib/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/catalog/product-card";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return {};
  }

  return buildMetadata({
    title: category.name,
    description: category.description,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const filteredProducts = await getCatalogProductsByCategory(category.slug as ProductCategory);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="surface-panel-strong rounded-[2.4rem] p-8 lg:p-10">
        <SectionHeading
          eyebrow="Categorie"
          title={category.name}
          description={`${category.description} ${category.hook}`}
        />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          "Realizat la comandă în România",
          "Timp de producție: 2–5 zile lucrătoare",
          "Ambalare premium",
          "Livrare în România",
        ].map((item) => (
          <div key={item} className="surface-panel rounded-[1.5rem] px-4 py-4 text-sm text-white/68">
            {item}
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
