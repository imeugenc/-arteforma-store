import type { ReactNode } from "react";
import { buildInternalMetadata, requireInternalAccess } from "@/lib/internal";
import { getAdminProducts } from "@/lib/admin-catalog";
import { getAdminReviews, getReviewFormDefaults } from "@/lib/reviews";

export const metadata = buildInternalMetadata(
  "Recenzii interne",
  "Administrare internă ArteForma pentru recenzii și testimoniale.",
  "/internal/reviews",
);

export default async function InternalReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
    saved?: string;
    deleted?: string;
    error?: string;
  }>;
}) {
  const { token, saved, deleted, error } = await searchParams;
  await requireInternalAccess(token, "/internal/reviews");

  const [reviews, products] = await Promise.all([getAdminReviews(), getAdminProducts()]);

  return (
    <div className="space-y-8">
      <div className="surface-panel-strong rounded-[2.4rem] p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7a12a]">Recenzii interne</p>
        <h1 className="mt-5 font-serif-display text-[2rem] text-white lg:text-[2.6rem]">
          Recenzii generale și recenzii legate de produse
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-white/68 sm:text-[15px]">
          Poți gestiona recenzii pentru produse specifice sau testimoniale generale de magazin, cu control pe
          vizibilitate și evidențiere în storefront.
        </p>
        {saved ? <p className="mt-4 text-sm text-[#f2dfaf]">Recenzie salvată.</p> : null}
        {deleted ? <p className="mt-4 text-sm text-[#f2dfaf]">Recenzie ștearsă.</p> : null}
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      </div>

      <div className="surface-panel rounded-[2rem] p-6 lg:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#d7a12a]">
          Recenzie nouă
        </p>
        <h2 className="mt-3 font-serif-display text-2xl text-white">Adaugă o recenzie</h2>
        <div className="mt-6">
          <ReviewEditor
            defaults={getReviewFormDefaults()}
            productOptions={products?.map((product) => ({
              slug: product.slug,
              name: product.name,
            })) ?? []}
          />
        </div>
      </div>

      {!reviews ? (
        <div className="surface-panel rounded-[2rem] p-6 text-white/65">
          Supabase nu este configurat, deci recenziile nu pot fi administrate încă.
        </div>
      ) : !reviews.length ? (
        <div className="surface-panel rounded-[2rem] p-6 text-white/65">
          Nu există încă recenzii salvate. Poți adăuga prima recenzie din formularul de mai sus.
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="surface-panel rounded-[2rem] p-6">
              <div className="grid gap-6 xl:grid-cols-[0.32fr_0.68fr]">
                <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d7a12a]">Rezumat</p>
                  <div className="mt-4 space-y-3 text-sm text-white/68">
                    <Info label="Client" value={review.customer_name} />
                    <Info label="Rating" value={`${review.rating}/5`} />
                    <Info label="Produs" value={review.product_slug ?? "General / magazin"} />
                    <Info label="Vizibilă" value={review.visible ? "Da" : "Nu"} />
                    <Info label="Featured" value={review.featured ? "Da" : "Nu"} />
                    <Info
                      label="Data"
                      value={review.review_date || new Date(review.created_at).toLocaleDateString("ro-RO")}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <ReviewEditor
                    defaults={getReviewFormDefaults(review)}
                    productOptions={products?.map((product) => ({
                      slug: product.slug,
                      name: product.name,
                    })) ?? []}
                  />
                  <form action="/api/internal-reviews/delete" method="POST">
                    <input type="hidden" name="reviewId" value={review.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full border border-red-400/30 bg-red-400/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-red-200"
                    >
                      Șterge recenzia
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewEditor({
  defaults,
  productOptions,
}: {
  defaults: ReturnType<typeof getReviewFormDefaults>;
  productOptions: Array<{ slug: string; name: string }>;
}) {
  return (
    <form action="/api/internal-reviews" method="POST" className="grid gap-4">
      <input type="hidden" name="reviewId" value={defaults.reviewId} />
      <div className="grid gap-4 lg:grid-cols-[0.8fr_0.3fr_0.7fr]">
        <Field label="Nume client">
          <input
            type="text"
            name="customerName"
            defaultValue={defaults.customerName}
            required
            className="input-field"
          />
        </Field>
        <Field label="Rating">
          <select name="rating" defaultValue={String(defaults.rating)} className="input-field">
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value}/5
              </option>
            ))}
          </select>
        </Field>
        <Field label="Produs">
          <select name="productSlug" defaultValue={defaults.productSlug} className="input-field">
            <option value="">General / magazin</option>
            {productOptions.map((product) => (
              <option key={product.slug} value={product.slug}>
                {product.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Text recenzie">
        <textarea
          name="reviewText"
          defaultValue={defaults.reviewText}
          required
          rows={5}
          className="textarea-field"
        />
      </Field>

      <div className="grid gap-4 lg:grid-cols-[0.5fr_0.25fr_0.25fr]">
        <Field label="Dată recenzie">
          <input type="date" name="reviewDate" defaultValue={defaults.reviewDate} className="input-field" />
        </Field>
        <CheckboxField label="Vizibilă">
          <input type="checkbox" name="visible" defaultChecked={defaults.visible} className="checkbox-field" />
        </CheckboxField>
        <CheckboxField label="Featured">
          <input type="checkbox" name="featured" defaultChecked={defaults.featured} className="checkbox-field" />
        </CheckboxField>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-[#d7a12a] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black"
        >
          Salvează recenzia
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-medium text-white">{label}</span>
      {children}
    </label>
  );
}

function CheckboxField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex h-full items-center gap-3 rounded-[1.3rem] border border-white/10 bg-black/30 px-4 py-3 text-sm text-white">
      {children}
      <span>{label}</span>
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-white/6 bg-white/[0.02] px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/34">{label}</p>
      <p className="mt-2 break-all text-sm text-white/78">{value}</p>
    </div>
  );
}
