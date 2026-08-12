import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { LegalContentPage } from "@/components/legal-content-page";
import { getSupportPhoneE164 } from "@/lib/contact";

export const metadata = {
  title: "Conditions générales de vente | Coin Original",
  description: "Conditions générales de vente de Coin Original — paiement, livraison, retours et remboursements au Maroc.",
};

export default function CGVPage() {
  const siteUrl = SITE_URL;
  const supportPhone = getSupportPhoneE164();

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Conditions générales de vente | Coin Original",
    url: `${siteUrl}/cgv`,
    description: "Conditions générales de vente de Coin Original — paiement, livraison, retours et remboursements au Maroc.",
    publisher: {
      "@type": "Organization",
      name: "Coin Original",
      url: siteUrl,
    },
  };

  return (
    <>
      <LegalContentPage
        eyebrow="Conditions de vente"
        title="Conditions generales de vente"
        intro={`Les presentes CGV encadrent les achats effectues sur ${siteUrl}, notamment les produits proposes, les prix, le paiement a la livraison, la livraison au Maroc et les retours.`}
        updateLabel="Juillet 2026"
        badges={["Paiement a la livraison", "Livraison Maroc", "Retours encadres"]}
        sections={[
          {
            id: "01",
            title: "Preambule",
            description:
              "Les presentes conditions generales de vente regissent la relation entre Coin Original et ses clients pour toute commande passee sur le site.",
            icon: "file",
          },
          {
            id: "02",
            title: "Produits",
            description:
              "Les articles proposes comprennent notamment sneakers, vetements et accessoires. Les visuels et descriptions sont presentes avec le plus grand soin.",
            icon: "blocks",
          },
          {
            id: "03",
            title: "Prix",
            description:
              "Les prix sont exprimes en dirhams marocains. Le montant facture est celui affiche au moment de la commande.",
            icon: "wallet",
            highlights: [
              "Prix susceptibles d'evoluer sans preavis",
              "Livraison gratuite a partir de 500 MAD",
            ],
          },
          {
            id: "04",
            title: "Commande",
            description:
              "La commande est passee depuis le panier puis confirmee via le parcours de checkout et le canal de confirmation defini par la boutique.",
            icon: "user",
            highlights: [
              "Validation apres ajout au panier",
              "Annulation possible en cas de stock indisponible ou fraude suspectee",
            ],
          },
          {
            id: "05",
            title: "Paiement",
            description:
              "Le paiement se fait exclusivement a la livraison. Aucun paiement en ligne n'est exige pour finaliser l'achat.",
            icon: "wallet",
            highlights: [
              "Paiement en especes au livreur",
              "Frais eventuels de 15 MAD sous 500 MAD",
            ],
          },
          {
            id: "06",
            title: "Livraison",
            description:
              "La livraison est disponible au Maroc uniquement. Le client peut etre contacte avant expedition ou livraison pour confirmer les informations utiles.",
            icon: "truck",
            highlights: [
              "Delai estimatif de 3 a 5 jours ouvres",
              "Confirmation avant livraison si necessaire",
            ],
          },
          {
            id: "07",
            title: "Retours et echanges",
            description:
              "Un retour ou un echange peut etre demande dans un delai de 7 jours apres reception, sous reserve du respect des conditions du produit.",
            icon: "shield",
            highlights: [
              "Produit non porte avec etiquettes intactes",
              "Retour a la charge du client sauf produit defectueux",
            ],
          },
          {
            id: "08",
            title: "Remboursements",
            description:
              "En cas de retour accepte, le remboursement intervient sous 14 jours selon la solution retenue avec le client.",
            icon: "clock",
          },
          {
            id: "09",
            title: "Retractation",
            description:
              "Le client dispose d'un droit de retractation de 7 jours conformement a la legislation applicable, en contactant Coin Original avec sa reference.",
            icon: "badge",
          },
          {
            id: "10",
            title: "Service client",
            description:
              "Pour toute demande, notre service client reste joignable par email ou WhatsApp.",
            icon: "bell",
            highlights: [
              "Email : contact@coinoriginal.shop",
              `WhatsApp : ${supportPhone}`,
              "Horaires : lundi au samedi, 9h a 18h",
            ],
          },
          {
            id: "11",
            title: "Droit applicable",
            description:
              "Les presentes CGV sont soumises au droit marocain. En cas de litige, une resolution amiable est privilegiee avant toute procedure.",
            icon: "scale",
            highlights: ["Tribunaux competents : Casablanca"],
          },
        ]}
        calloutTitle="Une question sur une commande ?"
        calloutText="Pour le suivi, les retours, les echanges ou une reclamation, le plus rapide reste WhatsApp ou l'email du support."
        calloutHref="/contact"
        calloutLabel="Voir la page contact"
      />
      <JsonLd data={webPageJsonLd} />
    </>
  );
}
