import { useState, useCallback } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Simple global state using module-level variable + listeners
let cartItems: CartItem[] = [];
const listeners: Set<() => void> = new Set();

function notify() {
  listeners.forEach((fn) => fn());
}

export function useCart() {
  const [, forceUpdate] = useState(0);

  const subscribe = useCallback(() => {
    const update = () => forceUpdate((n) => n + 1);
    listeners.add(update);
    return () => listeners.delete(update);
  }, []);

  // Subscribe on mount
  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    const existing = cartItems.find((i) => i.id === item.id);
    if (existing) {
      cartItems = cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      cartItems = [...cartItems, { ...item, quantity: 1 }];
    }
    notify();
  }, []);

  const removeItem = useCallback((id: number) => {
    cartItems = cartItems.filter((i) => i.id !== id);
    notify();
  }, []);

  const updateQty = useCallback((id: number, qty: number) => {
    if (qty <= 0) {
      cartItems = cartItems.filter((i) => i.id !== id);
    } else {
      cartItems = cartItems.map((i) =>
        i.id === id ? { ...i, quantity: qty } : i
      );
    }
    notify();
  }, []);

  const clearCart = useCallback(() => {
    cartItems = [];
    notify();
  }, []);

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { items: cartItems, addItem, removeItem, updateQty, clearCart, total };
}
