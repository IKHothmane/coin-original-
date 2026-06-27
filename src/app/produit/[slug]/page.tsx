import { notFound } from "next/navigation";
import { catalogProducts, getProductBySlug } from "@/components/catalog-data";
import { ProductPage } from "@/components/product-page";

type ProductRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return catalogProducts.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProduitSlugPage({ params }: ProductRouteProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductPage key={product.slug} product={product} />;
}
