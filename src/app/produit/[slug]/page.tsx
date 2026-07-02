import type { Metadata } from "next";
import { ProduitSlugPage } from "@/components/produit-slug-page";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/site";
import { fetchAdminProducts } from "@/lib/firebase/products";

export const metadata: Metadata = {
  title: "Produit | Coin Original",
  description: "Details du produit streetwear au Maroc.",
};

export async function generateStaticParams() {
  try {
    const products = await fetchAdminProducts();
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch {
    // Return empty array or fallback if Firebase is not available
    return [];
  }
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
