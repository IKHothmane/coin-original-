"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart-context";
import {
  ArrowRight,
  Heart,
  LayoutGrid,
  Menu,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  User,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/auth-context";
import type { CatalogProduct } from "@/components/catalog-data";
import {
  featureItems,
  homeCategories,
  popularRatings,
  type FeatureItem,
} from "@/components/homepage-data";
import { fetchCatalogProductsWithFallback } from "@/lib/products/storefront";
import { readRecentlyViewed, type RecentlyViewedProduct } from "@/lib/products/recently-viewed";
import { useTranslation } from "@/lib/i18n/use-translation";
import { getProductHref } from "@/lib/products/links";

type MenuActionProps = {
  mobileMenuOpen: boolean;
  onOpenMobileMenu: () => void;
  onCloseMobileMenu: () => void;
};

/* ---------------------------------------------------------------- */
/* Logo                                                              */
/* ---------------------------------------------------------------- */

export function ThemeLogo({
  width,
  height,
  className,
  priority = false,
}: {
  width: number;
  height: number;
  className: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src="/logo.jpg"
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        className={`theme-logo theme-logo--dark ${className}`}
        style={{ width: "auto", height: `${height}px` }}
        priority={priority}
      />
      <Image
        src="/logo%20ligh.jpg"
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        className={`theme-logo theme-logo--light ${className}`}
        style={{ width: "auto", height: `${height}px` }}
        priority={priority}
      />
    </>
  );
}

function BrandLogo({ imageSize = 44 }: { imageSize?: number }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Coin Original">
      <ThemeLogo
        width={imageSize}
        height={imageSize}
        className="rounded-full object-cover"
        priority
      />
      <span className="roca-display text-xl leading-none text-white sm:text-2xl">
        Coin <span className="text-[var(--primary)]">Original</span>
      </span>
    </Link>
  );
}

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/* ---------------------------------------------------------------- */
/* Navigation                                                        */
/* ---------------------------------------------------------------- */

type NavLink = {
  href: string;
  labelKey: string;
};

export const siteNavLinks: NavLink[] = [
  { href: "/", labelKey: "nav.accueil" },
  { href: "/boutique", labelKey: "nav.boutique" },
  { href: "/boutique?category=Chaussures", labelKey: "nav.chaussures" },
  { href: "/boutique?category=Vetements", labelKey: "nav.vetements" },
  { href: "/boutique?category=Accessoires", labelKey: "nav.accessoires" },
  { href: "/boutique?badge=Nouveaute", labelKey: "nav.nouveautes" },
  { href: "/boutique?promo=1", labelKey: "nav.promotions" },
  { href: "/contact", labelKey: "nav.contact" },
];

function isNavActive(pathname: string, href: string) {
  const path = href.split("?")[0];
  if (path === "/") return pathname === "/";
  if (href.includes("?")) return false;
  return pathname === path || pathname.startsWith(`${path}/`);
}

/* ---------------------------------------------------------------- */
/* Recherche avec suggestions                                        */
/* ---------------------------------------------------------------- */

function SearchAutocomplete({
  placeholder,
  buttonLabel,
  containerClassName,
  formClassName,
  inputClassName,
  buttonClassName,
  suggestionsClassName,
  onNavigate,
}: {
  placeholder: string;
  buttonLabel: string;
  containerClassName?: string;
  formClassName: string;
  inputClassName: string;
  buttonClassName: string;
  suggestionsClassName?: string;
  onNavigate?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      const nextProducts = await fetchCatalogProductsWithFallback();
      if (isMounted) {
        setProducts(nextProducts);
      }
    };

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const suggestions = useMemo(() => {
    if (!normalizedQuery) return [];

    return products
      .filter((product) =>
        [product.name, product.brand, product.category].join(" ").toLowerCase().includes(normalizedQuery),
      )
      .slice(0, 6);
  }, [products, normalizedQuery]);

  const resultsHref = normalizedQuery ? `/boutique?search=${encodeURIComponent(query.trim())}` : "/boutique";

  return (
    <div className={`relative ${containerClassName ?? ""}`}>
      <form action="/boutique" method="get" className={formClassName} onSubmit={onNavigate}>
        <input
          type="text"
          name="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 150);
          }}
          placeholder={placeholder}
          className={inputClassName}
          autoComplete="off"
        />
        <button type="submit" className={buttonClassName} aria-label={buttonLabel}>
          <Search size={18} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </form>

      {open && suggestions.length > 0 ? (
        <div
          className={`absolute left-0 right-0 top-[calc(100%+0.4rem)] z-[170] overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] shadow-[0_18px_50px_rgba(0,0,0,0.28)] ${suggestionsClassName ?? ""}`}
        >
          {suggestions.map((product) => (
            <Link
              key={product.slug}
              href={getProductHref(product.slug)}
              className="flex items-center gap-3 border-b border-[var(--border-soft)] px-3 py-2.5 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--surface-soft)]"
              onClick={onNavigate}
            >
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-[var(--border-soft)] bg-[var(--surface-soft)]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--foreground)]">{product.name}</p>
                <p className="truncate text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                  {product.brand}
                </p>
              </div>
              <span className="price text-xs">{product.price}</span>
            </Link>
          ))}
          <Link
            href={resultsHref}
            className="block px-3 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary)] transition-colors hover:bg-[var(--surface-soft)]"
            onClick={onNavigate}
          >
            Voir tous les resultats
          </Link>
        </div>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Header desktop (3 rangees, style reference)                       */
/* ---------------------------------------------------------------- */

export function DesktopTopBar({
  mobileMenuOpen,
  onOpenMobileMenu,
}: Pick<MenuActionProps, "mobileMenuOpen" | "onOpenMobileMenu">) {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const { cartCount, cartTotal } = useCart();
  const mounted = useMounted();
  const pathname = usePathname() ?? "/";

  const cartLabel = mounted ? `${cartTotal.toLocaleString("fr-FR")} DH` : "0 DH";

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 hidden md:block">
      {/* Bandeau utilitaire */}
      <div className="header-utility">
        <div className="container-site flex h-8 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-5">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Truck size={13} className="text-[var(--primary)]" aria-hidden="true" />
              <strong>{t("topbar.livraison")}</strong>
            </span>
            <span className="hidden items-center gap-1.5 whitespace-nowrap lg:inline-flex">
              <Wallet size={13} className="text-[var(--primary)]" aria-hidden="true" />
              <strong>{t("topbar.paiement")}</strong>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="whitespace-nowrap">
              {t("nav.aide")}
            </Link>
            <Link href="/mon-compte" className="hidden whitespace-nowrap lg:inline">
              {t("nav.suivi")}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Rangee principale */}
      <div className="container-site flex h-18 items-center gap-4 lg:gap-6">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--header-border)] text-[var(--header-fg)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] lg:hidden"
          aria-label={t("nav.ouvrir_menu")}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        <BrandLogo />

        <Link
          href="/boutique"
          className="btn btn--primary !hidden !min-h-10 !px-4 !text-xs xl:!inline-flex"
        >
          <LayoutGrid size={16} aria-hidden="true" />
          {t("nav.categories")}
        </Link>

        <SearchAutocomplete
          placeholder={t("nav.rechercher")}
          buttonLabel={t("nav.rechercher")}
          containerClassName="min-w-0 flex-1 max-w-2xl mx-auto"
          formClassName="flex items-stretch overflow-hidden rounded-full border border-[var(--header-border)] bg-[var(--header-soft)] focus-within:border-[var(--primary)]"
          inputClassName="w-full min-w-0 bg-transparent px-5 py-2.5 text-sm text-white outline-none placeholder:text-[#8b8b92]"
          buttonClassName="inline-flex w-12 shrink-0 items-center justify-center bg-[var(--primary)] text-white transition-colors hover:bg-[var(--primary-hover)]"
        />

        <div className="ml-auto flex shrink-0 items-center gap-4 lg:gap-5">
          {loading ? null : (
            <Link
              href={user ? "/mon-compte" : "/login"}
              className="header-icon-btn"
              aria-label={user ? t("nav.mon_compte") : t("nav.connexion")}
            >
              <User size={22} strokeWidth={1.8} aria-hidden="true" />
              <span className="label hidden lg:flex">
                <small>{user ? t("nav.mon_compte") : t("nav.connexion")}</small>
                <span className="font-semibold text-white">
                  {user ? user.displayName || t("nav.mon_compte") : t("nav.mon_compte")}
                </span>
              </span>
            </Link>
          )}
          <Link href="/mon-compte" className="header-icon-btn hidden lg:inline-flex" aria-label={t("nav.favoris")}>
            <Heart size={22} strokeWidth={1.8} aria-hidden="true" />
            <span className="label">
              <small>&nbsp;</small>
              <span className="font-semibold text-white">{t("nav.favoris")}</span>
            </span>
          </Link>
          <Link href="/panier" className="header-icon-btn" aria-label={t("nav.ouvrir_panier")}>
            <span className="relative inline-flex">
              <ShoppingCart size={22} strokeWidth={1.8} aria-hidden="true" />
              {mounted && cartCount > 0 ? (
                <span className="cart-count-badge">{cartCount > 9 ? "9+" : cartCount}</span>
              ) : null}
            </span>
            <span className="label hidden lg:flex">
              <small>{t("nav.panier")}</small>
              <span className="font-semibold text-white">{cartLabel}</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Rangee navigation */}
      <nav className="border-t border-[var(--header-border)]" aria-label="Navigation principale">
        <div className="container-site flex items-center gap-6 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {siteNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`header-nav-link ${isNavActive(pathname, link.href) ? "header-nav-link--active" : ""}`}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

/* ---------------------------------------------------------------- */
/* Header mobile                                                     */
/* ---------------------------------------------------------------- */

export function MobileTopBar({
  onOpenMobileMenu,
}: Pick<MenuActionProps, "onOpenMobileMenu">) {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const { cartCount } = useCart();
  const mounted = useMounted();

  return (
    <div className="site-header fixed inset-x-0 top-0 z-40 md:hidden">
      <div className="container-site flex h-14 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--header-border)] text-[var(--header-fg)]"
            aria-label={t("nav.ouvrir_menu")}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          <Link href="/" className="flex items-center gap-2" aria-label="Coin Original">
            <ThemeLogo width={32} height={32} className="rounded-full object-cover" priority />
            <span className="roca-display text-lg text-white">
              Coin <span className="text-[var(--primary)]">Original</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-1.5">
          {loading ? null : (
            <Link
              href={user ? "/mon-compte" : "/login"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--header-fg)]"
              aria-label={user ? t("nav.mon_compte") : t("nav.connexion")}
            >
              <User size={20} aria-hidden="true" />
            </Link>
          )}
          <Link
            href="/panier"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--header-fg)]"
            aria-label={t("nav.ouvrir_panier")}
          >
            <ShoppingCart size={20} aria-hidden="true" />
            {mounted && cartCount > 0 ? (
              <span className="cart-count-badge !right-0 !top-0">{cartCount > 9 ? "9+" : cartCount}</span>
            ) : null}
          </Link>
        </div>
      </div>
      <div className="container-site pb-2.5">
        <SearchAutocomplete
          placeholder={t("nav.rechercher")}
          buttonLabel={t("nav.rechercher")}
          formClassName="flex items-stretch overflow-hidden rounded-full border border-[var(--header-border)] bg-[var(--header-soft)] focus-within:border-[var(--primary)]"
          inputClassName="w-full min-w-0 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-[#8b8b92]"
          buttonClassName="inline-flex w-11 shrink-0 items-center justify-center bg-[var(--primary)] text-white"
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Drawer mobile                                                     */
/* ---------------------------------------------------------------- */

export function MobileDrawer({
  mobileMenuOpen,
  onCloseMobileMenu,
}: Pick<MenuActionProps, "mobileMenuOpen" | "onCloseMobileMenu">) {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const pathname = usePathname() ?? "/";

  if (!mobileMenuOpen) {
    return null;
  }

  return (
    <div
      id="mobile-menu"
      className="fixed inset-0 z-[160] bg-black/60 backdrop-blur-[2px]"
      onClick={onCloseMobileMenu}
    >
      <aside
        className="mr-auto flex h-full w-[82%] max-w-[320px] flex-col border-r border-[var(--header-border)] bg-[var(--header-bg)] text-[var(--header-fg)] shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--header-border)] px-4">
          <span className="roca-display text-xl text-white">
            Coin <span className="text-[var(--primary)]">Original</span>
          </span>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--header-border)] text-[var(--header-fg)]"
            aria-label={t("nav.fermer_menu")}
            onClick={onCloseMobileMenu}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-5">
          <nav className="flex flex-col gap-1" aria-label="Navigation mobile">
            {siteNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onCloseMobileMenu}
                className={`rounded-lg px-3 py-3 text-sm font-bold uppercase tracking-[0.08em] transition-colors ${
                  isNavActive(pathname, link.href)
                    ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                    : "text-[#d7d7dc] hover:bg-[var(--header-soft)] hover:text-[var(--primary)]"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>

          {!loading && user ? (
            <Link
              href="/mon-compte"
              onClick={onCloseMobileMenu}
              className="btn btn--outline w-full !border-[var(--header-border)] !text-[var(--header-fg)]"
            >
              <User size={16} aria-hidden="true" />
              {t("nav.mon_compte")}
            </Link>
          ) : (
            <Link href="/login" onClick={onCloseMobileMenu} className="btn btn--primary w-full">
              <User size={16} aria-hidden="true" />
              {t("nav.connexion")}
            </Link>
          )}

          <div className="mt-auto space-y-3">
            <div className="rounded-xl border border-[var(--header-border)] bg-[var(--header-soft)] p-3">
              <p className="mb-2.5 text-[10px] uppercase tracking-[0.14em] text-[#9a9aa0]">
                {t("nav.langue")}
              </p>
              <LanguageSwitcher />
            </div>
            <div className="rounded-xl border border-[var(--header-border)] bg-[var(--header-soft)] p-3">
              <p className="mb-2.5 text-[10px] uppercase tracking-[0.14em] text-[#9a9aa0]">
                {t("nav.theme")}
              </p>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function BottomDock({
  mobileMenuOpen: _mobileMenuOpen,
  onOpenMobileMenu: _onOpenMobileMenu,
}: Pick<MenuActionProps, "mobileMenuOpen" | "onOpenMobileMenu">) {
  return null;
}

/** Le pied de page global est rendu par FooterWrapper ; cet export est
 *  conserve pour compatibilite avec les pages qui l'importent encore. */
export function SiteFooter() {
  return null;
}

/* ---------------------------------------------------------------- */
/* Hero slider                                                       */
/* ---------------------------------------------------------------- */

export function HeroSection() {
  return (
    <section className="bg-[#0b0b0c]">
      <div className="w-full">
        <div className="relative overflow-hidden bg-black">
          <div className="relative aspect-[16/5] min-h-[140px] w-full sm:min-h-[210px] lg:min-h-[300px]">
            <Image
              src="/hero.webp"
              alt="Hero Coin Original"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Bandeau de garanties                                              */
/* ---------------------------------------------------------------- */

const featureIcons: Record<FeatureItem["icon"], typeof Truck> = {
  truck: Truck,
  payment: Wallet,
  shield: ShieldCheck,
  returns: RotateCcw,
};

export function FeaturesStrip() {
  const { t } = useTranslation();

  return (
    <section className="container-site relative z-10 -mt-6 sm:-mt-8">
      <div className="surface-panel grid grid-cols-1 gap-x-6 gap-y-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
        {featureItems.map((item) => {
          const Icon = featureIcons[item.icon];
          return (
            <div key={item.icon} className="flex items-center gap-3.5">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
                <Icon size={20} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-extrabold uppercase tracking-[0.05em] text-[var(--foreground)]">
                  {t(item.titleKey)}
                </p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">{t(item.subKey)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Categories                                                        */
/* ---------------------------------------------------------------- */

export function HomeCategoriesSection() {
  const { t } = useTranslation();

  return (
    <section id="categories" className="container-site py-10 md:py-14">
      <div className="section-head">
        <h2 className="section-title text-[var(--foreground)]">{t("sections.categories")}</h2>
        <Link href="/boutique" className="section-link">
          {t("sections.voir_categories")}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {homeCategories.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="group flex flex-col items-center rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] p-3 shadow-[var(--card-shadow)] transition-all hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[0_12px_32px_rgba(255,87,26,0.12)] md:p-4"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[var(--surface-soft)]">
              <Image
                src={category.image}
                alt={category.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <span className="mt-3 text-center text-[11px] font-extrabold uppercase tracking-[0.06em] text-[var(--foreground)] sm:text-xs">
              {category.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Marques                                                           */
/* ---------------------------------------------------------------- */

const brandLogos = [
  { src: "/zara.png", alt: "Zara" },
  { src: "/puma.png", alt: "Puma" },
  { src: "/nike.png", alt: "Nike" },
  { src: "/new.png", alt: "New Balance" },
  { src: "/adidas.png", alt: "Adidas" },
];

const brandLogosLoop = [...brandLogos, ...brandLogos];

function BrandWordmark({ src, alt }: { src: string; alt: string }) {

  return (
    <span className="inline-flex h-16 w-36 flex-shrink-0 items-center justify-center md:h-20 md:w-44">
      <Image
        src={src}
        alt={alt}
        width={176}
        height={80}
        className="h-full w-full object-contain"
      />
    </span>
  );
}

export function BrandsSection() {
  return (
    <section className="container-site pb-10 md:pb-14">
      <div className="partners-marquee relative overflow-hidden rounded-xl bg-white py-4">
        <div className="animate-marquee flex items-center gap-10 px-6 md:gap-14">
          {brandLogosLoop.map((brand, index) => (
            <BrandWordmark key={`${brand.alt}-${index}`} src={brand.src} alt={brand.alt} />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Cartes produit                                                    */
/* ---------------------------------------------------------------- */

function parsePrice(value: string): number | null {
  const digits = value.replace(/[^0-9.]/g, "");
  if (!digits) return null;
  const parsed = Number(digits);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function discountPercent(product: CatalogProduct): string | null {
  if (!product.compareAtPrice) return null;
  const price = parsePrice(product.price);
  const compareAt = parsePrice(product.compareAtPrice);
  if (!price || !compareAt || compareAt <= price) return null;
  return `-${Math.round((1 - price / compareAt) * 100)}%`;
}

export function StorefrontProductCard({
  product,
  showRating = false,
}: {
  product: CatalogProduct;
  showRating?: boolean;
}) {
  const { t } = useTranslation();
  const discount = discountPercent(product);
  const rating = popularRatings[product.slug];

  return (
    <article className="product-card">
      <Link href={getProductHref(product.slug)} className="group flex h-full flex-col">
        <div className="product-card__media">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
          <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
            {product.soldOut ? (
              <span className="badge-pill badge-pill--soldout">{t("product.rupture_stock")}</span>
            ) : discount ? (
              <span className="badge-pill badge-pill--promo">{discount}</span>
            ) : product.badge ? (
              <span className="badge-pill badge-pill--new">{product.badge.label}</span>
            ) : null}
          </div>
          <span className="wishlist-btn absolute right-2.5 top-2.5" aria-hidden="true">
            <Heart size={15} />
          </span>
        </div>
        <div className="product-card__body">
          <h3 className="product-card__name text-[var(--foreground)]">{product.name}</h3>
          <p className="product-card__meta">{product.brand}</p>
          {showRating && rating ? (
            <span className="rating-stars" aria-label={`${rating.rating}/5`}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={12}
                  fill={index < Math.round(Number(rating.rating)) ? "currentColor" : "none"}
                  className={index < Math.round(Number(rating.rating)) ? "" : "text-[var(--border)]"}
                />
              ))}
              <span className="count">
                {rating.rating} ({rating.count})
              </span>
            </span>
          ) : null}
          <div className="product-card__footer">
            <span className="flex items-baseline gap-1.5">
              <span className="price">{product.price}</span>
              {product.compareAtPrice ? (
                <span className="price--old">{product.compareAtPrice}</span>
              ) : null}
            </span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-white">
              <ArrowRight size={14} aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function useCatalogProducts() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const next = await fetchCatalogProductsWithFallback();
      if (isMounted) setProducts(next);
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  return products;
}

function ProductRailGrid({ products, showRating = false }: { products: CatalogProduct[]; showRating?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {products.map((product) => (
        <StorefrontProductCard key={product.slug} product={product} showRating={showRating} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Offres flash + compte a rebours                                   */
/* ---------------------------------------------------------------- */

function useCountdownToMidnight() {
  const [remaining, setRemaining] = useState("--:--:--");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = Math.max(0, end.getTime() - now.getTime());
      const hours = Math.floor(diff / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);
      const seconds = Math.floor((diff % 60_000) / 1000);
      const pad = (n: number) => String(n).padStart(2, "0");
      setRemaining(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return remaining;
}

export function FlashOffersSection() {
  const { t } = useTranslation();
  const products = useCatalogProducts();
  const countdown = useCountdownToMidnight();
  const offers = products.filter((product) => product.compareAtPrice).slice(0, 4);

  if (offers.length === 0) return null;

  return (
    <section className="container-site pb-10 md:pb-14">
      <div className="section-head">
        <h2 className="section-title flex items-center gap-2 text-[var(--foreground)]">
          <Zap size={22} className="text-[var(--primary)]" aria-hidden="true" />
          {t("sections.flash")}
        </h2>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-[var(--muted)] sm:inline">{t("sections.fin_dans")}</span>
          <span className="rounded-lg bg-[#17171a] px-2.5 py-1.5 font-mono text-xs font-bold tracking-[0.1em] text-white">
            {countdown}
          </span>
          <Link href="/boutique" className="section-link">
            {t("sections.voir_tout")}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <ProductRailGrid products={offers} />
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Nouveautes / Populaires / Recemment consultes                     */
/* ---------------------------------------------------------------- */

export function NewArrivalsSection() {
  const { t } = useTranslation();
  const products = useCatalogProducts();
  const arrivals = products.filter((product) => product.badge?.label === "Nouveaute").slice(0, 4);
  const fallback = products.filter((product) => !product.soldOut).slice(0, 4);
  const list = arrivals.length > 0 ? arrivals : fallback;

  if (list.length === 0) return null;

  return (
    <section className="container-site pb-10 md:pb-14">
      <div className="section-head">
        <h2 className="section-title text-[var(--foreground)]">{t("sections.nouveautes")}</h2>
        <Link href="/boutique?badge=Nouveaute" className="section-link">
          {t("sections.voir_tout")}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
      <ProductRailGrid products={list} />
    </section>
  );
}

export function PopularProductsSection() {
  const { t } = useTranslation();
  const products = useCatalogProducts();
  const popular = products
    .filter((product) => popularRatings[product.slug])
    .slice(0, 4);
  const list = popular.length > 0 ? popular : products.slice(0, 4);

  if (list.length === 0) return null;

  return (
    <section className="container-site pb-10 md:pb-14">
      <div className="section-head">
        <h2 className="section-title text-[var(--foreground)]">{t("sections.populaires")}</h2>
        <Link href="/boutique" className="section-link">
          {t("sections.voir_tout")}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
      <ProductRailGrid products={list} showRating />
    </section>
  );
}

export function RecentlyViewedSection() {
  const { t } = useTranslation();
  const [items, setItems] = useState<RecentlyViewedProduct[]>([]);

  useEffect(() => {
    setItems(readRecentlyViewed());
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="container-site pb-10 md:pb-14">
      <div className="section-head">
        <h2 className="section-title text-[var(--foreground)]">{t("sections.recents")}</h2>
        <Link href="/boutique" className="section-link">
          {t("sections.voir_tout")}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
        {items.slice(0, 6).map((item) => (
          <Link
            key={item.slug}
            href={getProductHref(item.slug)}
            className="group flex flex-col rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] p-2.5 shadow-[var(--card-shadow)] transition-all hover:-translate-y-1 hover:border-[var(--primary)]"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[var(--surface-soft)]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 50vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <span className="mt-2 line-clamp-1 text-[11px] font-bold uppercase tracking-[0.04em] text-[var(--foreground)]">
              {item.name}
            </span>
            <span className="price text-xs">{item.price}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Alias de compatibilite (anciens imports)                          */
/* ---------------------------------------------------------------- */

export { BrandsSection as PartnersSection };
export { FlashOffersSection as ShopSection };
export { HomeCategoriesSection as CategoriesSection };

export function TrustSection() {
  return null;
}

/* Icones re-exportees pour les pages existantes */
