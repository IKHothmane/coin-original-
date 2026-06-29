import { catalogProducts } from "@/components/catalog-data";
import { ProductPage } from "@/components/product-page";

export default function ProduitPage() {
  return <ProductPage key={catalogProducts[0].slug} slug={catalogProducts[0].slug} product={catalogProducts[0]} />;
}
