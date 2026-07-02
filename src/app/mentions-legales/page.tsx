import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

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
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">1. Éditeur du site</h2>
          <p className="text-gray-700 leading-relaxed">
            Le site <strong>Coin Original</strong> est édité par :<br />
            Nom : Coin Original<br />
            Adresse : Casablanca, Maroc<br />
            Email : contact@coinoriginal.shop<br />
            Téléphone : +212 6XX XX XX XX
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">2. Hébergement</h2>
          <p className="text-gray-700 leading-relaxed">
            Le site est hébergé par :<br />
            <strong>Cloudflare, Inc.</strong><br />
            101 Townsend Street, San Francisco, CA 94107, USA<br />
            Site web : <a href="https://www.cloudflare.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">www.cloudflare.com</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">3. Propriété intellectuelle</h2>
          <p className="text-gray-700 leading-relaxed">
            L'ensemble du contenu du site (textes, images, logos, marques) est la propriété exclusive de Coin Original ou de ses partenaires. Toute reproduction, distribution ou utilisation sans autorisation préalable est strictement interdite.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">4. Responsabilité</h2>
          <p className="text-gray-700 leading-relaxed">
            Coin Original s'efforce de garantir l'exactitude des informations publiées sur le site. Cependant, des erreurs ou omissions peuvent survenir. Coin Original ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation du site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">5. Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            Le site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic (Google Analytics). En naviguant sur le site, vous acceptez l'utilisation de ces cookies. Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">6. Droit applicable</h2>
          <p className="text-gray-700 leading-relaxed">
            Les présentes mentions légales sont soumises au droit marocain. En cas de litige, les tribunaux de Casablanca seront compétents.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-12">Dernière mise à jour : juillet 2026</p>
      </main>
      <JsonLd data={webPageJsonLd} />
    </>
  );
}
