import { z } from "zod";
import type { ProductMutationInput } from "./types";

function coerceNumber(minValue = 0, message?: string) {
  return z
    .preprocess((value) => {
      if (typeof value === "number") return value;
      if (typeof value === "string" && value !== "") return Number(value);
      return 0;
    }, z.number())
    .pipe(z.number().min(minValue, message));
}

export const productSchema = z.object({
  slug: z.string().optional(),
  brand: z.string().min(1, "La marque est requise."),
  category: z.string().min(1, "La categorie est requise."),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caracteres."),
  priceValue: coerceNumber(1, "Le prix doit etre superieur a 0."),
  compareAtPriceValue: coerceNumber().optional(),
  description: z.string().min(10, "La description doit contenir au moins 10 caracteres."),
  image: z.string().min(1, "Une image principale est requise."),
  gallery: z.array(z.object({ src: z.string(), alt: z.string() })).min(1, "Au moins une image est requise."),
  stockBySize: z
    .record(z.string(), coerceNumber())
    .refine(
      (stock) => Object.values(stock).some((quantity) => quantity > 0),
      "Au moins une taille doit avoir du stock.",
    ),
  badge: z
    .object({
      label: z.string(),
      tone: z.enum(["primary", "tertiary", "error"]),
    })
    .optional(),
  soldOut: z.boolean().optional(),
  authenticityLabel: z.string().optional(),
  deliveryLabel: z.string().optional(),
  deliveryRegion: z.string().optional(),
}) satisfies z.ZodType<ProductMutationInput>;

export type ProductFormData = ProductMutationInput;
