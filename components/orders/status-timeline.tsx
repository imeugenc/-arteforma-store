import { orderStatusSteps } from "@/lib/order-status";
import { translateOrderStatus } from "@/lib/orders";
import type { OrderStatusEventRecord } from "@/lib/types";

export function StatusTimeline({
  activeStep = "paid",
  compact = false,
  events = [],
}: {
  activeStep?: string;
  compact?: boolean;
  events?: OrderStatusEventRecord[];
}) {
  const activeIndex = orderStatusSteps.findIndex((step) => step.key === activeStep);

  return (
    <div className="space-y-5">
      <div className={`grid gap-4 ${compact ? "md:grid-cols-3" : "lg:grid-cols-3"}`}>
        {orderStatusSteps.map((step, index) => {
          const isCancelled = activeStep === "cancelled";
          const isActive = isCancelled ? step.key === "cancelled" : index <= (activeIndex === -1 ? 0 : activeIndex);

          return (
            <div
              key={step.key}
              className={`rounded-[1.75rem] border p-5 ${
                isActive
                  ? "border-[#d7a12a]/30 bg-[#d7a12a]/8"
                  : "border-white/8 bg-white/[0.03]"
              }`}
            >
              <p
                className={`text-[11px] font-semibold uppercase tracking-[0.32em] ${
                  isActive ? "text-[#f2dfaf]" : "text-white/36"
                }`}
              >
                Etapă {index + 1}
              </p>
              <h3 className="mt-3 font-serif-display text-2xl text-white">{step.label}</h3>
              <p className="mt-3 text-sm leading-7 text-white/64">{step.description}</p>
            </div>
          );
        })}
      </div>

      {events.length ? (
        <div className="rounded-[1.75rem] border border-white/8 bg-black/20 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#d7a12a]">
            Istoric status
          </p>
          <div className="mt-4 space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-1 rounded-[1.2rem] border border-white/6 bg-white/[0.02] px-4 py-3 text-sm text-white/68"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-medium text-white">{translateOrderStatus(event.status)}</p>
                  <p className="text-white/40">
                    {new Date(event.created_at).toLocaleString("ro-RO")}
                  </p>
                </div>
                {event.note ? <p>{event.note}</p> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
