import type { Metadata } from "next";
import { ProduitSlugPage } from "@/components/produit-slug-page";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/site";
import { fetchAdminProducts } from "@/lib/firebase/products";
import { catalogProducts } from "@/components/catalog-data";

export const metadata: Metadata = {
  title: "Produit | Coin Original",
  description: "Details du produit streetwear au Maroc.",
};

export async function generateStaticParams() {
  let slugs = new Set<string>();

  // Always include hardcoded catalog products
  catalogProducts.forEach((product) => slugs.add(product.slug));

  // Also include Firebase products if available
  try {
    const products = await fetchAdminProducts();
    products.forEach((product) => slugs.add(product.slug));
  } catch {
    // Firebase not available, catalog products already included
  }

  return Array.from(slugs).map((slug) => ({ slug }));
}

export const dynamic = "force-static";

export default async function ProduitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <>
      <ProduitSlugPage slug={slug} />
      <JsonLd data={{}} />
    </>
  );
}
