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
        src="/logo.jpg"
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
      <div className="mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between gap-4 px-5 md:px-8">
        <div className="flex items-center gap-6">
          <BrandLogo
            imageSize={56}
            textClassName="hidden font-[var(--font-display)] text-2xl uppercase tracking-tight text-[var(--primary-strong)] sm:inline"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Rechercher des sneakers..."
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
      <Link href="/" className="mobile-dock__item" aria-label="Accueil">
        <House size={18} strokeWidth={2.2} />
        <span>Accueil</span>
      </Link>
      <Link href="/boutique" className="mobile-dock__item" aria-label="Boutique">
        <Store size={18} strokeWidth={2.2} />
        <span>Boutique</span>
      </Link>
      <Link href="/panier" className="mobile-dock__item" aria-label="Panier">
        <ShoppingBag size={18} strokeWidth={2.2} />
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
        <Menu size={18} strokeWidth={2.2} />
        <span>Menu</span>
      </button>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-[500px] items-end overflow-hidden sm:min-h-[600px]">
      <div className="absolute inset-0">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGEMxc8LpjDqzJL3U5oYFu4tY6e0Cpkqj-9jWDfcS4UWdHsrEoWce_t2yHK8jqCpJ60ko_5DFwK5hH8ktamiU4AMm_7nBGIRAaXKL3oq9rpB21X2RMfg5Ed8W_Ke-mBvJc5hY2UjIaAbnTRr9UBmnnffl7v7tVvXNTeDRjjQxJigFxwgZ1TqYJYasTRRfshISBeWA8FpTFCqe9kqMI7aMpCqcgn7TWyzqs4zwMh2fq4hscvFJtE5vdgOPVkxsG16uuHzshxTiahQ"
          alt="Warehouse streetwear premium"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-5 pb-8 sm:gap-6 sm:pb-12 md:px-8 md:pb-20">
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
            Arrivages exclusifs de sneakers et hoodies heavy-weight. Le style
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
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 md:px-8">
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
      <Link href="/produit" className="group flex h-full flex-col">
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
          <div className="mt-2 size-chip cod-badge w-fit text-[9px] sm:mt-4 sm:text-xs">
            Paiement a la livraison
          </div>
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
    <section id="shop" className="mx-auto w-full max-w-[1200px] px-5 py-10 md:px-8 md:py-16">
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
      <div className="mx-auto w-full max-w-[1200px] px-5 text-center md:px-8">
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
        className="object-cover transition-transform duration-700 hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 md:bottom-6 md:left-6">
        <h3 className="font-[var(--font-display)] text-xl uppercase text-white sm:text-2xl md:text-4xl">
          {category.title}
        </h3>
        <a
          href="#shop"
          className="mt-2 inline-flex border border-white bg-white px-3 py-1.5 text-xs font-[var(--font-display)] uppercase text-black transition-colors hover:bg-[var(--primary-strong)] hover:text-[var(--background)] sm:mt-3 sm:px-4 sm:py-2 sm:text-sm"
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
      className="mx-auto w-full max-w-[1200px] px-5 py-12 md:px-8 md:py-16"
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
    <footer
      id="footer"
      className="border-t border-[var(--border-soft)] bg-[var(--surface-container-lowest,var(--surface))] pt-12"
    >
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-8 px-5 pb-8 md:grid-cols-3 md:px-8">
        <div>
          <a href="#top" className="inline-flex items-center gap-4" aria-label="Retour en haut">
            <Image
              src="/logo.jpg"
              alt="Logo Coin Original"
              width={72}
              height={72}
              className="h-18 w-18 border border-[var(--border-soft)] object-cover"
            />
            <span className="font-[var(--font-display)] text-3xl uppercase text-[var(--primary)]">
              Coin Original
            </span>
          </a>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--muted)]">
            Le premier shop de sneakers et streetwear premium au Maroc avec
            paiement a la livraison garanti.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="font-[var(--font-display)] text-xl uppercase">Boutique</h4>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              <li>Sneakers</li>
              <li>Hoodies</li>
              <li>T-Shirts</li>
              <li>Nouveaux Drops</li>
            </ul>
          </div>
          <div>
            <h4 className="font-[var(--font-display)] text-xl uppercase">Mentions</h4>
            <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              <li>Mentions legales</li>
              <li>Politique De Confidentialite</li>
              <li>Infos Livraison</li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-[var(--font-display)] text-xl uppercase">Contact</h4>
          <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <p>Support WhatsApp</p>
            <p>Instagram</p>
          </div>
          <div className="mt-6 border border-[var(--border-soft)]">
            <div className="meta-label border-b border-[var(--border-soft)] px-4 py-3 text-xs text-[var(--muted)]">
              Abonne-toi Aux Mises A Jour
            </div>
            <div className="flex">
              <input
                type="email"
                placeholder="Ton email"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
              />
              <button className="bg-[var(--primary-strong)] px-5 py-3 font-[var(--font-display)] uppercase text-[var(--background)]">
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border-soft)] px-5 py-4 text-center md:px-8">
        <p className="meta-label text-xs text-[var(--muted)]">
          2024 Coin Original. Paiement a la livraison au Maroc.
        </p>
      </div>
    </footer>
  );
}
