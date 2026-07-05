export function getProductHref(slug: string) {
  return `/produit?slug=${encodeURIComponent(slug)}`;
}
