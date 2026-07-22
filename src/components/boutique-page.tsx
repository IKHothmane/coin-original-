"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import {
  BottomDock,
  DesktopTopBar,
  MobileDrawer,
  MobileTopBar,
  StorefrontProductCard,
} from "@/components/homepage-sections";
import {
  PRODUCTS_PER_PAGE,
  sortOptions,
  type BoutiqueProduct,
  type BoutiqueSortValue,
} from "@/components/boutique-page-data";
import { fetchCatalogProductsWithFallback } from "@/lib/products/storefront";
import { useTranslation } from "@/lib/i18n/use-translation";

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

const categoryFilters = [
  { value: "Chaussures", labelKey: "nav.chaussures" },
  { value: "Vetements", labelKey: "nav.vetements" },
  { value: "Accessoires", labelKey: "nav.accessoires" },
] as const;

function CategoryChips({ activeCategory }: { activeCategory: string | null }) {
  const { t } = useTranslation();
  const chips = [
    {
      href: "/boutique",
      label: t("sections.voir_tout"),
      active: !activeCategory,
    },
    ...categoryFilters.map((category) => ({
      href: `/boutique?category=${encodeURIComponent(category.value)}`,
      label: t(category.labelKey),
      active: activeCategory?.toLowerCase() === category.value.toLowerCase(),
    })),
  ];

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 md:mb-8">
      {chips.map((chip) => (
        <Link
          key={chip.href}
          href={chip.href}
          className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.06em] transition-colors ${
            chip.active
              ? "border-[var(--primary)] bg-[var(--primary)] text-white"
              : "border-[var(--border-soft)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
          }`}
        >
          {chip.label}
        </Link>
      ))}
    </div>
  );
}

function BoutiqueHeader({
  searchQuery,
  onSearchChange,
  categoryFilter,
}: {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string | null;
}) {
  const { t } = useTranslation();
  return (
    <div className="mb-6 flex flex-col gap-5 md:mb-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-xl">
        <span className="eyebrow--orange">Coin Original</span>
        <h1 className="section-title mt-2.5 text-[var(--foreground)]">
          {categoryFilter ? categoryFilter : t("boutique.title")}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {categoryFilter
            ? `Decouvre notre selection de ${categoryFilter.toLowerCase()}.`
            : "La selection streetwear premium de Coin Original : sneakers, vetements et accessoires."}
        </p>
        {categoryFilter && (
          <Link href="/boutique" className="section-link mt-3">
            <ArrowLeft size={14} aria-hidden="true" />
            {t("sections.voir_tout")}
          </Link>
        )}
      </div>
      <div className="flex w-full items-stretch overflow-hidden rounded-full border border-[var(--border-soft)] bg-[var(--surface)] transition-colors focus-within:border-[var(--primary)] lg:max-w-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t("boutique.search")}
          className="w-full min-w-0 bg-transparent px-5 py-2.5 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
        />
        <span
          className="inline-flex w-12 shrink-0 items-center justify-center bg-[var(--primary)] text-white"
          aria-hidden="true"
        >
          <Search size={18} strokeWidth={2.4} />
        </span>
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
  const { t } = useTranslation();
  return (
    <div className="surface-panel mb-6 flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between md:mb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
        {t("boutique.affichage")}{" "}
        <span className="text-[var(--foreground)]">{shownCount}</span>{" "}
        {t("boutique.sur")}{" "}
        <span className="text-[var(--foreground)]">{totalCount}</span>{" "}
        {t("boutique.produits")}
      </p>
      <label className="flex items-center gap-2.5">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
          {t("boutique.trier_par")}
        </span>
        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value as BoutiqueSortValue)}
          className="cursor-pointer rounded-lg border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-2 text-xs font-bold uppercase tracking-[0.04em] text-[var(--foreground)] outline-none transition-colors focus:border-[var(--primary)]"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(`boutique.${option.value}`)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function EmptyResults({ searchQuery }: { searchQuery: string }) {
  const { t } = useTranslation();
  return (
    <div className="surface-panel px-6 py-14 text-center">
      <p className="section-title text-[var(--foreground)]">
        {t("boutique.aucun_produit")}
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm text-[var(--muted)]">
        Aucun resultat pour &quot;{searchQuery}&quot;. Essaie un autre mot-cle
        ou reinitialise les filtres.
      </p>
      <Link href="/boutique" className="btn btn--primary mt-6">
        {t("sections.voir_tout")}
      </Link>
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
    <nav
      className="mt-10 flex items-center justify-center gap-2 md:mt-12"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Page precedente"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`h-10 w-10 rounded-lg border text-sm font-bold transition-colors ${
            currentPage === page
              ? "border-[var(--primary)] bg-[var(--primary)] text-white"
              : "border-[var(--border-soft)] bg-[var(--surface)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Page suivante"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  );
}

export function BoutiquePage({ initialProducts }: { initialProducts?: BoutiqueProduct[] }) {
  const { t, lang } = useTranslation();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const badgeParam = searchParams.get("badge");
  const searchParam = searchParams.get("search") ?? "";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<BoutiqueProduct[]>(initialProducts ?? []);
  const [loading, setLoading] = useState(initialProducts === undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<BoutiqueSortValue>("latest");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (initialProducts) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const loadProducts = async () => {
      const nextProducts = await fetchCatalogProductsWithFallback();

      if (isMounted) {
        setProducts(nextProducts);
        setLoading(false);
      }
    };

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, [initialProducts]);

  useEffect(() => {
    setSearchQuery(searchParam);
    setCurrentPage(1);
  }, [searchParam]);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category from URL param
    if (categoryParam) {
      result = result.filter((product) =>
        product.category?.toLowerCase() === categoryParam.toLowerCase(),
      );
    }

    // Filter by badge from URL param
    if (badgeParam) {
      result = result.filter((product) =>
        product.badge?.label?.toLowerCase() === badgeParam.toLowerCase(),
      );
    }

    // Filter out hidden products
    result = result.filter((product) => !product.hidden);

    // Filter by search query
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (normalizedQuery) {
      result = result.filter((product) =>
        [product.brand, product.name, product.price, product.sizes.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      );
    }

    return result;
  }, [products, searchQuery, categoryParam, badgeParam]);

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
          <BoutiqueHeader
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            categoryFilter={categoryParam ?? badgeParam}
          />

          <CategoryChips activeCategory={categoryParam} />

          <BoutiqueToolbar
            shownCount={visibleProducts.length}
            totalCount={sortedProducts.length}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />

          {loading ? (
            <div className="py-20 text-center">
              <p className="text-sm text-[var(--muted)]">{t("boutique.chargement")}</p>
            </div>
          ) : visibleProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <StorefrontProductCard key={product.slug} product={product} />
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
        </section>
      </main>
    </div>
  );
}
