import { z } from "zod";
import type { ProductMutationInput } from "./types";
import { DEFAULT_PRODUCT_CATEGORY } from "./utils";

function coerceNumber(defaultValue = 0) {
  return z
    .preprocess((value) => {
      if (typeof value === "number") return value;
      if (typeof value === "string" && value !== "") {
        const parsedValue = Number(value);
        return Number.isFinite(parsedValue) ? parsedValue : defaultValue;
      }
      return defaultValue;
    }, z.number())
    .catch(defaultValue);
}

export const productSchema = z.object({
  slug: z.string().optional(),
  brand: z.string().optional().transform((value) => value?.trim() || "Coin Original"),
  category: z.string().optional().transform((value) => value?.trim() || DEFAULT_PRODUCT_CATEGORY),
  name: z.string().optional().transform((value) => value?.trim() || "Produit sans nom"),
  priceValue: coerceNumber(0),
  compareAtPriceValue: coerceNumber(0).optional(),
  description: z.string().optional().transform((value) => value?.trim() || ""),
  image: z.string().optional().transform((value) => value?.trim() || ""),
  gallery: z.array(z.object({ src: z.string(), alt: z.string() })).optional().default([]),
  stockBySize: z.record(z.string(), coerceNumber(0)).optional().default({}),
  badge: z
    .object({
      label: z.string(),
      tone: z.enum(["primary", "tertiary", "error"]),
    })
    .optional(),
  soldOut: z.boolean().optional(),
  hidden: z.boolean().optional(),
  authenticityLabel: z.string().optional(),
  deliveryLabel: z.string().optional(),
  deliveryRegion: z.string().optional(),
}) satisfies z.ZodType<ProductMutationInput>;

export type ProductFormData = ProductMutationInput;
