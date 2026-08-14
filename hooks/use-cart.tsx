"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem, Merchant, Product } from "@/types";

interface CartContextValue {
  merchant: Merchant | null;
  items: CartItem[];
  count: number;
  add: (merchant: Merchant, product: Product) => boolean;
  update: (productId: number, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("antergo_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        setMerchant(parsed.merchant);
        setItems(parsed.items);
      }
    } finally { setReady(true); }
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("antergo_cart", JSON.stringify({ merchant, items }));
  }, [items, merchant, ready]);

  const value = useMemo<CartContextValue>(() => ({
    merchant,
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    add: (nextMerchant, product) => {
      if (merchant && merchant.id !== nextMerchant.id && items.length > 0) return false;
      setMerchant(nextMerchant);
      setItems((current) => {
        const existing = current.find((item) => item.product.id === product.id);
        if (existing) return current.map((item) => item.product.id === product.id
          ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
          : item);
        return [...current, { product, quantity: 1 }];
      });
      return true;
    },
    update: (productId, quantity) => setItems((current) => current
      .map((item) => item.product.id === productId ? { ...item, quantity } : item)
      .filter((item) => item.quantity > 0)),
    clear: () => { setItems([]); setMerchant(null); },
  }), [items, merchant]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
