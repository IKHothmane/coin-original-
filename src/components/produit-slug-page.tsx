"use client";

import { useFirebaseProduct } from "@/lib/products/storefront";
import { ProductPage } from "@/components/product-page";

export function ProduitSlugPage({ slug }: { slug: string }) {
  const { product } = useFirebaseProduct(slug);

  return <ProductPage slug={slug} product={product ?? undefined} />;
}
