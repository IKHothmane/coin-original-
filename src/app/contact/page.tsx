import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

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
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">Contact</h1>
        <p className="text-gray-600 mb-8">
          Une question ? Un problème ? Nous sommes là pour vous aider.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
              💬
            </div>
            <div>
              <h3 className="font-semibold text-green-800">WhatsApp</h3>
              <p className="text-sm text-green-700">Réponse rapide garantie</p>
              <p className="text-sm text-green-600 font-mono">{whatsappNumber}</p>
            </div>
          </a>

          {/* Téléphone */}
          <a
            href={`tel:${whatsappNumber}`}
            className="flex items-center gap-4 p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
              📞
            </div>
            <div>
              <h3 className="font-semibold text-blue-800">Téléphone</h3>
              <p className="text-sm text-blue-700">Du lundi au samedi, 9h-18h</p>
              <p className="text-sm text-blue-600 font-mono">{whatsappNumber}</p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:contact@coinoriginal.shop"
            className="flex items-center gap-4 p-6 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
              ✉️
            </div>
            <div>
              <h3 className="font-semibold text-orange-800">Email</h3>
              <p className="text-sm text-orange-700">Réponse sous 24h</p>
              <p className="text-sm text-orange-600 font-mono">contact@coinoriginal.shop</p>
            </div>
          </a>

          {/* Adresse */}
          <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white text-xl">
              📍
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Adresse</h3>
              <p className="text-sm text-gray-700">Casablanca, Maroc</p>
              <p className="text-sm text-gray-600">Livraison dans tout le Maroc</p>
            </div>
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Suivez-nous</h2>
          <div className="flex gap-4">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Instagram
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Facebook
            </a>
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              TikTok
            </a>
          </div>
        </div>

        {/* FAQ rapide */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Questions fréquentes</h2>
          <div className="space-y-4">
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-medium cursor-pointer">Quel est le délai de livraison ?</summary>
              <p className="text-gray-600 mt-2">3 à 5 jours ouvrés selon la ville. Livraison gratuite à partir de 500 MAD.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-medium cursor-pointer">Comment puis-je retourner un article ?</summary>
              <p className="text-gray-600 mt-2">Vous avez 7 jours après réception. Contactez-nous par WhatsApp avec votre numéro de commande.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-medium cursor-pointer">Quels modes de paiement acceptez-vous ?</summary>
              <p className="text-gray-600 mt-2">Paiement à la livraison en espèces uniquement. Aucun paiement en ligne requis.</p>
            </details>
          </div>
        </div>
      </main>
      <JsonLd data={jsonLdData} />
    </>
  );
}
