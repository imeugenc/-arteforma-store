import { Suspense } from "react";
import { buildInternalMetadata } from "@/lib/internal";
import { InternalNav } from "@/components/internal/internal-nav";

export const metadata = buildInternalMetadata(
  "ArteForma Internal",
  "Zonă internă ArteForma pentru administrare și operațiuni.",
  "/internal",
);

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div className="mb-6 rounded-[1.75rem] border border-[#d7a12a]/14 bg-[#d7a12a]/6 px-5 py-4 text-sm text-white/65">
        Zonă internă ArteForma. Nu este destinată clienților și nu este indexată.
      </div>
      <Suspense fallback={null}>
        <InternalNav />
      </Suspense>
      {children}
    </div>
  );
}
