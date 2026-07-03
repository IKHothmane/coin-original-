"use client";

import { useFirebaseProduct } from "@/lib/products/storefront";
import { ProductPage } from "@/components/product-page";

export function ProduitSlugPage({ slug }: { slug: string }) {
  const { product, loading } = useFirebaseProduct(slug);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement du produit...</p>
      </div>
    );
  }

  return <ProductPage slug={slug} product={product ?? undefined} />;
}
