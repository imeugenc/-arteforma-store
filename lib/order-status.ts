export const orderStatusSteps = [
  {
    key: "paid",
    label: "Plătită",
    description: "Plata a fost confirmată, iar comanda a intrat în sistem.",
  },
  {
    key: "in_production",
    label: "În producție",
    description: "Piesa este în lucru și trece prin etapele de producție și finisaj.",
  },
  {
    key: "shipped",
    label: "Expediată",
    description: "Comanda a plecat către client.",
  },
  {
    key: "completed",
    label: "Finalizată",
    description: "Comanda a fost închisă cu succes.",
  },
  {
    key: "cancelled",
    label: "Anulată",
    description: "Comanda a fost anulată.",
  },
] as const;

export type OrderStatusStep = (typeof orderStatusSteps)[number]["key"];
