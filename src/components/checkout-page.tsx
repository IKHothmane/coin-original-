"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Info,
  ShoppingBag,
  Truck,
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Resume du panier */}
            <aside className="order-2 lg:order-1 lg:col-span-5">
              <div className="surface-panel p-5 md:p-6 lg:sticky lg:top-24">
                <div className="mb-5 flex items-center gap-3 border-b border-[var(--border-soft)] pb-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
                    <ShoppingBag size={18} aria-hidden="true" />
                  </span>
                  <h2 className="text-sm font-extrabold uppercase tracking-[0.06em] text-[var(--foreground)]">
                    Votre panier
                  </h2>
                </div>

                {!isReady ? (
                  <div className="py-6 text-center">
                    <p className="text-sm text-[var(--muted)]">Chargement du panier...</p>
                  </div>
                ) : items.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-sm text-[var(--muted)]">
                      Ton panier est vide. Ajoute des articles avant de commander.
                    </p>
                    <Link href="/boutique" className="btn btn--primary mt-5">
                      Voir la boutique
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="mb-5 max-h-[360px] space-y-3 overflow-y-auto pr-1">
                      {items.map((item) => (
                        <article
                          key={item.id}
                          className="flex items-center gap-3 rounded-lg border border-[var(--border-soft)] bg-[var(--surface-soft)] p-3"
                        >
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-[var(--border-soft)] bg-[var(--surface)]">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold uppercase text-[var(--foreground)]">
                              {item.name}
                            </p>
                            <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                              {item.brand} · Taille {item.size} · Qte {item.quantity}
                            </p>
                          </div>
                          <span className="price whitespace-nowrap text-xs">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </article>
                      ))}
                    </div>

                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--muted)]">Sous-total</span>
                        <span className="font-semibold text-[var(--foreground)]">
                          {formatPrice(total)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--muted)]">Livraison</span>
                        <span className="rounded-md bg-[var(--primary-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--primary)]">
                          Gratuite
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[var(--border-soft)] pt-3">
                        <span className="text-sm font-extrabold uppercase tracking-[0.06em] text-[var(--foreground)]">
                          Total
                        </span>
                        <span className="price text-xl">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-5 rounded-lg border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4">
                  <div className="flex items-start gap-3">
                    <Truck size={18} className="mt-0.5 shrink-0 text-[var(--primary)]" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.05em] text-[var(--foreground)]">
                        Paiement cash a la livraison
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                        Tu ne payes rien maintenant. Le paiement se fait a la livraison.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Formulaire de commande */}
            <section className="order-1 lg:order-2 lg:col-span-7">
              <div className="surface-panel p-5 md:p-8">
                <span className="eyebrow--orange">Commande</span>
                <h1 className="section-title mt-2.5 text-[var(--foreground)]">
                  Finaliser la commande
                </h1>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Veuillez remplir vos informations reelles pour la livraison.
                </p>

                <form className="mt-6 space-y-5 md:mt-8" onSubmit={handleSubmit}>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                      Nom et prenom complet
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(event) => updateField("fullName", event.target.value)}
                      placeholder="Ex : Mohammed Alami"
                      className="w-full rounded-lg border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                        Ville
                      </label>
                      <input
                        type="text"
                        required
                        name="city"
                        autoComplete="address-level2"
                        value={formData.city}
                        onChange={(event) => updateField("city", event.target.value)}
                        placeholder="Ex : Casablanca"
                        className="w-full rounded-lg border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
                        Telephone
                      </label>
                      <input
                        type="tel"
                        required
                        name="phone"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={(event) => updateField("phone", event.target.value)}
                        placeholder="Ex : 06 12 34 56 78"
                        className="w-full rounded-lg border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4">
                    <Info size={16} className="mt-0.5 shrink-0 text-[var(--primary)]" aria-hidden="true" />
                    <p className="text-xs leading-5 text-[var(--muted)]">
                      En cliquant sur confirmer, votre commande est enregistree et passe
                      directement a la confirmation.
                    </p>
                  </div>

                  {submitError ? (
                    <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                      {submitError}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={!isReady || isSubmitting || items.length === 0}
                    className="btn btn--primary w-full !min-h-12 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <ShoppingBag size={18} className="animate-pulse" aria-hidden="true" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={18} aria-hidden="true" />
                        Confirmer - Je paye a la livraison
                        <ArrowRight size={18} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
