import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
      <h1 className="font-serif-display text-5xl text-white">Pagina aceasta nu există.</h1>
      <p className="mt-5 text-white/65">Încearcă magazinul, pagina principală sau pornește o comandă custom.</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/">
          <Button>Acasă</Button>
        </Link>
        <Link href="/shop">
          <Button variant="secondary">Deschide magazinul</Button>
        </Link>
      </div>
    </div>
  );
}
