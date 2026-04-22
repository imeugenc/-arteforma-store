import type { ReactNode } from "react";
import { buildInternalMetadata, requireInternalAccess } from "@/lib/internal";
import {
  canUseAdminCatalog,
  getAdminProducts,
  getProductFormDefaults,
} from "@/lib/admin-catalog";
import { getPrimaryProductMedia } from "@/lib/product-media";
import { formatPrice } from "@/lib/utils";
import type { ProductCategory, ProductMediaRecord } from "@/lib/types";

export const metadata = buildInternalMetadata(
  "Catalog intern",
  "Administrare internă ArteForma pentru produse, opțiuni și media.",
  "/internal/products",
);

const categoryOptions: Array<{ value: ProductCategory; label: string }> = [
  { value: "auto-moto", label: "Auto / Moto" },
  { value: "crypto-trading", label: "Crypto / Trading" },
  { value: "desk-setup", label: "Birou / Setup" },
  { value: "gifts", label: "Cadouri" },
  { value: "funny-viral", label: "Funny / Viral" },
];

const mediaKindOptions = [
  { value: "cover", label: "Copertă / prezentare" },
  { value: "gallery", label: "Galerie" },
  { value: "detail", label: "Detaliu" },
  { value: "lifestyle", label: "Context / ambient" },
];

export default async function InternalProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
    saved?: string;
    imported?: string;
    error?: string;
  }>;
}) {
  const { token, saved, imported, error } = await searchParams;
  await requireInternalAccess(token, "/internal/products");

  const adminAvailable = canUseAdminCatalog();
  const products = adminAvailable ? await getAdminProducts() : null;

  return (
    <div className="space-y-8">
      <div className="surface-panel-strong rounded-[2.4rem] p-8 lg:p-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7a12a]">
              Catalog intern
            </p>
            <h1 className="mt-5 font-serif-display text-[2rem] text-white lg:text-[2.6rem]">
              Produse, opțiuni și media într-un singur loc
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-white/68 sm:text-[15px]">
              Creezi produsul, apoi îi gestionezi imaginile direct în aceeași zonă. Imaginea marcată ca
              „Copertă / prezentare” devine varianta principală pentru produs și poate fi folosită în
              storefront și pentru social sharing.
            </p>
          </div>
          <form action="/api/internal-products/import" method="POST">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full border border-[#d7a12a]/30 bg-[#d7a12a]/8 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#f2dfaf]"
            >
              Importă catalogul curent din cod
            </button>
          </form>
        </div>

        {saved ? <p className="mt-4 text-sm text-[#f2dfaf]">Produs salvat.</p> : null}
        {typeof imported !== "undefined" ? (
          <p className="mt-4 text-sm text-[#f2dfaf]">Import finalizat. Produse adăugate: {imported}.</p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      </div>

      {!adminAvailable ? (
        <div className="surface-panel rounded-[2rem] p-6 text-white/65">
          Supabase nu este configurat, deci catalogul intern nu poate salva încă produse.
        </div>
      ) : (
        <>
          <div className="surface-panel rounded-[2rem] p-6 lg:p-7">
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#d7a12a]">
                Produs nou
              </p>
              <h2 className="font-serif-display text-2xl text-white">Adaugă o piesă nouă în catalog</h2>
            </div>
            <div className="mt-6">
              <ProductEditor defaults={getProductFormDefaults()} />
              <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-black/20 p-5 text-sm leading-7 text-white/62">
                Salvează mai întâi produsul, apoi secțiunea de imagini apare automat sub el și poți încărca
                pozele direct din aceeași pagină.
              </div>
            </div>
          </div>

          {!products?.length ? (
            <div className="surface-panel rounded-[2rem] p-6 text-white/65">
              Tabelul `products` este încă gol. Apasă pe butonul de import de mai sus ca să copiezi catalogul
              actual în Supabase și să poți gestiona apoi imaginile și editările din admin.
            </div>
          ) : (
            <div className="space-y-6">
              {products.map((product) => {
                const primaryMedia = getPrimaryProductMedia(product.media);

                return (
                  <div
                    key={product.id}
                    id={`product-${product.id}`}
                    className="surface-panel rounded-[2rem] p-6 scroll-mt-28"
                  >
                    <div className="grid gap-6 xl:grid-cols-[0.3fr_0.7fr]">
                      <div className="space-y-5">
                        <div className="overflow-hidden rounded-[1.6rem] border border-white/8 bg-black/20">
                          {primaryMedia?.public_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={primaryMedia.public_url}
                              alt={primaryMedia.alt_text ?? product.name}
                              className="aspect-square h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex aspect-square items-center justify-center text-sm text-white/45">
                              Fără imagine de copertă
                            </div>
                          )}
                        </div>

                        <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d7a12a]">
                            Rezumat
                          </p>
                          <div className="mt-4 space-y-3 text-sm text-white/68">
                            <InfoRow label="Produs" value={product.name} />
                            <InfoRow label="Slug" value={product.slug} />
                            <InfoRow label="Categorie" value={product.category} />
                            <InfoRow label="Preț" value={formatPrice(product.price)} />
                            <InfoRow label="Status" value={product.enabled ? "Activ" : "Inactiv"} />
                            <InfoRow label="Featured" value={product.featured ? "Da" : "Nu"} />
                            <InfoRow label="Media" value={`${product.media?.length ?? 0} imagini`} />
                            <InfoRow
                              label="Imagine principală"
                              value={primaryMedia ? primaryMedia.kind : "Nesetată"}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <ProductEditor defaults={getProductFormDefaults(product)} />
                        <ProductMediaSection
                          productId={product.id}
                          productName={product.name}
                          media={product.media ?? []}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ProductEditor({
  defaults,
}: {
  defaults: ReturnType<typeof getProductFormDefaults>;
}) {
  return (
    <form action="/api/internal-products" method="POST" className="grid gap-4">
      <input type="hidden" name="productId" value={defaults.productId} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Nume">
          <input type="text" name="name" defaultValue={defaults.name} required className="input-field" />
        </Field>
        <Field label="Slug">
          <input type="text" name="slug" defaultValue={defaults.slug} required className="input-field" />
        </Field>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_0.4fr_0.45fr_0.45fr]">
        <Field label="Categorie">
          <select name="category" defaultValue={defaults.category} className="input-field">
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Preț (RON)">
          <input type="number" min={1} name="price" defaultValue={defaults.price} required className="input-field" />
        </Field>
        <CheckboxField label="Featured">
          <input type="checkbox" name="featured" defaultChecked={defaults.featured} className="checkbox-field" />
        </CheckboxField>
        <CheckboxField label="Activ">
          <input type="checkbox" name="enabled" defaultChecked={defaults.enabled} className="checkbox-field" />
        </CheckboxField>
      </div>

      <Field label="Badge">
        <input type="text" name="badge" defaultValue={defaults.badge} className="input-field" />
      </Field>

      <Field label="Descriere scurtă">
        <textarea
          name="shortDescription"
          defaultValue={defaults.shortDescription}
          required
          rows={3}
          className="textarea-field"
        />
      </Field>

      <Field label="Descriere lungă">
        <textarea
          name="longDescription"
          defaultValue={defaults.longDescription}
          required
          rows={6}
          className="textarea-field"
        />
      </Field>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Dimensiuni" hint="Un rând per opțiune. Exemplu: 20 cm standard">
          <textarea name="sizes" defaultValue={defaults.sizes} rows={5} className="textarea-field" />
        </Field>
        <Field label="Culori" hint="Un rând per opțiune. Exemplu: Negru Grafit">
          <textarea name="colors" defaultValue={defaults.colors} rows={5} className="textarea-field" />
        </Field>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Field label="Materiale" hint="Un rând per opțiune. Exemplu: PLA Silk">
          <textarea name="materials" defaultValue={defaults.materials} rows={5} className="textarea-field" />
        </Field>
        <Field label="Personalizare" hint="Listează clar opțiunile sau adaptările posibile">
          <textarea
            name="customization"
            defaultValue={defaults.customization}
            rows={5}
            className="textarea-field"
          />
        </Field>
        <Field label="Ideal pentru" hint="Exemplu: Birou / setup">
          <textarea name="idealFor" defaultValue={defaults.idealFor} rows={5} className="textarea-field" />
        </Field>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-[#d7a12a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black"
        >
          Salvează produsul
        </button>
      </div>
    </form>
  );
}

function ProductMediaSection({
  productId,
  productName,
  media,
}: {
  productId: string;
  productName: string;
  media: ProductMediaRecord[];
}) {
  const returnTo = `/internal/products?updated=media#product-${productId}`;

  return (
    <div className="rounded-[1.8rem] border border-white/8 bg-black/20 p-5">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#d7a12a]">Imagini</p>
        <h3 className="font-serif-display text-2xl text-white">Media pentru {productName}</h3>
        <p className="text-sm leading-7 text-white/62">
          Poți urca poze direct aici, poți seta imaginea de copertă și ajusta ordinea în care apar în
          galerie.
        </p>
      </div>

      <form
        action="/api/internal-media"
        method="POST"
        encType="multipart/form-data"
        className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_0.3fr_0.45fr]"
      >
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="returnTo" value={`${returnTo}&uploaded=1`} />
        <Field label="Alt text">
          <input type="text" name="altText" className="input-field" placeholder="Descriere scurtă a imaginii" />
        </Field>
        <Field label="Ordine">
          <input type="number" min={0} name="sortOrder" defaultValue={media.length} className="input-field" />
        </Field>
        <Field label="Tip imagine">
          <select name="kind" defaultValue="gallery" className="input-field">
            {mediaKindOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Fișier imagine">
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="block w-full text-sm text-white/68 file:mr-4 file:rounded-full file:border-0 file:bg-[#d7a12a] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
          />
        </Field>
        <div className="lg:col-span-3 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-[#d7a12a] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black"
          >
            Adaugă imaginea
          </button>
        </div>
      </form>

      {!media.length ? (
        <div className="mt-6 rounded-[1.4rem] border border-white/8 bg-white/[0.02] p-4 text-sm text-white/55">
          Produsul nu are încă imagini. Prima imagine marcată ca „Copertă / prezentare” va deveni varianta
          principală pentru produs.
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {media.map((item) => (
            <div key={item.id} className="rounded-[1.5rem] border border-white/8 bg-white/[0.02] p-4">
              <div className="grid gap-4 lg:grid-cols-[0.26fr_0.74fr]">
                <div className="overflow-hidden rounded-[1.2rem] border border-white/8 bg-black/20">
                  {item.public_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.public_url}
                      alt={item.alt_text ?? productName}
                      className="aspect-square h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-square items-center justify-center text-sm text-white/45">
                      Preview indisponibil
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <form action="/api/internal-media/update" method="POST" encType="multipart/form-data" className="grid gap-4">
                    <input type="hidden" name="mediaId" value={item.id} />
                    <input type="hidden" name="returnTo" value={`${returnTo}&updated=1`} />
                    <div className="grid gap-4 lg:grid-cols-[1fr_0.28fr_0.46fr]">
                      <Field label="Alt text">
                        <input
                          type="text"
                          name="altText"
                          defaultValue={item.alt_text ?? ""}
                          className="input-field"
                        />
                      </Field>
                      <Field label="Ordine">
                        <input
                          type="number"
                          min={0}
                          name="sortOrder"
                          defaultValue={item.sort_order}
                          className="input-field"
                        />
                      </Field>
                      <Field label="Tip imagine">
                        <select name="kind" defaultValue={item.kind} className="input-field">
                          {mediaKindOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    <Field label="Înlocuiește fișierul">
                      <input
                        type="file"
                        name="replacementFile"
                        accept="image/*"
                        className="block w-full text-sm text-white/68 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                      />
                    </Field>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-full bg-[#d7a12a] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black"
                      >
                        Salvează imaginea
                      </button>
                      {item.kind === "cover" ? (
                        <span className="inline-flex items-center rounded-full border border-[#d7a12a]/30 bg-[#d7a12a]/8 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#f2dfaf]">
                          Imagine principală
                        </span>
                      ) : null}
                    </div>
                  </form>

                  <form action="/api/internal-media/delete" method="POST">
                    <input type="hidden" name="mediaId" value={item.id} />
                    <input type="hidden" name="returnTo" value={`${returnTo}&deleted=1`} />
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
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-medium text-white">{label}</span>
      {children}
      {hint ? <span className="mt-2 block text-xs leading-6 text-white/38">{hint}</span> : null}
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-white/6 bg-white/[0.02] px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/34">{label}</p>
      <p className="mt-2 break-all text-sm text-white/78">{value}</p>
    </div>
  );
}
