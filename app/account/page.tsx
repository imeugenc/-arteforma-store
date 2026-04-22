import type { Metadata } from "next";
import { AccountShell } from "@/components/account/account-shell";
import { accountSteps } from "@/lib/account";

export const metadata: Metadata = {
  title: "Contul meu | ArteForma",
  description: "Direcția de cont client pentru comenzi, status și autentificare ArteForma.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <AccountShell
      eyebrow="Contul meu"
      title="Zona de cont client este pregătită ca direcție, dar nu este încă activată complet."
      description="Pasul recomandat pentru activare este un login simplu pe email, fără complicații inutile. Asta va permite legarea comenzilor la client, istoricul de comenzi și vizualizarea statusului într-o zonă clară."
    >
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="surface-panel rounded-[2rem] p-6">
          <h2 className="font-serif-display text-2xl text-white">Cum va funcționa</h2>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-white/68">
            {accountSteps.map((step, index) => (
              <li key={step}>
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="surface-panel rounded-[2rem] p-6">
          <h2 className="font-serif-display text-2xl text-white">Ce există deja în proiect</h2>
          <p className="mt-4 text-sm leading-7 text-white/68">
            Structura de comenzi și status există deja la nivel de date și UI. În acest pass am pregătit și rutele customer-facing pentru login, cont, comenzi și status, astfel încât următorul pas să fie conectarea la autentificare, nu redesign-ul.
          </p>
        </div>
      </div>
    </AccountShell>
  );
}
