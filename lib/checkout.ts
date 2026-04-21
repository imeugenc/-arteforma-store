import { CartItem } from "@/lib/types";
import { siteConfig } from "@/lib/site";

export function getSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getShipping(items: CartItem[]) {
  return items.length ? siteConfig.flatShipping : 0;
}

export function getTotal(items: CartItem[]) {
  return getSubtotal(items) + getShipping(items);
}
