import { SITE_URL } from "@/lib/site";

export const metadata = {
  title: "Conditions générales de vente | Coin Original",
  description: "Conditions générales de vente de Coin Original — paiement, livraison, retours et remboursements au Maroc.",
};

export default function CGVPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Conditions générales de vente</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Préambule</h2>
        <p className="text-gray-700 leading-relaxed">
          Les présentes conditions générales de vente (CGV) régissent les relations entre la boutique <strong>Coin Original</strong> et ses clients pour tout achat effectué sur le site {SITE_URL}.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Produits</h2>
        <p className="text-gray-700 leading-relaxed">
          Les produits proposés sont des articles de streetwear, sneakers, vêtements et accessoires. Les descriptions, photos et prix sont indiqués pour chaque produit. Coin Original s'efforce de garantir l'exactitude des informations, mais des variations de couleur peuvent exister selon les écrans.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Prix</h2>
        <p className="text-gray-700 leading-relaxed">
          Les prix sont indiqués en <strong>Dirhams marocains (MAD)</strong> et sont susceptibles de modification sans préavis. Le prix payé est celui en vigueur au moment de la commande. La livraison est gratuite à partir de 500 MAD d'achat.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Commande</h2>
        <p className="text-gray-700 leading-relaxed">
          Le client passe commande en ajoutant les produits au panier et en validant le checkout. La commande est confirmée par un message de succès à l'écran. Coin Original se réserve le droit d'annuler une commande en cas de problème de stock ou de suspicion de fraude.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Paiement</h2>
        <p className="text-gray-700 leading-relaxed">
          Le paiement se fait exclusivement <strong>à la livraison</strong> (paiement en espèces au livreur). Aucun paiement en ligne n'est accepté pour le moment. Des frais de livraison de 15 MAD peuvent s'appliquer pour les commandes inférieures à 500 MAD.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Livraison</h2>
        <p className="text-gray-700 leading-relaxed">
          La livraison est effectuée au Maroc uniquement. Le délai de livraison estimé est de <strong>3 à 5 jours ouvrés</strong> selon la ville. Le client est contacté par téléphone avant la livraison pour confirmer l'adresse et le créneau horaire.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Retours et échanges</h2>
        <p className="text-gray-700 leading-relaxed">
          Le client dispose d'un délai de <strong>7 jours</strong> après réception pour demander un retour ou un échange. Le produit doit être dans son état d'origine, non porté, avec les étiquettes intactes. Les frais de retour sont à la charge du client sauf en cas de produit défectueux.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Remboursements</h2>
        <p className="text-gray-700 leading-relaxed">
          En cas de retour accepté, le remboursement est effectué sous <strong>14 jours</strong> par virement bancaire ou en espèces selon le choix du client. Les frais de livraison initiaux ne sont pas remboursés.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">9. Droit de rétractation</h2>
        <p className="text-gray-700 leading-relaxed">
          Conformément à la législation marocaine, le client dispose d'un droit de rétractation de 7 jours. Pour l'exercer, le client doit contacter Coin Original par email ou WhatsApp avec sa référence de commande.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">10. Service client</h2>
        <p className="text-gray-700 leading-relaxed">
          Pour toute question, réclamation ou demande de retour :<br />
          Email : contact@coinoriginal.shop<br />
          WhatsApp : +212 6XX XX XX XX<br />
          Horaires : du lundi au samedi, 9h à 18h
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">11. Droit applicable</h2>
        <p className="text-gray-700 leading-relaxed">
          Les présentes CGV sont soumises au droit marocain. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux de Casablanca seront compétents.
        </p>
      </section>

      <p className="text-sm text-gray-500 mt-12">Dernière mise à jour : juillet 2026</p>
    </main>
  );
}
