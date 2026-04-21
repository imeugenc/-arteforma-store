import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CancelPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7a12a]">Checkout anulat</p>
      <h1 className="mt-6 font-serif-display text-5xl text-white">Comanda ta încă te așteaptă.</h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/68">
        Nu a fost retrasă nicio sumă. Dacă vrei mai multă claritate înainte să cumperi, scrie-ne sau trimite o cerere custom.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/cart">
          <Button>Înapoi în coș</Button>
        </Link>
        <Link href="/contact">
          <Button variant="secondary">Pune o întrebare</Button>
        </Link>
      </div>
    </div>
  );
}
