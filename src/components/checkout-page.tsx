"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  Info,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import {
  BottomDock,
  DesktopTopBar,
  MobileDrawer,
  MobileTopBar,
} from "@/components/homepage-sections";
import { useCart } from "@/components/cart-context";
import { useAuth } from "@/components/auth-context";
import { createOrder } from "@/lib/orders/store";
import { SITE_URL } from "@/lib/site";

function formatPrice(value: number) {
  return `${value.toLocaleString("fr-FR")} DH`;
}

const LAST_CITY_STORAGE_KEY = "coin-original-last-city";

export function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    city: "",
  });

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedCity = window.localStorage.getItem(LAST_CITY_STORAGE_KEY);
    if (!savedCity) return;

    setFormData((current) => (current.city ? current : { ...current, city: savedCity }));
  }, []);

  const total = cartTotal;
  const whatsappNumber = "212691567246";

  const buildWhatsappMessage = (reference?: string | null) => {
    const lines = [
      "Bonjour Coin Original, je veux confirmer ma commande.",
      "",
      `Reference: ${reference ?? "Nouvelle commande"}`,
      `Nom: ${formData.fullName.trim() || user?.displayName || "Non renseigne"}`,
      `Ville: ${formData.city.trim() || "Non renseignee"}`,
      `Telephone: ${user?.phoneNumber ?? "Non renseigne"}`,
      `Lien du panier: ${SITE_URL}/panier`,
      "",
      "Panier:",
      ...items.map(
        (item, index) =>
          `${index + 1}. ${item.name} | ${item.brand} | Taille ${item.size} | Qte ${item.quantity} | ${formatPrice(item.price * item.quantity)}`,
      ),
      "",
      `Total: ${formatPrice(total)}`,
      "Paiement: A la livraison",
    ];

    return lines.join("\n");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);

    const result = await createOrder({
      customer: {
        fullName: formData.fullName.trim(),
        email: undefined,
        phone: user?.phoneNumber || "",
        city: formData.city.trim(),
        address: "",
        notes: undefined,
      },
      items: items.map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        brand: item.brand,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      total,
    });

    if (typeof window !== "undefined" && formData.city.trim()) {
      window.localStorage.setItem(LAST_CITY_STORAGE_KEY, formData.city.trim());
    }

    setIsSubmitting(false);

    const whatsappMessage = buildWhatsappMessage(result.data?.id ?? null);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    if (result.data) {
      clearCart();
    }

    window.location.href = whatsappUrl;
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

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

      <main className="w-full px-3 pb-24 pt-20 md:px-5 md:pt-28">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
          <aside className="order-2 lg:order-1 lg:col-span-5">
            <div className="border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 lg:sticky lg:top-24 md:p-6">
              <h2 className="mb-4 font-[var(--font-display)] text-2xl uppercase text-[var(--primary)] md:mb-6 md:text-3xl">
                Votre Panier
              </h2>

              {items.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-sm text-[var(--muted)]">
                    Ton panier est vide. Ajoute des articles avant de commander.
                  </p>
                  <Link
                    href="/boutique"
                    className="impact-button impact-button--primary mt-4 inline-flex px-5 py-2.5 text-sm"
                  >
                    Voir la boutique
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-6 max-h-[360px] space-y-4 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <article
                        key={item.id}
                        className="flex items-start gap-3 border-b border-[var(--border-soft)] pb-4"
                      >
                        <div className="relative h-20 w-20 flex-none overflow-hidden bg-[var(--surface)] md:h-24 md:w-24">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-[var(--font-display)] text-lg uppercase leading-tight md:text-xl">
                            {item.name}
                          </p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                            {item.brand} — Taille {item.size} — Qté {item.quantity}
                          </p>
                          <div className="mt-2 inline-flex bg-[var(--primary-strong)] px-2 py-1 text-xs uppercase text-[var(--background)]">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--muted)]">Sous-total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--muted)]">Livraison</span>
                      <span className="text-[var(--accent)]">GRATUITE</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t-2 border-[var(--primary-strong)] pt-3">
                      <span className="font-[var(--font-display)] text-xl uppercase md:text-2xl">
                        Total
                      </span>
                      <span className="font-[var(--font-display)] text-xl text-[var(--primary)] md:text-2xl">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-5 flex items-center gap-3 border border-[var(--accent)]/30 bg-[var(--surface)] px-3 py-2">
                <CreditCard size={16} className="text-[var(--accent)]" />
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--foreground)]">
                  Paiement Cash à la Livraison
                </p>
              </div>
            </div>
          </aside>

          <section className="order-1 lg:order-2 lg:col-span-7">
            <div className="relative overflow-hidden border-2 border-[var(--border-soft)] bg-[var(--surface)] p-4 shadow-[6px_6px_0_0_var(--primary-strong)] md:p-8 md:shadow-[10px_10px_0_0_var(--primary-strong)]">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[var(--primary)]/10 blur-[100px]" />

              <div className="relative z-10">
                <h1 className="mb-1 font-[var(--font-display)] text-2xl uppercase text-[var(--primary)] md:text-4xl">
                  Finaliser La Commande
                </h1>
                <p className="mb-6 text-xs text-[var(--muted)] md:mb-8 md:text-sm">
                  Veuillez remplir vos informations réelles pour la livraison.
                </p>

                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-[var(--primary)]">
                        Nom et Prénom Complet
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(event) => updateField("fullName", event.target.value)}
                        placeholder="EX: MOHAMMED ALAMI"
                        className="w-full border-b-2 border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--primary-strong)] md:px-4 md:py-3 md:text-base"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-[var(--primary)]">
                          Ville
                        </label>
                        <input
                          type="text"
                          required
                          name="city"
                          autoComplete="address-level2"
                          value={formData.city}
                          onChange={(event) => updateField("city", event.target.value)}
                          placeholder="EX: CASABLANCA"
                          className="w-full border-b-2 border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--primary-strong)] md:px-4 md:py-3 md:text-base"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-[var(--muted)]">
                      <Info size={16} className="mt-0.5 flex-none text-[var(--primary)]" />
                      <p className="text-xs italic md:text-sm">
                        En cliquant sur confirmer, WhatsApp s&apos;ouvre avec votre panier et vos
                        informations pour envoyer directement la commande.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || items.length === 0}
                      className="inline-flex w-full items-center justify-center gap-2 bg-[var(--primary-strong)] px-4 py-3.5 font-[var(--font-display)] text-sm uppercase tracking-[0.04em] text-[var(--background)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 active:scale-95 md:gap-3 md:px-5 md:py-4 md:text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <MessageCircle size={18} className="animate-pulse" />
                          Traitement...
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={18} />
                          Confirmer - Je paye à la livraison
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
