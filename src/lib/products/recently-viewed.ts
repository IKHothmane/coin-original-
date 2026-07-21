export type RecentlyViewedProduct = {
  slug: string;
  name: string;
  price: string;
  image: string;
  brand?: string;
};

const STORAGE_KEY = "coin_recently_viewed";
const MAX_ITEMS = 8;

export function readRecentlyViewed(): RecentlyViewedProduct[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is RecentlyViewedProduct =>
        Boolean(item && typeof item.slug === "string" && typeof item.name === "string"),
    );
  } catch {
    return [];
  }
}

export function recordRecentlyViewed(product: RecentlyViewedProduct) {
  if (typeof window === "undefined") return;

  try {
    const current = readRecentlyViewed().filter((item) => item.slug !== product.slug);
    const next = [product, ...current].slice(0, MAX_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // stockage indisponible : on ignore silencieusement
  }
}
