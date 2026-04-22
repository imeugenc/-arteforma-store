import type { ReactNode } from "react";
import { buildInternalMetadata, requireInternalAccess } from "@/lib/internal";
import { canUseAdminCatalog, getAdminProducts, getProductFormDefaults } from "@/lib/admin-catalog";
import { formatPrice } from "@/lib/utils";
import type { ProductCategory } from "@/lib/types";

export const metadata = buildInternalMetadata(
  "Catalog intern",
  "Administrare internă ArteForma pentru produse, opțiuni și starea catalogului.",
  "/internal/products",
);

const categoryOptions: Array<{ value: ProductCategory; label: string }> = [
  { value: "auto-moto", label: "Auto / Moto" },
  { value: "crypto-trading", label: "Crypto / Trading" },
  { value: "desk-setup", label: "Birou / Setup" },
  { value: "gifts", label: "Cadouri" },
  { value: "funny-viral", label: "Funny / Viral" },
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
              Produse, opțiuni și controlul catalogului
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-white/68 sm:text-[15px]">
              Aici poți adăuga produse, edita catalogul existent și activa sau dezactiva piese fără să mai umbli direct în cod. Storefront-ul citește produsele din Supabase când există și revine pe fallback-ul din cod dacă baza e goală.
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
            </div>
          </div>

          {!products?.length ? (
            <div className="surface-panel rounded-[2rem] p-6 text-white/65">
              Tabelul `products` este încă gol. Apasă pe butonul de import de mai sus ca să copiezi catalogul actual în Supabase și să poți gestiona apoi media și editările din admin.
            </div>
          ) : (
            <div className="space-y-6">
              {products.map((product) => (
                <div key={product.id} className="surface-panel rounded-[2rem] p-6">
                  <div className="grid gap-6 xl:grid-cols-[0.34fr_0.66fr]">
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
                      </div>
                    </div>
                    <div>
                      <ProductEditor defaults={getProductFormDefaults(product)} />
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
          <input
            type="text"
            name="name"
            defaultValue={defaults.name}
            required
            className="input-field"
          />
        </Field>
        <Field label="Slug">
          <input
            type="text"
            name="slug"
            defaultValue={defaults.slug}
            required
            className="input-field"
          />
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
          <input
            type="number"
            min={1}
            name="price"
            defaultValue={defaults.price}
            required
            className="input-field"
          />
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
        <Field
          label="Dimensiuni"
          hint="Un rând per opțiune. Exemplu: 20 cm standard"
        >
          <textarea name="sizes" defaultValue={defaults.sizes} rows={5} className="textarea-field" />
        </Field>
        <Field label="Culori" hint="Un rând per opțiune. Exemplu: Negru Grafit">
          <textarea name="colors" defaultValue={defaults.colors} rows={5} className="textarea-field" />
        </Field>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Field label="Materiale" hint="Un rând per opțiune. Exemplu: PLA Silk">
          <textarea
            name="materials"
            defaultValue={defaults.materials}
            rows={5}
            className="textarea-field"
          />
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
          <textarea
            name="idealFor"
            defaultValue={defaults.idealFor}
            rows={5}
            className="textarea-field"
          />
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
