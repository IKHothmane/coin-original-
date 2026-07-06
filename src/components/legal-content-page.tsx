"use client";

import { useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BellRing,
  Blocks,
  Bot,
  Building2,
  Clock3,
  FileText,
  Globe,
  Lock,
  Scale,
  Shield,
  Truck,
  UserCheck,
  Wallet,
} from "lucide-react";
import {
  BottomDock,
  DesktopTopBar,
  MobileDrawer,
  MobileTopBar,
} from "@/components/homepage-sections";

type IconName =
  | "badge"
  | "bell"
  | "blocks"
  | "bot"
  | "building"
  | "clock"
  | "file"
  | "globe"
  | "lock"
  | "scale"
  | "shield"
  | "truck"
  | "user"
  | "wallet";

type LegalSection = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  highlights?: string[];
};

type LegalContentPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  updateLabel: string;
  badges: string[];
  sections: LegalSection[];
  calloutTitle: string;
  calloutText: string;
  calloutHref: string;
  calloutLabel: string;
};

const iconMap: Record<IconName, LucideIcon> = {
  badge: BadgeCheck,
  bell: BellRing,
  blocks: Blocks,
  bot: Bot,
  building: Building2,
  clock: Clock3,
  file: FileText,
  globe: Globe,
  lock: Lock,
  scale: Scale,
  shield: Shield,
  truck: Truck,
  user: UserCheck,
  wallet: Wallet,
};

function LegalSectionCard({ section }: { section: LegalSection }) {
  const Icon = iconMap[section.icon];

  return (
    <article className="overflow-hidden border border-[var(--border-soft)] bg-[var(--surface-soft)] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center border border-[var(--border-soft)] bg-[var(--surface)] text-[var(--primary)]">
            <Icon size={18} />
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--primary)]">
              Section {section.id}
            </p>
            <h2 className="roca-display mt-1 text-2xl text-[var(--foreground)] sm:text-3xl">
              {section.title}
            </h2>
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-[var(--muted)] sm:text-base">
        {section.description}
      </p>

      {section.highlights?.length ? (
        <ul className="mt-5 grid gap-3 border-t border-[var(--border-soft)] pt-5 sm:grid-cols-2">
          {section.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-start gap-2 text-sm leading-6 text-[var(--foreground)]"
            >
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[var(--primary)]" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export function LegalContentPage({
  eyebrow,
  title,
  intro,
  updateLabel,
  badges,
  sections,
  calloutTitle,
  calloutText,
  calloutHref,
  calloutLabel,
}: LegalContentPageProps) {
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

      <main className="w-full px-3 pb-24 pt-20 md:px-5 md:pt-28">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <section className="overflow-hidden border border-[var(--border-soft)] bg-[var(--surface)]">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-5 sm:p-7 md:p-8 lg:p-10">
                <div className="inline-flex items-center gap-2 border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[var(--primary)]">
                  <BadgeCheck size={14} />
                  {eyebrow}
                </div>
                <h1 className="roca-display mt-5 max-w-4xl text-4xl text-[var(--foreground)] sm:text-5xl md:text-6xl">
                  {title}
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base md:text-lg">
                  {intro}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {badges.map((badge) => (
                    <div
                      key={badge}
                      className="inline-flex items-center gap-2 border border-[var(--border-soft)] px-3 py-2 text-xs uppercase tracking-[0.16em] text-[var(--foreground)]"
                    >
                      <BadgeCheck size={14} className="text-[var(--primary)]" />
                      {badge}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--border-soft)] bg-[var(--surface-soft)] p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-10">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                  Acces rapide
                </p>
                <div className="mt-5 grid gap-4">
                  <Link
                    href="/mentions-legales"
                    className="border border-[var(--border-soft)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--primary)]"
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                      Legal
                    </p>
                    <p className="mt-1 text-base text-[var(--foreground)]">
                      Mentions legales
                    </p>
                  </Link>
                  <Link
                    href="/politique-confidentialite"
                    className="border border-[var(--border-soft)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--primary)]"
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                      Donnees
                    </p>
                    <p className="mt-1 text-base text-[var(--foreground)]">
                      Politique de confidentialite
                    </p>
                  </Link>
                  <Link
                    href="/cgv"
                    className="border border-[var(--border-soft)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--primary)]"
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                      Vente
                    </p>
                    <p className="mt-1 text-base text-[var(--foreground)]">CGV</p>
                  </Link>
                  <div className="border border-[var(--primary)]/30 bg-[color:color-mix(in_srgb,var(--primary)_10%,var(--surface))] p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--primary)]">
                      Mise a jour
                    </p>
                    <p className="mt-1 text-sm text-[var(--foreground)]">{updateLabel}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {sections.map((section) => (
              <LegalSectionCard key={section.id} section={section} />
            ))}
          </section>

          <section className="border border-[var(--border-soft)] bg-[var(--surface-soft)] p-5 sm:p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--primary)]">
                  Besoin d'aide
                </p>
                <h2 className="roca-display mt-2 text-3xl text-[var(--foreground)] sm:text-4xl">
                  {calloutTitle}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
                  {calloutText}
                </p>
              </div>
              <a
                href={calloutHref}
                className="inline-flex h-12 items-center justify-center border border-[var(--primary)] bg-[var(--primary)] px-5 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--background)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                {calloutLabel}
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
