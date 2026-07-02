import {
  catalogProducts,
  getProductBySlug,
  type CatalogProduct,
} from "@/components/catalog-data";
import {
  createAdminProduct as createFirebaseAdminProduct,
  deleteAdminProduct as deleteFirebaseAdminProduct,
  fetchAdminProductBySlug as fetchFirebaseAdminProductBySlug,
  fetchAdminProducts as fetchFirebaseAdminProducts,
  isFirebaseConfigured,
  updateAdminProduct as updateFirebaseAdminProduct,
} from "@/lib/firebase/products";
import {
  createAdminProduct as createSupabaseAdminProduct,
  deleteAdminProduct as deleteSupabaseAdminProduct,
  fetchAdminProductBySlug as fetchSupabaseAdminProductBySlug,
  fetchAdminProducts as fetchSupabaseAdminProducts,
  isSupabaseConfigured,
  updateAdminProduct as updateSupabaseAdminProduct,
} from "@/lib/supabase/products";
import type { AdminProductRecord, ProductMutationInput } from "./types";

export type ProductRepository = {
  isConfigured: () => boolean;
  fetchAll: () => Promise<AdminProductRecord[]>;
  fetchBySlug: (slug: string) => Promise<AdminProductRecord | null>;
  create: (input: ProductMutationInput) => Promise<{ data: AdminProductRecord | null; error: string | null }>;
  update: (
    slug: string,
    input: ProductMutationInput,
  ) => Promise<{ data: AdminProductRecord | null; error: string | null }>;
  delete: (slug: string) => Promise<{ data: { slug: string } | null; error: string | null }>;
  fetchCatalogProducts: () => Promise<CatalogProduct[]>;
  fetchCatalogProductBySlug: (slug: string) => Promise<CatalogProduct | null>;
};

function mapAdminProductsToCatalog(products: AdminProductRecord[]): CatalogProduct[] {
  return products.map((product) => ({
    slug: product.slug,
    brand: product.brand,
    category: product.category,
    name: product.name,
    price: product.priceLabel.replace("MAD", "DH").trim(),
    compareAtPrice: product.compareAtPriceLabel?.replace("MAD", "DH").trim(),
    description: product.description,
    badge: product.badge,
    image: product.image,
    gallery: product.gallery,
    sizes: product.sizes,
    soldOut: product.soldOut,
    authenticityLabel: product.authenticityLabel,
    deliveryLabel: product.deliveryLabel,
    deliveryRegion: product.deliveryRegion,
  }));
}

function createStaticProductRepository(): ProductRepository {
  return {
    isConfigured: () => true,
    fetchAll: async () => [],
    fetchBySlug: async () => null,
    create: async () => ({ data: null, error: "Le backend produit n'est pas configure." }),
    update: async () => ({ data: null, error: "Le backend produit n'est pas configure." }),
    delete: async () => ({ data: null, error: "Le backend produit n'est pas configure." }),
    fetchCatalogProducts: async () => catalogProducts,
    fetchCatalogProductBySlug: async (slug) => getProductBySlug(slug) ?? null,
  };
}

function createFirebaseProductRepository(): ProductRepository {
  return {
    isConfigured: () => isFirebaseConfigured(),
    fetchAll: () => fetchFirebaseAdminProducts(),
    fetchBySlug: (slug) => fetchFirebaseAdminProductBySlug(slug),
    create: (input) => createFirebaseAdminProduct(input),
    update: (slug, input) => updateFirebaseAdminProduct(slug, input),
    delete: (slug) => deleteFirebaseAdminProduct(slug),
    fetchCatalogProducts: async () => {
      const products = await fetchFirebaseAdminProducts();
      return products.length > 0 ? mapAdminProductsToCatalog(products) : catalogProducts;
    },
    fetchCatalogProductBySlug: async (slug) => {
      const product = await fetchFirebaseAdminProductBySlug(slug);
      if (product) {
        return mapAdminProductsToCatalog([product])[0] ?? null;
      }
      return getProductBySlug(slug) ?? null;
    },
  };
}

function createSupabaseProductRepository(): ProductRepository {
  return {
    isConfigured: () => isSupabaseConfigured(),
    fetchAll: () => fetchSupabaseAdminProducts(),
    fetchBySlug: (slug) => fetchSupabaseAdminProductBySlug(slug),
    create: (input) => createSupabaseAdminProduct(input),
    update: (slug, input) => updateSupabaseAdminProduct(slug, input),
    delete: (slug) => deleteSupabaseAdminProduct(slug),
    fetchCatalogProducts: async () => {
      const products = await fetchSupabaseAdminProducts();
      return products.length > 0 ? mapAdminProductsToCatalog(products) : catalogProducts;
    },
    fetchCatalogProductBySlug: async (slug) => {
      const product = await fetchSupabaseAdminProductBySlug(slug);
      if (product) {
        return mapAdminProductsToCatalog([product])[0] ?? null;
      }
      return getProductBySlug(slug) ?? null;
    },
  };
}

export function getProductRepository(): ProductRepository {
  if (isFirebaseConfigured()) {
    return createFirebaseProductRepository();
  }

  if (isSupabaseConfigured()) {
    return createSupabaseProductRepository();
  }

  return createStaticProductRepository();
}

export function getActiveProductBackendLabel(): string {
  if (isFirebaseConfigured()) {
    return "Firebase";
  }

  if (isSupabaseConfigured()) {
    return "Supabase";
  }

  return "Catalogue statique";
}
