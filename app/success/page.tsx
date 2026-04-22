import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SuccessEffects } from "@/components/checkout/success-effects";
import { StatusTimeline } from "@/components/orders/status-timeline";
import { getCheckoutSessionSnapshot, getOrderBySessionId } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Comandă confirmată",
  description:
    "Pagina de confirmare ArteForma cu pașii următori pentru producție și livrare în România.",
  path: "/success",
});

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; demo?: string }>;
}) {
  const { session_id: sessionId, demo } = await searchParams;
  if (!sessionId && !demo) {
    redirect("/shop");
  }

  const persistedOrder = sessionId ? await getOrderBySessionId(sessionId) : null;
  const orderBundle =
    persistedOrder ?? (sessionId ? await getCheckoutSessionSnapshot(sessionId) : null);
  const hasGiftPackaging =
    orderBundle?.items.some((item) => item.product_name === "Ambalare premium") ?? false;
  const hasPersonalization =
    orderBundle?.items.some(
      (item) =>
        "variant_summary" in item &&
        typeof item.variant_summary === "string" &&
        item.variant_summary.includes("Personalizare"),
    ) ?? false;
  const freeShippingApplied = orderBundle?.order.shipping_method === "Livrare gratuită România";

  return (
    <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
      <SuccessEffects
        orderId={orderBundle?.order.id}
        totalAmount={orderBundle?.order.total_amount}
        sessionId={sessionId}
      />

      <div className="surface-panel-strong rounded-[2.5rem] p-8 text-center lg:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7a12a]">
          Comandă confirmată
        </p>
        <h1 className="mt-6 font-serif-display text-5xl text-white">
          {demo ? "Simulare de checkout finalizată." : "Comanda ta a fost confirmată."}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/68">
          {demo
            ? "Stripe nu este configurat în mediul local, așa că vezi o simulare a paginii de confirmare."
            : "Plata a fost înregistrată cu succes. Comanda intră acum în fluxul ArteForma, iar piesele sunt pregătite în 2–5 zile lucrătoare, în funcție de complexitate."}
        </p>

        {orderBundle ? (
          <div className="mx-auto mt-10 grid max-w-3xl gap-6 text-left lg:grid-cols-[0.95fr_1.05fr]">
            <div className="surface-panel rounded-[2rem] p-6">
              <h2 className="font-serif-display text-2xl text-white">Rezumat comandă</h2>
              <div className="mt-5 space-y-3 text-sm text-white/68">
                <Row label="ID comandă" value={orderBundle.order.id.slice(0, 8).toUpperCase()} />
                <Row label="Client" value={orderBundle.order.customer_name} />
                <Row label="Email" value={orderBundle.order.customer_email} />
                <Row label="Total" value={formatPrice(orderBundle.order.total_amount)} />
                <Row label="Status" value={translateOrderStatus(orderBundle.order.status)} />
              </div>
            </div>
            <div className="surface-panel rounded-[2rem] p-6">
              <h2 className="font-serif-display text-2xl text-white">Ce urmează</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-white/68">
                <li>{siteConfig.shippingNote}</li>
                <li>{freeShippingApplied ? "Livrare gratuită activă pentru această comandă." : "Livrare în toată România."}</li>
                {hasGiftPackaging ? <li>Ambalarea premium a fost inclusă în comandă.</li> : null}
                {hasPersonalization ? <li>Opțiunea de personalizare a fost inclusă în detaliile comenzii.</li> : null}
                <li>
                  Dacă vrei să adaugi un detaliu important comenzii, scrie-ne la {siteConfig.email}.
                </li>
              </ul>
              <div className="mt-6 space-y-2 text-sm text-white/60">
                {orderBundle.items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4">
                    <span>{item.product_name}</span>
                    <span>{item.quantity}x</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {!orderBundle && !demo ? (
          <div className="mx-auto mt-10 max-w-2xl rounded-[2rem] border border-white/8 bg-white/[0.03] p-6 text-left text-sm leading-7 text-white/64">
            Confirmarea plății a fost înregistrată, dar detaliile comenzii încă se sincronizează. Dacă nu apar în câteva momente, scrie-ne la {siteConfig.email} și verificăm imediat.
          </div>
        ) : null}

        {!demo ? (
          <div className="mt-10 text-left">
            <div className="mb-6 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d7a12a]">
                Status comandă
              </p>
              <h2 className="mt-3 font-serif-display text-3xl text-white">
                Etapele următoare sunt deja pregătite în fluxul nostru
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/62">
                Următorul pas este să legăm aceste actualizări și de zona de cont client. Până atunci, poți cere actualizări direct pe email.
              </p>
            </div>
            <StatusTimeline activeStep="received" compact />
          </div>
        ) : null}

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/shop">
            <Button>Înapoi în magazin</Button>
          </Link>
          <Link href="/custom-orders">
            <Button variant="secondary">Creează o piesă personalizată</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function translateOrderStatus(status: string) {
  switch (status) {
    case "paid":
      return "Plătită";
    case "processing":
      return "În procesare";
    case "fulfilled":
      return "Finalizată";
    case "cancelled":
      return "Anulată";
    default:
      return status;
  }
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span>{label}</span>
      <span className="text-right text-white">{value}</span>
    </div>
  );
}
