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
  if (!items.length) {
    return 0;
  }

  return getSubtotal(items) >= siteConfig.freeShippingThreshold ? 0 : siteConfig.flatShipping;
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
