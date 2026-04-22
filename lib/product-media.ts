import type { ProductMediaRecord } from "@/lib/types";

export function getPrimaryProductMedia(media?: ProductMediaRecord[] | null) {
  if (!media?.length) {
    return null;
  }

  return [...media].sort((left, right) => {
    if (left.kind === "cover" && right.kind !== "cover") {
      return -1;
    }

    if (right.kind === "cover" && left.kind !== "cover") {
      return 1;
    }

    return left.sort_order - right.sort_order;
  })[0];
}
