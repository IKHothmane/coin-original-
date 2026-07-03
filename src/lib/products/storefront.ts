import { useEffect, useState } from "react";
import type { CatalogProduct } from "@/components/catalog-data";
import { catalogProducts, getProductBySlug } from "@/components/catalog-data";
import { fetchCatalogProductsFromFirebase, fetchCatalogProductBySlugFromFirebase } from "@/lib/firebase/products";
import { isFirebaseConfigured } from "@/lib/firebase/client";

export async function fetchCatalogProductsWithFallback(): Promise<CatalogProduct[]> {
  if (!isFirebaseConfigured()) {
    return catalogProducts;
  }

  try {
    const products = await fetchCatalogProductsFromFirebase();
    return products.length > 0 ? products : catalogProducts;
  } catch {
    return catalogProducts;
  }
}

export async function fetchCatalogProductBySlugWithFallback(slug: string): Promise<CatalogProduct | null> {
  if (!slug) return null;

  // Always check hardcoded catalog first as fallback
  const hardcodedProduct = getProductBySlug(slug);

  if (!isFirebaseConfigured()) {
    return hardcodedProduct ?? null;
  }

  try {
    const product = await fetchCatalogProductBySlugFromFirebase(slug);
    return product ?? hardcodedProduct ?? null;
  } catch {
    return hardcodedProduct ?? null;
  }
}

export async function fetchFeaturedProductsWithFallback() {
  const products = await fetchCatalogProductsWithFallback();
  return products.slice(0, 4).map((product) => ({
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    badge: product.badge?.label,
    badgeTone: product.badge?.tone,
    image: product.image,
  }));
}

export function useFirebaseProducts() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchCatalogProductsWithFallback();
        if (!cancelled) {
          setProducts(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Erreur de chargement");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { products, loading, error };
}

export function useFirebaseProduct(slug: string) {
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchCatalogProductBySlugWithFallback(slug);
        if (!cancelled) {
          setProduct(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Erreur de chargement");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug]);

  return { product, loading, error };
}
