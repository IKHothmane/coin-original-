"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import {
  BottomDock,
  DesktopTopBar,
  MobileDrawer,
  MobileTopBar,
  StorefrontProductCard,
} from "@/components/homepage-sections";
import { useFavorites } from "@/components/favorites-context";
import { type CatalogProduct } from "@/components/catalog-data";
import { useTranslation } from "@/lib/i18n/use-translation";
import { fetchCatalogProductBySlugWithFallback } from "@/lib/products/storefront";

export function FavoritesPage() {
  const { t, lang } = useTranslation();
  const { slugs, isReady, removeFavorite, clearFavorites } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    let cancelled = false;

    const loadFavorites = async () => {
      if (!isReady) return;
      if (!slugs.length) {
        setProducts([]);
        return;
      }

      setLoadingProducts(true);
      const resolved = await Promise.all(slugs.map((slug) => fetchCatalogProductBySlugWithFallback(slug)));

      if (!cancelled) {
        setProducts(resolved.filter((product): product is CatalogProduct => product !== null));
        setLoadingProducts(false);
      }
    };

    void loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [slugs, isReady]);

  const pageTitle = t("favoris.title");

  return (
    <div className="brand-shell min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <DesktopTopBar
        mobileMenuOpen={mobileMenuOpen}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />
      <div className="md:hidden">
        <MobileTopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      </div>
      <MobileDrawer
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />
      <BottomDock
        mobileMenuOpen={mobileMenuOpen}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      <main className="page-with-header" dir={lang === "ar" ? "rtl" : "ltr"}>
        <section className="container-site py-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-xs text-[var(--muted)]">
            <Link href="/" className="transition-colors hover:text-[var(--primary)]">
              Accueil
            </Link>
            <span>/</span>
            <span className="font-semibold text-[var(--foreground)]">{pageTitle}</span>
          </nav>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between md:mb-8">
            <div>
              <span className="eyebrow--orange">Coin Original</span>
              <h1 className="section-title mt-2.5 text-[var(--foreground)]">{pageTitle}</h1>
              <p className="mt-2 text-sm text-[var(--muted)]">{t("favoris.subtitle")}</p>
            </div>
            {products.length > 0 && (
              <button
                type="button"
                onClick={clearFavorites}
                className="inline-flex w-fit items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted)] transition-colors hover:text-red-500"
              >
                <Trash2 size={13} aria-hidden="true" />
                {t("favoris.vider")}
              </button>
            )}
          </div>

          {!isReady || loadingProducts ? (
            <div className="surface-panel px-5 py-12 text-center">
              <p className="text-sm text-[var(--muted)]">{t("favoris.chargement")}</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {products.map((product) => (
                <div key={product.slug} className="relative">
                  <StorefrontProductCard product={product} showWishlist={false} />
                  <button
                    type="button"
                    onClick={() => removeFavorite(product.slug)}
                    className="absolute right-2.5 top-2.5 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface)] text-[var(--muted)] transition-colors hover:border-red-500 hover:text-red-500"
                    aria-label={t("favoris.retirer")}
                  >
                    <Heart size={14} className="fill-red-500 text-red-500" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="surface-panel px-6 py-14 text-center">
              <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
                <Heart size={28} className="fill-current" aria-hidden="true" />
              </span>
              <p className="section-title mt-5 text-[var(--foreground)]">{t("favoris.empty")}</p>
              <p className="mx-auto mt-3 max-w-sm text-sm text-[var(--muted)]">
                {t("favoris.description")}
              </p>
              <Link href="/boutique" className="btn btn--primary mt-6">
                {t("favoris.boutique")}
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
