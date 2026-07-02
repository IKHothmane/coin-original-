import type { ProductBadgeTone, StockStatus } from "./types";

export const PRODUCT_CATEGORIES = ["Chaussures", "Vetements", "Accessoires"] as const;
export const DEFAULT_PRODUCT_CATEGORY: (typeof PRODUCT_CATEGORIES)[number] = "Vetements";

export const PRODUCT_STATUSES = ["Aucun", "Nouveaute", "Solde", "Rupture"] as const;

export const SHOE_SIZE_LABELS = ["38", "39", "40", "41", "42", "43", "44", "45"];
export const CLOTHING_SIZE_LABELS = ["XS", "S", "M", "L", "XL", "XXL"];
export const ACCESSORY_SIZE_LABELS = ["Unique"];

export function formatMad(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} MAD`;
}

export function slugifyProductName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCollectionLabel(product: { category: string }) {
  if (product.category === "Chaussures") {
    return "Collection Summer 24";
  }

  if (product.category === "Vetements" || product.category === "Hoodies") {
    return "Essentials Series";
  }

  return "Lifestyle Pack";
}

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) {
    return "Hors stock";
  }

  if (stock <= 8) {
    return "Stock faible";
  }

  return "Actif";
}

export function getSizeLabelsByCategory(category: string) {
  if (category === "Chaussures") {
    return SHOE_SIZE_LABELS;
  }

  if (category === "Accessoires") {
    return ACCESSORY_SIZE_LABELS;
  }

  return CLOTHING_SIZE_LABELS;
}

export function getBadgeConfig(
  status: string,
): { label: string; tone: ProductBadgeTone; soldOut?: boolean } | undefined {
  if (status === "Nouveaute") {
    return { label: "Nouveaute", tone: "primary" };
  }

  if (status === "Solde") {
    return { label: "Solde", tone: "tertiary" };
  }

  if (status === "Rupture") {
    return { label: "Rupture", tone: "error", soldOut: true };
  }

  return undefined;
}

export function getStatusFromProduct(product: {
  soldOut: boolean;
  badge?: { tone: ProductBadgeTone } | null;
}) {
  if (product.soldOut || product.badge?.tone === "error") {
    return "Rupture";
  }

  if (product.badge?.tone === "tertiary") {
    return "Solde";
  }

  if (product.badge?.tone === "primary") {
    return "Nouveaute";
  }

  return "Aucun";
}

export function normalizeCategory(category: string) {
  if (category === "Chaussures" || category === "Accessoires") {
    return category;
  }

  return "Vetements";
}

export function createInitialSizeStock(category: string) {
  return getSizeLabelsByCategory(category).reduce<Record<string, number>>((accumulator, size) => {
    accumulator[size] = 0;
    return accumulator;
  }, {});
}
