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
  try {
    const products = await fetchAdminProducts();
    if (products.length > 0) {
      return products.map((product) => ({
        slug: product.slug,
      }));
    }
  } catch {
    // Firebase not available, use hardcoded catalog
  }

  // Fallback: use hardcoded catalog products for static export
  return catalogProducts.map((product) => ({
    slug: product.slug,
  }));
}

export const dynamic = "force-static";

export default async function ProduitPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return (
    <>
      <ProduitSlugPage slug={slug} />
      <JsonLd data={{}} />
    </>
  );
}
