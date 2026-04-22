import type { Metadata } from "next";
import { AccountShell } from "@/components/account/account-shell";

export const metadata: Metadata = {
  title: "Login cont | ArteForma",
  description: "Direcție pentru autentificarea clientului ArteForma.",
  robots: { index: false, follow: false },
};

export default function AccountLoginPage() {
  return (
    <AccountShell
      eyebrow="Login"
      title="Autentificarea va porni de la email, nu de la un sistem complicat."
      description="Direcția recomandată este login pe email cu cod temporar sau magic link. Este suficient pentru un magazin ca ArteForma și se leagă curat de comenzi, status și istoricul clientului."
    >
      <div className="mt-8 surface-panel rounded-[2rem] p-6">
        <h2 className="font-serif-display text-2xl text-white">MVP recomandat</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-white/68">
          <li>Clientul introduce emailul folosit la comandă.</li>
          <li>Primește un cod de acces sau magic link.</li>
          <li>După autentificare, vede comenzile, statusul și datele salvate.</li>
        </ul>
      </div>
    </AccountShell>
  );
}
