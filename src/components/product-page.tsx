"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BottomDock,
  DesktopTopBar,
  MobileDrawer,
  MobileTopBar,
  SiteFooter,
} from "@/components/homepage-sections";

const productImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAcFk5YwZQFLy5NpkSSAhIxIEMhh-ojCzJ2LCUwnWoDvaeRwqFZn5x_OoAaBbpdlZ38UjKr2IfKtbjuRfC_ZYUmXzpF91_5Dw8_sNiUoMCl0MDiDxjg2LhSfMYA-hrh8_m3ynpMfWwh6mQEbF62QAd_ZF5Xh5YG_qPKJdavjZ32wTildYnCzZWv29FQl_3EFamupW5EBOakZAgYrR4Ce0oHXMQLHqiUUtHJhV2I5AByavtx9gorrftW4LcXDLDTTz6uv6Tx9-zQbg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC7_om9JluK_wVuiNzE0zvnNM_vn8sWrs6hhWljXnsBmN1hycfhmtoAhE67-8Ce2QGGsW8aCLNIY0Dff66n1fpeg13gf_DMHECNYI7sa_OE_ccLVyw9rveIDy-JaociaTFg6w6ZCylFplZp4t3tm1rZ8nF1ej-_-3lK4FljDDNdZtXjsKX1CpsBjeptvEpr6M2tnvsUoI4xfJXpWYiPHqSDg51PWjezNTym6lrbSXZATTQv3S20gd0tjP5PqsBxohrcWiBjup9Jgw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC2N9LdLoBFCM0pYhLrw5afno0Yrw5kPD3AOWhgjl-uqCkn06105BONkbeFvoJo0TjiuIkdM2cLaEv4Yk22wvT9Rpkd2fRN69bp8OdmcfK4DAGYSMEVizGstGIiM_TxXf5A2k2uB5ZjoiET_HhVSf0ES2BqO-8B3AnVbeLSTDmjV4Xss8sKr8P199-INm-PW1lkRXXhcfFXA5jAoW8MKoA80BnpGoQ8OzK3_XEgkCozm7InCMX4k3cLGli11IPiPXigrjayO0yeSQ",
];

const availableSizes = ["40", "41", "42", "43", "44", "45"];

export function ProductPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("42");

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="brand-shell brand-grid min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <DesktopTopBar
        mobileMenuOpen={mobileMenuOpen}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />
      <MobileTopBar />
      <MobileDrawer
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />
      <BottomDock
        mobileMenuOpen={mobileMenuOpen}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      <main id="top" className="pb-24 pt-18 md:pt-20">
        <section id="shop" className="mx-auto w-full max-w-[1200px] px-4 py-6 md:px-8 md:py-12">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
            <Link href="/" className="hover:text-[var(--primary)]">
              Accueil
            </Link>
            <span>/</span>
            <span>Sneakers</span>
            <span>/</span>
            <span className="text-[var(--foreground)]">Vitesse Urban Runner X1</span>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col gap-3 lg:col-span-7">
              <div className="grid grid-cols-1 gap-3">
                <div className="group relative aspect-[4/5] overflow-hidden border-2 border-[var(--border-soft)] bg-[var(--surface)]">
                  <Image
                    src={productImages[0]}
                    alt="Vitesse Urban Runner X1 vue principale"
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 58vw"
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-0 bg-[var(--primary-strong)] px-4 py-1">
                    <span className="font-[var(--font-display)] text-lg uppercase tracking-tight text-[var(--background)]">
                      New Drop
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {productImages.slice(1).map((image, index) => (
                    <div
                      key={image}
                      className="relative aspect-square overflow-hidden border-2 border-[var(--border-soft)] bg-[var(--surface)]"
                    >
                      <Image
                        src={image}
                        alt={`Vitesse Urban Runner X1 vue detail ${index + 1}`}
                        fill
                        sizes="(max-width: 1023px) 50vw, 29vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex h-fit flex-col gap-4 self-start lg:col-span-5 lg:sticky lg:top-28">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-[var(--primary)]">
                  <span aria-hidden="true">✦</span>
                  <span>Original Authentique</span>
                </div>
                <h1 className="font-[var(--font-display)] text-xl uppercase leading-none tracking-tight text-[var(--foreground)] sm:text-2xl">
                  Vitesse Urban Runner X1
                </h1>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-[var(--font-display)] text-xl text-[var(--primary-strong)] sm:text-2xl">
                    899 DH
                  </span>
                  <span className="text-sm text-[var(--muted)] line-through">
                    1299 DH
                  </span>
                </div>
              </div>

              <div className="border-l-4 border-[var(--primary-strong)] bg-[var(--surface-soft)] p-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg text-[var(--accent)]" aria-hidden="true">
                    🚚
                  </span>
                  <div className="text-xs text-[var(--foreground)]">
                    <span className="font-bold">LIVRAISON GRATUITE</span> AU MAROC
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <label className="text-[10px] uppercase text-[var(--muted)]">
                    Taille (EU)
                  </label>
                  <a
                    className="flex items-center gap-1 text-[10px] uppercase text-[var(--primary)] hover:underline"
                    href="#guide-tailles"
                  >
                    Guide <span aria-hidden="true">⟷</span>
                  </a>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {availableSizes.map((size) => {
                    const isDisabled = size === "45";
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setSelectedSize(size)}
                        className={`border-2 py-2 text-xs transition-colors ${
                          isDisabled
                            ? "cursor-not-allowed border-[var(--border-soft)] opacity-30"
                            : isSelected
                              ? "border-[var(--primary-strong)] text-[var(--primary-strong)]"
                              : "border-[var(--border-soft)] text-[var(--foreground)] hover:border-[var(--primary-strong)]"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button className="w-full bg-[var(--primary-strong)] py-3 font-[var(--font-display)] text-base uppercase text-[var(--background)] transition-all duration-300 hover:bg-[var(--foreground)] hover:text-[var(--background)] active:scale-95 sm:py-4 sm:text-lg">
                  Commander maintenant
                </button>

                <div className="flex gap-3 border-2 border-dashed border-[var(--border-soft)] bg-[var(--surface-soft)] p-3">
                  <div className="text-xl text-[var(--accent)] sm:text-2xl" aria-hidden="true">
                    📞
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase text-[var(--foreground)]">
                      Processus de Confirmation
                    </p>
                    <p className="text-[11px] leading-tight text-[var(--muted)]">
                      Après votre commande, un conseiller vous appellera pour
                      confirmer taille et adresse avant expédition.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
