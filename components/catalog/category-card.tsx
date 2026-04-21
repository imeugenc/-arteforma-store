import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Category } from "@/lib/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group surface-panel-strong relative overflow-hidden rounded-[2rem] p-6 transition hover:-translate-y-1"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(246,213,122,0.14),transparent_44%)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(120deg,transparent,rgba(215,161,42,0.16),transparent)] opacity-80 blur-2xl" />
      <div className="relative flex min-h-[250px] flex-col">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d7a12a]">
          Selecție ArteForma
        </p>
        <h3 className="mt-5 font-serif-display text-3xl text-white">{category.name}</h3>
        <p className="mt-4 max-w-sm text-sm leading-7 text-white/65">{category.hook}</p>
        <p className="mt-4 max-w-sm text-sm leading-7 text-white/48">{category.description}</p>
        <div className="mt-auto flex items-center gap-2 pt-10 text-sm font-semibold uppercase tracking-[0.22em] text-white/75">
          Vezi colecția
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
