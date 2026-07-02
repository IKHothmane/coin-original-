import type { Metadata } from "next";
import { Homepage } from "@/components/homepage";
import { JsonLd } from "@/components/json-ld";
import { RootHostRedirect } from "@/components/root-host-redirect";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Streetwear Premium Maroc | Sneakers & Vetements Urbains",
  description:
    "Decouvre la collection Coin Original : sneakers, hoodies, t-shirts et accessoires streetwear au Maroc. Paiement a la livraison et livraison gratuite.",
  openGraph: {
    title: "Streetwear Premium Maroc | Sneakers & Vetements Urbains",
    description:
      "Decouvre la collection Coin Original : sneakers, hoodies, t-shirts et accessoires streetwear au Maroc.",
    url: "/",
  },
};

export default function Home() {
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
    ],
  };

  return (
    <>
      <RootHostRedirect />
      <Homepage />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
