"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, writeBatch } from "firebase/firestore";
import { useAuth } from "@/components/auth-context";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
import type { CatalogProduct } from "@/components/catalog-data";
import { fetchCatalogProductBySlugWithFallback } from "@/lib/products/storefront";

const FAVORITES_STORAGE_KEY = "coin-original-favorites";
const EMPTY_FAVORITES: string[] = [];

function readFavoritesFromStorage(): string[] {
  if (typeof window === "undefined" || !window.localStorage) return [];

  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) {
        return parsed.filter((slug) => typeof slug === "string" && slug.length > 0);
      }
    }
  } catch {
    // Ignore invalid storage data
  }

  return [];
}

function writeFavoritesToStorage(slugs: string[]) {
  if (typeof window === "undefined" || !window.localStorage) return;

  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // Ignore storage errors
  }
}

type FavoritesStore = {
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => string[];
  getServerSnapshot: () => string[];
  hydrate: () => void;
  setSlugs: (updater: (current: string[]) => string[]) => void;
};

function createFavoritesStore(): FavoritesStore {
  let slugs: string[] = [];
  const listeners = new Set<() => void>();
  let hydrated = false;

  return {
    subscribe(callback) {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
    getSnapshot() {
      return slugs;
    },
    getServerSnapshot() {
      return EMPTY_FAVORITES;
    },
    hydrate() {
      if (hydrated) return;
      hydrated = true;
      slugs = readFavoritesFromStorage();
      listeners.forEach((callback) => callback());
    },
    setSlugs(updater) {
      slugs = updater(slugs);
      hydrated = true;
      writeFavoritesToStorage(slugs);
      listeners.forEach((callback) => callback());
    },
  };
}

const favoritesStore = createFavoritesStore();

type FavoritesContextValue = {
  slugs: string[];
  isReady: boolean;
  isFavorite: (slug: string) => boolean;
  addFavorite: (slug: string, product?: CatalogProduct) => void;
  removeFavorite: (slug: string) => void;
  toggleFavorite: (slug: string, product?: CatalogProduct) => void;
  clearFavorites: () => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function useIsReady() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const localSlugs = useSyncExternalStore(
    favoritesStore.subscribe,
    favoritesStore.getSnapshot,
    favoritesStore.getServerSnapshot,
  );
  const isReady = useIsReady();
  const [remoteSlugs, setRemoteSlugs] = useState<string[]>([]);
  const [remoteReady, setRemoteReady] = useState(false);
  const migratedUidRef = useRef<string | null>(null);

  useEffect(() => {
    favoritesStore.hydrate();
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setRemoteSlugs([]);
      setRemoteReady(false);
      return;
    }

    if (!user) {
      setRemoteSlugs([]);
      setRemoteReady(false);
      return;
    }

    const favoritesQuery = query(
      collection(getFirebaseDb(), "users", user.uid, "favorites"),
      orderBy("favoritedAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      favoritesQuery,
      (snapshot) => {
        setRemoteSlugs(snapshot.docs.map((docSnapshot) => docSnapshot.id));
        setRemoteReady(true);
      },
      () => {
        setRemoteReady(true);
      },
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;
    if (!user) return;
    if (migratedUidRef.current === user.uid) return;
    migratedUidRef.current = user.uid;

    const currentLocalSlugs = favoritesStore.getSnapshot();
    if (!currentLocalSlugs.length) return;

    Promise.all(currentLocalSlugs.map((slug) => fetchCatalogProductBySlugWithFallback(slug))).then((products) => {
      const batch = writeBatch(getFirebaseDb());
      currentLocalSlugs.forEach((slug, index) => {
        const product = products[index];
        const base = product
          ? {
              slug: product.slug,
              name: product.name,
              description: product.description ?? "",
              brand: product.brand ?? "",
              category: product.category ?? "",
              image: product.image ?? "",
              gallery: product.gallery ?? [],
              sizes: product.sizes ?? [],
              soldOut: Boolean(product.soldOut),
              hidden: false,
              priceValue: Number(String(product.price ?? "").replace(/[^\d.]/g, "")) || 0,
              compareAtPriceValue: product.compareAtPrice
                ? Number(String(product.compareAtPrice ?? "").replace(/[^\d.]/g, "")) || null
                : null,
            }
          : { slug };

        batch.set(
          doc(getFirebaseDb(), "users", user.uid, "favorites", slug),
          { ...base, favoritedAt: serverTimestamp() },
          { merge: true },
        );
      });
      return batch.commit();
    }).finally(() => {
      favoritesStore.setSlugs(() => []);
    });
  }, [user]);

  const setSlugs = useCallback((updater: (current: string[]) => string[]) => {
    favoritesStore.setSlugs(updater);
  }, []);

  const activeSlugs = user && isFirebaseConfigured() ? remoteSlugs : localSlugs;
  const activeReady = Boolean(isReady && (!user || !isFirebaseConfigured() || remoteReady));

  const isFavorite = useCallback(
    (slug: string) => activeSlugs.includes(slug),
    [activeSlugs],
  );

  const writeFavorite = useCallback(
    (slug: string, product?: CatalogProduct) => {
      if (!isFirebaseConfigured()) return;
      if (!user) return;
      if (!slug) return;

      const base = product
        ? {
            slug: product.slug,
            name: product.name,
            description: product.description ?? "",
            brand: product.brand ?? "",
            category: product.category ?? "",
            image: product.image ?? "",
            gallery: product.gallery ?? [],
            sizes: product.sizes ?? [],
            soldOut: Boolean(product.soldOut),
            hidden: false,
            priceValue: Number(String(product.price ?? "").replace(/[^\d.]/g, "")) || 0,
            compareAtPriceValue: product.compareAtPrice
              ? Number(String(product.compareAtPrice ?? "").replace(/[^\d.]/g, "")) || null
              : null,
          }
        : { slug };

      setDoc(doc(getFirebaseDb(), "users", user.uid, "favorites", slug), { ...base, favoritedAt: serverTimestamp() }, { merge: true }).catch(() => {});
    },
    [user],
  );

  const deleteFavorite = useCallback(
    (slug: string) => {
      if (!isFirebaseConfigured()) return;
      if (!user) return;
      if (!slug) return;
      deleteDoc(doc(getFirebaseDb(), "users", user.uid, "favorites", slug)).catch(() => {});
    },
    [user],
  );

  const addFavorite = useCallback(
    (slug: string, product?: CatalogProduct) => {
      if (!slug) return;
      if (user && isFirebaseConfigured()) {
        setRemoteSlugs((current) => (current.includes(slug) ? current : [...current, slug]));
        writeFavorite(slug, product);
        return;
      }
      setSlugs((current) => (current.includes(slug) ? current : [...current, slug]));
    },
    [setSlugs, user, writeFavorite],
  );

  const removeFavorite = useCallback(
    (slug: string) => {
      if (user && isFirebaseConfigured()) {
        setRemoteSlugs((current) => current.filter((s) => s !== slug));
        deleteFavorite(slug);
        return;
      }
      setSlugs((current) => current.filter((s) => s !== slug));
    },
    [setSlugs, user, deleteFavorite],
  );

  const toggleFavorite = useCallback(
    (slug: string, product?: CatalogProduct) => {
      if (!slug) return;
      if (user && isFirebaseConfigured()) {
        setRemoteSlugs((current) => {
          if (current.includes(slug)) {
            deleteFavorite(slug);
            return current.filter((s) => s !== slug);
          }
          writeFavorite(slug, product);
          return [...current, slug];
        });
        return;
      }
      setSlugs((current) => (current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]));
    },
    [setSlugs, user, writeFavorite, deleteFavorite],
  );

  const clearFavorites = useCallback(() => {
    if (user && isFirebaseConfigured()) {
      const db = getFirebaseDb();
      const batch = writeBatch(db);
      remoteSlugs.forEach((slug) => batch.delete(doc(db, "users", user.uid, "favorites", slug)));
      batch.commit().catch(() => {});
      setRemoteSlugs([]);
      return;
    }
    setSlugs(() => []);
  }, [setSlugs, user, remoteSlugs]);

  const value = useMemo(
    () => ({
      slugs: activeSlugs,
      isReady: activeReady,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      clearFavorites,
    }),
    [activeSlugs, activeReady, isFavorite, addFavorite, removeFavorite, toggleFavorite, clearFavorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
}
