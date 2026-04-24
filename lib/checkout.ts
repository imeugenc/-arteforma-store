import { CartItem } from "@/lib/types";
import { siteConfig } from "@/lib/site";

export function getSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getPersonalizationTotal(items: CartItem[]) {
  return items.reduce(
    (total, item) =>
      total +
      (item.personalizationSelected ? siteConfig.personalizationPrice * item.quantity : 0),
    0,
  );
}

export function getShipping(items: CartItem[]) {
  return getShippingQuote(items).cost;
}

export function getShippingQuote(items: CartItem[]) {
  if (!items.length) {
    return {
      cost: 0,
      method: "Coș gol",
      freeShippingReached: false,
      remainingForFreeShipping: siteConfig.freeShippingThreshold,
      hasPickupOnly: false,
      hasSpecialShipping: false,
      notes: [] as string[],
    };
  }

  const subtotal = getSubtotal(items);
  const hasPickupOnly = items.some((item) => item.shippingSettings?.pickupOnly);
  const hasSpecialShipping = items.some((item) => item.shippingSettings?.oversizedOrSpecialShipping);
  const standardShippingEnabled = items.every(
    (item) => item.shippingSettings?.standardShippingEnabled !== false,
  );
  const freeShippingEligible = items.every(
    (item) => item.shippingSettings?.freeShippingEligible !== false,
  );
  const notes = Array.from(
    new Set(
      items
        .flatMap((item) => [
          item.shippingNote,
          item.shippingSettings?.shippingNote,
          item.shippingSettings?.pickupOnly
            ? `${item.name}: ridicare sau gestionare manuală. Confirmăm detaliile după comandă.`
            : "",
          item.shippingSettings?.oversizedOrSpecialShipping
            ? `${item.name}: livrarea se confirmă manual în funcție de dimensiune și ambalare.`
            : "",
        ])
        .filter((note): note is string => Boolean(note?.trim())),
    ),
  );
  const freeShippingReached =
    subtotal >= siteConfig.freeShippingThreshold &&
    freeShippingEligible &&
    standardShippingEnabled &&
    !hasPickupOnly &&
    !hasSpecialShipping;

  if (hasPickupOnly) {
    return {
      cost: 0,
      method: "Ridicare / gestionare manuală",
      freeShippingReached: false,
      remainingForFreeShipping: Math.max(siteConfig.freeShippingThreshold - subtotal, 0),
      hasPickupOnly,
      hasSpecialShipping,
      notes,
    };
  }

  if (hasSpecialShipping || !standardShippingEnabled) {
    return {
      cost: 0,
      method: "Livrare confirmată manual",
      freeShippingReached: false,
      remainingForFreeShipping: Math.max(siteConfig.freeShippingThreshold - subtotal, 0),
      hasPickupOnly,
      hasSpecialShipping: true,
      notes,
    };
  }

  return {
    cost: freeShippingReached ? 0 : siteConfig.flatShipping,
    method: freeShippingReached ? "Livrare gratuită România" : "Livrare standard România",
    freeShippingReached,
    remainingForFreeShipping: Math.max(siteConfig.freeShippingThreshold - subtotal, 0),
    hasPickupOnly,
    hasSpecialShipping,
    notes,
  };
}

export function getGiftPackagingTotal(items: CartItem[], giftPackaging: boolean) {
  return items.length && giftPackaging ? siteConfig.giftPackagingPrice : 0;
}

export function getTotal(items: CartItem[], giftPackaging = false) {
  return (
    getSubtotal(items) +
    getPersonalizationTotal(items) +
    getShipping(items) +
    getGiftPackagingTotal(items, giftPackaging)
  );
}
