"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/catalog/product-card";

type SortOption = "recommended" | "price-asc" | "price-desc";

export function ShopBrowser({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("recommended");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const visible = products.filter((product) => {
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      const haystack = [
        product.name,
        product.shortDescription,
        product.longDescription,
        product.category,
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = normalizedQuery.length === 0 || haystack.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });

    if (sort === "price-asc") {
      return [...visible].sort((a, b) => a.price - b.price);
    }

    if (sort === "price-desc") {
      return [...visible].sort((a, b) => b.price - a.price);
    }

    return visible;
  }, [activeCategory, products, query, sort]);

  return (
    <div className="space-y-8">
      <div className="surface-panel rounded-[2rem] p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr_0.8fr] lg:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Caută după produs, categorie sau tip de piesă"
              className="w-full rounded-full border border-white/10 bg-black/30 px-11 py-3.5 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#d7a12a]/45"
            />
          </div>

          <label className="flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/70">
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/42">
              Sortare
            </span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="w-full bg-transparent text-sm text-white outline-none"
            >
              <option value="recommended">Recomandate</option>
              <option value="price-asc">Preț crescător</option>
              <option value="price-desc">Preț descrescător</option>
            </select>
          </label>

          <div className="rounded-[1.5rem] border border-white/8 bg-[#d7a12a]/7 px-5 py-4 text-sm text-white/72">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d7a12a]">
              Selecție
            </p>
            <p className="mt-2">
              {filteredProducts.length} produse afișate, realizate la comandă în România.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={pillClass(activeCategory === "all")}
          >
            Toate produsele
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setActiveCategory(category.slug)}
              className={pillClass(activeCategory === category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="surface-panel rounded-[2rem] px-6 py-10 text-center text-white/64">
          Nu am găsit piese pentru filtrul ales. Încearcă altă categorie sau un termen mai scurt.
        </div>
      )}
    </div>
  );
}

function pillClass(active: boolean) {
  return [
    "rounded-full border px-4 py-2.5 text-sm transition",
    active
      ? "border-[#d7a12a]/45 bg-[#d7a12a]/10 text-[#f1dba6]"
      : "border-white/10 bg-black/25 text-white/64 hover:border-white/18 hover:text-white",
  ].join(" ");
}
