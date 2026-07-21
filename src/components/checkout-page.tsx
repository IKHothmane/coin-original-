"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CreditCard,
  Info,
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

function formatPrice(value: number) {
  return `${value.toLocaleString("fr-FR")} DH`;
}

const LAST_CITY_STORAGE_KEY = "coin-original-last-city";

export function CheckoutPage() {
  const { items, cartTotal, clearCart, isReady } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const initialSavedCity =
    typeof window !== "undefined" ? window.localStorage.getItem(LAST_CITY_STORAGE_KEY) ?? "" : "";

  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    city: initialSavedCity,
    phone: user?.phoneNumber || "",
  });

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const total = cartTotal;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isReady) return;
    if (items.length === 0) return;
    setSubmitError(null);
    if (!formData.phone.trim()) {
      setSubmitError("Le numero de telephone est obligatoire pour la confirmation.");
      return;
    }

    setIsSubmitting(true);
    const traceId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `checkout-${Date.now()}`;
    // #region debug-point A:checkout-submit-start
    fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"checkout-order-error",runId:"post-fix",hypothesisId:"A",location:"src/components/checkout-page.tsx:handleSubmit:start",msg:"[DEBUG] checkout submit start",data:{traceId,itemCount:items.length,total,customerName:formData.fullName.trim(),city:formData.city.trim(),phone:formData.phone.trim()},ts:Date.now()})}).catch(()=>{});
    // #endregion

    const result = await createOrder({
      customer: {
        fullName: formData.fullName.trim(),
        email: undefined,
        phone: formData.phone.trim(),
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
    // #region debug-point A:checkout-submit-result
    fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"checkout-order-error",runId:"post-fix",hypothesisId:"A",location:"src/components/checkout-page.tsx:handleSubmit:afterCreateOrder",msg:"[DEBUG] checkout createOrder result",data:{traceId,hasData:Boolean(result.data),error:result.error,orderId:result.data?.id ?? null},ts:Date.now()})}).catch(()=>{});
    // #endregion

    if (typeof window !== "undefined" && formData.city.trim()) {
      window.localStorage.setItem(LAST_CITY_STORAGE_KEY, formData.city.trim());
    }

    if (result.data) {
      try {
        await fetch("/api/order-push", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: result.data.id,
            customerName: formData.fullName.trim() || user?.displayName || "Client",
            total,
            itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
          }),
        });
      } catch (error) {
        console.error("[Checkout client] Push notification error:", error);
      }

      clearCart();
      setIsSubmitting(false);
      router.push(`/merci?ref=${result.data.id}&status=confirmation`);
      return;
    }

    setIsSubmitting(false);
    setSubmitError(result.error || "Une erreur inconnue est survenue.");
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

      <main className="page-with-header w-full px-3 pb-24 md:px-5">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
          <aside className="order-2 lg:order-1 lg:col-span-5">
            <div className="border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 lg:sticky lg:top-24 md:p-6">
              <h2 className="mb-4 font-[var(--font-display)] text-2xl uppercase text-[var(--primary)] md:mb-6 md:text-3xl">
                Votre Panier
              </h2>

              {!isReady ? (
                <div className="py-6 text-center">
                  <p className="text-sm text-[var(--muted)]">Chargement du panier...</p>
                </div>
              ) : items.length === 0 ? (
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
                      <div>
                        <label className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-[var(--primary)]">
                          Telephone
                        </label>
                        <input
                          type="tel"
                          required
                          name="phone"
                          autoComplete="tel"
                          value={formData.phone}
                          onChange={(event) => updateField("phone", event.target.value)}
                          placeholder="EX: 06 12 34 56 78"
                          className="w-full border-b-2 border-[var(--border-soft)] bg-[var(--surface-soft)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--primary-strong)] md:px-4 md:py-3 md:text-base"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-[var(--muted)]">
                      <Info size={16} className="mt-0.5 flex-none text-[var(--primary)]" />
                      <p className="text-xs italic md:text-sm">
                        En cliquant sur confirmer, votre commande est enregistree et passe
                        directement a la confirmation.
                      </p>
                    </div>

                    {submitError ? (
                      <div className="border border-red-300 bg-red-50 px-3 py-3 text-sm text-red-700">
                        {submitError}
                      </div>
                    ) : null}

                    <button
                      type="submit"
                      disabled={!isReady || isSubmitting || items.length === 0}
                      className="inline-flex w-full items-center justify-center gap-2 bg-[var(--primary-strong)] px-4 py-3.5 font-[var(--font-display)] text-sm uppercase tracking-[0.04em] text-[var(--background)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 active:scale-95 md:gap-3 md:px-5 md:py-4 md:text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <ShoppingBag size={18} className="animate-pulse" />
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
