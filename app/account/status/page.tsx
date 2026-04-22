import type { Metadata } from "next";
import { AccountShell } from "@/components/account/account-shell";
import { StatusTimeline } from "@/components/orders/status-timeline";

export const metadata: Metadata = {
  title: "Status comandă în cont | ArteForma",
  description: "Direcție pentru statusul comenzilor din contul clientului ArteForma.",
  robots: { index: false, follow: false },
};

export default function AccountStatusPage() {
  return (
    <AccountShell
      eyebrow="Status comandă"
      title="Statusul comenzilor va fi vizibil și în contul clientului."
      description="Structura de status există deja în proiect. Următorul pas este legarea fiecărei comenzi la clientul autentificat, astfel încât actualizările să poată fi văzute din cont fără intervenție manuală."
    >
      <div className="mt-8 surface-panel rounded-[2rem] p-6">
        <StatusTimeline activeStep="received" />
      </div>
    </AccountShell>
  );
}
