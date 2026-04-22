import { orderStatusSteps } from "@/lib/order-status";

export function StatusTimeline({
  activeStep = "received",
  compact = false,
}: {
  activeStep?: string;
  compact?: boolean;
}) {
  const activeIndex = orderStatusSteps.findIndex((step) => step.key === activeStep);

  return (
    <div className={`grid gap-4 ${compact ? "md:grid-cols-3" : "lg:grid-cols-3"}`}>
      {orderStatusSteps.map((step, index) => {
        const isActive = index <= (activeIndex === -1 ? 1 : activeIndex);

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
  );
}
