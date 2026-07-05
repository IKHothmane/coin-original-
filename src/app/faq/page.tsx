import type { Metadata } from "next";
import {
  BottomDock,
  DesktopTopBar,
  MobileDrawer,
  MobileTopBar,
  SiteFooter,
  ThemeLogo,
} from "@/components/homepage-sections";

export const metadata: Metadata = {
  title: "FAQ | Coin Original",
  description: "Questions fréquentes sur Coin Original — livraison, paiement, retours et tailles.",
};

const faqs = [
  {
    question: "Comment passer une commande ?",
    answer:
      "Ajoutez les produits à votre panier, puis cliquez sur 'Valider ma commande'. Remplissez vos informations (nom, téléphone, ville, adresse) et confirmez. Vous recevrez une confirmation par WhatsApp.",
  },
  {
    question: "Quels sont les modes de paiement ?",
    answer:
      "Nous proposons le paiement à la livraison (cash on delivery) dans tout le Maroc. Aucun paiement en ligne n'est requis.",
  },
  {
    question: "Quel est le délai de livraison ?",
    answer:
      "La livraison est gratuite au Maroc. Les délais sont de 24h à 48h pour Casablanca, Rabat, Marrakech et Tanger. Pour les autres villes, comptez 2 à 5 jours ouvrables.",
  },
  {
    question: "Puis-je retourner un produit ?",
    answer:
      "Oui, vous disposez de 7 jours après réception pour retourner un produit non porté, dans son emballage d'origine, avec l'étiquette. Contactez-nous sur WhatsApp pour organiser le retour.",
  },
  {
    question: "Comment choisir ma taille ?",
    answer:
      "Chaque produit affiche les tailles disponibles. Pour les chaussures, nous utilisons les tailles européennes standard. Pour les vêtements, consultez le guide des tailles sur la fiche produit.",
  },
  {
    question: "Les produits sont-ils authentiques ?",
    answer:
      "Oui, tous nos produits sont 100% authentiques et vérifiés avant expédition. Nous travaillons directement avec les fournisseurs officiels.",
  },
  {
    question: "Puis-je modifier ou annuler ma commande ?",
    answer:
      "Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant la validation. Contactez-nous rapidement sur WhatsApp.",
  },
  {
    question: "Livrez-vous partout au Maroc ?",
    answer:
      "Oui, nous livrons dans toutes les villes du Maroc via Amana Express et les services de livraison locales.",
  },
];

export default function FAQPage() {
  return (
    <div className="brand-shell brand-grid min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <DesktopTopBar mobileMenuOpen={false} onOpenMobileMenu={() => {}} />
      <MobileTopBar onOpenMobileMenu={() => {}} />
      <MobileDrawer mobileMenuOpen={false} onCloseMobileMenu={() => {}} />
      <BottomDock mobileMenuOpen={false} onOpenMobileMenu={() => {}} />

      <main className="min-h-screen px-3 pb-24 pt-20 md:px-5 md:pt-28">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 font-[var(--font-display)] text-3xl uppercase text-[var(--primary)] sm:text-4xl md:text-5xl">
            FAQ
          </h1>
          <p className="mb-8 text-sm text-[var(--muted)] sm:text-base">
            Questions fréquentes sur Coin Original
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 sm:p-6"
              >
                <h2 className="font-[var(--font-display)] text-lg uppercase text-[var(--primary)] sm:text-xl">
                  {faq.question}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)] sm:text-base">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 text-center sm:p-6">
            <p className="text-sm text-[var(--muted)]">
              Vous ne trouvez pas votre réponse ? Contactez-nous sur{" "}
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary)] hover:underline"
              >
                WhatsApp
              </a>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
