import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Politique de confidentialité | Coin Original",
  description: "Politique de confidentialité de Coin Original — collecte, utilisation et protection des données personnelles.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
        <p className="text-gray-700 leading-relaxed">
          Coin Original s'engage à protéger la vie privée de ses utilisateurs. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles lorsque vous utilisez notre site {SITE_URL}.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Données collectées</h2>
        <p className="text-gray-700 leading-relaxed">
          Nous collectons les données suivantes :
        </p>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-2">
          <li><strong>Données de commande</strong> : nom, adresse, numéro de téléphone, WhatsApp</li>
          <li><strong>Données de navigation</strong> : pages visitées, temps passé, via Google Analytics</li>
          <li><strong>Données techniques</strong> : adresse IP, type de navigateur, appareil utilisé</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Finalité de la collecte</h2>
        <p className="text-gray-700 leading-relaxed">
          Vos données sont utilisées pour :
        </p>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-2">
          <li>Traiter et livrer vos commandes</li>
          <li>Vous contacter concernant votre commande</li>
          <li>Améliorer notre site et nos services</li>
          <li>Respecter nos obligations légales</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Conservation des données</h2>
        <p className="text-gray-700 leading-relaxed">
          Les données de commande sont conservées pendant <strong>3 ans</strong> à compter de la dernière commande. Les données de navigation (Google Analytics) sont conservées pendant <strong>14 mois</strong>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Partage des données</h2>
        <p className="text-gray-700 leading-relaxed">
          Vos données ne sont pas vendues à des tiers. Elles peuvent être partagées avec :
        </p>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-2">
          <li>Notre service de livraison (pour la livraison de vos commandes)</li>
          <li>Google Analytics (données de navigation anonymisées)</li>
          <li>Les autorités compétentes en cas d'obligation légale</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Vos droits</h2>
        <p className="text-gray-700 leading-relaxed">
          Conformément à la loi 09-08 relative à la protection des données personnelles au Maroc, vous disposez des droits suivants :
        </p>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-2">
          <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
          <li><strong>Droit de rectification</strong> : corriger vos données</li>
          <li><strong>Droit de suppression</strong> : demander l'effacement de vos données</li>
          <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-2">
          Pour exercer ces droits, contactez-nous à : <strong>contact@coinoriginal.shop</strong>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Cookies</h2>
        <p className="text-gray-700 leading-relaxed">
          Le site utilise des cookies pour :
        </p>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-2">
          <li><strong>Cookies fonctionnels</strong> : panier, préférences</li>
          <li><strong>Cookies analytiques</strong> : Google Analytics (pages vues, comportement)</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-2">
          Vous pouvez désactiver les cookies dans les paramètres de votre navigateur. Cela peut affecter certaines fonctionnalités du site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Sécurité</h2>
        <p className="text-gray-700 leading-relaxed">
          Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données : connexion sécurisée (HTTPS), hébergement chez Cloudflare, accès restreint aux données.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">9. Modifications</h2>
        <p className="text-gray-700 leading-relaxed">
          Cette politique peut être modifiée à tout moment. Les modifications sont publiées sur cette page avec la date de mise à jour.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">10. Contact</h2>
        <p className="text-gray-700 leading-relaxed">
          Pour toute question concernant cette politique :<br />
          Email : contact@coinoriginal.shop<br />
          Adresse : Casablanca, Maroc
        </p>
      </section>

      <p className="text-sm text-gray-500 mt-12">Dernière mise à jour : juillet 2026</p>
    </main>
  );
}
