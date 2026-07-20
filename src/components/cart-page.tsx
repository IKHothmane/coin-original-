"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Headphones, Minus, Plus, RefreshCw, ShieldCheck, Trash2, Truck } from "lucide-react";
import {
  BottomDock,
  DesktopTopBar,
  MobileDrawer,
  MobileTopBar,
  ThemeLogo,
} from "@/components/homepage-sections";
import { useCart } from "@/components/cart-context";

function formatPrice(value: number) {
  return `${value.toLocaleString("fr-FR")} DH`;
}

function CartLine({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  item: {
    id: string;
    name: string;
    brand: string;
    size: string;
    price: number;
    quantity: number;
    image: string;
  };
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}) {
  return (
    <article className="relative flex flex-col gap-4 border border-[var(--border-soft)] bg-[var(--surface)] p-4 rounded-xl md:flex-row items-center md:justify-between">
      {/* Product Image Frame */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative h-28 w-28 sm:h-32 sm:w-32 overflow-hidden border border-[var(--border-soft)] bg-white rounded-lg shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 112px, 128px"
            className="object-contain"
          />
        </div>

        {/* Product details */}
        <div className="space-y-1">
          <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--muted)]">
            COIN ORIGINAL
          </p>
          <h3 className="font-[var(--font-display)] text-base font-bold uppercase leading-tight text-[var(--foreground)]">
            {item.name}
          </h3>
          <p className="text-xs text-[var(--muted)]">
            Taille : {item.size}
          </p>
          <div className="pt-0.5">
            <span className="bg-[#ff571a]/10 text-[#ff571a] px-2 py-0.5 text-[9px] rounded font-bold uppercase">
              {formatPrice(item.price)} / unité
            </span>
          </div>
        </div>
      </div>

      {/* Right operations section */}
      <div className="flex items-center justify-between w-full md:w-auto md:gap-8">
        {/* Quantity Stepper */}
        <div className="inline-flex items-center border border-[var(--border-soft)] bg-[var(--surface-soft)] rounded overflow-hidden">
          <button
            type="button"
            onClick={onDecrease}
            className="inline-flex h-8 w-8 items-center justify-center transition-colors hover:bg-[var(--border-soft)]"
            aria-label={`Diminuer la quantité de ${item.name}`}
          >
            <Minus size={12} />
          </button>
          <span className="inline-flex h-8 min-w-8 items-center justify-center text-xs font-mono">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={onIncrease}
            className="inline-flex h-8 w-8 items-center justify-center transition-colors hover:bg-[var(--border-soft)]"
            aria-label={`Augmenter la quantité de ${item.name}`}
          >
            <Plus size={12} />
          </button>
        </div>

        {/* Price & Remove */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-lg font-bold text-[#ff571a]">
            {formatPrice(item.price * item.quantity)}
          </span>

          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-8 w-8 items-center justify-center border border-[var(--border-soft)] rounded-md text-[var(--muted)] hover:text-red-500 hover:border-red-500 transition-colors"
            aria-label={`Supprimer ${item.name}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function CartPage() {
  const { items, isReady, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

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

      <main className="min-h-screen w-full px-4 pb-24 pt-20 md:px-8 xl:px-12 md:pt-28 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--primary)]">
            Accueil
          </Link>
          <span>&gt;</span>
          <span className="text-[var(--foreground)] font-bold">
            Panier
          </span>
        </nav>

        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-[var(--border-soft)] pb-4">
          <div>
            <h1 className="font-[var(--font-display)] text-2xl md:text-3xl font-black uppercase tracking-tight text-[var(--foreground)]">
              Votre Panier
            </h1>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
              {!isReady
                ? "Chargement..."
                : itemCount === 0
                  ? "Aucun article pour le moment"
                  : `${itemCount} article${itemCount > 1 ? "s" : ""} dans ton panier`}
            </p>
          </div>
          {isReady && items.length > 0 ? (
            <button
              type="button"
              onClick={clearCart}
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] hover:text-red-500 transition-colors"
            >
              <Trash2 size={12} className="text-[#ff571a]" />
              Vider le panier
            </button>
          ) : null}
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-start">
          {/* Cart Lines */}
          <section className="space-y-4 lg:col-span-8">
            {!isReady ? (
              <div className="border border-[var(--border-soft)] bg-[var(--surface)] px-5 py-12 text-center rounded-xl">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                  Chargement du panier...
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="border border-[var(--border-soft)] bg-[var(--surface)] px-5 py-16 text-center rounded-xl space-y-4">
                <p className="font-[var(--font-display)] text-2xl uppercase text-[var(--foreground)] font-bold">
                  Panier vide
                </p>
                <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
                  Ajoute des produits depuis la boutique pour commencer ta commande.
                </p>
                <Link
                  href="/boutique"
                  className="inline-flex items-center gap-2 rounded bg-[#ff571a] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#e0450a] transition-all"
                >
                  Retour à la boutique
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartLine
                    key={item.id}
                    item={item}
                    onDecrease={() => updateQuantity(item.id, -1)}
                    onIncrease={() => updateQuantity(item.id, 1)}
                    onRemove={() => removeFromCart(item.id)}
                  />
                ))}

                {/* Back to Shopping link */}
                <div className="pt-2">
                  <Link
                    href="/boutique"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)] hover:text-[#ff571a] transition-colors"
                  >
                    <ArrowLeft size={13} />
                    Continuer mes achats
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* Checkout sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 border border-[var(--border-soft)] bg-[var(--surface)] p-5 md:p-6 rounded-xl space-y-6 shadow-md">
              <div className="mb-4 flex items-center gap-2 border-b border-[var(--border-soft)] pb-3">
                <ShieldCheck size={18} className="text-[#ff571a]" />
                <h2 className="font-[var(--font-display)] text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                  Résumé de commande
                </h2>
              </div>

              <div className="space-y-4 border-b border-[var(--border-soft)] pb-4 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted)]">SOUS-TOTAL</span>
                  <span className="text-[var(--foreground)] font-bold">
                    {!isReady ? "—" : formatPrice(cartTotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[var(--muted)]">LIVRAISON</span>
                  <span className="border border-[#ff571a] px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#ff571a] font-bold rounded">
                    À confirmer par téléphone
                  </span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-4 py-2">
                <span className="font-[var(--font-display)] text-sm font-bold uppercase text-[var(--foreground)]">TOTAL</span>
                <div className="text-right">
                  <span className="block font-mono text-2xl text-[#ff571a] font-extrabold">
                    {!isReady ? "—" : formatPrice(cartTotal)}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[var(--muted)]">
                    TVA incluse
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  href={items.length === 0 ? "/boutique" : "/checkout"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded bg-[#ff571a] px-5 py-3.5 font-[var(--font-display)] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#e0450a] transition-all active:scale-98"
                >
                  {items.length === 0 ? "Continuer mes achats" : "Valider ma commande"}
                  <ArrowRight size={14} />
                </Link>

                <div className="border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Truck size={18} className="mt-0.5 text-[#ff571a] shrink-0" />
                    <div>
                      <p className="text-xs font-bold uppercase text-[var(--foreground)] tracking-wide">
                        Paiement à la livraison
                      </p>
                      <p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">
                        Tu ne payes rien maintenant. Le paiement se fait à la livraison après
                        inspection de ton colis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] pt-1">
                <Headphones size={13} className="text-[#ff571a]" />
                <span>Assistance 24/7 disponible</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Propositions row at the bottom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 border-t border-[var(--border-soft)] pt-8">
          <div className="flex items-center gap-3 border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 rounded-xl">
            <ShieldCheck size={20} className="text-[#ff571a] shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase text-[var(--foreground)]">PRODUITS AUTHENTIQUES</p>
              <p className="text-[10px] text-[var(--muted)]">100% originaux et garantis</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 rounded-xl">
            <Truck size={20} className="text-[#ff571a] shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase text-[var(--foreground)]">LIVRAISON RAPIDE</p>
              <p className="text-[10px] text-[var(--muted)]">Partout au Maroc 24h - 72h</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 rounded-xl">
            <RefreshCw size={18} className="text-[#ff571a] shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase text-[var(--foreground)]">RETOURS FACILES</p>
              <p className="text-[10px] text-[var(--muted)]">14 jours pour changer d'avis</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 rounded-xl">
            <Headphones size={20} className="text-[#ff571a] shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase text-[var(--foreground)]">SUPPORT 24/7</p>
              <p className="text-[10px] text-[var(--muted)]">Notre équipe est à votre écoute</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
