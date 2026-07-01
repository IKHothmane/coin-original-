import { catalogProducts, getProductBySlug } from "@/components/catalog-data";
import { ProductPage } from "@/components/product-page";
import { fetchCatalogProductsWithFallback } from "@/lib/firebase/storefront";

type ProductRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  try {
    const firebaseProducts = await fetchCatalogProductsWithFallback();
    const firebaseSlugs = firebaseProducts.map((product) => product.slug);
    const catalogSlugs = catalogProducts.map((product) => product.slug);
    const allSlugs = Array.from(new Set([...catalogSlugs, ...firebaseSlugs]));

    return allSlugs.map((slug) => ({ slug }));
  } catch {
    // Fallback to hardcoded catalog if Firebase is unreachable during build
    return catalogProducts.map((product) => ({
      slug: product.slug,
    }));
  }
}

export default async function ProduitSlugPage({ params }: ProductRouteProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug) ?? undefined;

  return <ProductPage key={slug} slug={slug} product={product} />;
}
