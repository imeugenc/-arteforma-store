import type { Metadata } from "next";
import { getVisibleStoreReviews, getReviewProductChoices } from "@/lib/reviews";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = buildMetadata({
  title: "Recenzii",
  description:
    "Recenzii ArteForma de la clienți și formular public pentru trimiterea unei recenzii noi.",
  path: "/reviews",
});

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string; error?: string }>;
}) {
  const { submitted, error } = await searchParams;
  const [reviews, categories] = await Promise.all([getVisibleStoreReviews(), getReviewProductChoices()]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Recenzii"
        title="Recenzii publice și impresii de după livrare"
        description="Aici apar recenziile aprobate, iar clienții pot trimite recenzii noi pentru moderare înainte de publicare."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6">
          {reviews.map((review) => (
            <article key={review.id} className="surface-panel rounded-[2rem] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d7a12a]">
                    {review.category_slug ? "Recenzie categorie" : "Recenzie magazin"}
                  </p>
                  <h2 className="mt-3 font-serif-display text-2xl text-white">
                    {review.customer_name}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#f2dfaf]">{review.rating}/5</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/40">
                    {review.review_date
                      ? new Date(review.review_date).toLocaleDateString("ro-RO")
                      : new Date(review.created_at).toLocaleDateString("ro-RO")}
                  </p>
                </div>
              </div>
              {review.category_slug ? (
                <p className="mt-4 text-sm text-white/48">
                  Categorie: <span className="text-[#f2dfaf]">{review.category_label ?? review.category_slug}</span>
                </p>
              ) : null}
              <p className="mt-4 text-sm leading-8 text-white/72">{review.review_text}</p>
            </article>
          ))}
        </div>

        <div className="surface-panel-strong rounded-[2.25rem] p-6 lg:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d7a12a]">
            Trimite o recenzie
          </p>
          <h2 className="mt-3 font-serif-display text-2xl text-white">
            Spune-ne cum s-a simțit produsul după livrare
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/68">
            Recenziile trimise aici intră mai întâi în moderare. După verificare, pot fi publicate și editate din admin.
          </p>
          {submitted ? (
            <p className="mt-4 text-sm text-[#f2dfaf]">
              Recenzia a fost trimisă. O verificăm și o putem publica după moderare.
            </p>
          ) : null}
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

          <form action="/api/reviews" method="POST" className="mt-6 grid gap-4">
            <label className="block">
              <span className="mb-2 block text-[13px] font-medium text-white">Nume</span>
              <input type="text" name="customerName" required className="input-field" />
            </label>
            <div className="grid gap-4 sm:grid-cols-[0.42fr_0.58fr]">
              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-white">Rating</span>
                <select name="rating" defaultValue="5" className="input-field">
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value}/5
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] font-medium text-white">
                  Categorie
                </span>
                <select name="categorySlug" defaultValue="" className="input-field">
                  <option value="">General / magazin</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-[13px] font-medium text-white">Recenzie</span>
              <textarea name="reviewText" required rows={6} className="textarea-field" />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[#d7a12a] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black"
            >
              Trimite recenzia
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
