"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  ImagePlus,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  Sparkles,
  ShoppingCart,
  Truck,
  User,
  Verified,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createAdminProduct,
  slugifyProductName,
} from "@/lib/firebase/products";
import { uploadProductImageUrlsToCloudinary } from "@/lib/cloudinary";
import type { ProductBadgeTone } from "@/components/catalog-data";
import { useAdminProductImages } from "@/components/use-admin-product-images";

const DEBUG_SERVER_URL = "http://127.0.0.1:7777/event";
const DEBUG_SESSION_ID = "firebase-storage-cors";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
};

type SizeStock = Record<string, number>;

const desktopNavItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, active: false },
  { href: "/admin/products", label: "Products", icon: Package, active: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, active: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, active: false },
];

const mobileDockItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, active: false },
  { href: "/admin/products", label: "Produits", icon: Package, active: true },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingCart, active: false },
  { href: "/admin/settings", label: "Reglages", icon: Settings, active: false },
];

const productCategories = ["Chaussures", "Vetements", "Accessoires"] as const;
const defaultCategory = productCategories[1];
const productStatuses = ["Aucun", "Nouveaute", "Solde", "Rupture"] as const;
const shoeSizeLabels = ["38", "39", "40", "41", "42", "43", "44", "45"];
const clothingSizeLabels = ["XS", "S", "M", "L", "XL", "XXL"];
const accessorySizeLabels = ["Unique"];

function getBadgeConfig(status: string): { label: string; tone: ProductBadgeTone; soldOut?: boolean } | undefined {
  if (status === "Nouveaute") {
    return { label: "Nouveaute", tone: "primary" };
  }

  if (status === "Solde") {
    return { label: "Solde", tone: "tertiary" };
  }

  if (status === "Rupture") {
    return { label: "Rupture", tone: "error", soldOut: true };
  }

  return undefined;
}

function getSizeLabelsByCategory(category: string) {
  if (category === "Chaussures") {
    return shoeSizeLabels;
  }

  if (category === "Accessoires") {
    return accessorySizeLabels;
  }

  return clothingSizeLabels;
}

function createInitialSizeStock(category: string): SizeStock {
  return getSizeLabelsByCategory(category).reduce<SizeStock>((accumulator, size) => {
    accumulator[size] = 0;
    return accumulator;
  }, {});
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: NavItem & { onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 font-mono text-xs uppercase transition-all ${
        active ? "bg-[#ffb59e] font-bold text-[#5e1700]" : "text-[#e5e2e1] hover:bg-[#353534]"
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}

export default function AdminNewProductPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState<string>(defaultCategory);
  const [status, setStatus] = useState<string>(productStatuses[0]);
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sizeStock, setSizeStock] = useState<SizeStock>(() => createInitialSizeStock(defaultCategory));
  const [isDragActive, setIsDragActive] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    displayedUrls,
    primaryPreview,
    removeBackground,
    isProcessing,
    processError,
    progress,
    addFiles,
    toggleRemoveBackground,
  } = useAdminProductImages({ defaultRemoveBackground: false });

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const sizeLabels = useMemo(() => getSizeLabelsByCategory(category), [category]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    void addFiles(event.target.files);
    // Reset input so the same file can be selected again.
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);

    if (event.dataTransfer.files.length > 0) {
      void addFiles(event.dataTransfer.files);
    }
  };

  const toggleSize = (size: string) => {
    setSizeStock((current) => ({
      ...current,
      [size]: current[size] > 0 ? 0 : 1,
    }));
  };

  const handleCategoryChange = (nextCategory: string) => {
    setCategory(nextCategory);
    setSizeStock((current) => {
      const nextLabels = getSizeLabelsByCategory(nextCategory);

      return nextLabels.reduce<SizeStock>((accumulator, size) => {
        accumulator[size] = current[size] ?? 0;
        return accumulator;
      }, {});
    });
  };

  const handleSave = async () => {
    if (!productName.trim() || !price || !primaryPreview) {
      setSaveMessage("Ajoute au minimum un nom, un prix et une image avant d'enregistrer.");
      return;
    }

    // #region debug-point D:handle-save-start
    fetch(DEBUG_SERVER_URL, {
      method: "POST",
      body: JSON.stringify({
        sessionId: DEBUG_SESSION_ID,
        runId: "pre-fix",
        hypothesisId: "D",
        location: "src/app/admin/products/new/page.tsx:handleSave:start",
        msg: "[DEBUG] handleSave started",
        data: {
          productName: productName.trim(),
          category,
          status,
          fileCount: displayedUrls.length,
          hasPrimaryPreview: Boolean(primaryPreview),
        },
        ts: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    setIsSaving(true);
    const productSlug = slugifyProductName(productName.trim());
    let galleryUrls = displayedUrls.length ? [...displayedUrls] : [primaryPreview];

    const imageUploadResult = await uploadProductImageUrlsToCloudinary(productSlug, galleryUrls);
    if (imageUploadResult.error) {
      setSaveMessage(imageUploadResult.error);
      setIsSaving(false);
      return;
    }
    galleryUrls = imageUploadResult.urls;

    const badgeConfig = getBadgeConfig(status);

    // #region debug-point D:create-start
    fetch(DEBUG_SERVER_URL, {
      method: "POST",
      body: JSON.stringify({
        sessionId: DEBUG_SESSION_ID,
        runId: "pre-fix",
        hypothesisId: "D",
        location: "src/app/admin/products/new/page.tsx:handleSave:create-start",
        msg: "[DEBUG] createAdminProduct about to start",
        data: {
          productSlug,
          galleryCount: galleryUrls.length,
          hasBadge: Boolean(badgeConfig),
        },
        ts: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    const result = await createAdminProduct({
      slug: productSlug,
      brand: "Coin Original",
      category,
      name: productName.trim(),
      priceValue: Number(price),
      compareAtPriceValue: compareAtPrice ? Number(compareAtPrice) : undefined,
      description: description.trim(),
      image: galleryUrls[0],
      gallery: galleryUrls.map((image, index) => ({
        src: image,
        alt: `${productName.trim()} image ${index + 1}`,
      })),
      stockBySize: sizeStock,
      badge: badgeConfig ? { label: badgeConfig.label, tone: badgeConfig.tone } : undefined,
      soldOut: badgeConfig?.soldOut,
      authenticityLabel: "Original Authentique",
      deliveryLabel: "PAIEMENT A LA LIVRAISON",
      deliveryRegion: "MAROC",
    });

    if (result.error || !result.data) {
      // #region debug-point D:create-result-error
      fetch(DEBUG_SERVER_URL, {
        method: "POST",
        body: JSON.stringify({
          sessionId: DEBUG_SESSION_ID,
          runId: "pre-fix",
          hypothesisId: "D",
          location: "src/app/admin/products/new/page.tsx:handleSave:create-error",
          msg: "[DEBUG] createAdminProduct returned error",
          data: {
            productSlug,
            error: result.error ?? null,
            hasData: Boolean(result.data),
          },
          ts: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      setSaveMessage(result.error ?? "Impossible d'enregistrer le produit.");
      setIsSaving(false);
      return;
    }

    // #region debug-point D:create-result-success
    fetch(DEBUG_SERVER_URL, {
      method: "POST",
      body: JSON.stringify({
        sessionId: DEBUG_SESSION_ID,
        runId: "pre-fix",
        hypothesisId: "D",
        location: "src/app/admin/products/new/page.tsx:handleSave:create-success",
        msg: "[DEBUG] createAdminProduct returned success",
        data: {
          productSlug,
          resultSlug: result.data.slug,
        },
        ts: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    setSaveMessage("Produit enregistre dans Firebase.");
    setIsSaving(false);
    router.push(`/admin/products/edit?slug=${result.data.slug}`);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0F0F0F] font-[var(--font-body)] text-[#e5e2e1]">
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col gap-4 border-r-2 border-[#353534] bg-[#201f1f] py-8 lg:flex">
        <div className="mb-8 px-6">
          <h2 className="font-[var(--font-display)] text-4xl leading-none text-[#ffb59e]">
            ADMIN PANEL
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#e6beb2]">
            Management Suite
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {desktopNavItems.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </nav>

        <div className="mt-auto px-4">
          <Link
            href="/admin/products/new"
            className="block w-full bg-[#ff571a] py-4 text-center font-[var(--font-display)] uppercase text-[#521300] transition-all hover:brightness-110 active:scale-95"
          >
            NEW PRODUCT
          </Link>
          <Link
            href="/"
            className="mt-3 flex items-center justify-center gap-2 border border-[#ffb59e] py-3 text-center font-mono text-xs uppercase text-[#ffb59e] transition-colors hover:bg-[#ffb59e] hover:text-[#521300]"
          >
            Retour au site
          </Link>
          <Link
            href="/logout"
            className="mt-6 flex items-center gap-4 border-t border-[#353534] px-4 pt-6 font-mono text-xs uppercase text-[#e5e2e1] transition-all hover:bg-[#353534]"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b-2 border-[#353534] bg-[#131313] px-4 lg:hidden">
        <button type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Ouvrir le menu admin">
          <Menu size={24} />
        </button>
        <div className="font-[var(--font-display)] text-xl uppercase tracking-tight text-[#ffb59e]">
          Coin Original
        </div>
        <div className="flex items-center gap-4">
          <Bell size={20} />
          <User size={20} className="text-[#ffb59e]" />
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Fermer le menu admin"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 border-r-2 border-[#353534] bg-[#201f1f] py-6">
            <div className="mb-6 flex items-center justify-between px-6">
              <div>
                <h2 className="font-[var(--font-display)] text-2xl text-[#ffb59e]">ADMIN PANEL</h2>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#e6beb2]">
                  Management Suite
                </p>
              </div>
              <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Fermer le drawer">
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-2 px-4">
              {desktopNavItems.map((item) => (
                <NavLink key={item.label} {...item} onClick={() => setMobileMenuOpen(false)} />
              ))}
            </nav>
            <div className="mt-6 border-t border-[#353534] px-4 pt-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 border border-[#ffb59e] py-3 text-center font-mono text-xs uppercase text-[#ffb59e] transition-colors hover:bg-[#ffb59e] hover:text-[#521300]"
              >
                Retour au site
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <main className="min-h-screen px-3 pb-24 pt-20 lg:ml-64 lg:px-5 lg:pt-10">
        <header className="mb-10 flex flex-col gap-5 border-b-4 border-[#ffb59e] pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <nav className="mb-2 flex items-center gap-2 font-mono text-xs uppercase text-[#e6beb2]">
              <span>Admin</span>
              <span>/</span>
              <span>Catalogue</span>
            </nav>
            <h1 className="font-[var(--font-display)] text-4xl uppercase leading-none text-white sm:text-5xl lg:text-7xl">
              AJOUTER UN PRODUIT
            </h1>
          </div>
          <div className="flex items-center gap-2 self-start border border-green-500/50 bg-green-900/30 px-3 py-2 lg:self-end">
            <Verified size={16} className="text-green-400" />
            <span className="font-mono text-[10px] uppercase text-green-400">
              Stock Morocco Cloud
            </span>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 space-y-4 lg:col-span-5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={handleDrop}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              className={`relative aspect-square w-full cursor-pointer overflow-hidden border-2 border-dashed transition-colors ${
                isDragActive ? "border-[#ffb59e]" : "border-[#353534]"
              } ${
                primaryPreview
                  ? "bg-[repeating-linear-gradient(45deg,#111_0,#111_14px,#1A1A1A_14px,#1A1A1A_28px)]"
                  : "bg-[#1A1A1A]"
              }`}
            >
              {primaryPreview ? (
                <Image
                  key={primaryPreview}
                  src={primaryPreview}
                  alt="Apercu du produit"
                  fill
                  sizes="(max-width: 1023px) 100vw, 40vw"
                  className="object-contain"
                  onError={() => {
                    // eslint-disable-next-line no-console
                    console.error("Erreur de chargement de l'image:", primaryPreview);
                  }}
                />
              ) : null}
              {isProcessing ? (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 px-6 text-center">
                  <Sparkles size={32} className="mb-3 animate-pulse text-[#ffb59e]" />
                  <p className="font-mono text-xs uppercase text-[#e5e2e1]">
                    {progress
                      ? `${progress.key} ${Math.round((progress.current / progress.total) * 100)}%`
                      : "Suppression du fond..."}
                  </p>
                </div>
              ) : null}
              {primaryPreview ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleRemoveBackground();
                  }}
                  className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center border transition-all ${
                    removeBackground
                      ? "border-[#ffb59e] bg-[#ffb59e] text-[#521300]"
                      : "border-[#ffb59e]/60 bg-[#0f0f0f]/70 text-[#ffb59e]"
                  }`}
                  title={removeBackground ? "Fond supprime (actif)" : "Fond conserve (inactif)"}
                >
                  <Sparkles size={16} />
                </button>
              ) : null}
              {!primaryPreview && !isProcessing ? (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/30 px-6 text-center">
                  <ImagePlus size={52} className="mb-4 text-[#e6beb2]" />
                  <p className="font-mono text-xs uppercase text-[#e5e2e1]">Glisser & deposer</p>
                  <p className="mt-1 text-xs text-[#e6beb2]">PNG, JPG (MAX. 5MB)</p>
                </div>
              ) : null}
            </div>

            {primaryPreview ? (
              <div className="flex items-center justify-between border border-[#353534] bg-[#1A1A1A] px-3 py-2">
                <span className="font-mono text-xs uppercase text-[#e6beb2]">
                  Fond automatique
                </span>
                <button
                  type="button"
                  onClick={() => toggleRemoveBackground()}
                  className={`flex items-center gap-2 px-3 py-1 font-mono text-[10px] uppercase transition-all ${
                    removeBackground
                      ? "bg-[#ffb59e] text-[#521300]"
                      : "border border-[#ffb59e]/60 text-[#ffb59e]"
                  }`}
                >
                  <Sparkles size={12} />
                  {removeBackground ? "Actif" : "Inactif"}
                </button>
              </div>
            ) : null}

            {processError ? (
              <div className="border border-red-500 bg-red-900/30 px-3 py-2 text-xs text-red-200">
                {processError}
              </div>
            ) : null}

            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative aspect-square overflow-hidden border-2 border-dashed border-[#353534] transition-all hover:border-[#ffb59e] ${
                    displayedUrls[index + 1]
                      ? "bg-[repeating-linear-gradient(45deg,#111_0,#111_14px,#1A1A1A_14px,#1A1A1A_28px)]"
                      : "bg-[#1A1A1A]"
                  }`}
                >
                  {displayedUrls[index + 1] ? (
                    <>
                      <Image
                        key={displayedUrls[index + 1]}
                        src={displayedUrls[index + 1]}
                        alt={`Apercu supplementaire ${index + 1}`}
                        fill
                        sizes="120px"
                        className="object-contain"
                      />
                      <div className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center border border-[#ffb59e]/60 bg-[#0f0f0f]/70 text-[#ffb59e]">
                        <Sparkles size={14} />
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#e6beb2]">
                      <ImagePlus size={22} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="border-l-4 border-[#ffba20] bg-[#1A1A1A] p-6">
              <div className="flex items-start gap-4">
                <Info size={20} className="mt-0.5 text-[#ffba20]" />
                <div>
                  <h4 className="mb-1 font-mono text-xs uppercase text-white">Guide de Photographie</h4>
                  <p className="text-sm text-[#e6beb2]">
                    Utilise un fond urbain neutre ou un studio propre pour garder l&apos;identite
                    Coin Original.
                  </p>
                  <p className="mt-2 text-xs uppercase text-[#ffba20]">
                    Images sur Cloudinary si configure, sinon sauvegarde directe temporaire.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 flex flex-col gap-4 lg:col-span-7">
            <section className="space-y-6 bg-[#1A1A1A] p-6 border border-[#2A2A2A]">
              <div className="flex items-center gap-2">
                <span className="h-[2px] w-8 bg-[#ffb59e]" />
                <h3 className="font-mono text-xs uppercase text-[#ffb59e]">Informations de Base</h3>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs uppercase text-[#e6beb2]">Nom du Produit</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(event) => setProductName(event.target.value)}
                    placeholder="ex: OVERSIZED TEE CASABLANCA"
                    className="border-2 border-[#2A2A2A] bg-transparent px-3 py-3 text-base text-[#e5e2e1] outline-none transition-all focus:border-[#ffb59e] focus:shadow-[0_0_10px_rgba(255,181,158,0.2)]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs uppercase text-[#e6beb2]">Categorie</label>
                  <select
                    value={category}
                    onChange={(event) => handleCategoryChange(event.target.value)}
                    className="border-2 border-[#2A2A2A] bg-[#201f1f] px-3 py-3 text-base text-[#e5e2e1] outline-none transition-all focus:border-[#ffb59e]"
                  >
                    {productCategories.map((productCategory) => (
                      <option key={productCategory} value={productCategory}>
                        {productCategory}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs uppercase text-[#e6beb2]">Prix de Vente (MAD)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                      placeholder="0.00"
                      className="w-full border-2 border-[#2A2A2A] bg-transparent px-3 py-3 pr-16 text-base text-[#e5e2e1] outline-none transition-all focus:border-[#ffb59e]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-[#ffb59e]">
                      MAD
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs uppercase text-[#e6beb2]">
                    Prix Avant Solde (MAD)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={compareAtPrice}
                      onChange={(event) => setCompareAtPrice(event.target.value)}
                      placeholder="0.00"
                      className="w-full border-2 border-[#2A2A2A] bg-transparent px-3 py-3 pr-16 text-base text-[#e5e2e1] outline-none transition-all focus:border-[#ffb59e]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-[#ffb59e]">
                      MAD
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-xs uppercase text-[#e6beb2]">Statut Produit</label>
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="border-2 border-[#2A2A2A] bg-[#201f1f] px-3 py-3 text-base text-[#e5e2e1] outline-none transition-all focus:border-[#ffb59e]"
                  >
                    {productStatuses.map((productStatus) => (
                      <option key={productStatus} value={productStatus}>
                        {productStatus}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs uppercase text-[#e6beb2]">Description du Produit</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Details sur la coupe, la matiere et l'inspiration..."
                  className="border-2 border-[#2A2A2A] bg-transparent px-3 py-3 text-base text-[#e5e2e1] outline-none transition-all focus:border-[#ffb59e]"
                />
              </div>
            </section>

            <section className="space-y-6 bg-[#1A1A1A] p-6 border border-[#2A2A2A]">
              <div className="flex items-center gap-2">
                <span className="h-[2px] w-8 bg-[#ffb59e]" />
                <h3 className="font-mono text-xs uppercase text-[#ffb59e]">
                  Gestion des Tailles
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                {sizeLabels.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`border-2 p-4 text-center transition-all ${
                      sizeStock[size] > 0
                        ? "border-[#ffb59e] bg-[#ffb59e] text-[#5e1700]"
                        : "border-[#2A2A2A] bg-transparent text-[#e5e2e1]"
                    }`}
                  >
                    <div className="font-mono text-xs uppercase">
                      {size}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Link
                href="/admin/products"
                className="border-2 border-white py-5 text-center font-[var(--font-display)] uppercase text-white transition-all hover:bg-white hover:text-black active:scale-95"
              >
                ANNULER
              </Link>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || isProcessing}
                className="bg-[#ffb59e] py-5 font-[var(--font-display)] uppercase text-[#5e1700] shadow-[0_0_20px_rgba(255,181,158,0.2)] transition-all hover:brightness-110 active:scale-95"
              >
                {isSaving ? "ENREGISTREMENT..." : "ENREGISTRER LE PRODUIT"}
              </button>
            </div>

            {saveMessage ? (
              <div className="border border-[#ffb59e] bg-[#201f1f] px-4 py-3 text-sm text-[#ffdbd0]">
                {saveMessage}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="flex w-full max-w-xl flex-col gap-4 border-2 border-dashed border-[#ffb59e] bg-[#2a2a2a] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Truck size={24} className="text-[#ffb59e]" />
              <div>
                <p className="font-mono text-xs uppercase text-white">Compatible COD</p>
                <p className="text-xs text-[#e6beb2]">Pret pour le paiement a la livraison au Maroc.</p>
              </div>
            </div>
            <div className="h-px bg-[#353534] sm:h-10 sm:w-px" />
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-[#ffb59e]" />
              <span className="font-mono text-xs uppercase text-white">ORIGINE: MA</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="hidden fixed bottom-0 left-64 right-0 z-40 border-t-2 border-[#353534] bg-[#0e0e0e] px-10 py-4 lg:flex lg:items-center lg:justify-between">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[#e6beb2]">
          © 2024 COIN ORIGINAL MOROCCO. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-8">
          <Link href="/support" className="font-mono text-[10px] uppercase text-[#e6beb2] underline transition-all hover:text-[#ffb59e]">
            Support
          </Link>
          <Link href="/privacy" className="font-mono text-[10px] uppercase text-[#e6beb2] underline transition-all hover:text-[#ffb59e]">
            Privacy Policy
          </Link>
          <Link href="/status" className="font-mono text-[10px] uppercase text-[#e6beb2] underline transition-all hover:text-[#ffb59e]">
            System Status
          </Link>
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t-2 border-[#353534] bg-[#131313] lg:hidden">
        {mobileDockItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${
                item.active ? "text-[#ffb59e]" : "text-[#e5e2e1]"
              }`}
            >
              <Icon size={20} />
              <span className="font-mono text-[9px] uppercase">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
