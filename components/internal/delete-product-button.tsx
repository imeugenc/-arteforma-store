"use client";

export function DeleteProductButton({ productName }: { productName: string }) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        const confirmed = window.confirm(
          `Sigur vrei să ștergi produsul „${productName}”? Acțiunea elimină și imaginile asociate.`,
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
      className="inline-flex items-center justify-center rounded-full border border-red-300/35 bg-red-400/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-red-100"
    >
      Șterge produsul
    </button>
  );
}
