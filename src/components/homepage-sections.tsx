"use client";

import { House, Menu, ShoppingBag, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  categories,
  featuredProducts,
  partners,
  partnersLoop,
  trustItems,
  type CategoryItem,
  type FeaturedProduct,
  type TrustItem,
} from "@/components/homepage-data";

type MenuActionProps = {
  mobileMenuOpen: boolean;
  onOpenMobileMenu: () => void;
  onCloseMobileMenu: () => void;
};

function BrandLogo({
  imageSize,
  textClassName,
}: {
  imageSize: number;
  textClassName: string;
}) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Coin Original">
      <Image
        src="/logo.png"
        alt="Logo Coin Original"
        width={imageSize}
        height={imageSize}
        className="border border-[var(--border-soft)] object-cover"
        priority
      />
      <span className={textClassName}>Coin Original</span>
    </Link>
  );
}

export function DesktopTopBar({
}: Pick<MenuActionProps, "mobileMenuOpen" | "onOpenMobileMenu">) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 hidden border-b border-[var(--border-soft)] bg-[color:color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur md:block">
      <div className="flex h-20 w-full items-center justify-between gap-4 px-3 md:px-5">
        <div className="flex items-center gap-6">
          <BrandLogo
            imageSize={56}
            textClassName="hidden font-[var(--font-display)] text-2xl uppercase tracking-tight text-[var(--primary-strong)] sm:inline"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Rechercher des chaussures..."
            className="hidden border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-2 text-sm text-[var(--foreground)] outline-none md:block"
          />
          <Link
            href="/panier"
            className="inline-flex h-11 w-11 items-center justify-center border border-[var(--border-soft)] text-[var(--foreground)]"
            aria-label="Ouvrir le panier"
          >
            <ShoppingBag size={16} strokeWidth={2.2} aria-hidden="true" />
          </Link>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export function MobileTopBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-40 border-b border-[var(--border-soft)] bg-[color:color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur md:hidden">
      <div className="mx-auto flex h-18 w-full items-center justify-between gap-3 px-4">
        <BrandLogo
          imageSize={44}
          textClassName="font-[var(--font-display)] text-xl uppercase tracking-tight text-[var(--primary-strong)]"
        />
        <span className="info-chip text-[10px]">Maroc</span>
      </div>
    </div>
  );
}

export function MobileDrawer({
  mobileMenuOpen,
  onCloseMobileMenu,
}: Pick<MenuActionProps, "mobileMenuOpen" | "onCloseMobileMenu">) {
  if (!mobileMenuOpen) {
    return null;
  }

  return (
    <div
      id="mobile-menu"
      className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-[2px]"
      onClick={onCloseMobileMenu}
    >
      <aside
        className="ml-auto flex h-full w-[72%] max-w-[290px] flex-col border-l border-[var(--border-soft)] bg-[var(--surface)] shadow-[0_0_40px_rgba(0,0,0,0.35)] md:w-[360px] md:max-w-[360px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-20 items-center justify-between border-b border-[var(--border-soft)] px-5">
          <div className="flex flex-col">
            <span className="font-[var(--font-display)] text-3xl uppercase text-[var(--primary-strong)]">
              Menu
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
              Navigation rapide
            </span>
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-soft)] text-3xl text-[var(--foreground)]"
            aria-label="Fermer le menu"
            onClick={onCloseMobileMenu}
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-5 px-5 py-6">
          <div className="flex items-center gap-3 border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-3">
            <span className="text-[var(--muted)]">⌕</span>
            <input
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Chercher..."
              type="text"
            />
          </div>

          <nav className="flex flex-col gap-3">
            <DrawerLink href="/boutique" active onClick={onCloseMobileMenu}>
              Boutique
            </DrawerLink>
            <DrawerLink href="/panier" onClick={onCloseMobileMenu}>
              Panier
            </DrawerLink>
            <DrawerLink href="/#trust" onClick={onCloseMobileMenu}>
              A propos
            </DrawerLink>
            <DrawerLink href="/#footer" onClick={onCloseMobileMenu}>
              Contact
            </DrawerLink>
          </nav>

          <div className="mt-auto rounded-[1.2rem] border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4">
            <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
              Theme
            </p>
            <ThemeToggle />
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
      className={`rounded-[1.1rem] border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-4 font-[var(--font-display)] text-2xl uppercase transition-colors hover:text-[var(--primary)] ${
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
  mobileMenuOpen,
  onOpenMobileMenu,
}: Pick<MenuActionProps, "mobileMenuOpen" | "onOpenMobileMenu">) {
  return (
    <div className="mobile-dock">
      <div className="mobile-dock__shell">
        <Image
          src="/sole-navbar.png"
          alt=""
          width={797}
          height={271}
          priority
          sizes="(max-width: 768px) 82vw, (max-width: 1200px) 60vw, 620px"
          className="mobile-dock__image"
        />

        <nav className="mobile-dock__nav" aria-label="Navigation principale">
          <Link href="/" className="mobile-dock__item" aria-label="Accueil">
            <House size={14} strokeWidth={2.15} />
            <span>Accueil</span>
          </Link>
          <Link href="/boutique" className="mobile-dock__item" aria-label="Boutique">
            <Store size={14} strokeWidth={2.15} />
            <span>Boutique</span>
          </Link>
          <Link href="/panier" className="mobile-dock__item" aria-label="Panier">
            <ShoppingBag size={14} strokeWidth={2.15} />
            <span>Panier</span>
          </Link>
          <button
            type="button"
            className="mobile-dock__item"
            aria-label="Ouvrir le menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={onOpenMobileMenu}
          >
            <Menu size={14} strokeWidth={2.15} />
            <span>Menu</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-[500px] items-end overflow-hidden sm:min-h-[600px]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-home.jpg"
          alt="Warehouse streetwear premium"
          fill
          priority
          sizes="100vw"
          className="hero-image-light object-cover object-center"
        />
        <div className="hero-overlay-light absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      <div className="relative z-10 flex w-full flex-col gap-4 px-3 pb-8 sm:gap-6 sm:pb-12 md:px-5 md:pb-20">
        <div className="max-w-2xl">
          <span className="mb-3 inline-flex bg-[var(--primary-strong)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--background)] sm:mb-4 sm:px-4 sm:text-xs">
            Nouveau drop : Ete 24
          </span>
          <h1 className="mb-4 font-[var(--font-display)] text-3xl leading-none text-white uppercase sm:mb-6 sm:text-5xl md:text-[clamp(4.5rem,8vw,7rem)]">
            Le Coffre
            <br />
            est Ouvert.
          </h1>
          <p className="mb-6 max-w-lg text-sm leading-6 text-[var(--muted)] sm:mb-8 sm:text-base md:text-lg">
            Arrivages exclusifs de chaussures et hoodies heavy-weight. Le style
            urbain premium livre partout au Maroc.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href="#shop"
              className="impact-button impact-button--primary !h-11 w-full !px-5 !py-3 !text-sm sm:!h-14 sm:w-auto sm:!px-10 sm:!py-4 sm:!text-lg"
            >
              Voir La Collection
            </a>
            <a
              href="#categories"
              className="impact-button impact-button--secondary !h-11 w-full !border-white !px-5 !py-3 !text-sm !text-white sm:!h-14 sm:w-auto sm:!px-10 sm:!py-4 sm:!text-lg"
            >
              Voir Les Hoodies
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PartnersSection() {
  return (
    <section className="border-b border-[var(--border-soft)] bg-[var(--surface)]/80 py-12">
      <div className="flex w-full flex-col gap-8 px-3 md:px-5">
        <p className="meta-label text-center text-xs text-[var(--muted)]">
          Partenaires Urbains Globaux
        </p>
        <div className="partners-marquee sm:hidden">
          <div className="partners-track">
            {partnersLoop.map((partner, index) => (
              <span
                key={`${partner}-${index}`}
                className="partners-pill text-center font-[var(--font-display)] text-2xl uppercase"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
        <div className="hidden grid-cols-3 items-center gap-x-4 gap-y-5 opacity-60 sm:grid lg:flex lg:flex-wrap lg:justify-center lg:gap-8">
          {partners.map((partner) => (
            <span
              key={partner}
              className="text-center font-[var(--font-display)] text-3xl uppercase"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: FeaturedProduct }) {
  return (
    <article className="surface-panel flex h-full flex-col overflow-hidden">
      <Link href={`/produit/${product.slug}`} className="group flex h-full flex-col">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 bg-[var(--primary-strong)] px-2 py-1 font-[var(--font-display)] text-sm uppercase text-[var(--background)] sm:px-3 sm:text-lg">
            {product.price}
          </div>
          {product.badge ? (
            <div className="absolute right-2 top-2 bg-[var(--accent)] px-2 py-1 font-mono text-[10px] uppercase text-[var(--background)] sm:right-4 sm:top-4 sm:text-xs">
              {product.badge}
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-2 sm:p-4">
          <h3 className="font-[var(--font-display)] text-base uppercase leading-tight sm:text-2xl">
            {product.name}
          </h3>
          <p className="mt-1 text-[11px] leading-4 text-[var(--muted)] sm:text-sm">
            {product.description}
          </p>
          <span className="impact-button impact-button--secondary mt-3 !h-9 w-full !px-2 !py-2 !text-center !text-xs sm:mt-6 sm:!h-11 sm:!px-4 sm:!py-3 sm:!text-base">
            Ajouter Au Panier
          </span>
        </div>
      </Link>
    </article>
  );
}

export function ShopSection() {
  return (
    <section id="shop" className="w-full px-3 py-10 md:px-5 md:py-16">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:mb-8 sm:flex-row sm:items-end sm:gap-4">
        <div>
          <h2 className="font-[var(--font-display)] text-2xl leading-none uppercase text-[var(--foreground)] sm:text-3xl">
            Derniers Drops
          </h2>
          <p className="mt-1 text-xs text-[var(--muted)] sm:mt-2 sm:text-sm">
            Authentifies et prets pour expedition.
          </p>
        </div>
        <a
          href="#footer"
          className="meta-label border border-[var(--border-soft)] px-3 py-1.5 text-[10px] text-[var(--primary)] sm:border-0 sm:px-0 sm:py-0 sm:text-xs"
        >
          Voir Tout
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  );
}

function TrustCard({ item }: { item: TrustItem }) {
  return (
    <article className="surface-panel p-4 text-left sm:p-5 md:p-6">
      <p className="meta-label mb-3 text-[10px] text-[var(--primary)] sm:mb-4 sm:text-xs">
        Service
      </p>
      <h3 className="font-[var(--font-display)] text-lg uppercase sm:text-xl md:text-2xl">
        {item.title}
      </h3>
      <p className="mt-2 text-xs leading-5 text-[var(--muted)] sm:mt-3 sm:text-sm sm:leading-6">
        {item.text}
      </p>
    </article>
  );
}

export function TrustSection() {
  return (
    <section
      id="trust"
      className="border-y border-[color:color-mix(in_srgb,var(--primary-strong)_35%,transparent)] bg-[var(--surface)] py-12 md:py-16"
    >
      <div className="w-full px-3 text-center md:px-5">
        <div className="mb-6 inline-flex items-center border border-[var(--primary-strong)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--primary-strong)] sm:mb-8 sm:px-6 sm:text-xs">
          Aucune Carte Bancaire Requise
        </div>
        <h2 className="mb-4 font-[var(--font-display)] text-2xl uppercase leading-none text-[var(--foreground)] sm:mb-6 sm:text-4xl md:text-[clamp(2.8rem,6vw,4.8rem)]">
          Paiement a la
          <br />
          livraison au Maroc
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:mb-10 sm:text-base md:text-lg">
          Commandez maintenant, payez a votre porte. Nous livrons dans tout le
          Maroc avec un service rapide et fiable.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {trustItems.map((item) => (
            <TrustCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category }: { category: CategoryItem }) {
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
        <a
          href="#shop"
          className="category-cta mt-2 px-3 py-1.5 text-xs font-[var(--font-display)] uppercase sm:mt-3 sm:px-4 sm:py-2 sm:text-sm"
        >
          Explorer
        </a>
      </div>
    </article>
  );
}

export function CategoriesSection() {
  return (
    <section
      id="categories"
      className="w-full px-3 py-12 md:px-5 md:py-16"
    >
      <h2 className="mb-6 font-[var(--font-display)] text-2xl uppercase leading-none text-[var(--foreground)] sm:mb-8 sm:text-3xl">
        Explorer Les Categories
      </h2>
      <div className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:gap-4 md:grid-cols-4 md:auto-rows-[280px] md:gap-5">
        {categories.map((category) => (
          <CategoryCard key={category.title} category={category} />
        ))}

        <article className="surface-panel col-span-2 flex flex-col items-center justify-center p-4 text-center sm:p-5 md:col-span-1 md:p-6">
          <p className="meta-label mb-3 text-xs text-[var(--primary)] sm:mb-4">
            Exclusif
          </p>
          <h3 className="font-[var(--font-display)] text-xl uppercase sm:text-2xl md:text-3xl">
            Liste Des Drops
          </h3>
          <p className="mt-2 max-w-xs text-xs leading-5 text-[var(--muted)] sm:mt-3 sm:text-sm sm:leading-6">
            Sois le premier informe de la prochaine sortie limitee.
          </p>
          <a
            href="#footer"
            className="impact-button impact-button--primary mt-4 !h-11 !px-4 !py-2 !text-sm sm:mt-5 sm:!px-5 sm:!py-3 sm:!text-base md:mt-6"
          >
            Rejoindre La Liste
          </a>
        </article>
      </div>
    </section>
  );
}

export function SiteFooter() {
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
              <a href="#top" className="inline-flex items-center gap-4" aria-label="Retour en haut">
                <Image
                  src="/logo.png"
                  alt="Logo Coin Original"
                  width={68}
                  height={68}
                  className="h-16 w-16 rounded-full border border-[#d5cec3] bg-white/80 object-cover"
                />
                <span className="font-[var(--font-display)] text-3xl uppercase text-[#9b4c1f]">
                  Coin Original
                </span>
              </a>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#5f5549]">
                La premiere boutique de chaussures et de streetwear premium au Maroc,
                avec paiement a la livraison garanti.
              </p>
            </div>

            <div className="site-footer__block grid grid-cols-2 gap-5 text-[#564d42]">
              <div className="min-w-0">
                <h4 className="font-[var(--font-display)] text-xl uppercase text-[#3e3429]">
                  Boutique
                </h4>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>Chaussures</li>
                  <li>Sweats a capuche</li>
                  <li>T-shirts</li>
                  <li>Nouveautes</li>
                </ul>
              </div>
              <div className="min-w-0">
                <h4 className="font-[var(--font-display)] text-xl uppercase text-[#3e3429]">
                  Mentions
                </h4>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>Mentions legales</li>
                  <li>Politique de confidentialite</li>
                  <li>Infos livraison</li>
                </ul>
              </div>
            </div>

            <div className="site-footer__block">
              <h4 className="font-[var(--font-display)] text-xl uppercase text-[#3e3429]">
                Contact
              </h4>
              <div className="mt-4 space-y-3 text-sm text-[#564d42]">
                <p>Support sur WhatsApp</p>
                <p>Instagram</p>
              </div>
              <div className="mt-6 overflow-hidden rounded-[1.1rem] border border-[#d8d0c6] bg-white/55 shadow-[0_12px_30px_rgba(60,45,30,0.08)] backdrop-blur-sm">
                <div className="meta-label border-b border-[#d8d0c6] px-4 py-3 text-xs text-[#73695d]">
                  Abonne-toi aux mises a jour
                </div>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Adresse e-mail"
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-[#3e3429] outline-none placeholder:text-[#8c8378]"
                  />
                  <button className="bg-[var(--primary-strong)] px-5 py-3 font-[var(--font-display)] uppercase text-[var(--background)]">
                    S'inscrire
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
