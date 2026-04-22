export const orderStatusSteps = [
  {
    key: "placed",
    label: "Plasată",
    description: "Comanda a fost trimisă și confirmată.",
  },
  {
    key: "received",
    label: "Primită",
    description: "Detaliile au fost verificate și comanda a intrat în lucru.",
  },
  {
    key: "printing",
    label: "Se produce",
    description: "Piesa este în etapa de printare și verificare.",
  },
  {
    key: "hand-finished",
    label: "Se lucrează manual",
    description: "Finisajele și ajustările finale sunt în curs.",
  },
  {
    key: "packed",
    label: "Împachetată",
    description: "Produsul este pregătit pentru expediere.",
  },
  {
    key: "shipped",
    label: "Expediată",
    description: "Comanda a plecat către client.",
  },
] as const;

export type OrderStatusStep = (typeof orderStatusSteps)[number]["key"];
