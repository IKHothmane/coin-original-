"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BottomDock,
  DesktopTopBar,
  MobileTopBar,
  MobileDrawer,
  SiteFooter,
} from "@/components/homepage-sections";
import { type CatalogProduct } from "@/components/catalog-data";

type ProductPageProps = {
  product: CatalogProduct;
};

export function ProductPage({ product }: ProductPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
        <section id="shop" className="w-full px-3 py-6 md:px-5 md:py-12">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
            <Link href="/" className="hover:text-[var(--primary)]">
              Accueil
            </Link>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="text-[var(--foreground)]">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col gap-3 lg:col-span-7">
              <div className="grid grid-cols-1 gap-3">
                <div className="group relative aspect-[4/5] overflow-hidden border-2 border-[var(--border-soft)] bg-[var(--surface)]">
                  <Image
                    src={product.gallery[selectedImageIndex].src}
                    alt={product.gallery[selectedImageIndex].alt}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 58vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {product.badge ? (
                    <div className="absolute bottom-3 left-0 bg-[var(--primary-strong)] px-4 py-1">
                      <span className="font-[var(--font-display)] text-lg uppercase tracking-tight text-[var(--background)]">
                        {product.badge.label}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {product.gallery.map((image, index) => {
                    const isSelected = selectedImageIndex === index;

                    return (
                      <button
                        key={image.src}
                        type="button"
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative aspect-square overflow-hidden border-2 bg-[var(--surface)] text-left transition-colors ${
                          isSelected
                            ? "border-[var(--primary-strong)]"
                            : "border-[var(--border-soft)] hover:border-[var(--primary)]"
                        }`}
                        aria-label={`Afficher ${image.alt.toLowerCase()}`}
                        aria-pressed={isSelected}
                      >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 1023px) 50vw, 29vw"
                        className="object-cover"
                      />
                        <span className="absolute inset-x-0 bottom-0 bg-black/50 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white">
                          Vue {index + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex h-fit flex-col gap-4 self-start lg:col-span-5 lg:sticky lg:top-28">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-[var(--primary)]">
                  <span aria-hidden="true">✦</span>
                  <span>{product.authenticityLabel ?? "Original Authentique"}</span>
                </div>
                <h1 className="font-[var(--font-display)] text-xl uppercase leading-none tracking-tight text-[var(--foreground)] sm:text-2xl">
                  {product.name}
                </h1>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-[var(--font-display)] text-xl text-[var(--primary-strong)] sm:text-2xl">
                    {product.price}
                  </span>
                  {product.compareAtPrice ? (
                    <span className="text-sm text-[var(--muted)] line-through">
                      {product.compareAtPrice}
                    </span>
                  ) : null}
                </div>
                <p className="max-w-xl pt-2 text-sm leading-6 text-[var(--muted)]">
                  {product.description}
                </p>
              </div>

              <div className="border-l-4 border-[var(--primary-strong)] bg-[var(--surface-soft)] p-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg text-[var(--accent)]" aria-hidden="true">
                    🚚
                  </span>
                  <div className="text-xs text-[var(--foreground)]">
                    <span className="font-bold">{product.deliveryLabel ?? "LIVRAISON GRATUITE"}</span>{" "}
                    {product.deliveryRegion ?? "AU MAROC"}
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
                  {product.sizes.map((size) => {
                    const isDisabled = product.soldOut;
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
                <p id="guide-tailles" className="text-[11px] leading-5 text-[var(--muted)]">
                  Coupe standard. Si tu hesites entre deux pointures, prends la
                  plus grande pour un fit plus confortable.
                </p>
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
