import type { Metadata } from "next";
import { AccountShell } from "@/components/account/account-shell";

export const metadata: Metadata = {
  title: "Comenzile mele | ArteForma",
  description: "Direcție pentru istoricul de comenzi din contul clientului ArteForma.",
  robots: { index: false, follow: false },
};

export default function AccountOrdersPage() {
  return (
    <AccountShell
      eyebrow="Comenzile mele"
      title="Istoricul de comenzi va fi centralizat aici."
      description="În loc de email-uri separate și verificări manuale, clientul va putea vedea aici comenzile asociate contului său, totalul plătit și stadiul fiecărei piese."
    >
      <div className="mt-8 surface-panel rounded-[2rem] p-6">
        <h2 className="font-serif-display text-2xl text-white">Ce va conține această zonă</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-white/68">
          <li>Referință comandă și data plasării</li>
          <li>Produsele comandate și opțiunile selectate</li>
          <li>Statusul comenzii și actualizările relevante</li>
          <li>Datele de contact și detaliile de livrare de bază</li>
        </ul>
      </div>
    </AccountShell>
  );
}
