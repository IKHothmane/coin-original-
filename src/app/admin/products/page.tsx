"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Pencil,
  PlusSquare,
  Search,
  Settings,
  ShoppingCart,
  Trash2,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  fetchAdminProducts,
  isFirebaseConfigured,
  type AdminProductRecord,
} from "@/lib/firebase/products";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
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
      className={`flex items-center gap-4 px-6 py-4 font-mono text-xs uppercase transition-all ${
        active ? "bg-[#ffb59e] font-bold text-[#5e1700]" : "text-[#e5e2e1] hover:bg-[#353534]"
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}

function ProductStatus({ stockStatus }: { stockStatus: string }) {
  if (stockStatus === "Stock faible") {
    return (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#ffba20]" />
        <span className="font-mono text-[10px] uppercase text-[#ffba20]">Stock faible</span>
      </div>
    );
  }

  if (stockStatus === "Hors stock") {
    return (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#ffb4ab]" />
        <span className="font-mono text-[10px] uppercase text-[#ffb4ab]">Hors stock</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-[#ffb4a8]" />
      <span className="font-mono text-[10px] uppercase text-[#ffb4a8]">Actif</span>
    </div>
  );
}

export default function AdminProductsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryProducts, setInventoryProducts] = useState<AdminProductRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      const products = await fetchAdminProducts();

      if (isMounted) {
        setInventoryProducts(products);
        setIsLoading(false);
      }
    };

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return inventoryProducts;
    }

    return inventoryProducts.filter((product) =>
      [product.name, product.slug, product.category, product.brand].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [inventoryProducts, searchQuery]);

  const totalProducts = inventoryProducts.length;
  const lowStockCount = inventoryProducts.filter((product) => product.stockStatus === "Stock faible").length;
  const visibleCount = filteredProducts.length;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#131313] font-[var(--font-body)] text-[#e5e2e1]">
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col gap-4 border-r-2 border-[#353534] bg-[#201f1f] py-8 lg:flex">
        <div className="mb-8 px-6">
          <h1 className="font-[var(--font-display)] text-3xl leading-none text-[#ffb59e]">
            ADMIN PANEL
          </h1>
          <p className="font-mono text-[10px] tracking-widest text-[#e6beb2] opacity-60">
            Management Suite
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {desktopNavItems.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </nav>

        <div className="mt-auto border-t border-[#353534] px-6 pt-4">
          <Link
            href="/admin/products/new"
            className="block w-full bg-[#ff571a] px-2 py-4 text-center font-[var(--font-display)] text-lg text-[#521300] transition-all hover:brightness-110 active:scale-95"
          >
            NEW PRODUCT
          </Link>
          <Link
            href="/logout"
            className="mt-2 flex items-center gap-4 py-6 font-mono text-xs uppercase text-[#e5e2e1] transition-colors hover:text-[#ffb59e]"
          >
            <LogOut size={18} />
            Logout
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
                <p className="font-mono text-[10px] tracking-widest text-[#e6beb2] opacity-60">
                  Management Suite
                </p>
              </div>
              <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Fermer le drawer">
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-1">
              {desktopNavItems.map((item) => (
                <NavLink key={item.label} {...item} onClick={() => setMobileMenuOpen(false)} />
              ))}
            </nav>
          </div>
        </div>
      ) : null}

      <main className="min-h-screen px-3 pb-24 pt-20 lg:ml-64 lg:px-5 lg:pt-0">
        <header className="sticky top-0 z-30 -mx-4 hidden h-20 items-center justify-between border-b-2 border-[#353534] bg-[#131313] px-10 lg:mx-0 lg:flex">
          <div className="font-[var(--font-display)] text-3xl uppercase tracking-tight text-[#ffb59e]">
            Coin Original
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="RECHERCHER UN PRODUIT..."
                className="w-64 border-2 border-[#353534] bg-[#201f1f] px-4 py-2 pr-11 font-mono text-xs uppercase text-[#e5e2e1] outline-none transition-all placeholder:text-[#e6beb2] focus:border-[#ff571a]"
              />
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#e6beb2]" />
            </div>
            <button type="button" className="p-2 text-[#e5e2e1] transition-colors hover:text-[#ffb59e]">
              <Bell size={20} />
            </button>
            <button type="button" className="p-2 text-[#e5e2e1] transition-colors hover:text-[#ffb59e]">
              <User size={20} />
            </button>
          </div>
        </header>

        <div className="py-6 lg:px-0 lg:py-10">
          <div className="mb-8 flex flex-col justify-between gap-6 lg:mb-12 lg:flex-row lg:items-end">
            <div>
              <h2 className="mb-4 font-[var(--font-display)] text-4xl leading-none text-[#e5e2e1] sm:text-5xl lg:text-7xl">
                GESTION DES PRODUITS
              </h2>
              <p className="max-w-xl text-base text-[#e6beb2] lg:text-lg">
                Interface d&apos;administration pour la mise a jour de l&apos;inventaire streetwear
                avec Firebase.
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[#ffb59e]">
                {isFirebaseConfigured()
                  ? "Source: Firebase products"
                  : "Source: Firebase non configure"}
              </p>
            </div>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center justify-center gap-3 self-start bg-[#ffb59e] px-6 py-4 font-[var(--font-display)] text-xl text-[#5e1700] shadow-[8px_8px_0px_0px_rgba(255,181,158,0.2)] transition-all hover:scale-105 active:scale-95"
            >
              <PlusSquare size={22} />
              AJOUTER UN PRODUIT
            </Link>
          </div>

          <div className="mb-6 lg:hidden">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="RECHERCHER UN PRODUIT..."
                className="w-full border-2 border-[#353534] bg-[#201f1f] px-4 py-3 pr-11 font-mono text-xs uppercase text-[#e5e2e1] outline-none transition-all placeholder:text-[#e6beb2] focus:border-[#ff571a]"
              />
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#e6beb2]" />
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="border-2 border-[#353534] bg-[#201f1f] p-6">
              <p className="mb-2 font-mono text-[10px] uppercase text-[#ffb59e]">Total Produits</p>
              <p className="font-[var(--font-display)] text-4xl text-[#e5e2e1]">
                {isLoading ? "..." : totalProducts}
              </p>
            </div>
            <div className="border-2 border-[#353534] bg-[#201f1f] p-6">
              <p className="mb-2 font-mono text-[10px] uppercase text-[#ffba20]">Stock Faible</p>
              <p className="font-[var(--font-display)] text-4xl text-[#e5e2e1]">
                {isLoading ? "..." : `${lowStockCount} Items`}
              </p>
            </div>
            <div className="border-2 border-[#353534] bg-[#201f1f] p-6">
              <p className="mb-2 font-mono text-[10px] uppercase text-[#fff6f5]">Ventes (24h)</p>
              <p className="font-[var(--font-display)] text-4xl text-[#e5e2e1]">+45</p>
            </div>
            <div className="border-2 border-[#353534] bg-[#201f1f] p-6">
              <p className="mb-2 font-mono text-[10px] uppercase text-[#e6beb2]">Status Systeme</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-3 w-3 animate-pulse rounded-full bg-[#ffb4a8]" />
                <span className="font-mono text-xs uppercase text-[#e5e2e1]">Operationnel</span>
              </div>
            </div>
          </div>

          <div className="overflow-hidden border-2 border-[#353534] bg-[#201f1f]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-[#353534] bg-[#2a2a2a]">
                    <th className="p-6 font-mono text-[10px] uppercase text-[#e6beb2]">Produit</th>
                    <th className="p-6 font-mono text-[10px] uppercase text-[#e6beb2]">SKU</th>
                    <th className="p-6 font-mono text-[10px] uppercase text-[#e6beb2]">Prix</th>
                    <th className="p-6 font-mono text-[10px] uppercase text-[#e6beb2]">Stock</th>
                    <th className="p-6 font-mono text-[10px] uppercase text-[#e6beb2]">Status</th>
                    <th className="p-6 text-right font-mono text-[10px] uppercase text-[#e6beb2]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#353534]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center font-mono text-xs uppercase text-[#e6beb2]">
                        Chargement des produits...
                      </td>
                    </tr>
                  ) : null}

                  {!isLoading && filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center font-mono text-xs uppercase text-[#e6beb2]">
                        {isFirebaseConfigured()
                          ? "Aucun produit dans Firebase"
                          : "Configure Firebase pour afficher les produits"}
                      </td>
                    </tr>
                  ) : null}

                  {filteredProducts.map((product) => (
                    <tr key={product.slug} className="group transition-colors hover:bg-[#1c1b1b]">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden border border-[#5c4037] bg-[#353534]">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="64px"
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div>
                            <p className="font-[var(--font-display)] text-lg uppercase tracking-tight text-[#e5e2e1]">
                              {product.name}
                            </p>
                            <p className="font-mono text-[10px] text-[#e6beb2]">{product.collectionLabel}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 font-mono text-xs text-[#e5e2e1]">{product.slug}</td>
                      <td className="p-6">
                        <span className="font-[var(--font-display)] text-lg text-[#ffb59e]">
                          {product.priceLabel}
                        </span>
                      </td>
                      <td className="p-6">
                        <span
                          className={`inline-flex border px-3 py-1 font-mono text-[10px] uppercase ${
                            product.stockStatus === "Stock faible"
                              ? "border-[#ffb4ab] bg-[#93000a] text-[#ffdad6]"
                              : product.stockStatus === "Hors stock"
                                ? "border-[#ffb4ab] bg-[#690005] text-[#ffdad6]"
                                : "border-[#5c4037] bg-[#353534] text-[#e5e2e1]"
                          }`}
                        >
                          {product.stock} unites
                        </span>
                      </td>
                      <td className="p-6">
                        <ProductStatus stockStatus={product.stockStatus} />
                      </td>
                      <td className="p-6">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/products/edit?slug=${product.slug}`}
                            className="border border-[#353534] p-2 text-[#e5e2e1] transition-all hover:border-[#ff571a] hover:text-[#ff571a]"
                            aria-label={`Modifier ${product.name}`}
                          >
                            <Pencil size={18} />
                          </Link>
                          <button
                            type="button"
                            className="border border-[#353534] p-2 text-[#e5e2e1] transition-all hover:border-[#ffb4ab] hover:text-[#ffb4ab]"
                            aria-label={`Supprimer ${product.name}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t-2 border-[#353534] bg-[#2a2a2a] p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-xs text-[#e6beb2]">
                Affichage de 1-{visibleCount} sur {totalProducts} produits
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled
                  className="border border-[#353534] p-2 text-[#e5e2e1] opacity-50"
                  aria-label="Page precedente"
                >
                  <ChevronLeft size={18} />
                </button>
                <button type="button" className="bg-[#ffb59e] px-4 py-2 font-mono text-xs text-[#5e1700]">
                  1
                </button>
                <button
                  type="button"
                  className="border border-[#353534] px-4 py-2 font-mono text-xs text-[#e5e2e1] transition-colors hover:bg-[#353534]"
                >
                  2
                </button>
                <button
                  type="button"
                  className="border border-[#353534] px-4 py-2 font-mono text-xs text-[#e5e2e1] transition-colors hover:bg-[#353534]"
                >
                  3
                </button>
                <button
                  type="button"
                  className="border border-[#353534] p-2 text-[#e5e2e1] transition-colors hover:bg-[#353534]"
                  aria-label="Page suivante"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="hidden border-t-2 border-[#353534] bg-[#0e0e0e] py-6 lg:ml-64 lg:block">
        <div className="flex items-center justify-between px-10">
          <div className="font-[var(--font-display)] text-3xl uppercase text-[#e5e2e1] opacity-50">
            COIN ORIGINAL
          </div>
          <p className="font-mono text-[10px] text-[#e6beb2]">
            © 2024 COIN ORIGINAL MOROCCO. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-4 font-mono text-[10px] uppercase text-[#e6beb2]">
            <Link href="/support" className="transition-colors hover:text-[#ffb59e]">
              Support
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-[#ffb59e]">
              Privacy Policy
            </Link>
            <Link href="/status" className="transition-colors hover:text-[#ffb59e]">
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
