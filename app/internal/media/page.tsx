import { buildInternalMetadata, requireInternalAccess } from "@/lib/internal";
import { canUseAdminCatalog, getAdminMedia, getAdminProducts } from "@/lib/admin-catalog";

export const metadata = buildInternalMetadata(
  "Media intern",
  "Administrare internă ArteForma pentru imagini, sortare și alt text.",
  "/internal/media",
);

export default async function InternalMediaPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
    uploaded?: string;
    updated?: string;
    deleted?: string;
    error?: string;
  }>;
}) {
  const { token, uploaded, updated, deleted, error } = await searchParams;
  await requireInternalAccess(token, "/internal/media");

  const adminAvailable = canUseAdminCatalog();
  const [products, media] = adminAvailable
    ? await Promise.all([getAdminProducts(), getAdminMedia()])
    : [null, null];

  return (
    <div className="space-y-8">
      <div className="surface-panel-strong rounded-[2.4rem] p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7a12a]">Media intern</p>
        <h1 className="mt-5 font-serif-display text-[2rem] text-white lg:text-[2.6rem]">
          Imagini, sortare și legarea lor de produse
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-white/68 sm:text-[15px]">
          Încarci imagini direct pe produs, setezi alt text, ordinea din galerie și poți înlocui sau șterge rapid media fără să atingi codul.
        </p>

        {uploaded ? <p className="mt-4 text-sm text-[#f2dfaf]">Imagine încărcată.</p> : null}
        {updated ? <p className="mt-4 text-sm text-[#f2dfaf]">Imagine actualizată.</p> : null}
        {deleted ? <p className="mt-4 text-sm text-[#f2dfaf]">Imagine ștearsă.</p> : null}
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      </div>

      {!adminAvailable ? (
        <div className="surface-panel rounded-[2rem] p-6 text-white/65">
          Supabase nu este configurat, deci media nu poate fi administrată încă.
        </div>
      ) : !products?.length ? (
        <div className="surface-panel rounded-[2rem] p-6 text-white/65">
          Nu există produse în tabela `products`. Importă sau creează mai întâi produse în `/internal/products`, apoi revino aici pentru upload media.
        </div>
      ) : (
        <>
          <div className="surface-panel rounded-[2rem] p-6 lg:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#d7a12a]">
              Upload nou
            </p>
            <h2 className="mt-3 font-serif-display text-2xl text-white">Adaugă o imagine pentru un produs</h2>

            <form action="/api/internal-media" method="POST" encType="multipart/form-data" className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_0.9fr_0.35fr_0.45fr]">
              <label>
                <span className="mb-2 block text-[13px] font-medium text-white">Produs</span>
                <select name="productId" className="input-field" required>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-2 block text-[13px] font-medium text-white">Alt text</span>
                <input type="text" name="altText" className="input-field" placeholder="Descriere scurtă a imaginii" />
              </label>
              <label>
                <span className="mb-2 block text-[13px] font-medium text-white">Ordine</span>
                <input type="number" min={0} name="sortOrder" defaultValue={0} className="input-field" />
              </label>
              <label>
                <span className="mb-2 block text-[13px] font-medium text-white">Tip</span>
                <input type="text" name="kind" defaultValue="gallery" className="input-field" />
              </label>
              <label className="lg:col-span-4">
                <span className="mb-2 block text-[13px] font-medium text-white">Imagine</span>
                <input type="file" name="file" accept="image/*" required className="block w-full text-sm text-white/68 file:mr-4 file:rounded-full file:border-0 file:bg-[#d7a12a] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black" />
              </label>
              <div className="lg:col-span-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#d7a12a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black"
                >
                  Încarcă imaginea
                </button>
              </div>
            </form>
          </div>

          {!media?.length ? (
            <div className="surface-panel rounded-[2rem] p-6 text-white/65">
              Nu există încă media salvată. Poți încărca prima imagine din formularul de mai sus.
            </div>
          ) : (
            <div className="grid gap-6">
              {media.map((item) => (
                <div key={item.id} className="surface-panel rounded-[2rem] p-6">
                  <div className="grid gap-6 xl:grid-cols-[0.42fr_0.58fr]">
                    <div className="overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/20">
                      {item.public_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.public_url}
                          alt={item.alt_text ?? item.product_name}
                          className="aspect-[1.05/1] h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-[280px] items-center justify-center text-sm text-white/45">
                          Preview indisponibil
                        </div>
                      )}
                    </div>
                    <div className="space-y-5">
                      <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-4 text-sm text-white/68">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d7a12a]">
                          Legătură produs
                        </p>
                        <p className="mt-3 text-white">{item.product_name}</p>
                        <p className="mt-1 text-white/45">{item.product_slug}</p>
                      </div>

                      <form action="/api/internal-media/update" method="POST" encType="multipart/form-data" className="grid gap-4">
                        <input type="hidden" name="mediaId" value={item.id} />
                        <div className="grid gap-4 lg:grid-cols-[1fr_0.28fr_0.36fr]">
                          <label>
                            <span className="mb-2 block text-[13px] font-medium text-white">Alt text</span>
                            <input
                              type="text"
                              name="altText"
                              defaultValue={item.alt_text ?? ""}
                              className="input-field"
                            />
                          </label>
                          <label>
                            <span className="mb-2 block text-[13px] font-medium text-white">Ordine</span>
                            <input
                              type="number"
                              min={0}
                              name="sortOrder"
                              defaultValue={item.sort_order}
                              className="input-field"
                            />
                          </label>
                          <label>
                            <span className="mb-2 block text-[13px] font-medium text-white">Tip</span>
                            <input type="text" name="kind" defaultValue={item.kind} className="input-field" />
                          </label>
                        </div>
                        <label>
                          <span className="mb-2 block text-[13px] font-medium text-white">Înlocuiește imaginea</span>
                          <input type="file" name="replacementFile" accept="image/*" className="block w-full text-sm text-white/68 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" />
                        </label>
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-full bg-[#d7a12a] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black"
                          >
                            Salvează imaginea
                          </button>
                        </div>
                      </form>

                      <form action="/api/internal-media/delete" method="POST">
                        <input type="hidden" name="mediaId" value={item.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center rounded-full border border-red-400/30 bg-red-400/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-red-200"
                        >
                          Șterge imaginea
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
