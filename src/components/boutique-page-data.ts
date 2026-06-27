import { catalogProducts, type CatalogProduct } from "@/components/catalog-data";

export const PRODUCTS_PER_PAGE = 6;

export const sortOptions = [
  { value: "latest", label: "Nouveautes" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix decroissant" },
] as const;

export type BoutiqueSortValue = (typeof sortOptions)[number]["value"];

export type BoutiqueProduct = CatalogProduct;

export const boutiqueProducts: BoutiqueProduct[] = catalogProducts;
