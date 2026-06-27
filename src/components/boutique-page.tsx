"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  BottomDock,
  DesktopTopBar,
  MobileDrawer,
  MobileTopBar,
  SiteFooter,
} from "@/components/homepage-sections";
import {
  boutiqueProducts,
  PRODUCTS_PER_PAGE,
  sortOptions,
  type BoutiqueProduct,
  type BoutiqueSortValue,
} from "@/components/boutique-page-data";

function badgeToneClasses(tone: NonNullable<BoutiqueProduct["badge"]>["tone"]) {
  if (tone === "tertiary") {
    return "bg-[var(--accent)] text-[var(--background)]";
  }

  if (tone === "error") {
    return "bg-red-600 text-white";
  }

  return "bg-[var(--primary-strong)] text-[var(--background)]";
}

function parsePrice(price: string) {
  return Number(price.replace(/[^\d]/g, ""));
}

function sortProducts(products: BoutiqueProduct[], sortBy: BoutiqueSortValue) {
  const sortedProducts = [...products];

  if (sortBy === "price-asc") {
    sortedProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  }

  if (sortBy === "price-desc") {
    sortedProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  }

  return sortedProducts;
}

function BoutiqueCard({ product }: { product: BoutiqueProduct }) {
  return (
    <article className="group border border-[var(--border-soft)] bg-[var(--surface)] transition-all hover:border-[var(--primary-strong)]">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          alt={product.name}
          src={product.image}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.badge ? (
          <div
            className={`absolute left-2 top-2 px-2 py-1 font-mono text-[9px] uppercase sm:left-4 sm:top-4 sm:text-[10px] ${badgeToneClasses(product.badge.tone)}`}
          >
            {product.badge.label}
          </div>
        ) : null}
        <div className="absolute bottom-2 right-2 translate-y-12 transition-transform duration-300 group-hover:translate-y-0 sm:bottom-4 sm:right-4">
          <Link
            href={`/produit/${product.slug}`}
            className="inline-flex border-2 border-[var(--primary)] bg-[var(--surface)] p-2 text-[var(--primary)] transition-all hover:bg-[var(--primary-strong)] hover:text-[var(--background)] sm:p-3"
            aria-label={`Voir ${product.name}`}
          >
            <ShoppingCart size={16} className="sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
      <div className={`space-y-1.5 p-2.5 sm:space-y-2 sm:p-4 ${product.soldOut ? "opacity-60" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--muted)] sm:text-[10px]">
              {product.brand}
            </h4>
            <h3 className="font-[var(--font-display)] text-base uppercase leading-tight transition-colors group-hover:text-[var(--primary)] sm:text-2xl">
              {product.name}
            </h3>
          </div>
          <button
            type="button"
            className="text-[var(--muted)] transition-colors hover:text-red-500"
            aria-label={`Ajouter ${product.name} aux favoris`}
          >
            <Heart size={14} className="sm:h-[18px] sm:w-[18px]" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 font-[var(--font-display)] text-sm tracking-tight sm:px-3 sm:text-xl ${
              product.soldOut
                ? "bg-[var(--surface-strong)] text-[var(--muted)]"
                : "bg-[var(--primary-strong)] text-[var(--background)]"
            }`}
          >
            {product.price}
          </span>
        </div>
        <div className="flex gap-1.5 pt-1.5 sm:gap-2 sm:pt-2">
          {product.sizes.map((size) => (
            <span
              key={size}
              className="border border-[var(--border-soft)] px-1.5 py-0.5 font-mono text-[8px] sm:px-2 sm:text-[10px]"
            >
              {size}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function BoutiqueHeader({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-[var(--font-display)] text-3xl uppercase text-[var(--primary)] sm:text-4xl md:text-5xl">
          Boutique
        </h1>
        <p className="mt-1.5 max-w-2xl text-xs text-[var(--muted)] sm:mt-2 sm:text-sm md:text-base">
          La selection streetwear premium de Coin Original, inspiree de ton
          design boutique.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Rechercher..."
            className="w-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-2.5 pr-10 text-xs outline-none transition-all focus:border-[var(--primary-strong)] sm:w-56 sm:px-4 sm:py-3 sm:pr-11 sm:text-sm"
          />
          <Search
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] sm:h-[18px] sm:w-[18px]"
          />
        </div>
        <Link
          href={`/produit/${boutiqueProducts[0]?.slug ?? "speed-volt-runner"}`}
          className="inline-flex items-center justify-center border border-[var(--border-soft)] px-3 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--foreground)] transition-colors hover:border-[var(--primary-strong)] hover:text-[var(--primary)] sm:px-4 sm:py-3 sm:text-[10px]"
        >
          Voir un produit
        </Link>
      </div>
    </div>
  );
}

function BoutiqueToolbar({
  shownCount,
  totalCount,
  sortBy,
  onSortChange,
}: {
  shownCount: number;
  totalCount: number;
  sortBy: BoutiqueSortValue;
  onSortChange: (value: BoutiqueSortValue) => void;
}) {
  return (
    <div className="mb-5 flex flex-col gap-2 border-b border-[var(--border-soft)] pb-5 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)] sm:text-[10px]">
        Affichage de {shownCount} sur {totalCount} produits
      </p>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] sm:text-[10px]">
          Trier par:
        </span>
        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value as BoutiqueSortValue)}
          className="cursor-pointer bg-transparent text-xs text-[var(--primary)] outline-none sm:text-sm"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function EmptyResults({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="border border-[var(--border-soft)] bg-[var(--surface)] px-5 py-10 text-center">
      <p className="font-[var(--font-display)] text-2xl uppercase text-[var(--primary)]">
        Aucun produit trouve
      </p>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Aucun resultat pour &quot;{searchQuery}&quot;. Essaie un autre mot-cle ou
        change le tri.
      </p>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="mt-10 flex items-center justify-center gap-3 border-t border-[var(--border-soft)] pt-5 sm:mt-12 sm:gap-4 sm:pt-6">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex h-9 w-9 items-center justify-center border border-[var(--border-soft)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
      >
        <ChevronLeft size={16} className="sm:h-[18px] sm:w-[18px]" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`h-9 w-9 border font-mono text-[9px] transition-colors sm:h-10 sm:w-10 sm:text-[10px] ${
            currentPage === page
              ? "border-[var(--primary)] bg-[var(--primary-strong)] text-[var(--background)]"
              : "border-[var(--border-soft)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex h-9 w-9 items-center justify-center border border-[var(--border-soft)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
      >
        <ChevronRight size={16} className="sm:h-[18px] sm:w-[18px]" />
      </button>
    </nav>
  );
}

export function BoutiquePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<BoutiqueSortValue>("latest");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return boutiqueProducts;
    }

    return boutiqueProducts.filter((product) =>
      [product.brand, product.name, product.price, product.sizes.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [searchQuery]);

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, sortBy),
    [filteredProducts, sortBy],
  );

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
  const visibleProducts = sortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: BoutiqueSortValue) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    const nextPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(nextPage);
  };

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

      <main className="min-h-screen w-full px-3 pb-24 pt-20 md:px-5">
        <div className="py-6 sm:py-10">
          <BoutiqueHeader searchQuery={searchQuery} onSearchChange={handleSearchChange} />

          <BoutiqueToolbar
            shownCount={visibleProducts.length}
            totalCount={sortedProducts.length}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />

          {visibleProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <BoutiqueCard key={product.name} product={product} />
              ))}
            </div>
          ) : (
            <EmptyResults searchQuery={searchQuery} />
          )}

          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
