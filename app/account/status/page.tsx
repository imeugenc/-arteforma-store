import type { Metadata } from "next";
import { AccountShell } from "@/components/account/account-shell";
import { StatusTimeline } from "@/components/orders/status-timeline";
import { getCustomerOrderStatus, getOrderDisplayReference, translateOrderStatus } from "@/lib/orders";
import { siteConfig } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Status comandă | ArteForma",
  description: "Verifică statusul unei comenzi ArteForma folosind referința publică și emailul folosit la checkout.",
  alternates: {
    canonical: `${siteConfig.url}/account/status`,
  },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Status comandă | ArteForma",
    description:
      "Pagină privată pentru verificarea statusului unei comenzi ArteForma pe baza referinței publice și a emailului.",
    url: `${siteConfig.url}/account/status`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 1200,
        alt: "ArteForma",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Status comandă | ArteForma",
    description:
      "Pagină privată pentru verificarea statusului unei comenzi ArteForma pe baza referinței publice și a emailului.",
    images: [siteConfig.defaultOgImage],
  },
};

export default async function AccountStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ identifier?: string; email?: string }>;
}) {
  const { identifier, email } = await searchParams;
  const result =
    identifier && email
      ? await getCustomerOrderStatus({ identifier, email })
      : null;

  return (
    <AccountShell
      eyebrow="Status comandă"
      title="Verifică în ce stadiu se află comanda ta."
      description="Introdu referința publică a comenzii și emailul folosit la checkout. Vei vedea statusul curent, produsele din comandă și istoricul actualizărilor disponibile."
    >
      <div className="mt-8 surface-panel rounded-[2rem] p-6">
        <form className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
          <label>
            <span className="mb-2 block text-[13px] font-medium text-white">Referință comandă</span>
            <input
              type="text"
              name="identifier"
              defaultValue={identifier ?? ""}
              placeholder="Ex: AF-1049"
              className="w-full rounded-[1.3rem] border border-white/10 bg-black/30 px-4 py-3 text-[14px] text-white outline-none placeholder:text-white/30"
            />
          </label>
          <label>
            <span className="mb-2 block text-[13px] font-medium text-white">Email</span>
            <input
              type="email"
              name="email"
              defaultValue={email ?? ""}
              placeholder="emailul folosit la comandă"
              className="w-full rounded-[1.3rem] border border-white/10 bg-black/30 px-4 py-3 text-[14px] text-white outline-none placeholder:text-white/30"
            />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[#d7a12a] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black"
            >
              Verifică
            </button>
          </div>
        </form>
      </div>

      {identifier && email && !result ? (
        <div className="mt-8 surface-panel rounded-[2rem] p-6 text-sm leading-7 text-white/68">
          Nu am găsit o comandă care să corespundă combinației dintre referință și email.
        </div>
      ) : null}

      {result ? (
        <div className="mt-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Info label="Referință comandă" value={getOrderDisplayReference(result.order)} />
            <Info label="Status curent" value={translateOrderStatus(result.order.status)} />
            <Info
              label="Creată la"
              value={new Date(result.order.created_at).toLocaleString("ro-RO")}
            />
            <Info label="Total" value={formatPrice(result.order.total_amount)} />
            <Info label="Monedă" value={result.order.currency} />
          </div>

          <div className="surface-panel rounded-[2rem] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d7a12a]">
              Produse din comandă
            </p>
            <div className="mt-4 grid gap-3">
              {result.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-[1.2rem] border border-white/6 bg-white/[0.02] px-4 py-3 text-sm text-white/68"
                >
                  <div>
                    <p className="text-white">{item.product_name}</p>
                    {item.variant_summary ? <p>{item.variant_summary}</p> : null}
                  </div>
                  <div className="text-right">
                    <p>{item.quantity}x</p>
                    <p>{formatPrice(item.line_total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel rounded-[2rem] p-6">
            <StatusTimeline activeStep={result.order.status} events={result.events} />
          </div>
        </div>
      ) : null}
    </AccountShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-panel rounded-[1.5rem] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/36">{label}</p>
      <p className="mt-3 text-sm text-white/78">{value}</p>
    </div>
  );
}
