"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from "lucide-react";
import {
  BottomDock,
  DesktopTopBar,
  MobileTopBar,
  MobileDrawer,
  SiteFooter,
  ThemeLogo,
} from "@/components/homepage-sections";
import { type CatalogProduct, catalogProducts } from "@/components/catalog-data";
import { fetchCatalogProductBySlugWithFallback } from "@/lib/products/storefront";
import { useCart } from "@/components/cart-context";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function badgeToneClasses(tone: NonNullable<CatalogProduct["badge"]>["tone"]) {
  if (tone === "tertiary") {
    return "bg-red-600 text-white";
  }

  if (tone === "error") {
    return "bg-[#7b7b7b] text-white";
  }

  return "bg-[#1f8f4d] text-white";
}

function parsePrice(price: string) {
  return Number(price.replace(/[^\d]/g, ""));
}

function formatPrice(value: number) {
  return `${value.toLocaleString("fr-FR")} DH`;
}

type ProductPageProps = {
  product?: CatalogProduct;
  slug?: string;
};

function QuantityStepper({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex items-center overflow-hidden border-2 border-[var(--border-soft)]">
      <button
        type="button"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        className="inline-flex h-10 w-10 items-center justify-center bg-[var(--surface-soft)] text-[var(--foreground)] transition-colors hover:bg-[var(--primary-strong)] hover:text-[var(--background)] disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Diminuer la quantité"
      >
        <Minus size={14} />
      </button>
      <span className="inline-flex h-10 w-12 items-center justify-center font-mono text-sm">
        {value}
      </span>
      <button
        type="button"
        disabled={disabled || value >= 10}
        onClick={() => onChange(value + 1)}
        className="inline-flex h-10 w-10 items-center justify-center bg-[var(--surface-soft)] text-[var(--foreground)] transition-colors hover:bg-[var(--primary-strong)] hover:text-[var(--background)] disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Augmenter la quantité"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--border-soft)]">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between py-3.5 text-left md:py-4"
      >
        <span className="font-[var(--font-display)] text-sm uppercase tracking-wide md:text-base">
          {title}
        </span>
        <span
          className={cn(
            "inline-flex h-6 w-6 items-center justify-center transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        >
          <ChevronRight size={16} className="rotate-90" />
        </span>
      </button>
      <div
        className={cn(
          "grid overflow-hidden transition-all duration-300",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0">
          <div className="pb-4 text-xs leading-5 text-[var(--muted)] md:text-sm md:leading-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCardSmall({ product }: { product: CatalogProduct }) {
  return (
    <article className="group border border-[var(--border-soft)] bg-[var(--surface)] transition-all hover:border-[var(--primary-strong)]">
      <Link href={`/produit/${product.slug}`} className="block">
        <div className="product-image-frame aspect-[3/4]">
          <Image
            alt={product.name}
            src={product.image}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2 z-20 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--border-soft)] bg-black/30 sm:h-12 sm:w-12">
            <ThemeLogo width={48} height={48} className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="space-y-1 p-2.5 sm:space-y-2 sm:p-4">
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--muted)] sm:text-[10px]">
            {product.brand}
          </p>
          <h3 className="font-[var(--font-display)] text-sm uppercase leading-tight sm:text-base">
            {product.name}
          </h3>
          <span className="inline-block bg-[var(--primary-strong)] px-2 py-0.5 font-[var(--font-display)] text-xs text-[var(--background)]">
            {product.price}
          </span>
        </div>
      </Link>
    </article>
  );
}

export function ProductPage({ product, slug }: ProductPageProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fetchedProduct, setFetchedProduct] = useState<CatalogProduct | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(!product && Boolean(slug));
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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

  useEffect(() => {
    if (!addedToCart) return;

    const timer = window.setTimeout(() => setAddedToCart(false), 2200);
    return () => window.clearTimeout(timer);
  }, [addedToCart]);

  const activeProduct = fetchedProduct ?? product ?? null;

  const priceValue = useMemo(
    () => (activeProduct ? parsePrice(activeProduct.price) : 0),
    [activeProduct],
  );

  const compareValue = useMemo(
    () => (activeProduct?.compareAtPrice ? parsePrice(activeProduct.compareAtPrice) : 0),
    [activeProduct],
  );

  const savings = useMemo(
    () => (compareValue > priceValue ? compareValue - priceValue : 0),
    [compareValue, priceValue],
  );

  const recommendedProducts = useMemo(() => {
    if (!activeProduct) return [];
    return catalogProducts
      .filter((item) => item.slug !== activeProduct.slug)
      .slice(0, 4);
  }, [activeProduct]);

  const handleAddToCart = (options?: { redirectToCart?: boolean }) => {
    if (!activeProduct) return;

    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    addToCart(activeProduct, selectedSize, quantity);
    setAddedToCart(true);

    if (options?.redirectToCart) {
      router.push("/panier");
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="brand-shell brand-grid min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <DesktopTopBar mobileMenuOpen={mobileMenuOpen} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <MobileTopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
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

  if (!activeProduct) {
    return (
      <div className="brand-shell brand-grid min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <DesktopTopBar mobileMenuOpen={mobileMenuOpen} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <MobileTopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <MobileDrawer mobileMenuOpen={mobileMenuOpen} onCloseMobileMenu={() => setMobileMenuOpen(false)} />
        <BottomDock mobileMenuOpen={mobileMenuOpen} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-3 pb-24 pt-18 text-center md:px-5 md:pt-20">
          <h1 className="font-[var(--font-display)] text-3xl uppercase text-[var(--foreground)]">
            Produit introuvable
          </h1>
          <p className="max-w-md text-sm text-[var(--muted)]">
            Le produit que tu cherches n&apos;existe pas ou a été retiré.
          </p>
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 border border-[var(--border-soft)] bg-[var(--surface)] px-6 py-3 font-mono text-xs uppercase text-[var(--primary)] transition-colors hover:border-[var(--primary-strong)]"
          >
            Retour à la boutique
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const effectiveSelectedSize = activeProduct.sizes.includes(selectedSize)
    ? selectedSize
    : (activeProduct.sizes[0] ?? "");

  const mainImage = activeProduct.gallery[selectedImageIndex] ?? activeProduct.gallery[0];
  const hasMultipleImages = activeProduct.gallery.length > 1;

  return (
    <div className="brand-shell brand-grid min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <DesktopTopBar
        mobileMenuOpen={mobileMenuOpen}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />
      <MobileTopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileDrawer
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />
      <BottomDock
        mobileMenuOpen={mobileMenuOpen}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      <main id="top" className="pb-24 pt-18 md:pt-20">
        <section className="w-full px-3 py-4 md:px-5 md:py-8">
          {/* Breadcrumb */}
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] md:mb-6">
            <Link href="/" className="hover:text-[var(--primary)]">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/boutique" className="hover:text-[var(--primary)]">
              Boutique
            </Link>
            <span>/</span>
            <span>{activeProduct.category}</span>
            <span>/</span>
            <span className="max-w-[200px] truncate text-[var(--foreground)] md:max-w-xs">
              {activeProduct.name}
            </span>
          </nav>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <div className="sticky top-20 space-y-3 md:space-y-4">
                <div className="group relative aspect-[4/5] border-2 border-[var(--border-soft)] product-image-frame md:aspect-square lg:aspect-[4/5]">
                  <Image
                    src={mainImage.src}
                    alt={mainImage.alt}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 58vw"
                    className="object-contain p-3 transition-transform duration-700 group-hover:scale-[1.03] md:p-6"
                  />
                  <div className="absolute left-3 top-3 z-20 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[var(--border-soft)] bg-black/30 md:left-5 md:top-5 md:h-14 md:w-14">
                    <ThemeLogo width={56} height={56} className="h-full w-full object-cover" />
                  </div>

                  {activeProduct.badge ? (
                    <div
                      className={cn(
                        "absolute right-3 top-3 px-3 py-1.5 md:right-5 md:top-5",
                        badgeToneClasses(activeProduct.badge.tone),
                      )}
                    >
                      <span className="font-[var(--font-display)] text-xs uppercase tracking-tight md:text-sm">
                        {activeProduct.badge.label}
                      </span>
                    </div>
                  ) : null}

                  {hasMultipleImages ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImageIndex((index) =>
                            index === 0 ? activeProduct.gallery.length - 1 : index - 1,
                          )
                        }
                        className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center border border-[var(--border-soft)] bg-[var(--surface)]/90 text-[var(--foreground)] backdrop-blur transition-colors hover:bg-[var(--primary-strong)] hover:text-[var(--background)] md:left-4 md:flex"
                        aria-label="Image précédente"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImageIndex((index) =>
                            index === activeProduct.gallery.length - 1 ? 0 : index + 1,
                          )
                        }
                        className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center border border-[var(--border-soft)] bg-[var(--surface)]/90 text-[var(--foreground)] backdrop-blur transition-colors hover:bg-[var(--primary-strong)] hover:text-[var(--background)] md:right-4 md:flex"
                        aria-label="Image suivante"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  ) : null}
                </div>

                {hasMultipleImages ? (
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:gap-3">
                    {activeProduct.gallery.map((image, index) => {
                      const isSelected = selectedImageIndex === index;

                      return (
                        <button
                          key={`${image.src}-${index}`}
                          type="button"
                          onClick={() => setSelectedImageIndex(index)}
                          className={cn(
                            "relative aspect-square overflow-hidden border-2 bg-[var(--surface)] text-left transition-all",
                            isSelected
                              ? "border-[var(--primary-strong)] ring-1 ring-[var(--primary-strong)]"
                              : "border-[var(--border-soft)] hover:border-[var(--primary)]",
                          )}
                          aria-label={`Afficher ${image.alt.toLowerCase()}`}
                          aria-pressed={isSelected}
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes="(max-width: 640px) 25vw, 12vw"
                            className="object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Product info */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                <div className="space-y-4 md:space-y-5">
                  {/* Brand & Title */}
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--primary)]">
                        {activeProduct.brand}
                      </span>
                      <span className="hidden h-px w-6 bg-[var(--border-soft)] sm:inline-block" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                        {activeProduct.category}
                      </span>
                    </div>
                    <h1 className="font-[var(--font-display)] text-2xl uppercase leading-none tracking-tight text-[var(--foreground)] sm:text-3xl md:text-4xl">
                      {activeProduct.name}
                    </h1>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-[var(--accent)]">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={12}
                          fill={index < 4 ? "currentColor" : "none"}
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                      4.8 / 5 (12 avis)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex flex-wrap items-baseline gap-3 border-b border-[var(--border-soft)] pb-5">
                    {activeProduct.compareAtPrice ? (
                      <span className="text-base text-[var(--muted)] line-through md:text-lg">
                        {activeProduct.compareAtPrice}
                      </span>
                    ) : null}
                    <span className="font-[var(--font-display)] text-3xl text-[var(--primary-strong)] md:text-4xl">
                      {activeProduct.price}
                    </span>
                    {savings > 0 ? (
                      <span className="bg-[var(--accent)] px-2 py-0.5 font-mono text-[10px] uppercase text-[var(--background)]">
                        Économise {formatPrice(savings)}
                      </span>
                    ) : null}
                  </div>

                  {/* Short description */}
                  <p className="text-sm leading-6 text-[var(--muted)] md:text-base md:leading-7">
                    {activeProduct.description}
                  </p>

                  {/* Delivery notice */}
                  <div className="flex items-center gap-3 border-l-4 border-[var(--primary-strong)] bg-[var(--surface-soft)] p-3 md:p-4">
                    <span className="text-xl text-[var(--accent)] md:text-2xl" aria-hidden="true">
                      🚚
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase text-[var(--foreground)] md:text-sm">
                        {activeProduct.deliveryLabel ?? "Livraison gratuite"}
                      </p>
                      <p className="text-[11px] text-[var(--muted)] md:text-xs">
                        {activeProduct.deliveryRegion ?? "Partout au Maroc"} — Paiement à la livraison
                      </p>
                    </div>
                  </div>

                  {/* Size selector */}
                  <div className="space-y-2">
                    <div className="flex items-end justify-between">
                      <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                        Taille ({activeProduct.category === "Vetements" || activeProduct.category === "Hoodies" ? "US" : "EU"})
                      </label>
                      <button
                        type="button"
                        className="flex items-center gap-1 text-[10px] uppercase text-[var(--primary)] hover:underline"
                      >
                        <Info size={12} />
                        Guide des tailles
                      </button>
                    </div>

                    <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:gap-3">
                      {activeProduct.sizes.map((size) => {
                        const isDisabled = activeProduct.soldOut;
                        const isSelected = effectiveSelectedSize === size;

                        return (
                          <button
                            key={size}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => {
                              setSelectedSize(size);
                              setSizeError(false);
                            }}
                            className={cn(
                              "relative border-2 py-2.5 text-xs transition-all md:py-3 md:text-sm",
                              isDisabled
                                ? "cursor-not-allowed border-[var(--border-soft)] opacity-30"
                                : isSelected
                                  ? "border-[var(--primary-strong)] bg-[var(--primary-strong)] text-[var(--background)]"
                                  : "border-[var(--border-soft)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--primary-strong)] hover:text-[var(--primary-strong)]",
                            )}
                            aria-pressed={isSelected}
                          >
                            {size}
                            {isSelected ? (
                              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--background)] md:h-4 md:w-4">
                                <Check size={8} strokeWidth={3} />
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>

                    {sizeError ? (
                      <p className="text-xs text-red-500">Veuillez sélectionner une taille.</p>
                    ) : null}
                  </div>

                  {/* Quantity & Actions */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between gap-4">
                      <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                        Quantité
                      </label>
                      <QuantityStepper
                        value={quantity}
                        onChange={setQuantity}
                        disabled={activeProduct.soldOut}
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        disabled={activeProduct.soldOut}
                        onClick={() => handleAddToCart()}
                        className={cn(
                          "group relative flex w-full items-center justify-center gap-2 overflow-hidden border-2 px-5 py-3.5 font-[var(--font-display)] text-base uppercase transition-all active:scale-95 sm:py-4 sm:text-lg",
                          activeProduct.soldOut
                            ? "cursor-not-allowed border-[var(--border-soft)] bg-[var(--surface-soft)] text-[var(--muted)]"
                            : addedToCart
                              ? "border-green-600 bg-green-600 text-white"
                              : "border-[var(--primary-strong)] bg-[var(--primary-strong)] text-[var(--background)] hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:border-[var(--foreground)]",
                        )}
                      >
                        {activeProduct.soldOut ? (
                          "Rupture de stock"
                        ) : addedToCart ? (
                          <>
                            <Check size={18} />
                            Ajouté au panier
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={18} />
                            Ajouter au panier
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={activeProduct.soldOut}
                        onClick={() => handleAddToCart({ redirectToCart: true })}
                        className={cn(
                          "flex w-full items-center justify-center gap-2 border-2 px-5 py-3.5 font-[var(--font-display)] text-base uppercase transition-all active:scale-95 sm:py-4 sm:text-lg",
                          activeProduct.soldOut
                            ? "hidden"
                            : "border-[var(--foreground)] bg-transparent text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]",
                        )}
                      >
                        Commander maintenant
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsFavorite((value) => !value)}
                        className={cn(
                          "inline-flex h-11 w-11 items-center justify-center border-2 transition-colors",
                          isFavorite
                            ? "border-red-500 bg-red-500 text-white"
                            : "border-[var(--border-soft)] text-[var(--muted)] hover:border-red-400 hover:text-red-400",
                        )}
                        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                      >
                        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                      </button>
                      <span className="text-xs text-[var(--muted)]">
                        {isFavorite ? "Dans tes favoris" : "Ajouter aux favoris"}
                      </span>
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className="grid grid-cols-2 gap-2 pt-2 md:grid-cols-3">
                    {[
                      { icon: "✓", label: "Authentique" },
                      { icon: "🚚", label: "Livraison rapide" },
                      { icon: "🛡️", label: "Paiement sécurisé" },
                    ].map((badge) => (
                      <div
                        key={badge.label}
                        className="flex items-center gap-2 border border-[var(--border-soft)] bg-[var(--surface-soft)] px-2 py-2.5 md:px-3"
                      >
                        <span className="text-sm">{badge.icon}</span>
                        <span className="text-[10px] uppercase tracking-wide text-[var(--foreground)] md:text-xs">
                          {badge.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Accordions */}
                  <div className="pt-2">
                    <Accordion title="Description" defaultOpen>
                      {activeProduct.description}
                    </Accordion>
                    <Accordion title="Livraison & Retours">
                      Livraison gratuite dans tout le Maroc sous 24h à 72h selon la ville. Paiement
                      à la livraison. Les retours sont acceptés sous 7 jours si l&apos;article est
                      non porté et dans son emballage d&apos;origine.
                    </Accordion>
                    <Accordion title="Authenticité">
                      Tous nos produits sont vérifiés avant expédition. Chez Coin Original, on ne
                      vend que des articles authentiques et contrôlés.
                    </Accordion>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-sell */}
        {recommendedProducts.length > 0 ? (
          <section className="w-full border-t border-[var(--border-soft)] px-3 py-10 md:px-5 md:py-16">
            <div className="mb-6 flex items-end justify-between md:mb-8">
              <div>
                <h2 className="font-[var(--font-display)] text-2xl uppercase text-[var(--foreground)] md:text-3xl">
                  Tu vas aimer aussi
                </h2>
                <p className="mt-1 text-xs text-[var(--muted)] md:text-sm">
                  Découvre ces articles de la collection.
                </p>
              </div>
              <Link
                href="/boutique"
                className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--primary)] transition-colors hover:text-[var(--primary-strong)] sm:inline"
              >
                Voir tout →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-5">
              {recommendedProducts.map((product) => (
                <ProductCardSmall key={product.slug} product={product} />
              ))}
            </div>
          </section>
        ) : null}

        {/* Spacer for mobile sticky bar */}
        <div className="h-20 md:hidden" aria-hidden="true" />

        {/* Mobile sticky add-to-cart bar */}
        <div className="fixed inset-x-0 bottom-24 z-[130] border-t border-[var(--border-soft)] bg-[var(--surface)] p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.25)] md:hidden">
          {sizeError ? (
            <p className="mb-2 text-center text-xs text-red-500">
              Sélectionne une taille avant d&apos;ajouter
            </p>
          ) : null}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="font-[var(--font-display)] text-lg uppercase leading-none text-[var(--foreground)]">
                {activeProduct.price}
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                Taille: {effectiveSelectedSize || "—"}
              </p>
            </div>
            <button
              type="button"
              disabled={activeProduct.soldOut}
              onClick={() => handleAddToCart()}
              className={cn(
                "flex items-center justify-center gap-2 px-5 py-3 font-[var(--font-display)] text-sm uppercase transition-all active:scale-95",
                activeProduct.soldOut
                  ? "cursor-not-allowed bg-[var(--surface-soft)] text-[var(--muted)]"
                  : addedToCart
                    ? "bg-green-600 text-white"
                    : "bg-[var(--primary-strong)] text-[var(--background)]",
              )}
            >
              {activeProduct.soldOut ? (
                "Rupture"
              ) : addedToCart ? (
                <>
                  <Check size={16} />
                  Ajouté
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  Ajouter
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
