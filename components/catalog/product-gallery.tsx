"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { Product, ProductMediaRecord } from "@/lib/types";
import { ProductVisual } from "@/components/ui/product-visual";
import { cn } from "@/lib/utils";

type GalleryItem =
  | {
      type: "image";
      id: string;
      src: string;
      alt: string;
    }
  | {
      type: "visual";
      id: string;
      motif: string;
      label: string;
    };

export function ProductGallery({
  productName,
  media,
  visual,
  badge,
}: {
  productName: string;
  media: ProductMediaRecord[];
  visual: Product["visual"];
  badge?: string;
}) {
  const items = useMemo<GalleryItem[]>(() => {
    if (media.length) {
      const mediaItems = media
        .filter((item) => item.public_url)
        .map((item) => ({
          type: "image",
          id: item.id,
          src: item.public_url ?? "",
          alt: item.alt_text ?? productName,
        }) satisfies GalleryItem);

      if (mediaItems.length) {
        return mediaItems;
      }
    }

    return [
      { type: "visual", id: "fallback-main", motif: visual.motif, label: badge ?? "ArteForma" },
      { type: "visual", id: "fallback-detail", motif: `${visual.motif}-1`, label: "Detaliu" },
      { type: "visual", id: "fallback-context", motif: `${visual.motif}-2`, label: "Ambient" },
    ];
  }, [badge, media, productName, visual.motif]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const didSwipeRef = useRef(false);
  const activeItem = items[activeIndex] ?? items[0];

  const goTo = useCallback((nextIndex: number) => {
    if (!items.length) {
      return;
    }

    setActiveIndex((nextIndex + items.length) % items.length);
  }, [items.length]);

  const handleSwipeEnd = (clientX: number) => {
    if (touchStart === null) {
      return;
    }

    const distance = touchStart - clientX;

    if (Math.abs(distance) > 42) {
      didSwipeRef.current = true;
      goTo(activeIndex + (distance > 0 ? 1 : -1));
    }

    setTouchStart(null);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }

      if (event.key === "ArrowRight") {
        goTo(activeIndex + 1);
      }

      if (event.key === "ArrowLeft") {
        goTo(activeIndex - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, goTo, isOpen]);

  if (!items.length || !activeItem) {
    return null;
  }

  return (
    <>
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => {
            if (didSwipeRef.current) {
              didSwipeRef.current = false;
              return;
            }

            setIsOpen(true);
          }}
          onTouchStart={(event) => {
            didSwipeRef.current = false;
            setTouchStart(event.touches[0]?.clientX ?? null);
          }}
          onTouchEnd={(event) => handleSwipeEnd(event.changedTouches[0]?.clientX ?? 0)}
          className="group relative block w-full overflow-hidden rounded-[1.75rem] border border-white/8 bg-black/20 text-left md:rounded-[2rem]"
          aria-label="Deschide galeria fullscreen"
        >
          <GalleryFrame item={activeItem} visual={visual} priority />
          <span className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white/82 backdrop-blur transition group-hover:border-[#d7a12a]/40 group-hover:text-[#f2dfaf]">
            <Maximize2 className="h-4 w-4" />
          </span>
          {items.length > 1 ? (
            <span className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-xs font-medium text-white/78 backdrop-blur">
              {activeIndex + 1} / {items.length}
            </span>
          ) : null}
        </button>

        {items.length > 1 ? (
          <>
            <div className="flex items-center justify-center gap-2 md:hidden">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(index)}
                  className={cn(
                    "h-2 rounded-full transition",
                    index === activeIndex ? "w-7 bg-[#d7a12a]" : "w-2 bg-white/22",
                  )}
                  aria-label={`Afișează imaginea ${index + 1}`}
                />
              ))}
            </div>

            <div className="hidden grid-cols-4 gap-3 md:grid xl:grid-cols-5">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(index)}
                  className={cn(
                    "overflow-hidden rounded-[1.25rem] border bg-black/20 transition",
                    index === activeIndex
                      ? "border-[#d7a12a]/70 opacity-100"
                      : "border-white/8 opacity-62 hover:border-white/20 hover:opacity-100",
                  )}
                  aria-label={`Afișează imaginea ${index + 1}`}
                >
                  <GalleryFrame item={item} visual={visual} thumbnail />
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/92 px-4 py-5 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Galerie produs"
          onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)}
          onTouchEnd={(event) => handleSwipeEnd(event.changedTouches[0]?.clientX ?? 0)}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition hover:border-[#d7a12a]/45 hover:text-[#f2dfaf]"
            aria-label="Închide galeria"
          >
            <X className="h-5 w-5" />
          </button>

          {items.length > 1 ? (
            <>
              <ModalArrow direction="previous" onClick={() => goTo(activeIndex - 1)} />
              <ModalArrow direction="next" onClick={() => goTo(activeIndex + 1)} />
            </>
          ) : null}

          <div className="w-full max-w-6xl">
            <div className="mx-auto max-h-[82vh] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30">
              <GalleryFrame item={activeItem} visual={visual} modal />
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-white/72">
              <span>{activeIndex + 1} / {items.length}</span>
              <span className="h-1 w-1 rounded-full bg-white/24" />
              <span>{productName}</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function GalleryFrame({
  item,
  visual,
  priority,
  thumbnail,
  modal,
}: {
  item: GalleryItem;
  visual: Product["visual"];
  priority?: boolean;
  thumbnail?: boolean;
  modal?: boolean;
}) {
  if (item.type === "image") {
    return (
      <Image
        src={item.src}
        alt={item.alt}
        width={modal ? 1800 : thumbnail ? 360 : 1400}
        height={modal ? 1800 : thumbnail ? 360 : 1400}
        sizes={modal ? "100vw" : thumbnail ? "20vw" : "(min-width: 1024px) 50vw, 100vw"}
        priority={priority}
        className={cn(
          "w-full object-cover",
          modal ? "max-h-[82vh] object-contain" : thumbnail ? "aspect-square" : "aspect-square",
        )}
      />
    );
  }

  return (
    <ProductVisual
      accent={visual.accent}
      glow={visual.glow}
      motif={item.motif}
      label={item.label}
      className={cn(
        "rounded-none border-0",
        modal ? "min-h-[78vh]" : thumbnail ? "min-h-[120px]" : "min-h-[380px] md:min-h-[560px]",
      )}
    />
  );
}

function ModalArrow({
  direction,
  onClick,
}: {
  direction: "previous" | "next";
  onClick: () => void;
}) {
  const isPrevious = direction === "previous";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition hover:border-[#d7a12a]/45 hover:text-[#f2dfaf] sm:inline-flex",
        isPrevious ? "left-5" : "right-5",
      )}
      aria-label={isPrevious ? "Imaginea anterioară" : "Imaginea următoare"}
    >
      {isPrevious ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );
}
