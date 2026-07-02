"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CartItem } from "@/components/cart-types";
import type { CatalogProduct } from "@/components/catalog-data";

const CART_STORAGE_KEY = "coin-original-cart";

function parsePrice(price: string) {
  return Number(price.replace(/[^\d]/g, ""));
}

function makeCartItemId(slug: string, size: string) {
  return `${slug}__${size}`;
}

function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined" || !window.localStorage) return [];

  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Ignore invalid storage data
  }

  return [];
}

function writeCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined" || !window.localStorage) return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage errors (e.g. private mode)
  }
}

type CartStore = {
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => CartItem[];
  getServerSnapshot: () => CartItem[];
  setItems: (updater: (current: CartItem[]) => CartItem[]) => void;
};

function createCartStore(): CartStore {
  let items = readCartFromStorage();
  const listeners = new Set<() => void>();

  return {
    subscribe(callback) {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
    getSnapshot() {
      return items;
    },
    getServerSnapshot() {
      return [];
    },
    setItems(updater) {
      items = updater(items);
      writeCartToStorage(items);
      listeners.forEach((callback) => callback());
    },
  };
}

const cartStore = createCartStore();

type CartContextValue = {
  items: CartItem[];
  isReady: boolean;
  addToCart: (product: CatalogProduct, size: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function useIsReady() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const isReady = useIsReady();

  const setItems = useCallback((updater: (current: CartItem[]) => CartItem[]) => {
    cartStore.setItems(updater);
  }, []);

  const addToCart = useCallback(
    (product: CatalogProduct, size: string, quantity = 1) => {
      const id = makeCartItemId(product.slug, size);
      const price = parsePrice(product.price);

      setItems((current) => {
        const existing = current.find((item) => item.id === id);

        if (existing) {
          return current.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(10, item.quantity + quantity) }
              : item,
          );
        }

        return [
          ...current,
          {
            id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            size,
            price,
            quantity,
            image: product.image,
          },
        ];
      });
    },
    [setItems],
  );

  const removeFromCart = useCallback(
    (itemId: string) => {
      setItems((current) => current.filter((item) => item.id !== itemId));
    },
    [setItems],
  );

  const updateQuantity = useCallback(
    (itemId: string, delta: number) => {
      setItems((current) =>
        current.map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, Math.min(10, item.quantity + delta)) }
            : item,
        ),
      );
    },
    [setItems],
  );

  const setQuantity = useCallback(
    (itemId: string, quantity: number) => {
      setItems((current) =>
        current.map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, Math.min(10, quantity)) }
            : item,
        ),
      );
    },
    [setItems],
  );

  const clearCart = useCallback(() => {
    setItems(() => []);
  }, [setItems]);

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const cartTotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      isReady,
      addToCart,
      removeFromCart,
      updateQuantity,
      setQuantity,
      clearCart,
      cartCount,
      cartTotal,
    }),
    [
      items,
      isReady,
      addToCart,
      removeFromCart,
      updateQuantity,
      setQuantity,
      clearCart,
      cartCount,
      cartTotal,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
