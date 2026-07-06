import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { LegalContentPage } from "@/components/legal-content-page";

export const metadata = {
  title: "Politique de confidentialité | Coin Original",
  description: "Politique de confidentialité de Coin Original — collecte, utilisation et protection des données personnelles.",
};

export default function PolitiqueConfidentialitePage() {
  const siteUrl = SITE_URL;

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Politique de confidentialité | Coin Original",
    url: `${siteUrl}/politique-confidentialite`,
    description: "Politique de confidentialité de Coin Original — collecte, utilisation et protection des données personnelles.",
    publisher: {
      "@type": "Organization",
      name: "Coin Original",
      url: siteUrl,
    },
  };

  return (
    <>
      <LegalContentPage
        eyebrow="Protection des donnees"
        title="Politique de confidentialite"
        intro={`Cette page explique comment Coin Original collecte, utilise, conserve et protege vos donnees personnelles lorsque vous naviguez sur ${siteUrl} ou passez une commande.`}
        updateLabel="Juillet 2026"
        badges={["Loi 09-08", "Donnees clients", "Cookies & analytics"]}
        sections={[
          {
            id: "01",
            title: "Introduction",
            description:
              "Coin Original s'engage a proteger la vie privee de ses utilisateurs et a traiter les donnees personnelles avec transparence.",
            icon: "shield",
          },
          {
            id: "02",
            title: "Donnees collectees",
            description:
              "Nous pouvons collecter les donnees necessaires au traitement des commandes, a la navigation et a la securite technique du site.",
            icon: "blocks",
            highlights: [
              "Nom, ville, telephone et informations utiles a la commande",
              "Pages consultees et interactions analytiques",
              "Adresse IP, navigateur et appareil utilise",
            ],
          },
          {
            id: "03",
            title: "Finalite de la collecte",
            description:
              "Les donnees servent a assurer le service client, confirmer les commandes, livrer les produits et ameliorer la boutique.",
            icon: "user",
            highlights: [
              "Traiter et suivre vos commandes",
              "Communiquer avec vous au sujet de votre achat",
              "Ameliorer le site et repondre aux obligations legales",
            ],
          },
          {
            id: "04",
            title: "Conservation",
            description:
              "Les donnees de commande sont conservees pendant 3 ans a compter de la derniere commande. Les donnees analytiques sont conservees pendant 14 mois.",
            icon: "clock",
          },
          {
            id: "05",
            title: "Partage des donnees",
            description:
              "Vos donnees ne sont pas revendues. Elles peuvent etre partagees uniquement avec les partenaires strictement necessaires ou en cas d'obligation legale.",
            icon: "building",
            highlights: [
              "Services de livraison",
              "Outils analytiques comme Google Analytics",
              "Autorites competentes si la loi l'exige",
            ],
          },
          {
            id: "06",
            title: "Vos droits",
            description:
              "Conformement a la loi marocaine 09-08, vous disposez notamment d'un droit d'acces, de rectification, de suppression et d'opposition.",
            icon: "scale",
            highlights: [
              "Demander une copie de vos donnees",
              "Faire corriger une information inexacte",
              "Demander la suppression ou vous opposer a certains traitements",
            ],
          },
          {
            id: "07",
            title: "Cookies",
            description:
              "Le site utilise des cookies fonctionnels pour le panier et les preferences, ainsi que des cookies analytiques pour mesurer l'audience.",
            icon: "bot",
          },
          {
            id: "08",
            title: "Securite",
            description:
              "Nous mettons en place des mesures techniques et organisationnelles raisonnables pour proteger vos informations et limiter les acces non autorises.",
            icon: "lock",
          },
          {
            id: "09",
            title: "Modifications",
            description:
              "Cette politique peut evoluer a tout moment. La version a jour est toujours publiee sur cette page avec sa date de mise a jour.",
            icon: "bell",
          },
          {
            id: "10",
            title: "Contact",
            description:
              "Pour exercer vos droits ou poser une question sur vos donnees, contactez-nous directement par email.",
            icon: "file",
            highlights: [
              "Email : contact@coinoriginal.shop",
              "Ville : Casablanca, Maroc",
            ],
          },
        ]}
        calloutTitle="Une question sur vos donnees ?"
        calloutText="Notre equipe peut vous repondre concernant la collecte, la conservation ou la suppression de vos donnees personnelles."
        calloutHref="mailto:contact@coinoriginal.shop"
        calloutLabel="Contacter par email"
      />
      <JsonLd data={webPageJsonLd} />
    </>
  );
}
