"use client";

import { useFirebaseProduct } from "@/lib/products/storefront";
import { ProductPage } from "@/components/product-page";

export function ProduitSlugPage({ slug }: { slug: string }) {
  // Skip Firebase fetch for build-time placeholder slug
  const { product, loading } = useFirebaseProduct(slug === "placeholder" ? "" : slug);

  if (loading && slug !== "placeholder") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement du produit...</p>
      </div>
    );
  }

  return <ProductPage slug={slug === "placeholder" ? "" : slug} product={product ?? undefined} />;
}
