"use client";

import { useEffect, useState } from "react";
import {
  BanknoteArrowDown,
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

type BoutiqueProduct = {
  brand: string;
  name: string;
  price: string;
  badge?: {
    label: string;
    tone: "primary" | "tertiary" | "error";
  };
  image: string;
  sizes: string[];
  soldOut?: boolean;
};

const boutiqueProducts: BoutiqueProduct[] = [
  {
    brand: "Original Drop",
    name: "Neo-Retro Hoodie",
    price: "450 MAD",
    badge: { label: "New Drop", tone: "primary" },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB5-T2Ny4uOj3LeNaZvP29y_llOiDQwW1V3cojXtweZ5DdrEfphZlgx2n576EV-fKCipD7gSscQuRJYU2Wq9V22FuBK01P9fpoacV0KlyFsD9hYTHBqMSI92edRHmkGqFW8QnqWpxH00zWXBwVSPMXhYWRcq1c-a15BSkRFt8Q__zEhkHyvIkJmodhI_K_Es95T1KFdm6c0SnXUFIMPLnjO2TMp7BlKZDeOhHwzayDiZGdojzYRjOsRvi2Atwnjvk2ug1LZQ6-RPw",
    sizes: ["S", "M", "L"],
  },
  {
    brand: "Atlas Street",
    name: "Nomad Tee",
    price: "250 MAD",
    badge: { label: "Limited", tone: "tertiary" },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjzZg34_S4gLJUHWLDRhArJWhjznEJb57-t_MjLdC_76AbtGYm8aYwdSOZzCvqBC7bPk6HFE33NttZM3YD7pqg0CQ10QhbdC3EVy5Wm26G0MSdTMRf9SwS8dQfpEHYronRzhfGSv2Oei6hl0k4UPd7thq_6ZQEy7eaVtHfQfLtg7ogotUmVsHamsXmyrlHW0JIA7tNSLaQ4uY33wxs7_0PMWHuxo4HClxPvf_K5DBnCuVWSI5rwa_mON8b2pRXFNKsbuFvwAhRlw",
    sizes: ["M", "L", "XL"],
  },
  {
    brand: "Neo-Medina",
    name: "Tactical Jacket",
    price: "890 MAD",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCz7nWWSUSuOqGPVCuVuwlKBKqVI9MzzlYqDmk7fEUFxgZW3DQnQQLiDYCkGHKNAYn7lZfI50v_pgst3VYBw4n6vE8RV8xpsTMwiBMxw-q5yF7Mxtu1BnExoXQO9I2cre7Md8P9O8tHwuwYSQu0mcw9B7f3AC91GFplQ7MXl0ygnutiuCwxD0lYAkuov6t5bDQCyKNPfjlwpN-MzNzBY2eUT6TdROMEwwYVFscNV00De4HFxIYieesvFu1Ajs1f4FLBF0MkDeKItg",
    sizes: ["S", "L"],
  },
  {
    brand: "Original Drop",
    name: "Volta Sneakers",
    price: "1200 MAD",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAuT8hkhoeT1EZkhRkMWQK_NSyzfMydpxVg6zfmQj3XYXZTu9i10jPPSNqFlJM_lY3rS8ppWyXld0CJ82Aq5TyH6_eF06dAzNbs617HDrzpeb3DqyLpY_SlsBaKqbS4ECS7TWv8gLeGZpqKSKKK5t7iZm0U897J0nPJ2o1dHnGT9maP6XbZiibHSCXzINl4UJxoned2a5jc7ogjysOMGxvZVTp160H6MJpKu2xWIW0-rTqxnB29JQ1kmzt0MqQ6ueIDgZ3NKKJRmQ",
    sizes: ["40", "42", "44"],
  },
  {
    brand: "Casablanca City",
    name: "Essential Pack",
    price: "650 MAD",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4_rJthmolHaMi-cYnWY3RGWjSwmb709tFxb1PNSH9uguSUlK-xbQ5zB-goIrER19AR6VBybizdQ6x4h6ZA8UK2HWVeW8Ep3BCMmAK6p7Eh-uLChipFH-Gn9B6GG1Jyjnql3KlkMIOPsyH1yOdn25QyjsqoWN06Lv3UNJOaX1nE82SpVVpRb4eTfNPdyxqJXZvuW0hONH1hXd65s9ZFHOFLSZP4kTpsxHFC9it_r-k02bFspi9VokBggvFJDQcuJY6mW0AbwLOVQ",
    sizes: ["S", "M", "XL"],
  },
  {
    brand: "Original Drop",
    name: "Iconic Leather",
    price: "1500 MAD",
    badge: { label: "Sold Out", tone: "error" },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-6pNLxJ63BYDu-LRWOAPwS5VklXBz_BlPkcC2XK7ZGwrU9yAI16QgxcHfMXhr8uWPpE5_3SMbUwJsrW1PZ88jQP7ETa42C7cr_TT_KarA2tX6ePKoeYLOpwxCwiEJ0nEOJ2zBUJfVZ0YyyHpvMoKqArMWww1hwFiN1UFQ7MtvdjpEkpXhfYPlYRJ7Kasf5g3BV53E9BE6qU7V10ORpfPxnwhS-VYWQWKNhBa21rCi5gzkULp8Nua2MUlg02IIFx4s4arsoAfUMw",
    sizes: ["M", "L"],
    soldOut: true,
  },
];

function badgeToneClasses(tone: NonNullable<BoutiqueProduct["badge"]>["tone"]) {
  if (tone === "tertiary") {
    return "bg-[var(--accent)] text-[var(--background)]";
  }

  if (tone === "error") {
    return "bg-red-600 text-white";
  }

  return "bg-[var(--primary-strong)] text-[var(--background)]";
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
            href="/produit"
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
        <div className="flex items-center gap-1.5 font-mono text-[8px] uppercase text-[var(--accent)] sm:gap-2 sm:text-[10px]">
          <BanknoteArrowDown size={12} className="sm:h-[14px] sm:w-[14px]" />
          <span>{product.soldOut ? "Bientot disponible" : "Paiement a la livraison"}</span>
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

export function BoutiquePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

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

      <main className="min-h-screen max-w-[1200px] px-4 pb-24 pt-20 md:mx-auto md:px-8">
        <div className="py-6 sm:py-10">
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
                  placeholder="Rechercher..."
                  className="w-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-2.5 pr-10 text-xs outline-none transition-all focus:border-[var(--primary-strong)] sm:w-56 sm:px-4 sm:py-3 sm:pr-11 sm:text-sm"
                />
                <Search
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] sm:h-[18px] sm:w-[18px]"
                />
              </div>
              <Link
                href="/produit"
                className="inline-flex items-center justify-center border border-[var(--border-soft)] px-3 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--foreground)] transition-colors hover:border-[var(--primary-strong)] hover:text-[var(--primary)] sm:px-4 sm:py-3 sm:text-[10px]"
              >
                Voir un produit
              </Link>
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-2 border-b border-[var(--border-soft)] pb-5 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)] sm:text-[10px]">
              Affichage de 6 sur 48 produits
            </p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] sm:text-[10px]">
                Trier par:
              </span>
              <select className="cursor-pointer bg-transparent text-xs text-[var(--primary)] outline-none sm:text-sm">
                <option>Nouveautes</option>
                <option>Prix croissant</option>
                <option>Prix decroissant</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {boutiqueProducts.map((product) => (
              <BoutiqueCard key={product.name} product={product} />
            ))}
          </div>

          <nav className="mt-10 flex items-center justify-center gap-3 border-t border-[var(--border-soft)] pt-5 sm:mt-12 sm:gap-4 sm:pt-6">
            <button className="inline-flex h-9 w-9 items-center justify-center border border-[var(--border-soft)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] sm:h-10 sm:w-10">
              <ChevronLeft size={16} className="sm:h-[18px] sm:w-[18px]" />
            </button>
            <button className="h-9 w-9 border border-[var(--primary)] bg-[var(--primary-strong)] font-mono text-[9px] text-[var(--background)] sm:h-10 sm:w-10 sm:text-[10px]">
              1
            </button>
            <button className="h-9 w-9 border border-[var(--border-soft)] font-mono text-[9px] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] sm:h-10 sm:w-10 sm:text-[10px]">
              2
            </button>
            <button className="h-9 w-9 border border-[var(--border-soft)] font-mono text-[9px] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] sm:h-10 sm:w-10 sm:text-[10px]">
              3
            </button>
            <button className="inline-flex h-9 w-9 items-center justify-center border border-[var(--border-soft)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] sm:h-10 sm:w-10">
              <ChevronRight size={16} className="sm:h-[18px] sm:w-[18px]" />
            </button>
          </nav>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
