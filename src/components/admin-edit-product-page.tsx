"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Save,
  Settings,
  ShoppingCart,
  Truck,
  User,
  Verified,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  type AdminProductRecord,
  updateAdminProduct,
} from "@/lib/firebase/products";
import type { ProductBadgeTone } from "@/components/catalog-data";
import { isCloudinaryConfigured, uploadImagesToCloudinary } from "@/lib/cloudinary";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
};

type AdminEditProductPageProps = {
  product: AdminProductRecord;
};

type SizeInventory = {
  label: string;
  quantity: number;
  active: boolean;
};

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

const editableCategories = ["Chaussures", "Vetements", "Accessoires"];
const productStatuses = ["Aucun", "Nouveaute", "Solde", "Rupture"] as const;

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error(`Impossible de lire le fichier ${file.name}.`));
    reader.readAsDataURL(file);
  });
}
const shoeSizeLabels = ["38", "39", "40", "41", "42", "43", "44", "45"];
const clothingSizeLabels = ["XS", "S", "M", "L", "XL", "XXL"];
const accessorySizeLabels = ["Unique"];

function normalizeCategory(category: string) {
  if (category === "Chaussures" || category === "Accessoires") {
    return category;
  }

  return "Vetements";
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

function getInitialStatus(product: AdminProductRecord) {
  if (product.soldOut || product.badge?.tone === "error") {
    return "Rupture";
  }

  if (product.badge?.tone === "tertiary") {
    return "Solde";
  }

  if (product.badge?.tone === "primary") {
    return "Nouveaute";
  }

  return "Aucun";
}

function createInitialSizes(product: AdminProductRecord): SizeInventory[] {
  const sizePool = getSizeLabelsByCategory(normalizeCategory(product.category));

  return sizePool.map((label, index) => ({
    label,
    active: (product.stockBySize[label] ?? 0) > 0 || product.sizes.includes(label),
    quantity: product.stockBySize[label] ?? (product.sizes.includes(label) ? 12 + index * 7 : 0),
  }));
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

export function AdminEditProductPage({ product }: AdminEditProductPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productName, setProductName] = useState(product.name);
  const [price, setPrice] = useState(String(product.priceValue));
  const [compareAtPrice, setCompareAtPrice] = useState(String(product.compareAtPriceValue ?? ""));
  const [status, setStatus] = useState<string>(getInitialStatus(product));
  const [description, setDescription] = useState(product.description);
  const [selectedCategory, setSelectedCategory] = useState(normalizeCategory(product.category));
  const [sizeInventory, setSizeInventory] = useState<SizeInventory[]>(() => createInitialSizes(product));
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(product.gallery[0]?.src ?? product.image);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const totalStock = useMemo(
    () =>
      sizeInventory.reduce((sum, size) => {
        return size.active ? sum + size.quantity : sum;
      }, 0),
    [sizeInventory],
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedImageFile(file);
    void readFileAsDataUrl(file).then((nextPreview) => {
      setPreviewImage(nextPreview);
    });
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    setSelectedImageFile(file);
    void readFileAsDataUrl(file).then((nextPreview) => {
      setPreviewImage(nextPreview);
    });
  };

  const toggleSize = (label: string) => {
    setSizeInventory((current) =>
      current.map((size) => (size.label === label ? { ...size, active: !size.active } : size)),
    );
  };

  const updateSizeQuantity = (label: string, value: string) => {
    const parsed = Number(value);

    setSizeInventory((current) =>
      current.map((size) =>
        size.label === label
          ? { ...size, quantity: Number.isFinite(parsed) && parsed >= 0 ? parsed : 0 }
          : size,
      ),
    );
  };

  const handleCategoryChange = (nextCategory: string) => {
    setSelectedCategory(nextCategory);
    setSizeInventory((current) => {
      const nextLabels = getSizeLabelsByCategory(nextCategory);

      return nextLabels.map((label) => {
        const existingSize = current.find((size) => size.label === label);

        return {
          label,
          active: existingSize?.active ?? false,
          quantity: existingSize?.quantity ?? 0,
        };
      });
    });
  };

  const handleSave = async () => {
    if (!productName.trim() || !price) {
      setSaveMessage("Ajoute au minimum un nom et un prix avant d'enregistrer.");
      return;
    }

    setIsSaving(true);
    let nextImage = previewImage;
    const shouldUploadToCloudinary = Boolean(selectedImageFile) && isCloudinaryConfigured();

    if (selectedImageFile && shouldUploadToCloudinary) {
      const uploadResult = await uploadImagesToCloudinary([selectedImageFile], product.slug);

      if (uploadResult.error || !uploadResult.data?.[0]) {
        setSaveMessage(uploadResult.error ?? "Impossible d'envoyer l'image vers Cloudinary.");
        setIsSaving(false);
        return;
      }

      nextImage = uploadResult.data[0];
    }

    const nextGallery = [
      { src: nextImage, alt: `${productName.trim()} vue principale` },
      ...product.gallery.slice(1),
    ];

    const stockBySize = sizeInventory.reduce<Record<string, number>>((accumulator, size) => {
      accumulator[size.label] = size.active ? size.quantity : 0;
      return accumulator;
    }, {});

    const badgeConfig = getBadgeConfig(status);

    const result = await updateAdminProduct(product.slug, {
      slug: product.slug,
      brand: product.brand,
      category: selectedCategory,
      name: productName.trim(),
      priceValue: Number(price),
      compareAtPriceValue:
        status === "Solde" && compareAtPrice ? Number(compareAtPrice) : undefined,
      description: description.trim(),
      image: nextImage,
      gallery: nextGallery,
      stockBySize,
      badge: badgeConfig ? { label: badgeConfig.label, tone: badgeConfig.tone } : undefined,
      soldOut: badgeConfig?.soldOut,
      authenticityLabel: product.authenticityLabel,
      deliveryLabel: product.deliveryLabel,
      deliveryRegion: product.deliveryRegion,
    });

    if (result.error) {
      setSaveMessage(result.error);
      setIsSaving(false);
      return;
    }

    setSaveMessage(
      shouldUploadToCloudinary
        ? `Le produit ${productName.trim()} a ete mis a jour dans Firebase avec image Cloudinary.`
        : `Le produit ${productName.trim()} a ete mis a jour dans Firebase.`,
    );
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#131313] text-[#e5e2e1]">
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

        <div className="mt-auto px-6">
          <Link
            href="/admin/products/new"
            className="block w-full bg-[#ff571a] py-3 text-center font-[var(--font-display)] uppercase tracking-widest text-[#521300] transition-transform hover:brightness-110 active:scale-95"
          >
            NEW PRODUCT
          </Link>
          <Link
            href="/logout"
            className="flex items-center gap-4 py-6 font-mono text-xs uppercase text-[#e6beb2] transition-colors hover:text-[#ffb59e]"
          >
            <LogOut size={18} />
            Logout
          </Link>
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b-2 border-[#353534] bg-[#131313] px-4 lg:h-20 lg:px-10">
        <div className="flex items-center gap-4">
          <button type="button" className="lg:hidden" onClick={() => setMobileMenuOpen(true)} aria-label="Ouvrir le menu admin">
            <Menu size={24} />
          </button>
          <div className="font-[var(--font-display)] text-2xl uppercase tracking-tighter text-[#ffb59e] lg:text-4xl">
            COIN ORIGINAL
          </div>
        </div>
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden items-center border-2 border-[#353534] bg-[#2a2a2a] px-4 py-2 md:flex">
            <span className="mr-2 text-[#e6beb2]">⌕</span>
            <input
              type="text"
              placeholder="RECHERCHER..."
              className="bg-transparent font-mono text-xs uppercase text-[#e5e2e1] outline-none placeholder:text-[#e6beb2]"
            />
          </div>
          <button type="button" className="transition-colors hover:text-[#ffb59e]">
            <Bell size={20} />
          </button>
          <button type="button" className="transition-colors hover:text-[#ffb59e]">
            <User size={20} />
          </button>
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
          </div>
        </div>
      ) : null}

      <main className="min-h-screen bg-[#131313] px-3 pb-24 pt-20 md:px-5 md:pt-24 lg:ml-64 lg:px-5 lg:pt-28">
        <div className="w-full">
          <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#ffb59e]">
                Editeur de Catalogue
              </span>
              <h1 className="mt-1 font-[var(--font-display)] text-4xl uppercase leading-none sm:text-5xl md:text-7xl">
                Modifier Produit
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-[#bc8700] px-4 py-2 font-mono text-xs font-bold uppercase text-[#392600]">
              <Truck size={16} />
              Livraison Express COD Active
            </div>
          </header>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragActive(true);
                }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={handleDrop}
                className={`group relative aspect-square overflow-hidden border-2 border-dashed p-8 text-center transition-colors ${
                  isDragActive ? "border-[#ff571a]" : "border-[#353534]"
                } bg-[#1A1A1A]`}
              >
                <Image
                  src={previewImage}
                  alt={`${product.name} preview`}
                  fill
                  sizes="(max-width: 1023px) 100vw, 35vw"
                  className="object-cover opacity-60 transition-opacity group-hover:opacity-100"
                />
                <div className="relative z-10 flex h-full flex-col items-center justify-center bg-black/20">
                  <ImagePlus size={52} className="mb-4 text-[#ffb59e]" />
                  <p className="mb-2 font-[var(--font-display)] text-3xl uppercase">GLISSER L&apos;IMAGE</p>
                  <p className="max-w-[240px] font-mono text-[10px] uppercase text-[#e6beb2]">
                    FORMATS JPG, PNG JUSQU&apos;A 10MB. RATIO 1:1 RECOMMANDE.
                  </p>
                </div>
              </button>

              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => {
                  const galleryItem = product.gallery[index + 1];

                  return (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden border-2 border-dashed border-[#353534] bg-[#1A1A1A]"
                    >
                      {galleryItem ? (
                        <Image
                          src={galleryItem.src}
                          alt={galleryItem.alt}
                          fill
                          sizes="120px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#e6beb2]">
                          <ImagePlus size={22} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border-2 border-[#ffb59e] bg-[#1A1A1A] p-6">
                <div className="mb-2 flex items-center gap-3 text-[#ffb59e]">
                  <Verified size={18} />
                  <span className="font-[var(--font-display)] text-2xl uppercase">BADGE DE CONFIANCE</span>
                </div>
                <p className="text-sm uppercase leading-tight text-[#e6beb2]">
                  Ce produit sera automatiquement marque comme disponible en paiement a la
                  livraison pour tout le Maroc.
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase text-[#ffba20]">
                  Images sur Cloudinary si configure, sinon sauvegarde directe temporaire.
                </p>
              </div>
            </div>

            <form className="space-y-8 border border-[#2A2A2A] bg-[#1A1A1A] p-5 sm:p-6 lg:col-span-7 lg:p-8">
              <div className="space-y-6">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-tight text-[#e6beb2]">
                    Nom du Produit
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(event) => setProductName(event.target.value)}
                    className="w-full border-b-2 border-[#353534] bg-transparent py-3 font-[var(--font-display)] text-2xl uppercase text-[#e5e2e1] outline-none transition-all focus:border-[#ff571a] sm:text-3xl"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-tight text-[#e6beb2]">
                      Prix (MAD)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        className="w-full border-b-2 border-[#353534] bg-transparent py-3 pr-10 font-[var(--font-display)] text-2xl text-[#e5e2e1] outline-none transition-all focus:border-[#ff571a] sm:text-3xl"
                      />
                      <span className="absolute bottom-3 right-0 font-[var(--font-display)] text-2xl text-[#ffb59e]">
                        DH
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-tight text-[#e6beb2]">
                      Prix Avant Solde (MAD)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={compareAtPrice}
                        onChange={(event) => setCompareAtPrice(event.target.value)}
                        className="w-full border-b-2 border-[#353534] bg-transparent py-3 pr-10 font-[var(--font-display)] text-2xl text-[#e5e2e1] outline-none transition-all focus:border-[#ff571a] sm:text-3xl"
                      />
                      <span className="absolute bottom-3 right-0 font-[var(--font-display)] text-2xl text-[#ffb59e]">
                        DH
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-tight text-[#e6beb2]">
                      Statut Produit
                    </label>
                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                      className="w-full border-b-2 border-[#353534] bg-transparent py-3 font-[var(--font-display)] text-xl text-[#e5e2e1] outline-none transition-all focus:border-[#ff571a] sm:text-2xl"
                    >
                      {productStatuses.map((productStatus) => (
                        <option key={productStatus} value={productStatus} className="bg-[#201f1f]">
                          {productStatus}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-tight text-[#e6beb2]">
                      Stock Total
                    </label>
                    <input
                      type="number"
                      value={totalStock}
                      readOnly
                      className="w-full border-b-2 border-[#353534] bg-transparent py-3 font-[var(--font-display)] text-2xl text-[#e5e2e1] outline-none sm:text-3xl"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-4 block font-mono text-[10px] uppercase tracking-tight text-[#e6beb2]">
                    Categorie
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {editableCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryChange(category)}
                        className={`border px-4 py-1 font-mono text-xs uppercase transition-colors ${
                          selectedCategory === category
                            ? "border-[#ffb59e] bg-[#ffb59e] font-bold text-[#5e1700]"
                            : "border-[#ad897e] bg-[#353534] text-[#e5e2e1]"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="border-2 border-dashed border-[#5c4037] px-4 py-1 font-mono text-xs uppercase text-[#e6beb2] transition-colors hover:border-[#ffb59e] hover:text-[#ffb59e]"
                    >
                      + Nouveau
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-tight text-[#e6beb2]">
                    Description du Produit
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="mt-2 w-full resize-none border-b-2 border-[#353534] bg-transparent py-3 text-base text-[#e5e2e1] outline-none transition-all focus:border-[#ff571a]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-4 block font-mono text-[10px] uppercase tracking-tight text-[#e6beb2]">
                  Gestion des Tailles
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {sizeInventory.map((size) => (
                    <button
                      key={size.label}
                      type="button"
                      onClick={() => toggleSize(size.label)}
                      className={`border-2 p-4 transition-all ${
                        size.active
                          ? "border-[#ff571a] bg-[#ff571a] text-[#0e0e0e]"
                          : "border-[#353534] bg-transparent text-[#e5e2e1]"
                      }`}
                    >
                      <span className="block font-mono text-xs">{size.label}</span>
                      <input
                        type="number"
                        min={0}
                        value={size.quantity}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => updateSizeQuantity(size.label, event.target.value)}
                        className={`mt-2 w-full bg-transparent text-center font-[var(--font-display)] text-3xl outline-none ${
                          size.active ? "text-[#0e0e0e]" : "text-[#e5e2e1]"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-2 md:flex-row">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex flex-1 items-center justify-center gap-3 bg-[#ffb59e] py-5 font-[var(--font-display)] text-2xl uppercase text-[#5e1700] transition-transform hover:scale-[1.01] active:scale-[0.98]"
                >
                  <Save size={28} />
                  {isSaving ? "ENREGISTREMENT..." : "ENREGISTRER LE PRODUIT"}
                </button>
                <Link
                  href="/admin/products"
                  className="flex items-center justify-center border-2 border-white px-6 py-5 font-[var(--font-display)] text-2xl uppercase text-[#e5e2e1] transition-colors hover:border-[#ffb4ab] hover:bg-[#ffb4ab] hover:text-[#690005] md:w-1/4"
                >
                  ANNULER
                </Link>
              </div>

              {saveMessage ? (
                <div className="border border-[#ffb59e] bg-[#201f1f] px-4 py-3 text-sm text-[#ffdbd0]">
                  {saveMessage}
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-[#353534] bg-[#0e0e0e] py-6 lg:ml-64">
        <div className="flex flex-col items-center justify-between gap-4 px-6 text-center md:flex-row md:px-10 md:text-left">
          <div className="font-[var(--font-display)] text-3xl uppercase text-[#e5e2e1]">
            COIN ORIGINAL
          </div>
          <p className="font-mono text-[10px] uppercase text-[#e6beb2]">
            © 2024 COIN ORIGINAL MOROCCO. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-4 font-mono text-[10px] uppercase text-[#e6beb2]">
            <Link href="/support" className="hover:text-[#ffb59e]">
              Support
            </Link>
            <Link href="/privacy" className="hover:text-[#ffb59e]">
              Privacy Policy
            </Link>
            <Link href="/status" className="hover:text-[#ffb59e]">
              System Status
            </Link>
          </div>
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
