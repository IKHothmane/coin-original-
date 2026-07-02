import type { Metadata } from "next";
import { BoutiquePage } from "@/components/boutique-page";
import { JsonLd } from "@/components/json-ld";
import { fetchCatalogProductsWithFallback } from "@/lib/products/storefront";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Boutique | Sneakers & Streetwear Maroc",
  description:
    "Achete les derniers sneakers, vetements et accessoires streetwear au Maroc. Filtre par categorie, taille et prix. Paiement a la livraison.",
  openGraph: {
    title: "Boutique | Sneakers & Streetwear Maroc",
    description: "Collection streetwear et sneakers au Maroc avec paiement a la livraison.",
    url: "/boutique",
  },
};

export default async function BoutiqueRoute() {
  const products = await fetchCatalogProductsWithFallback();
  const siteUrl = SITE_URL;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Boutique",
        item: `${siteUrl}/boutique`,
      },
    ],
  };

  return (
    <>
      <BoutiquePage initialProducts={products} />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
