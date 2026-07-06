import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { ContactPageClient } from "@/components/contact-page-client";

export const metadata = {
  title: "Contact | Coin Original",
  description: "Contactez Coin Original — WhatsApp, téléphone, email et réseaux sociaux. Service client disponible du lundi au samedi.",
};

export default function ContactPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+212600000000";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\+/g, "")}`;
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com/coinoriginal";
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://facebook.com/coinoriginal";
  const tiktokUrl = process.env.NEXT_PUBLIC_TIKTOK_URL ?? "https://tiktok.com/@coinoriginal";
  const siteUrl = SITE_URL;

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact | Coin Original",
    url: `${siteUrl}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "Coin Original",
      url: siteUrl,
      logo: `${siteUrl}/og-image.png`,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: whatsappNumber,
        contactType: "customer service",
        areaServed: "MA",
        availableLanguage: ["French", "Arabic"],
      },
      sameAs: [instagramUrl, facebookUrl, tiktokUrl].filter(Boolean),
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Quel est le délai de livraison ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "3 à 5 jours ouvrés selon la ville. Livraison gratuite à partir de 500 MAD.",
        },
      },
      {
        "@type": "Question",
        name: "Comment puis-je retourner un article ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Vous avez 7 jours après réception. Contactez-nous par WhatsApp avec votre numéro de commande.",
        },
      },
      {
        "@type": "Question",
        name: "Quels modes de paiement acceptez-vous ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Paiement à la livraison en espèces uniquement. Aucun paiement en ligne requis.",
        },
      },
    ],
  };

  const jsonLdData = [contactJsonLd, faqJsonLd];

  return (
    <>
      <ContactPageClient />
      <JsonLd data={jsonLdData} />
    </>
  );
}
