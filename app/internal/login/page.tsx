import type { Metadata } from "next";
import { buildInternalMetadata } from "@/lib/internal";

export const metadata: Metadata = buildInternalMetadata(
  "Login intern | ArteForma",
  "Acces intern protejat pentru administrarea ArteForma.",
  "/internal/login",
);

export default async function InternalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const redirectTo = next?.startsWith("/internal") ? next : "/internal";

  return (
    <div className="mx-auto max-w-xl px-5 py-16 sm:px-8">
      <div className="surface-panel-strong rounded-[2.4rem] p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d7a12a]">ArteForma Internal</p>
        <h1 className="mt-5 font-serif-display text-[2.1rem] text-white lg:text-[2.7rem]">
          Acces intern
        </h1>
        <p className="mt-4 text-sm leading-8 text-white/68 sm:text-[15px]">
          Zona internă este protejată prin token-ul din environment. După autentificare, accesul rămâne activ în browser pentru operațiunile curente.
        </p>

        <form action="/api/internal-login" method="POST" className="mt-8 grid gap-4">
          <input type="hidden" name="next" value={redirectTo} />
          <label>
            <span className="mb-2 block text-[13px] font-medium text-white">Token intern</span>
            <input
              type="password"
              name="token"
              required
              className="w-full rounded-[1.5rem] border border-white/10 bg-black/30 px-4 py-3 text-[14px] text-white outline-none transition placeholder:text-white/30 focus:border-[#d7a12a]/40"
              placeholder="INTERNAL_ORDERS_TOKEN"
            />
          </label>

          {error ? <p className="text-sm text-red-300">Token invalid. Încearcă din nou.</p> : null}

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-[#d7a12a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#e2b448]"
          >
            Intră în zona internă
          </button>
        </form>
      </div>
    </div>
  );
}
