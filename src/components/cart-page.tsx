"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShieldCheck, Trash2, Truck } from "lucide-react";
import {
  BottomDock,
  DesktopTopBar,
  MobileDrawer,
  MobileTopBar,
  SiteFooter,
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
    <article className="relative flex flex-col gap-4 border border-[var(--border-soft)] bg-[var(--surface)] p-4 md:flex-row">
      <div className="absolute right-4 top-4 md:hidden">
        <span className="inline-flex items-center gap-1 border border-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">
          <Truck size={12} />
          COD
        </span>
      </div>

      <div className="relative h-40 w-full overflow-hidden border border-[var(--border-soft)] bg-black md:h-32 md:w-32 md:flex-none">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, 128px"
          className="object-cover"
        />
        <div className="absolute left-2 top-2 z-20 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[var(--border-soft)] bg-black/30 md:h-10 md:w-10">
          <ThemeLogo width={40} height={40} className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--primary)]">
              {item.brand}
            </p>
            <h3 className="font-[var(--font-display)] text-xl uppercase leading-none text-[var(--foreground)]">
              {item.name}
            </h3>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
              Taille: {item.size}
            </p>
          </div>
          <span className="font-[var(--font-display)] text-xl text-[var(--primary)]">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <span className="border border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--foreground)]">
              {formatPrice(item.price)} / unité
            </span>

            <div className="inline-flex items-center border border-[var(--border-soft)]">
              <button
                type="button"
                onClick={onDecrease}
                className="inline-flex h-9 w-9 items-center justify-center transition-colors hover:bg-[var(--primary-strong)] hover:text-[var(--background)]"
                aria-label={`Diminuer la quantité de ${item.name}`}
              >
                <Minus size={14} />
              </button>
              <span className="inline-flex h-9 min-w-10 items-center justify-center text-sm">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={onIncrease}
                className="inline-flex h-9 w-9 items-center justify-center transition-colors hover:bg-[var(--primary-strong)] hover:text-[var(--background)]"
                aria-label={`Augmenter la quantité de ${item.name}`}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-10 w-10 items-center justify-center text-[var(--muted)] transition-colors hover:text-red-500"
            aria-label={`Supprimer ${item.name}`}
          >
            <Trash2 size={18} />
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

      <main className="min-h-screen w-full px-3 pb-24 pt-20 md:px-5 md:pt-28">
        <div className="mb-6">
          <h1 className="font-[var(--font-display)] text-3xl uppercase tracking-tight text-[var(--primary)] md:text-[clamp(3rem,6vw,4.5rem)]">
            Votre Panier
          </h1>
          <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
            {!isReady
              ? "Chargement..."
              : itemCount === 0
                ? "Aucun article pour le moment"
                : `${itemCount} article${itemCount > 1 ? "s" : ""} dans ton panier`}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-4">
          <section className="space-y-4 lg:col-span-8">
            {!isReady ? (
              <div className="border border-[var(--border-soft)] bg-[var(--surface)] px-5 py-12 text-center">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                  Chargement du panier...
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="border border-[var(--border-soft)] bg-[var(--surface)] px-5 py-10 text-center">
                <p className="font-[var(--font-display)] text-2xl uppercase text-[var(--foreground)]">
                  Panier vide
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Ajoute un produit depuis la boutique pour commencer ta commande.
                </p>
                <Link
                  href="/boutique"
                  className="impact-button impact-button--primary mt-6 inline-flex px-6 py-3 text-sm"
                >
                  Retour à la boutique
                </Link>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <CartLine
                    key={item.id}
                    item={item}
                    onDecrease={() => updateQuantity(item.id, -1)}
                    onIncrease={() => updateQuantity(item.id, 1)}
                    onRemove={() => removeFromCart(item.id)}
                  />
                ))}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={clearCart}
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)] transition-colors hover:text-red-500"
                  >
                    Vider le panier
                  </button>
                </div>
              </>
            )}
          </section>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 border-2 border-[var(--primary-strong)] bg-[var(--surface)] p-5 md:p-6">
              <div className="mb-6 flex items-center gap-2">
                <ShieldCheck size={20} className="text-[var(--accent)]" />
                <h2 className="font-[var(--font-display)] text-2xl uppercase">
                  Résumé de commande
                </h2>
              </div>

              <div className="mb-6 space-y-4 border-b border-[var(--border-soft)] pb-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    Sous-total
                  </span>
                  <span className="text-lg font-bold">
                    {!isReady ? "—" : formatPrice(cartTotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    Livraison
                  </span>
                  <span className="border border-[var(--accent)] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">
                    À confirmer par téléphone
                  </span>
                </div>
              </div>

              <div className="mb-8 flex items-end justify-between gap-4">
                <span className="font-[var(--font-display)] text-xl uppercase">Total</span>
                <div className="text-right">
                  <span className="block font-[var(--font-display)] text-4xl text-[var(--primary)]">
                    {!isReady ? "—" : formatPrice(cartTotal)}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    TVA incluse
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  href={items.length === 0 ? "/boutique" : "/checkout"}
                  className="inline-flex w-full items-center justify-center gap-2 bg-[var(--primary-strong)] px-5 py-4 font-[var(--font-display)] text-lg uppercase text-[var(--background)] transition-all hover:bg-[var(--foreground)] hover:text-[var(--background)] active:scale-95"
                >
                  {items.length === 0 ? "Continuer mes achats" : "Valider ma commande"}
                  <ArrowRight size={20} />
                </Link>

                <div className="border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4">
                  <div className="flex items-start gap-3">
                    <Truck size={18} className="mt-0.5 text-[var(--accent)]" />
                    <div>
                      <p className="text-sm font-bold uppercase text-[var(--foreground)]">
                        Paiement à la livraison
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        Tu ne payes rien maintenant. Le paiement se fait à la livraison après
                        inspection de ton colis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-center">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                  Assistance 24/7 disponible
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
