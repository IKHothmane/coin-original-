import {
  catalogProducts,
  featuredProductSlugs,
  type CatalogProduct,
} from "@/components/catalog-data";
import type { FeaturedProduct } from "@/components/homepage-data";
import { getProductRepository } from "./repository";

function toFeaturedProduct(product: CatalogProduct): FeaturedProduct {
  return {
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    badge: product.badge?.label,
    badgeTone: product.badge?.tone,
    image: product.image,
  };
}

export async function fetchCatalogProductsWithFallback() {
  const repository = getProductRepository();
  return repository.fetchCatalogProducts();
}

export async function fetchCatalogProductBySlugWithFallback(slug: string) {
  const repository = getProductRepository();
  return repository.fetchCatalogProductBySlug(slug);
}

export async function fetchFeaturedProductsWithFallback() {
  const products = await fetchCatalogProductsWithFallback();
  const featured = featuredProductSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is CatalogProduct => Boolean(product))
    .map(toFeaturedProduct);

  if (featured.length > 0) {
    return featured;
  }

  return products.slice(0, 4).map(toFeaturedProduct);
}

export { catalogProducts, featuredProductSlugs };
