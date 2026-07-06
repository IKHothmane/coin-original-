"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart-context";
import { ShoppingBag, ShoppingCart, Instagram, User, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/auth-context";
import type { CatalogProduct } from "@/components/catalog-data";
import {
  categories,
  featuredProducts,
  partners,
  partnersLoop,
  trustItems,
  type CategoryItem,
  type FeaturedProduct,
  type PartnerBrand,
  type TrustItem,
} from "@/components/homepage-data";
import { fetchCatalogProductsWithFallback, fetchFeaturedProductsWithFallback } from "@/lib/products/storefront";
import { useTranslation } from "@/lib/i18n/use-translation";
import { getProductHref } from "@/lib/products/links";

type MenuActionProps = {
  mobileMenuOpen: boolean;
  onOpenMobileMenu: () => void;
  onCloseMobileMenu: () => void;
};

function DrawerToggleIcon({
  open = false,
  className,
}: {
  open?: boolean;
  className?: string;
}) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="coinDrawerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6A00" />
          <stop offset="100%" stopColor="#FFC300" />
        </linearGradient>
      </defs>

      <g transform="translate(0 2)">
        <rect
          x="10"
          y="30"
          width="100"
          height="70"
          rx="8"
          fill="#1A1A1A"
          stroke="#000"
          strokeWidth="4"
        />

        <g
          style={{
            opacity: open ? 1 : 0,
            transition: "opacity 0.3s ease 0.18s",
          }}
        >
          <path
            d="M35 45 L35 75 Q35 80 40 80 L50 80 Q55 80 55 75 L55 60 L50 55 L40 55 L35 60 Z"
            fill="#FF2D2D"
            stroke="#000"
            strokeWidth="2.5"
          />
          <circle cx="45" cy="50" r="3" fill="#000" />

          <path
            d="M65 65 L85 65 Q90 65 90 70 L90 75 Q90 80 85 80 L70 80 Q65 80 65 75 Z"
            fill="#FFFFFF"
            stroke="#000"
            strokeWidth="2.5"
          />
          <path d="M65 70 L80 70" stroke="#FF2D2D" strokeWidth="3" />
          <path
            d="M82 68 L88 68 Q90 68 90 70"
            fill="#FF2D2D"
            stroke="#000"
            strokeWidth="2"
          />
        </g>

        <g
          style={{
            transform: open ? "translateX(25px)" : "translateX(0px)",
            transformOrigin: "center",
            transition: "transform 0.4s ease",
          }}
        >
          <rect
            x="15"
            y="35"
            width="90"
            height="60"
            rx="6"
            fill="url(#coinDrawerGradient)"
            stroke="#000"
            strokeWidth="4"
          />
          <circle cx="85" cy="65" r="4" fill="#000" />
          <text
            x="45"
            y="68"
            textAnchor="middle"
            fill="#000"
            fontSize="12"
            fontWeight="900"
            style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
          >
            COIN
          </text>
        </g>
      </g>
    </svg>
  );
}

function BrandLogo({
  imageSize,
  textClassName,
}: {
  imageSize: number;
  textClassName: string;
}) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Coin Original">
      <ThemeLogo
        width={imageSize}
        height={imageSize}
        className="border border-[var(--border-soft)] object-cover"
        priority
      />
      <span className={`roca-display ${textClassName}`}>Coin Original</span>
    </Link>
  );
}

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
        priority={priority}
      />
      <Image
        src="/logo%20ligh.jpg"
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        className={`theme-logo theme-logo--light ${className}`}
        priority={priority}
      />
    </>
  );
}

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function CartIconBadge({ className }: { className?: string }) {
  const { cartCount } = useCart();
  const mounted = useMounted();

  return (
    <span className={`relative inline-flex items-center justify-center text-[var(--foreground)] ${className ?? ""}`}>
      <ShoppingCart size={22} strokeWidth={2.2} aria-hidden="true" />
      {mounted && cartCount > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--primary-strong)] px-1 text-[10px] font-bold text-[var(--background)]">
          {cartCount > 9 ? "9+" : cartCount}
        </span>
      ) : null}
    </span>
  );
}

function CartCountDot() {
  const { cartCount } = useCart();
  const mounted = useMounted();

  if (!mounted || cartCount === 0) return null;

  return (
    <span className="absolute -right-1.5 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--primary-strong)] text-[8px] font-bold text-[var(--background)]">
      {cartCount > 9 ? "9+" : cartCount}
    </span>
  );
}

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
          ⌕
        </button>
      </form>

      {open && suggestions.length > 0 ? (
        <div
          className={`absolute left-0 right-0 top-[calc(100%+0.35rem)] z-[170] border border-[var(--border-soft)] bg-[var(--surface)] shadow-[0_18px_50px_rgba(0,0,0,0.28)] ${suggestionsClassName ?? ""}`}
        >
          {suggestions.map((product) => (
            <Link
              key={product.slug}
              href={getProductHref(product.slug)}
              className="flex items-center gap-3 border-b border-[var(--border-soft)] px-3 py-2.5 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--surface-soft)]"
              onClick={onNavigate}
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-[var(--border-soft)] bg-[var(--surface-soft)]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-[var(--foreground)]">{product.name}</p>
                <p className="truncate text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                  {product.brand}
                </p>
              </div>
            </Link>
          ))}
          <Link
            href={resultsHref}
            className="block px-3 py-2.5 text-xs uppercase tracking-[0.14em] text-[var(--primary)] transition-colors hover:bg-[var(--surface-soft)]"
            onClick={onNavigate}
          >
            Voir tous les resultats
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export function DesktopTopBar({
  mobileMenuOpen,
  onOpenMobileMenu,
}: Pick<MenuActionProps, "mobileMenuOpen" | "onOpenMobileMenu">) {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 hidden border-b border-[var(--border-soft)] bg-[color:color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur md:block">
      <div className="flex h-20 w-full items-center justify-between gap-4 px-3 md:px-5">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className={`inline-flex h-11 w-11 items-center justify-center border text-[var(--foreground)] transition-colors ${
              mobileMenuOpen
                ? "border-[var(--primary)] bg-[color:color-mix(in_srgb,var(--primary)_18%,transparent)]"
                : "border-[var(--border-soft)] bg-[var(--surface-soft)] hover:border-[var(--primary)]"
            }`}
            aria-label={t("nav.ouvrir_menu")}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <DrawerToggleIcon open={mobileMenuOpen} />
          </button>
          <BrandLogo
            imageSize={56}
            textClassName="hidden font-[var(--font-display)] text-2xl uppercase tracking-tight text-[var(--primary-strong)] sm:inline"
          />
        </div>

        <div className="flex items-center gap-3">
          <SearchAutocomplete
            placeholder={t("nav.rechercher")}
            buttonLabel={t("nav.rechercher")}
            containerClassName="hidden w-[22rem] md:block"
            formClassName="flex items-center gap-2"
            inputClassName="w-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-2 text-sm text-[var(--foreground)] outline-none"
            buttonClassName="inline-flex h-10 items-center justify-center border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 text-[var(--foreground)] transition-colors hover:border-[var(--primary)]"
          />
          {loading ? null : user ? (
            <Link
              href="/mon-compte"
              className="inline-flex h-11 items-center gap-2 border border-[var(--border-soft)] px-3 text-[var(--foreground)] transition-colors hover:border-[var(--primary)]"
              aria-label="Mon compte"
            >
              <User size={18} />
              <span className="text-xs font-mono uppercase tracking-widest hidden lg:inline">{user.displayName || "Mon compte"}</span>
            </Link>
          ) : null}
          <Link
            href="/panier"
            className="inline-flex h-11 w-11 items-center justify-center border border-[var(--border-soft)] text-[var(--foreground)]"
            aria-label={t("nav.ouvrir_panier")}
          >
            <CartIconBadge />
          </Link>
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export function MobileTopBar({
  onOpenMobileMenu,
}: Pick<MenuActionProps, "onOpenMobileMenu">) {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  return (
    <div className="fixed inset-x-0 top-0 z-40 border-b border-[var(--border-soft)] bg-[color:color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur md:hidden">
      <div className="mx-auto flex h-18 w-full items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="inline-flex h-10 w-10 items-center justify-center border border-[var(--border-soft)] text-[var(--foreground)]"
            aria-label={t("nav.ouvrir_menu")}
          >
            <DrawerToggleIcon />
          </button>
          <BrandLogo
            imageSize={44}
            textClassName="hidden font-[var(--font-display)] text-xl uppercase tracking-tight text-[var(--primary-strong)] sm:inline"
          />
        </div>
        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            <Link
              href="/mon-compte"
              className="inline-flex h-10 w-10 items-center justify-center border border-[var(--border-soft)] text-[var(--foreground)]"
              aria-label="Mon compte"
            >
              <User size={20} />
            </Link>
          ) : null}
          <Link
            href="/panier"
            className="inline-flex h-10 w-10 items-center justify-center border border-[var(--border-soft)] text-[var(--foreground)]"
            aria-label={t("nav.ouvrir_panier")}
          >
            <CartIconBadge />
          </Link>
          <span className="info-chip text-[10px]">Maroc</span>
        </div>
      </div>
    </div>
  );
}

export function MobileDrawer({
  mobileMenuOpen,
  onCloseMobileMenu,
}: Pick<MenuActionProps, "mobileMenuOpen" | "onCloseMobileMenu">) {
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  if (!mobileMenuOpen) {
    return null;
  }

  return (
    <div
      id="mobile-menu"
      className="fixed inset-0 z-[160] bg-black/45 backdrop-blur-[2px]"
      onClick={onCloseMobileMenu}
    >
      <aside
        className="mr-auto flex h-full w-[58%] max-w-[232px] flex-col border-r border-[var(--border-soft)] bg-[var(--surface)] shadow-[0_0_40px_rgba(0,0,0,0.35)] md:w-[288px] md:max-w-[288px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--border-soft)] px-4">
          <div className="flex flex-col">
            <span className="font-[var(--font-display)] text-2xl uppercase text-[var(--primary-strong)]">
              {t("nav.menu")}
            </span>
            <span className="text-[8px] uppercase tracking-[0.16em] text-[var(--muted)]">
              {t("nav.navigation_rapide")}
            </span>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-soft)] text-2xl text-[var(--foreground)]"
            aria-label={t("nav.fermer_menu")}
            onClick={onCloseMobileMenu}
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 px-4 py-5">
          <SearchAutocomplete
            placeholder={t("nav.chercher")}
            buttonLabel={t("nav.rechercher")}
            formClassName="flex items-center gap-2.5 border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-2.5"
            inputClassName="w-full bg-transparent text-xs outline-none"
            buttonClassName="text-[var(--muted)]"
            suggestionsClassName="max-h-72 overflow-y-auto"
            onNavigate={onCloseMobileMenu}
          />

          <nav className="flex flex-col gap-2.5">
            <DrawerLink href="/" onClick={onCloseMobileMenu}>
              {t("nav.accueil")}
            </DrawerLink>
            <DrawerLink href="/boutique" active onClick={onCloseMobileMenu}>
              {t("nav.boutique")}
            </DrawerLink>
            <DrawerLink href="/panier" onClick={onCloseMobileMenu}>
              {t("nav.panier")}
            </DrawerLink>
            {!loading && user ? (
              <DrawerLink href="/mon-compte" onClick={onCloseMobileMenu}>
                Mon compte
              </DrawerLink>
            ) : null}
            <DrawerLink href="/#trust" onClick={onCloseMobileMenu}>
              {t("nav.a_propos")}
            </DrawerLink>
            <DrawerLink href="/contact" onClick={onCloseMobileMenu}>
              {t("nav.contact")}
            </DrawerLink>
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-[1rem] border border-[var(--border-soft)] bg-[var(--surface-soft)] p-3">
              <p className="mb-2.5 text-[8px] uppercase tracking-[0.14em] text-[var(--muted)]">
                {t("nav.langue")}
              </p>
              <LanguageSwitcher />
            </div>
            <div className="rounded-[1rem] border border-[var(--border-soft)] bg-[var(--surface-soft)] p-3">
              <p className="mb-2.5 text-[8px] uppercase tracking-[0.14em] text-[var(--muted)]">
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

function DrawerLink({
  href,
  children,
  onClick,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <Link
      className={`rounded-[0.9rem] border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-3 font-[var(--font-display)] text-xl uppercase transition-colors hover:text-[var(--primary)] ${
        active ? "text-[var(--primary)]" : "text-[var(--foreground)]"
      }`}
      href={href}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export function BottomDock({
  mobileMenuOpen: _mobileMenuOpen,
  onOpenMobileMenu: _onOpenMobileMenu,
}: Pick<MenuActionProps, "mobileMenuOpen" | "onOpenMobileMenu">) {
  return null;
}

export function HeroSection() {
  const { t } = useTranslation();
  
  return (
    <section className="relative flex min-h-[500px] items-end overflow-hidden sm:min-h-[600px]">
      <div className="absolute inset-0 z-0">
        <iframe
          src="https://my.spline.design/radialglass-fUljRbilheIbNuNuY9PPdRRq/"
          title="Coin Original hero experience"
          className="h-full w-full border-0"
          loading="eager"
        />
        <div className="hero-overlay-light absolute inset-0 bg-black/28" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      <div className="relative z-10 flex w-full flex-col gap-4 px-3 pb-8 sm:gap-6 sm:pb-12 md:px-5 md:pb-20">
        <div className="max-w-2xl">
          <h1 className="mb-4 font-[var(--font-display)] text-3xl leading-none text-white uppercase sm:mb-6 sm:text-5xl md:text-[clamp(4.5rem,8vw,7rem)]">
            {t("homepage.hero_title")}
          </h1>
          <p className="mb-6 max-w-lg text-sm leading-6 text-[var(--muted)] sm:mb-8 sm:text-base md:text-lg">
            {t("homepage.hero_desc")}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href="/boutique"
              className="impact-button impact-button--primary !h-11 w-full !px-5 !py-3 !text-sm sm:!h-14 sm:w-auto sm:!px-10 sm:!py-4 sm:!text-lg"
            >
              {t("homepage.voir_collection")}
            </a>
            <a
              href="#categories"
              className="impact-button impact-button--secondary !h-11 w-full !border-white !px-5 !py-3 !text-sm !text-white sm:!h-14 sm:w-auto sm:!px-10 sm:!py-4 sm:!text-lg"
            >
              {t("homepage.voir_hoodies")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PartnersSection() {
  const { t } = useTranslation();
  
  return (
    <section className="w-full overflow-hidden py-12 md:py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 md:px-6">
        <p className="text-center text-xl font-semibold text-[var(--foreground)] md:text-2xl">
          {t("homepage.partenaires")}
        </p>
        <div className="partners-marquee relative">
          <div className="animate-marquee flex items-center gap-12 md:gap-16">
            {partnersLoop.map((partner, index) => (
              <BrandWordmark key={`${partner.slug}-${index}`} brand={partner} compact />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--background)] to-transparent md:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--background)] to-transparent md:w-24" />
        </div>
      </div>
    </section>
  );
}

function BrandWordmark({
  brand,
  compact = false,
}: {
  brand: PartnerBrand;
  compact?: boolean;
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const shellClassName = "text-black";

  const sizeClassName = compact
    ? "h-12 w-32 md:h-16 md:w-40"
    : "h-12 w-32 md:h-16 md:w-40";

  const logoClassName = compact ? "h-full w-full max-w-full" : "h-full w-full max-w-full";

  const wordmarkClassName =
    brand.style === "sport"
      ? "font-black italic tracking-[0.16em] skew-x-[-10deg]"
      : brand.style === "wide"
        ? "font-black tracking-[0.42em]"
        : brand.style === "script"
          ? "font-black normal-case italic tracking-[0.08em]"
          : brand.style === "tight"
            ? "font-black tracking-[0.14em]"
            : brand.style === "box"
              ? "font-black tracking-[0.18em]"
              : brand.style === "mono"
                ? "font-mono font-bold tracking-[0.22em]"
                : brand.style === "heritage"
                  ? "font-semibold tracking-[0.28em]"
                  : "font-semibold tracking-[0.24em]";

  return (
    <span
      className={`partners-pill inline-flex flex-shrink-0 items-center justify-center text-center uppercase grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100 ${shellClassName} ${sizeClassName}`}
      aria-label={brand.name}
      title={brand.name}
    >
      {!brand.logoUrl || logoFailed ? (
        <svg
          viewBox="0 0 320 64"
          className={`${logoClassName} w-auto`}
          role="img"
          aria-label={brand.name}
        >
          <text
            x="160"
            y="39"
            textAnchor="middle"
            fill="currentColor"
            fontSize={brand.style === "script" ? "28" : "24"}
            fontWeight={brand.style === "heritage" || brand.style === "trail" ? "600" : "800"}
            letterSpacing={
              brand.style === "wide"
                ? "7"
                : brand.style === "mono"
                  ? "4"
                  : brand.style === "heritage"
                    ? "5"
                    : "2"
            }
            style={{
              fontFamily:
                brand.style === "mono"
                  ? "ui-monospace, SFMono-Regular, monospace"
                  : "Arial, Helvetica, sans-serif",
              fontStyle: brand.style === "script" || brand.style === "sport" ? "italic" : "normal",
            }}
          >
            {brand.wordmark}
          </text>
        </svg>
      ) : (
        <img
          src={brand.logoUrl}
          alt={brand.name}
          className={`${logoClassName} w-auto object-contain`}
          loading="lazy"
          onError={() => setLogoFailed(true)}
        />
      )}
    </span>
  );
}

function ProductCard({ product }: { product: FeaturedProduct }) {
  const { t } = useTranslation();
  
  const badgeClassName =
    product.badgeTone === "tertiary"
      ? "bg-red-600 text-white"
      : product.badgeTone === "error"
        ? "bg-[#7b7b7b] text-white"
        : "bg-[#1f8f4d] text-white";

  return (
    <article className="surface-panel flex h-full flex-col overflow-hidden">
      <Link href={getProductHref(product.slug)} className="group flex h-full flex-col">
        <div className="product-image-frame aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2 z-20 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--border-soft)] bg-black/30 sm:left-3 sm:top-3 sm:h-12 sm:w-12">
            <ThemeLogo width={48} height={48} className="h-full w-full object-cover" />
          </div>
          <div className="absolute bottom-0 left-0 flex flex-col bg-[var(--primary-strong)] px-2 py-1 text-[var(--background)] sm:px-3">
            {product.compareAtPrice ? (
              <span className="font-mono text-[10px] uppercase leading-none text-white/70 line-through sm:text-xs">
                {product.compareAtPrice}
              </span>
            ) : null}
            <span className="font-[var(--font-display)] text-sm uppercase leading-none sm:text-lg">
              {product.price}
            </span>
          </div>
          {product.badge ? (
            <div
              className={`absolute right-2 top-2 px-2 py-1 font-mono text-[10px] uppercase sm:right-4 sm:top-4 sm:text-xs ${badgeClassName}`}
            >
              {product.badge}
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-2 sm:p-4">
          <div className="flex-1">
            <h3 className="font-[var(--font-display)] text-base uppercase leading-tight sm:text-2xl">
              {product.name}
            </h3>
            <p className="mt-1 text-[11px] leading-4 text-[var(--muted)] sm:text-sm">
              {product.description}
            </p>
          </div>
          <span className="impact-button impact-button--secondary mt-3 !h-9 w-full !px-2 !py-2 !text-center !text-xs sm:mt-6 sm:!h-11 sm:!px-4 sm:!py-3 sm:!text-base">
            {t("product.ajouter")}
          </span>
        </div>
      </Link>
    </article>
  );
}

export function ShopSection() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<FeaturedProduct[]>(featuredProducts);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      const nextProducts = await fetchFeaturedProductsWithFallback();

      if (isMounted) {
        setProducts(nextProducts);
      }
    };

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="shop" className="w-full px-3 py-10 md:px-5 md:py-16">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:mb-8 sm:flex-row sm:items-end sm:gap-4">
        <div>
          <h2 className="font-[var(--font-display)] text-2xl leading-none uppercase text-[var(--foreground)] sm:text-3xl">
            {t("homepage.derniers_drops")}
          </h2>
          <p className="mt-1 text-xs text-[var(--muted)] sm:mt-2 sm:text-sm">
            {t("homepage.authentifies")}
          </p>
        </div>
        <Link
          href="/boutique"
          className="meta-label border border-[var(--border-soft)] px-3 py-1.5 text-[10px] text-[var(--primary)] sm:border-0 sm:px-0 sm:py-0 sm:text-xs"
        >
          {t("homepage.voir_tout")}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  );
}

function TrustCard({ item }: { item: TrustItem }) {
  const { t } = useTranslation();
  
  return (
    <article className="surface-panel h-full min-w-0 p-2.5 text-left sm:p-5 md:p-6">
      <p className="meta-label mb-2 text-[9px] text-[var(--primary)] sm:mb-4 sm:text-xs">
        {t("homepage.service")}
      </p>
      <h3 className="font-[var(--font-display)] text-[0.88rem] uppercase leading-tight sm:text-xl md:text-2xl">
        {item.title}
      </h3>
      <p className="mt-2 text-[11px] leading-4 text-[var(--muted)] sm:mt-3 sm:text-sm sm:leading-6">
        {item.text}
      </p>
    </article>
  );
}

export function TrustSection() {
  const { t } = useTranslation();
  
  return (
    <section
      id="trust"
      className="border-y border-[color:color-mix(in_srgb,var(--primary-strong)_35%,transparent)] bg-[var(--surface)] py-12 md:py-16"
    >
      <div className="w-full px-3 text-center md:px-5">
        <div className="mb-6 inline-flex items-center border border-[var(--primary-strong)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--primary-strong)] sm:mb-8 sm:px-6 sm:text-xs">
          {t("homepage.carte_bancaire")}
        </div>
        <h2 className="mb-4 font-[var(--font-display)] text-2xl uppercase leading-none text-[var(--foreground)] sm:mb-6 sm:text-4xl md:text-[clamp(2.8rem,6vw,4.8rem)]">
          {t("homepage.paiement_livraison")}
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:mb-10 sm:text-base md:text-lg">
          {t("homepage.commandez")}
        </p>
        <div className="grid grid-cols-3 items-stretch gap-2 sm:gap-3 md:gap-5">
          {trustItems.map((item) => (
            <TrustCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category }: { category: CategoryItem }) {
  const { t } = useTranslation();
  
  return (
    <article
      className={`relative overflow-hidden border border-[var(--border-soft)] ${category.span}`}
    >
      <Image
        src={category.image}
        alt={category.title}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="category-image-light object-cover transition-transform duration-700 hover:scale-105"
      />
      <div className="category-overlay-light absolute inset-0" />
      <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 md:bottom-6 md:left-6">
        <h3 className="font-[var(--font-display)] text-xl uppercase text-white sm:text-2xl md:text-4xl">
          {category.title}
        </h3>
        <Link
          href={`/boutique?category=${encodeURIComponent(category.title)}`}
          className="category-cta mt-2 inline-block px-3 py-1.5 text-xs font-[var(--font-display)] uppercase sm:mt-3 sm:px-4 sm:py-2 sm:text-sm"
        >
          {t("homepage.explorer")}
        </Link>
      </div>
    </article>
  );
}

export function CategoriesSection() {
  const { t } = useTranslation();
  
  return (
    <section
      id="categories"
      className="w-full px-3 pt-12 pb-0 md:px-5 md:pt-16 md:pb-0"
    >
      <h2 className="mb-6 font-[var(--font-display)] text-2xl uppercase leading-none text-[var(--foreground)] sm:mb-8 sm:text-3xl">
        {t("homepage.explorer_categories")}
      </h2>
      <div className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:gap-4 md:grid-cols-4 md:auto-rows-[280px] md:gap-5">
        {categories.map((category) => (
          <CategoryCard key={category.title} category={category} />
        ))}

        <Link
          href="/boutique?badge=Nouveaute"
          className="surface-panel col-span-2 flex flex-col items-center justify-center p-4 text-center transition-colors hover:border-[var(--primary-strong)] sm:p-5 md:col-span-1 md:p-6"
        >
          <p className="meta-label mb-3 text-xs text-[var(--primary)] sm:mb-4">
            {t("homepage.exclusif")}
          </p>
          <h3 className="font-[var(--font-display)] text-xl uppercase sm:text-2xl md:text-3xl">
            {t("homepage.liste_drops")}
          </h3>
          <p className="mt-2 max-w-xs text-xs leading-5 text-[var(--muted)] sm:mt-3 sm:text-sm sm:leading-6">
            {t("homepage.premier_informe")}
          </p>
          <span className="impact-button impact-button--primary mt-4 !h-11 !px-4 !py-2 !text-sm sm:mt-5 sm:!px-5 sm:!py-3 sm:!text-base md:mt-6">
            {t("homepage.rejoindre_liste")}
          </span>
        </Link>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const { t } = useTranslation();
  
  return (
    <footer id="footer" className="site-footer">
      <div className="site-footer__canvas">
        <div className="site-footer__art" aria-hidden="true">
          <Image
            src="/footer.png"
            alt=""
            width={752}
            height={324}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>

        <div className="site-footer__overlay px-3 md:px-5">
          <div className="site-footer__content grid gap-6 md:grid-cols-[1.1fr_0.9fr_1fr] md:gap-8">
            <div className="site-footer__block">
              <a href="/" className="inline-flex items-center gap-4" aria-label={t("footer.retour_haut")}>
                <ThemeLogo
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full border border-[#d5cec3] bg-white/80 object-cover"
                />
                <span className="font-[var(--font-display)] text-3xl uppercase text-[#9b4c1f]">
                  Coin Original
                </span>
              </a>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#5f5549]">
                {t("footer.brand_desc")}
              </p>
            </div>

            <div className="site-footer__block grid grid-cols-2 gap-5 text-[#564d42]">
              <div className="min-w-0">
                <h4 className="font-[var(--font-display)] text-xl uppercase text-[#3e3429]">
                  {t("footer.boutique")}
                </h4>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>
                    <Link href="/boutique?category=Chaussures" className="hover:text-[#9b4c1f] transition-colors">
                      {t("footer.chaussures")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/boutique?category=Vetements" className="hover:text-[#9b4c1f] transition-colors">
                      {t("footer.sweats")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/boutique?category=Vetements" className="hover:text-[#9b4c1f] transition-colors">
                      {t("footer.tshirts")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/boutique" className="hover:text-[#9b4c1f] transition-colors">
                      {t("footer.nouveautes")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="min-w-0">
                <h4 className="font-[var(--font-display)] text-xl uppercase text-[#3e3429]">
                  {t("footer.mentions")}
                </h4>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>
                    <Link href="/mentions-legales" className="hover:text-[#9b4c1f] transition-colors">
                      {t("footer.mentions_legales")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/politique-confidentialite" className="hover:text-[#9b4c1f] transition-colors">
                      {t("footer.politique")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/cgv" className="hover:text-[#9b4c1f] transition-colors">
                      {t("footer.cgv")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-[#9b4c1f] transition-colors">
                      {t("footer.contact_link")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="hover:text-[#9b4c1f] transition-colors">
                      {t("footer.faq")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="site-footer__block">
              <h4 className="font-[var(--font-display)] text-xl uppercase text-[#3e3429]">
                {t("footer.contact")}
              </h4>
              <div className="mt-4 space-y-3 text-sm text-[#564d42]">
                <a
                  href="https://wa.me/212600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#564d42] hover:text-[#9b4c1f] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>{t("footer.whatsapp")}</span>
                </a>
                <a
                  href="https://www.instagram.com/coinoriginal_?igsh=dnFqNng4aXZ2MDY5&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#564d42] hover:text-[#9b4c1f] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                  <span>{t("footer.instagram")}</span>
                </a>
              </div>
              <div className="mt-6 overflow-hidden rounded-[1.1rem] border border-[#d8d0c6] bg-white/55 shadow-[0_12px_30px_rgba(60,45,30,0.08)] backdrop-blur-sm">
                <div className="meta-label border-b border-[#d8d0c6] px-4 py-3 text-xs text-[#73695d]">
                  {t("footer.newsletter")}
                </div>
                <div className="flex">
                  <input
                    type="email"
                    placeholder={t("footer.email")}
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-[#3e3429] outline-none placeholder:text-[#8c8378]"
                  />
                  <button className="bg-[var(--primary-strong)] px-5 py-3 font-[var(--font-display)] uppercase text-[var(--background)]">
                    {t("footer.subscribe")}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
