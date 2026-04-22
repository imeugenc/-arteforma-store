import { getRecentOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { buildInternalMetadata, requireInternalAccess } from "@/lib/internal";

export const metadata = buildInternalMetadata(
  "Comenzi interne",
  "Vizualizare internă ArteForma pentru comenzile plătite recent.",
  "/internal/orders",
);

export default async function InternalOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  await requireInternalAccess(token, "/internal/orders");

  const bundle = await getRecentOrders(25);

  return (
    <div>
      <h1 className="font-serif-display text-4xl text-white">Comenzi recente</h1>
      <p className="mt-4 text-white/65">
        Vizualizare internă simplă pentru comenzile de produse plătite și stocate după un checkout Stripe reușit.
      </p>

      {!bundle ? (
        <div className="surface-panel mt-8 rounded-[2rem] p-6 text-white/65">
          Supabase nu este configurat, așa că comenzile plătite nu pot fi afișate încă.
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {bundle.orders.map((order) => {
            const items = bundle.items.filter((item) => item.order_id === order.id);

            return (
              <div key={order.id} className="surface-panel rounded-[2rem] p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="font-serif-display text-2xl text-white">
                      {order.customer_name}
                    </h2>
                    <p className="mt-2 text-sm text-white/55">{order.customer_email}</p>
                    {order.customer_phone ? (
                      <p className="text-sm text-white/55">{order.customer_phone}</p>
                    ) : null}
                  </div>
                  <div className="text-sm text-white/60">
                    <p>Status: {order.status}</p>
                    <p>Total: {formatPrice(order.total_amount)}</p>
                    <p>Sesiune: {order.stripe_session_id}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 rounded-[1.5rem] border border-white/8 bg-black/20 p-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-4 text-sm text-white/68">
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
            );
          })}
        </div>
      )}
    </div>
  );
}
