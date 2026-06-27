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
  uploadProductImages,
} from "@/lib/supabase/products";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
};

type SizeStock = Record<"XS" | "S" | "M" | "L" | "XL" | "XXL", number>;

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

const sizeLabels: Array<keyof SizeStock> = ["XS", "S", "M", "L", "XL", "XXL"];

const initialSizeStock: SizeStock = {
  XS: 0,
  S: 0,
  M: 0,
  L: 0,
  XL: 0,
  XXL: 0,
};

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
  const [category, setCategory] = useState("Hauts / T-shirts");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sizeStock, setSizeStock] = useState<SizeStock>(initialSizeStock);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const totalStock = useMemo(
    () => Object.values(sizeStock).reduce((sum, quantity) => sum + quantity, 0),
    [sizeStock],
  );

  const primaryPreview = imagePreviews[0];

  const applyFiles = (files: FileList | File[]) => {
    const selectedFiles = Array.from(files).slice(0, 5);

    if (selectedFiles.length === 0) {
      return;
    }

    setImagePreviews((current) => {
      current.forEach((url) => URL.revokeObjectURL(url));
      return selectedFiles.map((file) => URL.createObjectURL(file));
    });
    setSelectedFiles(selectedFiles);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    applyFiles(event.target.files);
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragActive(false);

    if (event.dataTransfer.files.length > 0) {
      applyFiles(event.dataTransfer.files);
    }
  };

  const handleSizeChange = (size: keyof SizeStock, value: string) => {
    const parsed = Number(value);

    setSizeStock((current) => ({
      ...current,
      [size]: Number.isFinite(parsed) && parsed >= 0 ? parsed : 0,
    }));
  };

  const handleSave = async () => {
    if (!productName.trim() || !price || !primaryPreview) {
      setSaveMessage("Ajoute au minimum un nom, un prix et une image avant d'enregistrer.");
      return;
    }

    setIsSaving(true);
    const productSlug = slugifyProductName(productName.trim());
    let galleryUrls = imagePreviews.length ? [...imagePreviews] : [primaryPreview];

    if (selectedFiles.length > 0) {
      const uploadResult = await uploadProductImages(selectedFiles, productSlug);

      if (uploadResult.error || !uploadResult.data) {
        setSaveMessage(uploadResult.error ?? "Impossible d'envoyer les images vers Supabase Storage.");
        setIsSaving(false);
        return;
      }

      galleryUrls = uploadResult.data;
    }

    const result = await createAdminProduct({
      slug: productSlug,
      brand: "Coin Original",
      category,
      name: productName.trim(),
      priceValue: Number(price),
      description: description.trim(),
      image: galleryUrls[0],
      gallery: galleryUrls.map((image, index) => ({
        src: image,
        alt: `${productName.trim()} image ${index + 1}`,
      })),
      stockBySize: sizeStock,
      authenticityLabel: "Original Authentique",
      deliveryLabel: "PAIEMENT A LA LIVRAISON",
      deliveryRegion: "MAROC",
    });

    if (result.error || !result.data) {
      setSaveMessage(result.error ?? "Impossible d'enregistrer le produit.");
      setIsSaving(false);
      return;
    }

    setSaveMessage("Produit enregistre dans Supabase.");
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

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={handleDrop}
              className={`relative aspect-square w-full overflow-hidden border-2 border-dashed transition-colors ${
                isDragActive ? "border-[#ffb59e]" : "border-[#353534]"
              } bg-[#1A1A1A]`}
            >
              {primaryPreview ? (
                <Image
                  src={primaryPreview}
                  alt="Apercu du produit"
                  fill
                  sizes="(max-width: 1023px) 100vw, 40vw"
                  className="object-cover"
                />
              ) : null}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/30 px-6 text-center">
                <ImagePlus size={52} className="mb-4 text-[#e6beb2]" />
                <p className="font-mono text-xs uppercase text-[#e5e2e1]">Glisser & deposer</p>
                <p className="mt-1 text-xs text-[#e6beb2]">PNG, JPG (MAX. 5MB)</p>
              </div>
            </button>

            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-square overflow-hidden border-2 border-dashed border-[#353534] bg-[#1A1A1A] transition-all hover:border-[#ffb59e]"
                >
                  {imagePreviews[index + 1] ? (
                    <Image
                      src={imagePreviews[index + 1]}
                      alt={`Apercu supplementaire ${index + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
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
                    onChange={(event) => setCategory(event.target.value)}
                    className="border-2 border-[#2A2A2A] bg-[#201f1f] px-3 py-3 text-base text-[#e5e2e1] outline-none transition-all focus:border-[#ffb59e]"
                  >
                    <option>Hauts / T-shirts</option>
                    <option>Hoodies & Sweats</option>
                    <option>Pantalons</option>
                    <option>Accessoires</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                  <label className="font-mono text-xs uppercase text-[#e6beb2]">Stock Total</label>
                  <input
                    type="number"
                    value={totalStock}
                    disabled
                    className="cursor-not-allowed border-2 border-[#2A2A2A] bg-[#131313] px-3 py-3 text-base text-[#e5e2e1] opacity-60"
                  />
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
                  Gestion des Tailles & Stock
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                {sizeLabels.map((size) => (
                  <div key={size} className="flex flex-col">
                    <div className="border border-[#353534] bg-[#353534] py-1 text-center font-mono text-xs uppercase">
                      {size}
                    </div>
                    <input
                      type="number"
                      min={0}
                      value={sizeStock[size]}
                      onChange={(event) => handleSizeChange(size, event.target.value)}
                      className="border-2 border-t-0 border-[#2A2A2A] bg-transparent p-2 text-center font-mono text-sm outline-none transition-all focus:border-[#ffb59e]"
                    />
                  </div>
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
                disabled={isSaving}
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
