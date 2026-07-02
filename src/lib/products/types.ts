export type ProductBadgeTone = "primary" | "tertiary" | "error";

export type ProductGalleryItem = {
  src: string;
  alt: string;
};

export type StockStatus = "Actif" | "Stock faible" | "Hors stock";

export type AdminProductRecord = {
  id: string;
  slug: string;
  brand: string;
  category: string;
  name: string;
  priceValue: number;
  priceLabel: string;
  compareAtPriceValue?: number;
  compareAtPriceLabel?: string;
  description: string;
  badge?: {
    label: string;
    tone: ProductBadgeTone;
  };
  image: string;
  gallery: ProductGalleryItem[];
  sizes: string[];
  stockBySize: Record<string, number>;
  stock: number;
  stockStatus: StockStatus;
  collectionLabel: string;
  soldOut: boolean;
  authenticityLabel?: string;
  deliveryLabel?: string;
  deliveryRegion?: string;
};

export type ProductMutationInput = {
  slug?: string;
  brand: string;
  category: string;
  name: string;
  priceValue: number;
  compareAtPriceValue?: number;
  description: string;
  image: string;
  gallery: ProductGalleryItem[];
  stockBySize: Record<string, number>;
  badge?: {
    label: string;
    tone: ProductBadgeTone;
  };
  soldOut?: boolean;
  authenticityLabel?: string;
  deliveryLabel?: string;
  deliveryRegion?: string;
};
