import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { MentionsLegalesPageClient } from "@/components/mentions-legales-page";

export const metadata = {
  title: "Mentions légales | Coin Original",
  description: "Mentions légales de la boutique Coin Original — informations sur l'éditeur, l'hébergement et les conditions d'utilisation.",
};

export default function MentionsLegalesPage() {
  const siteUrl = SITE_URL;

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Mentions légales | Coin Original",
    url: `${siteUrl}/mentions-legales`,
    description: "Mentions légales de la boutique Coin Original — informations sur l'éditeur, l'hébergement et les conditions d'utilisation.",
    publisher: {
      "@type": "Organization",
      name: "Coin Original",
      url: siteUrl,
    },
  };

  return (
    <>
      <MentionsLegalesPageClient />
      <JsonLd data={webPageJsonLd} />
    </>
  );
}
