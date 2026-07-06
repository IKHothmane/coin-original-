"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import {
  BottomDock,
  DesktopTopBar,
  MobileDrawer,
  MobileTopBar,
} from "@/components/homepage-sections";

type ContactCard = {
  title: string;
  description: string;
  value: string;
  href?: string;
  icon: LucideIcon;
  accent: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

function ContactInfoCard({ item }: { item: ContactCard }) {
  const Icon = item.icon;

  return (
    <a
      href={item.href}
      target={item.href?.startsWith("http") ? "_blank" : undefined}
      rel={item.href?.startsWith("http") ? "noreferrer noopener" : undefined}
      className={`group border p-5 transition-transform duration-300 hover:-translate-y-1 ${item.accent} ${item.href ? "" : "pointer-events-none"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex h-11 w-11 items-center justify-center border border-[var(--border-soft)] bg-[var(--surface)] text-[var(--primary)]">
          <Icon size={18} />
        </span>
        {item.href ? (
          <ChevronRight
            size={18}
            className="text-[var(--muted)] transition-transform duration-300 group-hover:translate-x-1"
          />
        ) : null}
      </div>

      <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
        {item.title}
      </p>
      <p className="mt-2 text-lg text-[var(--foreground)] sm:text-xl">{item.value}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
    </a>
  );
}

export function ContactPageClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+212600000000";
  const whatsappCleanNumber = whatsappNumber.replace(/\+/g, "");
  const whatsappLink = `https://wa.me/${whatsappCleanNumber}`;
  const instagramUrl =
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
    "https://instagram.com/coinoriginal";
  const facebookUrl =
    process.env.NEXT_PUBLIC_FACEBOOK_URL ??
    "https://facebook.com/coinoriginal";
  const tiktokUrl =
    process.env.NEXT_PUBLIC_TIKTOK_URL ?? "https://tiktok.com/@coinoriginal";

  const contactCards: ContactCard[] = [
    {
      title: "WhatsApp",
      value: whatsappNumber,
      description: "Canal principal pour confirmer les commandes et obtenir une reponse rapide.",
      href: whatsappLink,
      icon: MessageCircle,
      accent:
        "border-[var(--primary)]/40 bg-[color:color-mix(in_srgb,var(--primary)_10%,var(--surface-soft))]",
    },
    {
      title: "Telephone",
      value: whatsappNumber,
      description: "Disponible du lundi au samedi pour le suivi, les confirmations et les questions urgentes.",
      href: `tel:${whatsappNumber}`,
      icon: Phone,
      accent: "border-[var(--border-soft)] bg-[var(--surface-soft)]",
    },
    {
      title: "Email",
      value: "contact@coinoriginal.shop",
      description: "Pour les demandes detaillees, partenariats ou sujets administratifs.",
      href: "mailto:contact@coinoriginal.shop",
      icon: Mail,
      accent: "border-[var(--border-soft)] bg-[var(--surface-soft)]",
    },
    {
      title: "Adresse",
      value: "Casablanca, Maroc",
      description: "Livraison disponible dans tout le Maroc avec suivi de commande simplifie.",
      icon: MapPin,
      accent: "border-[var(--border-soft)] bg-[var(--surface-soft)]",
    },
  ];

  const faqItems: FaqItem[] = [
    {
      question: "Quel est le delai de livraison ?",
      answer:
        "Le delai moyen est de 24h a 48h selon la ville et la disponibilite du produit.",
    },
    {
      question: "Comment modifier une commande ?",
      answer:
        "Ecrivez-nous rapidement sur WhatsApp avec votre reference pour ajuster la commande avant expedition.",
    },
    {
      question: "Quels paiements acceptez-vous ?",
      answer:
        "Le paiement se fait a la livraison au Maroc. Aucun paiement en ligne n'est requis.",
    },
  ];

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

      <main className="w-full px-3 pb-24 pt-20 md:px-5 md:pt-28">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <section className="overflow-hidden border border-[var(--border-soft)] bg-[var(--surface)]">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-5 sm:p-7 md:p-8 lg:p-10">
                <div className="inline-flex items-center gap-2 border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[var(--primary)]">
                  <MessageCircle size={14} />
                  Support Coin Original
                </div>
                <h1 className="roca-display mt-5 max-w-4xl text-4xl text-[var(--foreground)] sm:text-5xl md:text-6xl">
                  Contact
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base md:text-lg">
                  Une question sur une commande, une taille, une livraison ou un
                  retour ? Contactez-nous via le canal le plus rapide.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 border border-[var(--border-soft)] px-3 py-2 text-xs uppercase tracking-[0.16em] text-[var(--foreground)]">
                    <Clock3 size={14} className="text-[var(--primary)]" />
                    Lun - Sam 9h - 18h
                  </div>
                  <div className="inline-flex items-center gap-2 border border-[var(--border-soft)] px-3 py-2 text-xs uppercase tracking-[0.16em] text-[var(--foreground)]">
                    <Truck size={14} className="text-[var(--primary)]" />
                    Livraison Maroc
                  </div>
                  <div className="inline-flex items-center gap-2 border border-[var(--border-soft)] px-3 py-2 text-xs uppercase tracking-[0.16em] text-[var(--foreground)]">
                    <ShieldCheck size={14} className="text-[var(--primary)]" />
                    Confirmation WhatsApp
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border-soft)] bg-[var(--surface-soft)] p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-10">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                  Reseaux
                </p>
                <div className="mt-5 grid gap-4">
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="border border-[var(--border-soft)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--primary)]"
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                      Instagram
                    </p>
                    <p className="mt-1 text-base text-[var(--foreground)]">
                      @coinoriginal
                    </p>
                  </a>
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="border border-[var(--border-soft)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--primary)]"
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                      Facebook
                    </p>
                    <p className="mt-1 text-base text-[var(--foreground)]">
                      Coin Original
                    </p>
                  </a>
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="border border-[var(--border-soft)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--primary)]"
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                      TikTok
                    </p>
                    <p className="mt-1 text-base text-[var(--foreground)]">
                      @coinoriginal
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {contactCards.map((item) => (
              <ContactInfoCard key={item.title} item={item} />
            ))}
          </section>

          <section className="border border-[var(--border-soft)] bg-[var(--surface-soft)] p-5 sm:p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--primary)]">
              Questions frequentes
            </p>
            <div className="mt-4 space-y-4">
              {faqItems.map((faq) => (
                <details
                  key={faq.question}
                  className="border border-[var(--border-soft)] bg-[var(--surface)] p-4"
                >
                  <summary className="roca-display cursor-pointer list-none text-xl text-[var(--foreground)]">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)] sm:text-base">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
