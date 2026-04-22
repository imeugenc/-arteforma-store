import { products } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import { buildInternalMetadata, requireInternalAccess } from "@/lib/internal";

export const metadata = buildInternalMetadata(
  "Catalog intern",
  "Vizualizare internă pentru administrarea catalogului ArteForma.",
  "/internal/products",
);

export default async function InternalProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  requireInternalAccess(token);

  return (
    <div>
      <h1 className="font-serif-display text-4xl text-white">Catalog produse</h1>
      <p className="mt-4 max-w-3xl text-white/65">
        În forma actuală, catalogul este administrat din cod. Pagina aceasta îți arată ce poți schimba imediat și care este următorul pas recomandat pentru un admin real.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="surface-panel rounded-[2rem] p-6">
          <h2 className="font-serif-display text-2xl text-white">Cum modifici acum</h2>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-white/68">
            <li>1. Deschizi fișierul `lib/catalog.ts`.</li>
            <li>2. Găsești produsul după `slug`.</li>
            <li>3. Modifici preț, descrieri, opțiuni și `featured` după nevoie.</li>
            <li>4. Dacă vrei să ascunzi un produs, setezi `enabled: false`.</li>
            <li>5. Dacă vrei altă imagine statică, adaugi asset-ul în `public/brand` sau `public/products` și actualizezi componenta care îl folosește.</li>
          </ol>
        </div>
        <div className="surface-panel rounded-[2rem] p-6">
          <h2 className="font-serif-display text-2xl text-white">Ce poți controla</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-white/68">
            <li>Preț</li>
            <li>Descriere scurtă și lungă</li>
            <li>Dimensiuni, culori și materiale</li>
            <li>Badge și featured</li>
            <li>Activ / inactiv prin `enabled`</li>
          </ul>
        </div>
        <div className="surface-panel rounded-[2rem] p-6">
          <h2 className="font-serif-display text-2xl text-white">Admin real: pasul următor</h2>
          <p className="mt-4 text-sm leading-7 text-white/68">
            Pentru un admin minim real, următorul pas bun este un tabel `products` în Supabase plus storage pentru imagini. Asta îți permite să editezi catalogul fără cod și să înlocuiești imagini direct dintr-o interfață simplă.
          </p>
          <p className="mt-4 text-sm leading-7 text-white/55">
            În pass-ul actual, am pregătit structura pentru conturi, media și un admin intern mai coerent, dar CRUD-ul complet pentru produse nu este încă activ.
          </p>
          <p className="mt-4 text-sm leading-7 text-white/55">
            Schema pregătită pentru următorul pas este în `supabase/store-admin.sql`.
          </p>
        </div>
      </div>

      <div className="surface-panel mt-8 overflow-hidden rounded-[2rem]">
        <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr] gap-4 border-b border-white/8 px-6 py-4 text-xs uppercase tracking-[0.3em] text-white/38">
          <span>Produs</span>
          <span>Categorie</span>
          <span>Preț</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-white/8">
          {products.map((product) => (
            <div
              key={product.slug}
              className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr] gap-4 px-6 py-4 text-sm text-white/68"
            >
              <div>
                <p className="text-white">{product.name}</p>
                <p className="mt-1 text-xs text-white/40">{product.slug}</p>
              </div>
              <span>{product.category}</span>
              <span>{formatPrice(product.price)}</span>
              <span>{product.enabled === false ? "Inactiv" : "Activ"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
