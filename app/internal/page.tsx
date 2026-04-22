import Link from "next/link";
import { requireInternalAccess, buildInternalMetadata } from "@/lib/internal";
import { env, isProduction } from "@/lib/env";

export const metadata = buildInternalMetadata(
  "Dashboard intern",
  "Dashboard intern ArteForma pentru operațiuni și administrare.",
  "/internal",
);

export default async function InternalDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  await requireInternalAccess(token, "/internal");

  const accessHint =
    isProduction && env.INTERNAL_ORDERS_TOKEN
      ? `?token=${token ?? "INTERNAL_ORDERS_TOKEN"}`
      : "";

  return (
    <div className="grid gap-6">
      <div className="surface-panel-strong rounded-[2.4rem] p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7a12a]">ArteForma Internal</p>
        <h1 className="mt-5 font-serif-display text-4xl text-white">Dashboard intern</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-white/68">
          Acesta este punctul central pentru operațiuni. În forma actuală, zona internă este încă lightweight, dar este deja pregătită pentru comenzi, produse, media și pașii următori de admin real.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardCard
          title="Comenzi"
          body="Vezi comenzile plătite, datele clientului și liniile din comandă. Potrivit pentru verificare rapidă după checkout și producție."
          href={`/internal/orders${accessHint}`}
        />
        <DashboardCard
          title="Produse"
          body="Vezi catalogul activ, statusul produselor și direcția de trecere de la administrare în cod la un admin real, cu produse și opțiuni editabile."
          href={`/internal/products${accessHint}`}
        />
        <DashboardCard
          title="Media"
          body="Găsești aici direcția pentru imagini, optimizare, compresie, storage și felul în care ar trebui pregătit upload-ul pentru viitorul admin."
          href={`/internal/media${accessHint}`}
        />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link href={href} className="surface-panel rounded-[2rem] p-6 transition hover:border-[#d7a12a]/24">
      <h2 className="font-serif-display text-2xl text-white">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-white/68">{body}</p>
    </Link>
  );
}
