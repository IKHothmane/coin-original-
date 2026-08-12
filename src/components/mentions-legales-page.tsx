"use client";

import { useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Building2,
  Cookie,
  Globe,
  Mail,
  MapPin,
  Phone,
  Scale,
  Shield,
  ShieldAlert,
  Store,
} from "lucide-react";
import {
  BottomDock,
  DesktopTopBar,
  MobileDrawer,
  MobileTopBar,
} from "@/components/homepage-sections";
import { getSupportPhoneE164 } from "@/lib/contact";

type LegalCard = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent?: "primary" | "accent";
  details?: Array<{
    label: string;
    value: string;
    href?: string;
  }>;
};

const legalCards: LegalCard[] = [
  {
    id: "01",
    title: "Editeur du site",
    description:
      "Coin Original exploite la boutique en ligne et assure la publication des contenus, offres et informations visibles sur le site.",
    icon: Store,
    details: [
      { label: "Nom", value: "Coin Original" },
      { label: "Adresse", value: "Casablanca, Maroc" },
      { label: "Email", value: "contact@coinoriginal.shop", href: "mailto:contact@coinoriginal.shop" },
      { label: "Telephone", value: getSupportPhoneE164(), href: `tel:${getSupportPhoneE164()}` },
    ],
  },
  {
    id: "02",
    title: "Hebergement",
    description:
      "L'infrastructure technique du site est hebergee par un prestataire international garantissant disponibilite, securite et diffusion des contenus.",
    icon: Building2,
    details: [
      { label: "Hebergeur", value: "Cloudflare, Inc." },
      { label: "Adresse", value: "101 Townsend Street, San Francisco, CA 94107, USA" },
      { label: "Site web", value: "www.cloudflare.com", href: "https://www.cloudflare.com" },
    ],
  },
  {
    id: "03",
    title: "Propriete intellectuelle",
    description:
      "Les textes, visuels, logos, graphismes et elements de marque presentes sur Coin Original sont proteges. Toute reproduction non autorisee est interdite.",
    icon: Shield,
    accent: "accent",
  },
  {
    id: "04",
    title: "Responsabilite",
    description:
      "Coin Original met a jour le site avec soin, sans garantir l'absence totale d'erreurs ou d'interruptions. L'utilisation des contenus reste sous la responsabilite de l'utilisateur.",
    icon: ShieldAlert,
  },
  {
    id: "05",
    title: "Cookies",
    description:
      "Le site peut utiliser des cookies fonctionnels et analytiques, notamment via Google Analytics, afin d'ameliorer l'experience utilisateur et mesurer l'audience.",
    icon: Cookie,
  },
  {
    id: "06",
    title: "Droit applicable",
    description:
      "Les presentes mentions legales sont regies par le droit marocain. En cas de litige, competence exclusive est attribuee aux juridictions de Casablanca.",
    icon: Scale,
    accent: "primary",
  },
];

function LegalCardItem({ card }: { card: LegalCard }) {
  const Icon = card.icon;
  const accentClass =
    card.accent === "primary"
      ? "border-[var(--primary)] bg-[color:color-mix(in_srgb,var(--primary)_8%,var(--surface-soft))]"
      : card.accent === "accent"
        ? "border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_10%,var(--surface-soft))]"
        : "border-[var(--border-soft)] bg-[var(--surface-soft)]";

  return (
    <article className={`group relative overflow-hidden border p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6 ${accentClass}`}>
      <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-[color:color-mix(in_srgb,var(--primary)_16%,transparent)] blur-2xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center border border-[var(--border-soft)] bg-[var(--surface)] text-[var(--primary)]">
            <Icon size={18} />
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--primary)]">
              Section {card.id}
            </p>
            <h2 className="roca-display mt-1 text-2xl text-[var(--foreground)] sm:text-3xl">
              {card.title}
            </h2>
          </div>
        </div>
        <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          Legal
        </span>
      </div>

      <p className="relative mt-5 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
        {card.description}
      </p>

      {card.details?.length ? (
        <dl className="relative mt-6 grid gap-3 border-t border-[var(--border-soft)] pt-5 sm:grid-cols-2">
          {card.details.map((detail) => (
            <div key={detail.label} className="space-y-1">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                {detail.label}
              </dt>
              <dd className="text-sm leading-6 text-[var(--foreground)] sm:text-[15px]">
                {detail.href ? (
                  <a
                    href={detail.href}
                    target={detail.href.startsWith("http") ? "_blank" : undefined}
                    rel={detail.href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="transition-colors hover:text-[var(--primary)]"
                  >
                    {detail.value}
                  </a>
                ) : (
                  detail.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </article>
  );
}

export function MentionsLegalesPageClient() {
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

      <main className="page-with-header w-full px-3 pb-24 md:px-5">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <section className="overflow-hidden border border-[var(--border-soft)] bg-[var(--surface)]">
            <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="p-5 sm:p-7 md:p-8 lg:p-10">
                <div className="inline-flex items-center gap-2 border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[var(--primary)]">
                  <BadgeCheck size={14} />
                  Page officielle
                </div>
                <h1 className="roca-display mt-5 max-w-4xl text-4xl text-[var(--foreground)] sm:text-5xl md:text-6xl">
                  Mentions
                  <br />
                  legales
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base md:text-lg">
                  Retrouvez ici les informations d'edition, d'hebergement et le
                  cadre juridique applicable a l'utilisation du site Coin
                  Original, presentees dans une mise en page claire et coherente
                  avec l'univers de la marque.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 border border-[var(--border-soft)] px-3 py-2 text-xs uppercase tracking-[0.16em] text-[var(--foreground)]">
                    <Globe size={14} className="text-[var(--primary)]" />
                    Droit marocain
                  </div>
                  <div className="inline-flex items-center gap-2 border border-[var(--border-soft)] px-3 py-2 text-xs uppercase tracking-[0.16em] text-[var(--foreground)]">
                    <Building2 size={14} className="text-[var(--primary)]" />
                    Hebergement Cloudflare
                  </div>
                  <div className="inline-flex items-center gap-2 border border-[var(--border-soft)] px-3 py-2 text-xs uppercase tracking-[0.16em] text-[var(--foreground)]">
                    <Scale size={14} className="text-[var(--primary)]" />
                    Mise a jour Juillet 2026
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border-soft)] bg-[var(--surface-soft)] p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-10">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                  Coordonnees
                </p>
                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3 border border-[var(--border-soft)] bg-[var(--surface)] p-4">
                    <MapPin size={18} className="mt-0.5 text-[var(--primary)]" />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                        Adresse
                      </p>
                      <p className="mt-1 text-sm text-[var(--foreground)] sm:text-base">
                        Casablanca, Maroc
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 border border-[var(--border-soft)] bg-[var(--surface)] p-4">
                    <Mail size={18} className="mt-0.5 text-[var(--primary)]" />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                        Email
                      </p>
                      <a
                        href="mailto:contact@coinoriginal.shop"
                        className="mt-1 block text-sm text-[var(--foreground)] transition-colors hover:text-[var(--primary)] sm:text-base"
                      >
                        contact@coinoriginal.shop
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 border border-[var(--border-soft)] bg-[var(--surface)] p-4">
                    <Phone size={18} className="mt-0.5 text-[var(--primary)]" />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                        Telephone
                      </p>
                      <p className="mt-1 text-sm text-[var(--foreground)] sm:text-base">
                        {getSupportPhoneE164()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border border-[var(--primary)]/30 bg-[color:color-mix(in_srgb,var(--primary)_10%,var(--surface))] p-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--primary)]">
                    Navigation utile
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em] text-[var(--foreground)]">
                    <Link href="/boutique" className="transition-colors hover:text-[var(--primary)]">
                      Boutique
                    </Link>
                    <Link href="/politique-confidentialite" className="transition-colors hover:text-[var(--primary)]">
                      Confidentialite
                    </Link>
                    <Link href="/cgv" className="transition-colors hover:text-[var(--primary)]">
                      CGV
                    </Link>
                    <Link href="/contact" className="transition-colors hover:text-[var(--primary)]">
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {legalCards.map((card) => (
              <LegalCardItem key={card.id} card={card} />
            ))}
          </section>

          <section className="border border-[var(--border-soft)] bg-[var(--surface-soft)] p-5 sm:p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--primary)]">
                  Transparence
                </p>
                <h2 className="roca-display mt-2 text-3xl text-[var(--foreground)] sm:text-4xl">
                  Besoin d'une precision ?
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
                  Pour toute question relative a l'edition du site, a vos donnees
                  ou aux informations legales, contactez notre equipe.
                </p>
              </div>
              <a
                href="mailto:contact@coinoriginal.shop"
                className="inline-flex h-12 items-center justify-center border border-[var(--primary)] bg-[var(--primary)] px-5 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--background)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                contact@coinoriginal.shop
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
