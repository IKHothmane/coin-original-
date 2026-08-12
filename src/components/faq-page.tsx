"use client";

import { useState } from "react";
import {
  BottomDock,
  DesktopTopBar,
  MobileDrawer,
  MobileTopBar,
  SiteFooter,
} from "@/components/homepage-sections";
import { getWhatsAppHref } from "@/lib/contact";

const faqs = [
  {
    question: "Comment passer une commande ?",
    answer:
      "Ajoutez les produits a votre panier, puis cliquez sur 'Valider ma commande'. Remplissez vos informations (nom, telephone, ville, adresse) et confirmez. Vous recevrez une confirmation par WhatsApp.",
  },
  {
    question: "Quels sont les modes de paiement ?",
    answer:
      "Nous proposons le paiement a la livraison (cash on delivery) dans tout le Maroc. Aucun paiement en ligne n'est requis.",
  },
  {
    question: "Quel est le delai de livraison ?",
    answer:
      "La livraison est gratuite au Maroc. Les delais sont de 24h a 48h pour Casablanca, Rabat, Marrakech et Tanger. Pour les autres villes, comptez 2 a 5 jours ouvrables.",
  },
  {
    question: "Puis-je retourner un produit ?",
    answer:
      "Oui, vous disposez de 7 jours apres reception pour retourner un produit non porte, dans son emballage d'origine, avec l'etiquette. Contactez-nous sur WhatsApp pour organiser le retour.",
  },
  {
    question: "Comment choisir ma taille ?",
    answer:
      "Chaque produit affiche les tailles disponibles. Pour les chaussures, nous utilisons les tailles europeennes standard. Pour les vetements, consultez le guide des tailles sur la fiche produit.",
  },
  {
    question: "Les produits sont-ils authentiques ?",
    answer:
      "Oui, tous nos produits sont 100% authentiques et verifies avant expedition. Nous travaillons directement avec les fournisseurs officiels.",
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

export function FAQPageClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="brand-shell brand-grid min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <DesktopTopBar
        mobileMenuOpen={mobileMenuOpen}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />
      <MobileTopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileDrawer
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />
      <BottomDock
        mobileMenuOpen={mobileMenuOpen}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      <main className="page-with-header min-h-screen px-3 pb-24 md:px-5">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 font-[var(--font-display)] text-3xl uppercase text-[var(--primary)] sm:text-4xl md:text-5xl">
            FAQ
          </h1>
          <p className="mb-8 text-sm text-[var(--muted)] sm:text-base">
            Questions frequentes sur Coin Original
          </p>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
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
              Vous ne trouvez pas votre reponse ? Contactez-nous sur{" "}
              <a
                href={getWhatsAppHref()}
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
