import { SectionHeading } from "@/components/ui/section-heading";
import { StatusTimeline } from "@/components/orders/status-timeline";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Status comandă",
  description:
    "Structura etapelor prin care trece o comandă ArteForma, de la confirmare până la expediere.",
  path: "/order-status",
});

export default function OrderStatusPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Status comandă"
        title="Etapele prin care trece o comandă ArteForma"
        description="Lucrăm la legarea acestei zone cu viitorul cont client. Până atunci, poți cere actualizări direct pe email, iar structura de mai jos este deja pregătită pentru fluxul viitor."
      />
      <div className="mt-10">
        <StatusTimeline activeStep="printing" />
      </div>
    </div>
  );
}
