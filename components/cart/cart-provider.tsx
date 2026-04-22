"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { CartItem, CartStorage } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  giftPackaging: boolean;
  setGiftPackaging: (value: boolean) => void;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "arteforma-cart";

function buildCartItemId(item: Partial<CartItem>) {
  return [
    item.slug ?? "",
    item.size ?? "",
    item.color ?? "",
    item.material ?? "",
    item.personalizationSelected ? "personalized" : "standard",
    item.personalization ?? "",
  ].join("::");
}

function normalizeCartItem(item: CartItem | Omit<CartItem, "id">) {
  return {
    ...item,
    id: "id" in item && item.id ? item.id : buildCartItemId(item),
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartStorage>(() => {
    if (typeof window === "undefined") {
      return { items: [], giftPackaging: false };
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return { items: [], giftPackaging: false };
    }

    try {
      const parsed = JSON.parse(saved) as CartStorage | CartItem[];

      if (Array.isArray(parsed)) {
        return {
          items: parsed.map(normalizeCartItem),
          giftPackaging: false,
        };
      }

      return {
        items: (parsed.items ?? []).map(normalizeCartItem),
        giftPackaging: parsed.giftPackaging ?? false,
      };
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return { items: [], giftPackaging: false };
    }
  });

  const items = cart.items;
  const giftPackaging = cart.giftPackaging;

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addItem = useCallback((item: CartItem) => {
    setCart((current) => {
      const normalizedItem = normalizeCartItem(item);
      const existing = current.items.find((entry) => entry.id === normalizedItem.id);

      if (!existing) {
        return {
          ...current,
          items: [...current.items, normalizedItem],
        };
      }

      return {
        ...current,
        items: current.items.map((entry) =>
          entry.id === normalizedItem.id
            ? { ...entry, quantity: entry.quantity + normalizedItem.quantity }
            : entry,
        ),
      };
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCart((current) => ({
      ...current,
      items: current.items
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
        )
        .filter((item) => item.quantity > 0),
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCart((current) =>
      current.items.length || current.giftPackaging
        ? { items: [], giftPackaging: false }
        : current,
    );
  }, []);

  const setGiftPackaging = useCallback((value: boolean) => {
    setCart((current) =>
      current.giftPackaging === value ? current : { ...current, giftPackaging: value },
    );
  }, []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      giftPackaging,
      setGiftPackaging,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
    }),
    [items, addItem, updateQuantity, removeItem, clearCart, giftPackaging, setGiftPackaging],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
