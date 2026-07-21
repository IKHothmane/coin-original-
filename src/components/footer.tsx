"use client";

import Link from "next/link";
import { Instagram, MapPin, Phone } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeLogo } from "@/components/homepage-sections";
import { useTranslation } from "@/lib/i18n/use-translation";

export function Footer() {
  const { t, lang } = useTranslation();
  const isAr = lang === "ar";

  return (
    <footer className="site-footer w-full" dir={isAr ? "rtl" : "ltr"}>
      <div className="container-site grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 md:py-16 lg:grid-cols-4">
        {/* Marque */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Coin Original">
            <ThemeLogo
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border border-[#2a2a2e] object-cover"
            />
            <span className="roca-display text-2xl text-white">
              Coin <span className="text-[var(--primary)]">Original</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#9a9aa0]">
            {t("footer.brand_desc")}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://www.instagram.com/coinoriginal_?igsh=dnFqNng4aXZ2MDY5&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2a2e] text-[#c9c9cf] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://wa.me/212600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2a2a2e] text-[#c9c9cf] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
              aria-label="WhatsApp"
            >
              <Phone size={18} />
            </a>
          </div>
        </div>

        {/* Boutique */}
        <div>
          <h4 className="footer-title">{t("footer.boutique")}</h4>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <Link href="/boutique?category=Chaussures">{t("footer.chaussures")}</Link>
            </li>
            <li>
              <Link href="/boutique?category=Vetements">{t("footer.sweats")}</Link>
            </li>
            <li>
              <Link href="/boutique?category=Vetements">{t("footer.tshirts")}</Link>
            </li>
            <li>
              <Link href="/boutique?badge=Nouveaute">{t("footer.nouveautes")}</Link>
            </li>
          </ul>
        </div>

        {/* Informations */}
        <div>
          <h4 className="footer-title">{t("footer.mentions")}</h4>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <Link href="/mentions-legales">{t("footer.mentions_legales")}</Link>
            </li>
            <li>
              <Link href="/politique-confidentialite">{t("footer.politique")}</Link>
            </li>
            <li>
              <Link href="/cgv">{t("footer.cgv")}</Link>
            </li>
            <li>
              <Link href="/contact">{t("footer.contact_link")}</Link>
            </li>
            <li>
              <Link href="/faq">{t("footer.faq")}</Link>
            </li>
          </ul>
        </div>

        {/* Contact + newsletter */}
        <div>
          <h4 className="footer-title">{t("footer.contact")}</h4>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Phone size={15} className="text-[var(--primary)]" />
                <span>{t("footer.whatsapp")}</span>
              </a>
            </li>
            <li className="inline-flex items-center gap-2 text-[#9a9aa0]">
              <MapPin size={15} className="text-[var(--primary)]" />
              <span>Casablanca, Maroc</span>
            </li>
          </ul>

          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-white">
              {t("footer.newsletter")}
            </p>
            <div className="mt-3 flex overflow-hidden rounded-lg border border-[#2a2a2e] bg-[#141417] focus-within:border-[var(--primary)]">
              <input
                type="email"
                placeholder={t("footer.email")}
                className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-[#6b6b72]"
              />
              <button
                type="button"
                className="shrink-0 bg-[var(--primary)] px-4 text-xs font-extrabold uppercase tracking-[0.06em] text-white transition-colors hover:bg-[var(--primary-hover)]"
              >
                {t("footer.subscribe")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barre inferieure */}
      <div className="border-t border-[#232326]">
        <div className="container-site flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <p className="text-xs text-[#8b8b92]">
            © {new Date().getFullYear()} Coin Original. {t("footer.rights")}
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
