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
  House,
  Info,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  Lock,
  Maximize2,
  Ruler,
  Zap,
} from "lucide-react";
import {
  BottomDock,
  DesktopTopBar,
  MobileTopBar,
  MobileDrawer,
  ThemeLogo,
} from "@/components/homepage-sections";
import { type CatalogProduct, catalogProducts } from "@/components/catalog-data";
import { fetchCatalogProductBySlugWithFallback, fetchCatalogProductsWithFallback } from "@/lib/products/storefront";
import { useCart } from "@/components/cart-context";
import { getProductHref } from "@/lib/products/links";

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
      <Link href={getProductHref(product.slug)} className="block">
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
  const [fetchedProduct, setFetchedProduct] = useState<CatalogProduct | null>(product ?? null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(!product);
  const [selectedSizeState, setSelectedSizeState] = useState({
    productSlug: product?.slug ?? slug ?? "",
    value: product?.sizes.length === 1 ? (product.sizes[0] ?? "") : "",
  });
  const [quantityState, setQuantityState] = useState({
    productSlug: product?.slug ?? slug ?? "",
    value: 1,
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [sizeErrorState, setSizeErrorState] = useState({
    productSlug: product?.slug ?? slug ?? "",
    value: false,
  });
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
      // Skip Firebase fetch if product already loaded from props/catalog
      if (product) {
        setIsLoadingProduct(false);
        return;
      }
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

  const activeProduct = fetchedProduct;

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

  const [allProducts, setAllProducts] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadAllProducts = async () => {
      const products = await fetchCatalogProductsWithFallback();
      if (isMounted) {
        setAllProducts(products);
      }
    };

    void loadAllProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const recommendedProducts = useMemo(() => {
    if (!activeProduct) return [];
    return allProducts
      .filter((item) => item.slug !== activeProduct.slug)
      .slice(0, 4);
  }, [activeProduct, allProducts]);

  const handleAddToCart = (options?: { redirectToCart?: boolean }) => {
    if (!activeProduct) return;
    const cartSize = effectiveSelectedSize;
    const needsExplicitSizeSelection = activeProduct.sizes.length > 1 && !cartSize;

    if (needsExplicitSizeSelection) {
      setSizeErrorState({
        productSlug: activeProduct.slug,
        value: true,
      });
      return;
    }

    addToCart(activeProduct, cartSize, quantity, {
      replaceExisting: options?.redirectToCart,
    });
    setAddedToCart(true);
    setQuantityState({
      productSlug: activeProduct.slug,
      value: 1,
    });

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
        <main className="page-with-header flex min-h-screen items-center justify-center pb-24">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Chargement du produit...
          </p>
        </main>
      </div>
    );
  }

  if (!activeProduct) {
    return (
      <div className="brand-shell brand-grid min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <DesktopTopBar mobileMenuOpen={mobileMenuOpen} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <MobileTopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <MobileDrawer mobileMenuOpen={mobileMenuOpen} onCloseMobileMenu={() => setMobileMenuOpen(false)} />
        <main className="page-with-header flex min-h-screen flex-col items-center justify-center gap-4 px-3 pb-24 text-center md:px-5">
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
      </div>
    );
  }

  const defaultSelectedSize = activeProduct.sizes.length === 1 ? (activeProduct.sizes[0] ?? "") : "";
  const effectiveSelectedSize =
    selectedSizeState.productSlug === activeProduct.slug && activeProduct.sizes.includes(selectedSizeState.value)
      ? selectedSizeState.value
      : defaultSelectedSize;
  const quantity = quantityState.productSlug === activeProduct.slug ? quantityState.value : 1;
  const sizeError = sizeErrorState.productSlug === activeProduct.slug ? sizeErrorState.value : false;

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
      <main id="top" className="page-with-header pb-28">
        <section className="w-full px-4 py-4 md:px-8 xl:px-12 md:py-8">
          {/* Breadcrumb */}
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] md:mb-6">
            <Link href="/" className="hover:text-[var(--primary)]">
              Accueil
            </Link>
            <span>&gt;</span>
            <Link href="/boutique" className="hover:text-[var(--primary)]">
              Boutique
            </Link>
            <span>&gt;</span>
            <span>{activeProduct.category}</span>
            <span>&gt;</span>
            <span className="max-w-[200px] truncate text-[var(--foreground)] md:max-w-xs font-bold">
              {activeProduct.name}
            </span>
          </nav>

          {/* Main 3-Column Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-start">
            
            {/* Column 1: Gallery (vertical thumbnails on left, large image on right) */}
            <div className="lg:col-span-5">
              <div className="flex flex-col-reverse gap-3 md:flex-row md:items-start md:gap-4">
                {/* Vertical Thumbnails */}
                {hasMultipleImages ? (
                  <div className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-y-auto md:pb-0 md:w-20 lg:w-24 shrink-0 max-h-[500px]">
                    {activeProduct.gallery.map((image, index) => {
                      const isSelected = selectedImageIndex === index;
                      return (
                        <button
                          key={`${image.src}-${index}`}
                          type="button"
                          onClick={() => setSelectedImageIndex(index)}
                          className={cn(
                            "relative aspect-square w-16 md:w-full overflow-hidden border-2 bg-white rounded-md transition-all",
                            isSelected
                              ? "border-[#ff571a] ring-1 ring-[#ff571a]"
                              : "border-[var(--border-soft)] hover:border-[#ff571a]"
                          )}
                          aria-label={`Afficher ${image.alt.toLowerCase()}`}
                          aria-pressed={isSelected}
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes="(max-width: 768px) 64px, 96px"
                            className="object-contain p-1"
                          />
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {/* Main Image Frame */}
                <div className="group relative aspect-square w-full border border-[var(--border-soft)] bg-white rounded-xl overflow-hidden flex-1 flex items-center justify-center min-h-[300px] md:min-h-[400px] lg:min-h-[450px]">
                  <Image
                    src={mainImage.src}
                    alt={mainImage.alt}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 40vw"
                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03]"
                  />

                  {/* Badge Nouveauté */}
                  <div className="absolute left-3 top-3 z-20 bg-[#ff571a] text-white px-3 py-1 font-bold text-[10px] uppercase tracking-wider rounded">
                    NOUVEAUTÉ
                  </div>

                  {/* Zoom/Fullscreen icon */}
                  <button
                    type="button"
                    className="absolute right-3 bottom-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-soft)] bg-white/95 text-[var(--foreground)] hover:bg-[#ff571a] hover:text-white transition-colors shadow-sm"
                    aria-label="Agrandir l'image"
                  >
                    <Maximize2 size={14} />
                  </button>

                  {/* Pagination Indicator */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-black/60 text-white px-2.5 py-0.5 text-[10px] font-mono tracking-widest rounded-full">
                    {selectedImageIndex + 1}/{activeProduct.gallery.length || 1}
                  </div>

                  {hasMultipleImages ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImageIndex((index) =>
                            index === 0 ? activeProduct.gallery.length - 1 : index - 1,
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-soft)] bg-white/90 text-black hover:bg-[#ff571a] hover:text-white hover:border-[#ff571a] transition-all"
                        aria-label="Image précédente"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImageIndex((index) =>
                            index === activeProduct.gallery.length - 1 ? 0 : index + 1,
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-soft)] bg-white/90 text-black hover:bg-[#ff571a] hover:text-white hover:border-[#ff571a] transition-all"
                        aria-label="Image suivante"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Column 2: Product Info Details */}
            <div className="lg:col-span-4 space-y-5">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--muted)]">
                  <span>COIN ORIGINAL</span>
                  <span>•</span>
                  <span className="text-[#ff571a] font-bold">{activeProduct.category}</span>
                </div>
                <h1 className="mt-1.5 font-[var(--font-display)] text-2xl font-black uppercase leading-tight tracking-tight text-[var(--foreground)] sm:text-3xl md:text-4xl">
                  {activeProduct.name}
                </h1>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-yellow-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={13}
                      fill={index < 4 ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono tracking-widest text-[var(--muted)]">
                  4.8 / 5 (512 avis)
                </span>
              </div>

              {/* Price block */}
              <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border-soft)] pb-4">
                {activeProduct.compareAtPrice ? (
                  <span className="text-base text-[var(--muted)] line-through">
                    {activeProduct.compareAtPrice}
                  </span>
                ) : null}
                <span className="font-mono text-3xl font-extrabold text-[#ff571a]">
                  {activeProduct.price}
                </span>
                {savings > 0 ? (
                  <span className="bg-[#ffba20] text-black px-2 py-0.5 font-mono font-bold text-[10px] uppercase rounded">
                    ÉCONOMISEZ {formatPrice(savings)}
                  </span>
                ) : null}
              </div>

              {/* Subtitle / Model details */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-[var(--foreground)] uppercase font-[var(--font-display)]">
                  {activeProduct.name}
                </h3>
                <p className="text-xs leading-5 text-[var(--muted)]">
                  {activeProduct.description}
                </p>
              </div>

              {/* Cash on Delivery Notice */}
              <div className="flex items-center gap-3 border border-[var(--border-soft)] bg-[var(--surface-soft)] p-3 rounded-lg">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff571a]/10 text-[#ff571a] shrink-0">
                  <Truck size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-[var(--foreground)] tracking-wide">
                    PAIEMENT À LA LIVRAISON
                  </p>
                  <p className="text-[10px] text-[var(--muted)]">
                    Partout au Maroc - Paiement à la réception de votre commande.
                  </p>
                </div>
              </div>

              {/* Value Propositions */}
              <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-3">
                <div className="flex items-center gap-2 border border-[var(--border-soft)] bg-[var(--surface-soft)] p-2.5 rounded-lg">
                  <ShieldCheck size={16} className="text-[#ff571a] shrink-0" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--foreground)]">AUTHENTIQUE</p>
                    <p className="text-[8px] text-[var(--muted)]">Produits 100% originaux</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border border-[var(--border-soft)] bg-[var(--surface-soft)] p-2.5 rounded-lg">
                  <Truck size={16} className="text-[#ff571a] shrink-0" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--foreground)]">LIVRAISON RAPIDE</p>
                    <p className="text-[8px] text-[var(--muted)]">24h - 72h au Maroc</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border border-[var(--border-soft)] bg-[var(--surface-soft)] p-2.5 rounded-lg">
                  <Lock size={16} className="text-[#ff571a] shrink-0" />
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--foreground)]">PAIEMENT SÉCURISÉ</p>
                    <p className="text-[8px] text-[var(--muted)]">Transactions 100% sûres</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Checkout Sidebar Card */}
            <div className="lg:col-span-3">
              <div className="bg-[var(--surface)] p-5 border border-[var(--border-soft)] shadow-lg rounded-xl space-y-5 lg:sticky lg:top-24">
                {/* Size Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                      TAILLE (EU)
                    </span>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#ff571a] hover:underline"
                    >
                      <Ruler size={11} />
                      Guide des tailles
                    </button>
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
                          onClick={() => {
                            setSelectedSizeState({
                              productSlug: activeProduct.slug,
                              value: size,
                            });
                            setSizeErrorState({
                              productSlug: activeProduct.slug,
                              value: false,
                            });
                          }}
                          className={cn(
                            "relative border py-2 text-xs font-mono rounded transition-all",
                            isDisabled
                              ? "cursor-not-allowed border-[var(--border-soft)] opacity-20"
                              : isSelected
                                ? "border-[#ff571a] bg-[#ff571a] text-white font-bold"
                                : "border-[var(--border-soft)] bg-[var(--surface-soft)] text-[var(--foreground)] hover:border-[#ff571a] hover:text-[#ff571a]"
                          )}
                          aria-pressed={isSelected}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {sizeError ? (
                    <p className="text-[10px] text-red-500">Veuillez sélectionner une taille.</p>
                  ) : null}
                </div>

                {/* Quantity selection */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                    QUANTITÉ
                  </span>
                  <div className="flex items-center justify-between border border-[var(--border-soft)] bg-[var(--surface-soft)] rounded overflow-hidden">
                    <button
                      type="button"
                      disabled={activeProduct.soldOut || quantity <= 1}
                      onClick={() =>
                        setQuantityState({
                          productSlug: activeProduct.slug,
                          value: quantity - 1,
                        })
                      }
                      className="flex h-9 w-9 items-center justify-center text-[var(--foreground)] hover:bg-[var(--border-soft)] transition-colors disabled:opacity-20"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-mono text-xs">{quantity}</span>
                    <button
                      type="button"
                      disabled={activeProduct.soldOut || quantity >= 10}
                      onClick={() =>
                        setQuantityState({
                          productSlug: activeProduct.slug,
                          value: quantity + 1,
                        })
                      }
                      className="flex h-9 w-9 items-center justify-center text-[var(--foreground)] hover:bg-[var(--border-soft)] transition-colors disabled:opacity-20"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    disabled={activeProduct.soldOut}
                    onClick={() => handleAddToCart()}
                    className={cn(
                      "flex w-full items-center justify-center gap-2 rounded px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all active:scale-98",
                      activeProduct.soldOut
                        ? "cursor-not-allowed border border-[var(--border-soft)] bg-[var(--surface-soft)] text-[var(--muted)]"
                        : addedToCart
                          ? "bg-green-600 text-white"
                          : "bg-[#ff571a] hover:bg-[#e0450a] text-white"
                    )}
                  >
                    {activeProduct.soldOut ? (
                      "Rupture de stock"
                    ) : addedToCart ? (
                      <>
                        <Check size={14} />
                        Ajouté au panier
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={14} />
                        Ajouter au panier
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={activeProduct.soldOut}
                    onClick={() => handleAddToCart({ redirectToCart: true })}
                    className={cn(
                      "flex w-full items-center justify-center gap-2 rounded border px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all active:scale-98",
                      activeProduct.soldOut
                        ? "hidden"
                        : "border-[var(--foreground)] bg-transparent text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]"
                    )}
                  >
                    <Zap size={14} />
                    Commander maintenant
                  </button>
                </div>

                {/* Wishlist toggle */}
                <button
                  type="button"
                  onClick={() => setIsFavorite((value) => !value)}
                  className="flex w-full items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)] hover:text-[#ff571a] transition-colors py-1.5"
                >
                  <Heart size={14} className={isFavorite ? "fill-[#ff571a] text-[#ff571a]" : ""} />
                  {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                </button>
              </div>
            </div>

          </div>

          {/* Processus de Commande Banner */}
          <div className="border border-[var(--border-soft)] bg-[var(--surface-soft)] p-5 md:p-6 rounded-xl mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#ff571a]">
                  PROCESSUS DE COMMANDE
                </p>
                <h3 className="mt-0.5 font-[var(--font-display)] text-lg font-black uppercase text-[var(--foreground)]">
                  COMMANDE, EXPÉDITION ET LIVRAISON
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--muted)]">
                24H - 72H AU MAROC
              </span>
            </div>

            <div className="relative mt-6 max-w-3xl mx-auto">
              <div className="absolute left-[16.66%] right-[16.66%] top-5 border-t border-dashed border-[var(--border-soft)]" />
              <div className="relative grid grid-cols-3 gap-3 text-center">
                {[
                  {
                    icon: PackageCheck,
                    title: "Commande",
                    text: "Validation de la commande",
                  },
                  {
                    icon: Truck,
                    title: "Expédiée",
                    text: "Colis en route",
                  },
                  {
                    icon: House,
                    title: "Livrée",
                    text: "Réception et paiement",
                  },
                ].map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <div key={step.title} className="flex flex-col items-center">
                      <span className="relative z-[1] inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface)] text-[#ff571a] shadow-sm">
                        <Icon size={16} />
                      </span>
                      <p className="mt-2.5 font-[var(--font-display)] text-xs font-bold uppercase text-[var(--foreground)]">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-[9px] text-[var(--muted)]">
                        {step.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Description & Product Details side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Description Benefits Card */}
            <div className="border border-[var(--border-soft)] bg-[var(--surface)] p-5 md:p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-[var(--border-soft)] pb-3">
                <Info size={16} className="text-[#ff571a]" />
                <h4 className="font-[var(--font-display)] text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  DESCRIPTION
                </h4>
              </div>
              <p className="text-xs leading-5 text-[var(--muted)]">
                {activeProduct.description}
              </p>
              
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2 text-xs">
                  <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)]">
                    {activeProduct.category === "Chaussures"
                      ? "Empeigne ajustée pour un excellent contrôle et un confort supérieur."
                      : "Matière premium conçue pour durer et résister au quotidien."}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                  <span className="text-[var(--muted)]">
                    {activeProduct.category === "Chaussures"
                      ? "Semelle adhérente idéale pour terrains gras, humides et synthétiques."
                      : "Finition soignée et détails de coupe modernes."}
                  </span>
                </div>
              </div>
            </div>

            {/* Product info table */}
            <div className="border border-[var(--border-soft)] bg-[var(--surface)] p-5 md:p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-[var(--border-soft)] pb-3">
                <Info size={16} className="text-[#ff571a]" />
                <h4 className="font-[var(--font-display)] text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                  INFORMATIONS PRODUIT
                </h4>
              </div>

              <div className="divide-y divide-[var(--border-soft)] text-xs font-mono">
                <div className="flex py-2 justify-between">
                  <span className="text-[var(--muted)]">Marque</span>
                  <span className="text-[var(--foreground)] font-bold">{activeProduct.brand}</span>
                </div>
                <div className="flex py-2 justify-between">
                  <span className="text-[var(--muted)]">Modèle</span>
                  <span className="text-[var(--foreground)] font-bold">{activeProduct.name}</span>
                </div>
                <div className="flex py-2 justify-between">
                  <span className="text-[var(--muted)]">Catégorie</span>
                  <span className="text-[var(--foreground)] font-bold">{activeProduct.category}</span>
                </div>
                {activeProduct.category === "Chaussures" ? (
                  <div className="flex py-2 justify-between">
                    <span className="text-[var(--muted)]">Type de terrain</span>
                    <span className="text-[var(--foreground)] font-bold">Terrains gras / synthétiques (SG)</span>
                  </div>
                ) : null}
                <div className="flex py-2 justify-between">
                  <span className="text-[var(--muted)]">Référence</span>
                  <span className="text-[var(--foreground)] font-bold">
                    CO-{activeProduct.slug.toUpperCase().slice(0, 8)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-sell */}
        {recommendedProducts.length > 0 ? (
          <section className="w-full border-t border-[var(--border-soft)] px-4 py-10 md:px-8 xl:px-12 md:py-16">
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
        <div className="h-24 md:hidden" aria-hidden="true" />

        {/* Mobile sticky add-to-cart bar */}
        <div className="fixed inset-x-0 bottom-0 z-[130] border-t border-[var(--border-soft)] bg-[var(--surface)] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_30px_rgba(0,0,0,0.25)] md:hidden">
          {sizeError ? (
            <p className="mb-2 text-center text-xs text-red-500">
              Sélectionne une taille avant d&apos;ajouter
            </p>
          ) : null}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="font-[var(--font-display)] text-lg uppercase leading-none text-[#ff571a] font-bold">
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
                "flex items-center justify-center gap-2 px-5 py-3 font-[var(--font-display)] text-sm uppercase transition-all active:scale-95 rounded font-bold",
                activeProduct.soldOut
                  ? "cursor-not-allowed bg-[var(--surface-soft)] text-[var(--muted)]"
                  : addedToCart
                    ? "bg-green-600 text-white"
                    : "bg-[#ff571a] text-white",
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
    </div>
  );
}
