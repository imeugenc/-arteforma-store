import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory, categories } from "@/lib/catalog";
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

  const filteredProducts = getProductsByCategory(category.slug as ProductCategory);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Categorie"
        title={category.name}
        description={`${category.description} ${category.hook}`}
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
