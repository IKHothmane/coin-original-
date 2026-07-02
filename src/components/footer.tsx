"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/lib/i18n/use-translation";

export function Footer() {
  const { t, lang } = useTranslation();
  const isAr = lang === "ar";

  return (
    <footer className="w-full overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      {/* Image complète et responsive en haut — fond hérite du body (#fafafa) */}
      <div className="w-full">
        <Image
          src="/footer-bg.png"
          alt=""
          width={716}
          height={94}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Contenu texte avec fond #E6E6E6 — pleine largeur */}
      <div className="bg-[#E6E6E6] px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo%20ligh.jpg"
                alt="Coin Original"
                width={48}
                height={48}
                className="rounded-full"
              />
              <span className="text-black text-xl font-bold uppercase tracking-tight">
                Coin Original
              </span>
            </div>
            <p className="text-sm text-black/70 leading-relaxed">
              {t("footer.brand_desc")}
            </p>
          </div>

          {/* Boutique */}
          <div>
            <h3 className="text-black text-sm font-bold uppercase tracking-wider mb-4">
              {t("footer.boutique")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/boutique" className="text-black/70 hover:text-black transition-colors">
                  {t("footer.chaussures")}
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="text-black/70 hover:text-black transition-colors">
                  {t("footer.sweats")}
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="text-black/70 hover:text-black transition-colors">
                  {t("footer.tshirts")}
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="text-black/70 hover:text-black transition-colors">
                  {t("footer.nouveautes")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Mentions */}
          <div>
            <h3 className="text-black text-sm font-bold uppercase tracking-wider mb-4">
              {t("footer.mentions")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/mentions-legales" className="text-black/70 hover:text-black transition-colors">
                  {t("footer.mentions_legales")}
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-black/70 hover:text-black transition-colors">
                  {t("footer.politique")}
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-black/70 hover:text-black transition-colors">
                  {t("footer.livraison")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-black text-sm font-bold uppercase tracking-wider mb-4">
              {t("footer.contact")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-black/70 hover:text-black transition-colors">
                  {t("footer.whatsapp")}
                </Link>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/coinoriginal_?igsh=dnFqNng4aXZ2MDY5&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                  <span>{t("footer.instagram")}</span>
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-black/70 text-xs uppercase tracking-wider mb-2">
                {t("footer.newsletter")}
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder={t("footer.email")}
                  className="flex-1 bg-white border border-black/20 text-black placeholder:text-black/50 px-3 py-2 text-sm focus:outline-none focus:border-black/40"
                />
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm font-bold uppercase transition-colors">
                  {t("footer.subscribe")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-black/20 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-black/50">
            © {new Date().getFullYear()} Coin Original. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
