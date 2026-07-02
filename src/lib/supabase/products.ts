import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  AdminProductRecord,
  ProductBadgeTone,
  ProductGalleryItem,
  ProductMutationInput,
} from "@/lib/products/types";
import {
  formatMad,
  getCollectionLabel,
  getStockStatus,
  slugifyProductName,
} from "@/lib/products/utils";

type SupabaseProductRow = {
  id: string;
  slug: string;
  brand: string;
  category: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  description: string;
  image: string;
  gallery: ProductGalleryItem[] | null;
  sizes: string[] | null;
  stock_by_size: Record<string, number> | null;
  sold_out: boolean | null;
  badge_label: string | null;
  badge_tone: ProductBadgeTone | null;
  authenticity_label: string | null;
  delivery_label: string | null;
  delivery_region: string | null;
  created_at: string;
  updated_at: string;
};

let browserClient: SupabaseClient | null = null;

function getSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabaseEnv();
  return Boolean(url && anonKey);
}

export function getSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return browserClient;
}

function mapSupabaseRowToAdminProduct(row: SupabaseProductRow): AdminProductRecord {
  const stockBySize = row.stock_by_size ?? {};
  const sizes = row.sizes ?? Object.keys(stockBySize).filter((size) => (stockBySize[size] ?? 0) > 0);
  const computedStock = Object.values(stockBySize).reduce((sum, quantity) => sum + quantity, 0);
  const stock = row.sold_out ? 0 : computedStock;

  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    category: row.category,
    name: row.name,
    priceValue: row.price,
    priceLabel: formatMad(row.price),
    compareAtPriceValue: row.compare_at_price ?? undefined,
    compareAtPriceLabel: row.compare_at_price ? formatMad(row.compare_at_price) : undefined,
    description: row.description,
    badge:
      row.badge_label && row.badge_tone
        ? {
            label: row.badge_label,
            tone: row.badge_tone,
          }
        : undefined,
    image: row.image,
    gallery: row.gallery?.length ? row.gallery : [{ src: row.image, alt: `${row.name} vue principale` }],
    sizes,
    stockBySize,
    stock,
    stockStatus: getStockStatus(stock),
    collectionLabel: getCollectionLabel(row),
    soldOut: Boolean(row.sold_out),
    authenticityLabel: row.authenticity_label ?? undefined,
    deliveryLabel: row.delivery_label ?? undefined,
    deliveryRegion: row.delivery_region ?? undefined,
  };
}

function mapInputToSupabasePayload(input: ProductMutationInput) {
  const sizes = Object.entries(input.stockBySize)
    .filter(([, quantity]) => quantity > 0)
    .map(([size]) => size);
  const totalStock = Object.values(input.stockBySize).reduce((sum, quantity) => sum + quantity, 0);

  return {
    slug: input.slug ?? slugifyProductName(input.name),
    brand: input.brand,
    category: input.category,
    name: input.name,
    price: input.priceValue,
    compare_at_price: input.compareAtPriceValue ?? null,
    description: input.description,
    image: input.image,
    gallery: input.gallery,
    sizes,
    stock_by_size: input.stockBySize,
    sold_out: input.soldOut ?? totalStock <= 0,
    badge_label: input.badge?.label ?? null,
    badge_tone: input.badge?.tone ?? null,
    authenticity_label: input.authenticityLabel ?? null,
    delivery_label: input.deliveryLabel ?? null,
    delivery_region: input.deliveryRegion ?? null,
  };
}

export async function fetchAdminProducts() {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch products failed:", error.message);
    return [];
  }

  return (data as SupabaseProductRow[]).map(mapSupabaseRowToAdminProduct);
}

export async function fetchAdminProductBySlug(slug: string) {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Supabase fetch product failed:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  return mapSupabaseRowToAdminProduct(data as SupabaseProductRow);
}

export async function createAdminProduct(input: ProductMutationInput) {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return {
      data: null,
      error:
        "Supabase n'est pas configure. Ajoute NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    };
  }

  const payload = mapInputToSupabasePayload(input);
  const { data, error } = await client.from("products").insert(payload).select("*").single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapSupabaseRowToAdminProduct(data as SupabaseProductRow), error: null };
}

export async function updateAdminProduct(slug: string, input: ProductMutationInput) {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return {
      data: null,
      error:
        "Supabase n'est pas configure. Ajoute NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    };
  }

  const payload = mapInputToSupabasePayload(input);
  const { data, error } = await client
    .from("products")
    .update(payload)
    .eq("slug", slug)
    .select("*")
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: mapSupabaseRowToAdminProduct(data as SupabaseProductRow), error: null };
}

export async function deleteAdminProduct(slug: string) {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return {
      data: null,
      error:
        "Supabase n'est pas configure. Ajoute NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    };
  }

  const { error } = await client.from("products").delete().eq("slug", slug);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: { slug }, error: null };
}

function sanitizeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-").toLowerCase();
}

export async function uploadProductImages(files: File[], productSlug: string) {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return {
      data: null,
      error:
        "Supabase n'est pas configure. Ajoute NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    };
  }

  const uploadedUrls: string[] = [];

  for (const file of files) {
    const filePath = `${productSlug}/${Date.now()}-${sanitizeFileName(file.name)}`;
    const { error } = await client.storage.from("product-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    const { data } = client.storage.from("product-images").getPublicUrl(filePath);
    uploadedUrls.push(data.publicUrl);
  }

  return { data: uploadedUrls, error: null };
}
