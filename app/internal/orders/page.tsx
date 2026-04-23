import { buildInternalMetadata, requireInternalAccess } from "@/lib/internal";
import {
  ADMIN_ORDER_STATUSES,
  getOrderDisplayReference,
  getRecentOrdersFiltered,
  translateOrderStatus,
} from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

export const metadata = buildInternalMetadata(
  "Comenzi interne",
  "Vizualizare internă ArteForma pentru comenzile plătite recent.",
  "/internal/orders",
);

export default async function InternalOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
    status?: string;
    email?: string;
    updated?: string;
    error?: string;
  }>;
}) {
  const { token, status, email, updated, error } = await searchParams;
  await requireInternalAccess(token, "/internal/orders");

  const bundle = await getRecentOrdersFiltered({
    limit: 40,
    status,
    email,
  });

  return (
    <div className="space-y-8">
      <div className="surface-panel-strong rounded-[2.4rem] p-8 lg:p-10">
        <h1 className="font-serif-display text-[2.1rem] text-white lg:text-[2.7rem]">
          Comenzi interne
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-white/68 sm:text-[15px]">
          Vizualizare internă pentru comenzile plătite, statusul lor și istoricul de actualizări.
        </p>

        <form className="mt-8 grid gap-4 lg:grid-cols-[1fr_220px_auto]">
          <label>
            <span className="mb-2 block text-[13px] font-medium text-white">Filtru după email</span>
            <input
              type="text"
              name="email"
              defaultValue={email ?? ""}
              placeholder="client@email.com"
              className="w-full rounded-[1.3rem] border border-white/10 bg-black/30 px-4 py-3 text-[14px] text-white outline-none placeholder:text-white/30"
            />
          </label>
          <label>
            <span className="mb-2 block text-[13px] font-medium text-white">Filtru după status</span>
            <select
              name="status"
              defaultValue={status ?? ""}
              className="w-full rounded-[1.3rem] border border-white/10 bg-black/30 px-4 py-3 text-[14px] text-white outline-none"
            >
              <option value="">Toate</option>
              {ADMIN_ORDER_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[#d7a12a] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black"
            >
              Filtrează
            </button>
          </div>
        </form>

        {updated ? <p className="mt-4 text-sm text-[#f2dfaf]">Status actualizat.</p> : null}
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      </div>

      {!bundle ? (
        <div className="surface-panel rounded-[2rem] p-6 text-white/65">
          Supabase nu este configurat, așa că comenzile plătite nu pot fi afișate încă.
        </div>
      ) : (
        <div className="space-y-6">
          {bundle.orders.map((order) => {
            const items = bundle.items.filter((item) => item.order_id === order.id);
            const events = bundle.events.filter((event) => event.order_id === order.id);

            return (
              <div key={order.id} className="surface-panel rounded-[2rem] p-6">
                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <Info label="Referință comandă" value={getOrderDisplayReference(order)} />
                      <Info
                        label="Creată la"
                        value={new Date(order.created_at).toLocaleString("ro-RO")}
                      />
                      <Info label="Email client" value={order.customer_email} />
                      <Info label="Total" value={formatPrice(order.total_amount)} />
                      <Info label="Monedă" value={order.currency} />
                      <Info label="Status" value={translateOrderStatus(order.status)} />
                      <Info label="Payment status" value={order.payment_status ?? "—"} />
                      <Info label="Stripe session" value={order.stripe_session_id ?? "—"} />
                    </div>

                    <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d7a12a]">
                        Produse
                      </p>
                      <div className="mt-4 grid gap-3">
                        {items.map((item) => (
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
                  </div>

                  <div className="space-y-5">
                    <form action="/api/internal-orders/status" method="POST" className="rounded-[1.5rem] border border-white/8 bg-black/20 p-4">
                      <input type="hidden" name="orderId" value={order.id} />
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d7a12a]">
                        Actualizare status
                      </p>
                      <label className="mt-4 block">
                        <span className="mb-2 block text-[13px] font-medium text-white">Status nou</span>
                        <select
                          name="status"
                          defaultValue={order.status}
                          className="w-full rounded-[1.3rem] border border-white/10 bg-black/30 px-4 py-3 text-[14px] text-white outline-none"
                        >
                          {ADMIN_ORDER_STATUSES.map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="mt-4 block">
                        <span className="mb-2 block text-[13px] font-medium text-white">Notă</span>
                        <textarea
                          name="note"
                          rows={3}
                          className="w-full rounded-[1.3rem] border border-white/10 bg-black/30 px-4 py-3 text-[14px] text-white outline-none placeholder:text-white/30"
                          placeholder="Exemplu: predată în producție, AWB emis sau finalizată."
                        />
                      </label>
                      <button
                        type="submit"
                        className="mt-4 inline-flex items-center justify-center rounded-full bg-[#d7a12a] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black"
                      >
                        Salvează status
                      </button>
                    </form>

                    <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d7a12a]">
                        Istoric status
                      </p>
                      <div className="mt-4 space-y-3">
                        {events.length ? (
                          events.map((event) => (
                            <div
                              key={event.id}
                              className="rounded-[1.2rem] border border-white/6 bg-white/[0.02] px-4 py-3 text-sm text-white/68"
                            >
                              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <p className="font-medium text-white">{translateOrderStatus(event.status)}</p>
                                <p className="text-white/40">
                                  {new Date(event.created_at).toLocaleString("ro-RO")}
                                </p>
                              </div>
                              {event.note ? <p className="mt-2">{event.note}</p> : null}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-white/45">Nu există încă istoric de status pentru această comandă.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-white/6 bg-black/20 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/36">{label}</p>
      <p className="mt-2 break-all text-sm text-white/78">{value}</p>
    </div>
  );
}
