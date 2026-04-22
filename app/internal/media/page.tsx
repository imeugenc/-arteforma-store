import { requireInternalAccess, buildInternalMetadata } from "@/lib/internal";

export const metadata = buildInternalMetadata(
  "Media intern",
  "Direcție internă ArteForma pentru media, imagini și storage.",
  "/internal/media",
);

const mediaRules = [
  {
    title: "Format recomandat",
    body:
      "Pentru majoritatea produselor, imaginile finale ar trebui pregătite în format JPEG sau WebP, la rezoluție suficientă pentru desktop și mobil, dar fără fișiere brute foarte grele.",
  },
  {
    title: "Dimensiuni și compresie",
    body:
      "Înainte de upload, imaginile ar trebui redimensionate și comprimate. 1600–2200 px pe latura mare este suficient pentru listare, produs și zoom vizual ușor, fără să consume inutil storage sau bandwidth.",
  },
  {
    title: "Storage practic",
    body:
      "Direcția bună pentru următorul pas este Supabase Storage, cu foldere separate pentru produse, hero și materiale de brand. Adminul ar încărca versiuni deja optimizate, nu fișiere brute direct din cameră.",
  },
];

export default async function InternalMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  requireInternalAccess(token);

  return (
    <div className="grid gap-6">
      <div className="surface-panel-strong rounded-[2.4rem] p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7a12a]">Media și storage</p>
        <h1 className="mt-5 font-serif-display text-4xl text-white">Cum gestionăm imaginile ArteForma</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-white/68">
          Pentru un magazin mic, premium și rapid, cheia nu este să încărcăm multe fișiere brute, ci să păstrăm un flux simplu: imagini optimizate înainte de upload, storage clar organizat și un admin care știe ce variantă este live.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {mediaRules.map((rule) => (
          <div key={rule.title} className="surface-panel rounded-[2rem] p-6">
            <h2 className="font-serif-display text-2xl text-white">{rule.title}</h2>
            <p className="mt-4 text-sm leading-7 text-white/68">{rule.body}</p>
          </div>
        ))}
      </div>

      <div className="surface-panel rounded-[2rem] p-6">
        <h2 className="font-serif-display text-2xl text-white">Flux recomandat pentru pasul următor</h2>
        <ol className="mt-4 space-y-3 text-sm leading-7 text-white/68">
          <li>1. Imaginea este pregătită local: crop, lumină, compresie și dimensiune finală.</li>
          <li>2. Upload în storage, separat pe produs și tip de imagine.</li>
          <li>3. Adminul salvează URL-ul imaginii în catalogul produsului.</li>
          <li>4. Varianta veche poate fi arhivată sau înlocuită controlat, fără dubluri inutile.</li>
        </ol>
      </div>
    </div>
  );
}
