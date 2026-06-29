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
import { fetchCatalogProductBySlugWithFallback } from "@/lib/firebase/storefront";

type ProductPageProps = {
  product?: CatalogProduct;
  slug?: string;
};

function badgeToneClasses(tone: NonNullable<CatalogProduct["badge"]>["tone"]) {
  if (tone === "tertiary") {
    return "bg-red-600 text-white";
  }

  if (tone === "error") {
    return "bg-[#7b7b7b] text-white";
  }

  return "bg-[#1f8f4d] text-white";
}

export function ProductPage({ product, slug }: ProductPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fetchedProduct, setFetchedProduct] = useState<CatalogProduct | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(!product && Boolean(slug));
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    if (!slug) {
      return () => {
        isMounted = false;
      };
    }

    const loadProduct = async () => {
      setIsLoadingProduct(true);
      const nextProduct = await fetchCatalogProductBySlugWithFallback(slug);

      if (isMounted) {
        setFetchedProduct(nextProduct);
        setSelectedImageIndex(0);
        setIsLoadingProduct(false);
      }
    };

    void loadProduct();

    return () => {
      isMounted = false;
    };
  }, [product, slug]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  if (isLoadingProduct) {
    return (
      <div className="brand-shell brand-grid min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <DesktopTopBar mobileMenuOpen={mobileMenuOpen} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <MobileTopBar />
        <MobileDrawer mobileMenuOpen={mobileMenuOpen} onCloseMobileMenu={() => setMobileMenuOpen(false)} />
        <BottomDock mobileMenuOpen={mobileMenuOpen} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex min-h-screen items-center justify-center pb-24 pt-18 md:pt-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Chargement du produit...
          </p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const activeProduct = fetchedProduct ?? product ?? null;

  if (!activeProduct) {
    return (
      <div className="brand-shell brand-grid min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <DesktopTopBar mobileMenuOpen={mobileMenuOpen} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <MobileTopBar />
        <MobileDrawer mobileMenuOpen={mobileMenuOpen} onCloseMobileMenu={() => setMobileMenuOpen(false)} />
        <BottomDock mobileMenuOpen={mobileMenuOpen} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-3 pb-24 pt-18 text-center md:px-5 md:pt-20">
          <h1 className="font-[var(--font-display)] text-3xl uppercase text-[var(--foreground)]">
            Produit introuvable
          </h1>
          <Link
            href="/boutique"
            className="border border-[var(--border-soft)] px-4 py-3 font-mono text-xs uppercase text-[var(--primary)]"
          >
            Retour Boutique
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }
  const effectiveSelectedSize = activeProduct.sizes.includes(selectedSize)
    ? selectedSize
    : (activeProduct.sizes[0] ?? "");

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
            <span>{activeProduct.category}</span>
            <span>/</span>
            <span className="text-[var(--foreground)]">{activeProduct.name}</span>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col gap-3 lg:col-span-6">
              <div className="grid max-w-[680px] grid-cols-1 gap-3">
                <div className="group relative aspect-[4/5] overflow-hidden border-2 border-[var(--border-soft)] bg-[var(--surface)]">
                  <Image
                    src={activeProduct.gallery[selectedImageIndex].src}
                    alt={activeProduct.gallery[selectedImageIndex].alt}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 42vw"
                    className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.02] md:p-4"
                  />
                  {activeProduct.badge ? (
                    <div className={`absolute bottom-3 left-0 px-4 py-1 ${badgeToneClasses(activeProduct.badge.tone)}`}>
                      <span className="font-[var(--font-display)] text-lg uppercase tracking-tight">
                        {activeProduct.badge.label}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {activeProduct.gallery.map((image, index) => {
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
                        sizes="(max-width: 1023px) 50vw, 21vw"
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

            <div className="flex h-fit flex-col gap-4 self-start lg:col-span-6 lg:sticky lg:top-28">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-[var(--primary)]">
                  <span aria-hidden="true">✦</span>
                  <span>{activeProduct.authenticityLabel ?? "Original Authentique"}</span>
                </div>
                <h1 className="font-[var(--font-display)] text-xl uppercase leading-none tracking-tight text-[var(--foreground)] sm:text-2xl">
                  {activeProduct.name}
                </h1>
                <div className="mt-3 flex items-baseline gap-3">
                  {activeProduct.compareAtPrice ? (
                    <span className="text-sm text-[var(--muted)] line-through">
                      {activeProduct.compareAtPrice}
                    </span>
                  ) : null}
                  <span className="font-[var(--font-display)] text-xl text-[var(--primary-strong)] sm:text-2xl">
                    {activeProduct.price}
                  </span>
                </div>
                <p className="max-w-xl pt-2 text-sm leading-6 text-[var(--muted)]">
                  {activeProduct.description}
                </p>
              </div>

              <div className="border-l-4 border-[var(--primary-strong)] bg-[var(--surface-soft)] p-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg text-[var(--accent)]" aria-hidden="true">
                    🚚
                  </span>
                  <div className="text-xs text-[var(--foreground)]">
                    <span className="font-bold">{activeProduct.deliveryLabel ?? "LIVRAISON GRATUITE"}</span>{" "}
                    {activeProduct.deliveryRegion ?? "AU MAROC"}
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
                  {activeProduct.sizes.map((size) => {
                    const isDisabled = activeProduct.soldOut;
                    const isSelected = effectiveSelectedSize === size;

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
