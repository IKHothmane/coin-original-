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
} from "@/components/homepage-sections";
import { useCart } from "@/components/cart-context";

function formatPrice(value: number) {
  return `${value.toLocaleString("fr-FR")} DH`;
}

const reassurances = [
  { icon: ShieldCheck, title: "Produits authentiques", sub: "100% originaux et garantis" },
  { icon: Truck, title: "Livraison rapide", sub: "Partout au Maroc 24h - 72h" },
  { icon: RefreshCw, title: "Retours faciles", sub: "14 jours pour changer d'avis" },
  { icon: Headphones, title: "Support 24/7", sub: "Notre equipe est a votre ecoute" },
] as const;

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
    <article className="flex flex-col gap-4 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] p-4 shadow-[var(--card-shadow)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-[var(--border-soft)] bg-[var(--surface-soft)] sm:h-28 sm:w-28">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 96px, 112px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            {item.brand}
          </p>
          <h3 className="text-sm font-bold uppercase leading-snug text-[var(--foreground)]">
            {item.name}
          </h3>
          <p className="text-xs text-[var(--muted)]">Taille : {item.size}</p>
          <p className="text-xs text-[var(--muted)]">{formatPrice(item.price)} / unite</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:gap-6">
        <div className="inline-flex items-center overflow-hidden rounded-lg border border-[var(--border-soft)] bg-[var(--surface-soft)]">
          <button
            type="button"
            onClick={onDecrease}
            className="inline-flex h-9 w-9 items-center justify-center transition-colors hover:text-[var(--primary)]"
            aria-label={`Diminuer la quantite de ${item.name}`}
          >
            <Minus size={14} aria-hidden="true" />
          </button>
          <span className="inline-flex h-9 min-w-9 items-center justify-center text-sm font-bold">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={onIncrease}
            className="inline-flex h-9 w-9 items-center justify-center transition-colors hover:text-[var(--primary)]"
            aria-label={`Augmenter la quantite de ${item.name}`}
          >
            <Plus size={14} aria-hidden="true" />
          </button>
        </div>

        <span className="price whitespace-nowrap text-base">
          {formatPrice(item.price * item.quantity)}
        </span>

        <button
          type="button"
          onClick={onRemove}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-soft)] text-[var(--muted)] transition-colors hover:border-red-500 hover:text-red-500"
          aria-label={`Supprimer ${item.name}`}
        >
          <Trash2 size={15} aria-hidden="true" />
        </button>
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

      <main className="page-with-header">
        <section className="container-site py-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-xs text-[var(--muted)]">
            <Link href="/" className="transition-colors hover:text-[var(--primary)]">
              Accueil
            </Link>
            <span>/</span>
            <span className="font-semibold text-[var(--foreground)]">Panier</span>
          </nav>

          {/* Title row */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between md:mb-8">
            <div>
              <span className="eyebrow--orange">Coin Original</span>
              <h1 className="section-title mt-2.5 text-[var(--foreground)]">Votre panier</h1>
              <p className="mt-2 text-sm text-[var(--muted)]">
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
                className="inline-flex w-fit items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted)] transition-colors hover:text-red-500"
              >
                <Trash2 size={13} aria-hidden="true" />
                Vider le panier
              </button>
            ) : null}
          </div>

          {/* Grid layout */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Cart Lines */}
            <section className="space-y-3 lg:col-span-8">
              {!isReady ? (
                <div className="surface-panel px-5 py-12 text-center">
                  <p className="text-sm text-[var(--muted)]">Chargement du panier...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="surface-panel px-6 py-14 text-center">
                  <p className="section-title text-[var(--foreground)]">Panier vide</p>
                  <p className="mx-auto mt-3 max-w-sm text-sm text-[var(--muted)]">
                    Ajoute des produits depuis la boutique pour commencer ta commande.
                  </p>
                  <Link href="/boutique" className="btn btn--primary mt-6">
                    Retour a la boutique
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
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
                    <Link href="/boutique" className="section-link">
                      <ArrowLeft size={14} aria-hidden="true" />
                      Continuer mes achats
                    </Link>
                  </div>
                </div>
              )}
            </section>

            {/* Checkout sidebar */}
            <aside className="lg:col-span-4">
              <div className="surface-panel sticky top-24 space-y-5 p-5 md:p-6">
                <div className="flex items-center gap-3 border-b border-[var(--border-soft)] pb-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
                    <ShieldCheck size={18} aria-hidden="true" />
                  </span>
                  <h2 className="text-sm font-extrabold uppercase tracking-[0.06em] text-[var(--foreground)]">
                    Resume de commande
                  </h2>
                </div>

                <div className="space-y-3 border-b border-[var(--border-soft)] pb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--muted)]">Sous-total</span>
                    <span className="font-semibold text-[var(--foreground)]">
                      {!isReady ? "—" : formatPrice(cartTotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[var(--muted)]">Livraison</span>
                    <span className="rounded-md bg-[var(--primary-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--primary)]">
                      A confirmer par telephone
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-4">
                  <span className="text-sm font-extrabold uppercase tracking-[0.06em] text-[var(--foreground)]">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="price block text-2xl">
                      {!isReady ? "—" : formatPrice(cartTotal)}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--muted)]">
                      TVA incluse
                    </span>
                  </div>
                </div>

                <Link
                  href={items.length === 0 ? "/boutique" : "/checkout"}
                  className="btn btn--primary w-full"
                >
                  {items.length === 0 ? "Continuer mes achats" : "Valider ma commande"}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>

                <div className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4">
                  <div className="flex items-start gap-3">
                    <Truck size={18} className="mt-0.5 shrink-0 text-[var(--primary)]" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.05em] text-[var(--foreground)]">
                        Paiement a la livraison
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                        Tu ne payes rien maintenant. Le paiement se fait a la livraison apres
                        inspection de ton colis.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
                  <Headphones size={13} className="text-[var(--primary)]" aria-hidden="true" />
                  <span>Assistance 24/7 disponible</span>
                </div>
              </div>
            </aside>
          </div>

          {/* Reassurances (style bandeau de garanties de l'accueil) */}
          <div className="surface-panel mt-10 grid grid-cols-1 gap-x-6 gap-y-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-6 md:mt-12">
            {reassurances.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-center gap-3.5">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-extrabold uppercase tracking-[0.05em] text-[var(--foreground)]">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--muted)]">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
