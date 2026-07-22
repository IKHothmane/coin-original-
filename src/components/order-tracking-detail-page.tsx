"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { AlertTriangle, CheckCircle2, Package, Truck } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/orders/types";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
import {
  BottomDock,
  DesktopTopBar,
  MobileDrawer,
  MobileTopBar,
} from "@/components/homepage-sections";

type OrderTrackingDetailPageProps = {
  orderId: string;
};

type NormalizedOrder = Order & {
  id: string;
};

function formatDate(value: unknown) {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "string") {
    return value;
  }
  if (value && typeof value === "object") {
    try {
      const maybeDate = (value as { toDate?: () => Date }).toDate?.();
      if (maybeDate) return maybeDate.toISOString();
    } catch {}
  }
  return new Date().toISOString();
}

function normalizeCustomer(data: Record<string, unknown>): Order["customer"] {
  const rawCustomer = data.customer;
  if (rawCustomer && typeof rawCustomer === "object") {
    const c = rawCustomer as Record<string, unknown>;
    return {
      fullName: String(c.fullName ?? ""),
      email: c.email ? String(c.email) : undefined,
      phone: String(c.phone ?? ""),
      city: String(c.city ?? ""),
      address: String(c.address ?? ""),
      notes: c.notes ? String(c.notes) : undefined,
    };
  }

  const rawAddress = data.address;
  const address = rawAddress && typeof rawAddress === "object" ? (rawAddress as Record<string, unknown>) : {};

  return {
    fullName: String(data.userName ?? ""),
    email: data.userEmail ? String(data.userEmail) : undefined,
    phone: String(address.phone ?? ""),
    city: String(address.city ?? ""),
    address: String(address.street ?? address.address ?? ""),
  };
}

function normalizeItems(data: Record<string, unknown>): Order["items"] {
  const rawItems = data.items;
  if (!Array.isArray(rawItems)) return [];

  return rawItems.map((rawItem, index) => {
    const item = rawItem && typeof rawItem === "object" ? (rawItem as Record<string, unknown>) : {};
    const rawProduct = item.product;
    const product = rawProduct && typeof rawProduct === "object" ? (rawProduct as Record<string, unknown>) : {};

    const productImages = Array.isArray(product.images) ? (product.images as unknown[]) : [];
    const productFirstImage =
      productImages.length > 0 && typeof productImages[0] === "string" ? (productImages[0] as string) : "";

    const variants = Array.isArray(product.variants) ? (product.variants as unknown[]) : [];
    const firstVariant = variants.length > 0 ? String(variants[0] ?? "") : "";

    const quantityRaw = item.quantity ?? 1;
    const quantity = typeof quantityRaw === "number" ? quantityRaw : Number(quantityRaw) || 1;

    const priceRaw = product.priceValue ?? product.price ?? item.price ?? 0;
    const price = typeof priceRaw === "number" ? priceRaw : Number(priceRaw) || 0;

    const slug = String(product.slug ?? item.slug ?? item.productId ?? item.id ?? "");
    const id = String(item.id ?? item.productId ?? (slug || `item-${index}`));

    return {
      id,
      slug: slug || id,
      name: String(product.name ?? item.name ?? ""),
      brand: String(product.brand ?? item.brand ?? ""),
      size: String(item.size ?? firstVariant ?? ""),
      price,
      quantity,
      image: String(product.image ?? item.image ?? productFirstImage ?? ""),
    };
  });
}

function normalizeTotal(data: Record<string, unknown>) {
  const raw = data.total ?? data.totalAmount ?? 0;
  return typeof raw === "number" ? raw : Number(raw) || 0;
}

function getStatusMeta(status: OrderStatus) {
  if (status === "pending") return { label: "En attente", badge: "bg-[#ffba20] text-[#412d00]" };
  if (status === "processing") return { label: "Confirmee", badge: "bg-[#ff8b63] text-[#5e1700]" };
  if (status === "shipped") return { label: "Expediee", badge: "bg-[#3b82f6] text-white" };
  if (status === "delivered") return { label: "Livree", badge: "bg-[#16a34a] text-white" };
  return { label: "Annulee", badge: "bg-[#ef4444] text-white" };
}

function getStepState(status: OrderStatus, step: "pending" | "processing" | "shipped" | "delivered") {
  const order = ["pending", "processing", "shipped", "delivered"] as const;
  const statusIndex = order.indexOf(status as (typeof order)[number]);
  const stepIndex = order.indexOf(step);

  if (status === "cancelled") return "inactive";
  if (statusIndex === -1) return step === "pending" ? "active" : "inactive";
  if (stepIndex < statusIndex) return "done";
  if (stepIndex === statusIndex) return "active";
  return "inactive";
}

function Step({
  label,
  state,
}: {
  label: string;
  state: "inactive" | "active" | "done";
}) {
  const base =
    "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 font-mono text-[10px] uppercase tracking-widest";
  if (state === "done") {
    return (
      <div className={`${base} border-[var(--border-soft)] bg-[var(--surface-soft)] text-[var(--foreground)]`}>
        <span>{label}</span>
        <CheckCircle2 size={16} className="text-[var(--primary)]" aria-hidden="true" />
      </div>
    );
  }
  if (state === "active") {
    return (
      <div className={`${base} border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]`}>
        <span>{label}</span>
        <Truck size={16} aria-hidden="true" />
      </div>
    );
  }
  return (
    <div className={`${base} border-[var(--border-soft)] bg-[var(--surface)] text-[var(--muted)]`}>
      <span>{label}</span>
      <span className="h-2 w-2 rounded-full bg-[var(--border-soft)]" aria-hidden="true" />
    </div>
  );
}

export function OrderTrackingDetailPage({ orderId }: OrderTrackingDetailPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<NormalizedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const safeOrderId = useMemo(() => decodeURIComponent(orderId), [orderId]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setError("Le suivi n'est pas configure (Firebase).");
      setLoading(false);
      return;
    }

    const ref = doc(getFirebaseDb(), "orders", safeOrderId);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (!snapshot.exists()) {
          setOrder(null);
          setError("Commande introuvable.");
          setLoading(false);
          return;
        }

        const data = snapshot.data() as Record<string, unknown>;
        const normalized: NormalizedOrder = {
          id: snapshot.id,
          customer: normalizeCustomer(data),
          items: normalizeItems(data),
          total: normalizeTotal(data),
          status: (data.status as OrderStatus) ?? "pending",
          paymentMethod: (data.paymentMethod as Order["paymentMethod"]) ?? "cash_on_delivery",
          createdAt: formatDate(data.createdAt),
          updatedAt: formatDate(data.updatedAt),
        };

        setOrder(normalized);
        setError(null);
        setLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError instanceof Error ? snapshotError.message : "Erreur de suivi.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [safeOrderId]);

  const status = order?.status ?? "pending";
  const statusMeta = getStatusMeta(status);

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
        <section className="container-site flex justify-center py-10 md:py-16">
          <div className="surface-panel w-full max-w-3xl p-6 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="inline-flex rounded-full bg-[var(--primary-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--primary)]">
                  Suivi
                </p>
                <h1 className="section-title mt-3 text-[var(--foreground)]">
                  Suivi de commande
                </h1>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Reference: <span className="font-semibold text-[var(--foreground)]">{safeOrderId}</span>
                </p>
              </div>

              <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest ${statusMeta.badge}`}>
                {status === "delivered" ? <Package size={16} aria-hidden="true" /> : <Truck size={16} aria-hidden="true" />}
                {statusMeta.label}
              </div>
            </div>

            {loading ? (
              <div className="mt-8 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-6 text-sm text-[var(--muted)]">
                Chargement du suivi...
              </div>
            ) : null}

            {error ? (
              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#ef4444] bg-[#2a1414] p-6 text-sm text-[#ffd9d9]">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-semibold">{error}</p>
                  <p className="mt-2 text-[#ffbaba]">
                    Tu peux aussi revenir sur la page de suivi et coller une autre reference.
                  </p>
                  <div className="mt-4">
                    <Link href="/suivi" className="btn btn--outline">
                      Retour au suivi
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}

            {order ? (
              <div className="mt-8 space-y-6">
                {status === "cancelled" ? (
                  <div className="rounded-2xl border border-[#ef4444] bg-[#2a1414] p-5 text-sm text-[#ffd9d9]">
                    La commande a ete annulee. Pour toute question, contacte-nous sur WhatsApp.
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Step label="Commande recue" state={getStepState(status, "pending")} />
                    <Step label="Commande confirmee" state={getStepState(status, "processing")} />
                    <Step label="Commande expediee" state={getStepState(status, "shipped")} />
                    <Step label="Commande livree" state={getStepState(status, "delivered")} />
                  </div>
                )}

                <div className="grid gap-4 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      Client
                    </p>
                    <p className="text-sm font-semibold text-[var(--foreground)]">{order.customer.fullName}</p>
                    <p className="text-sm text-[var(--muted)]">{order.customer.city}</p>
                    <p className="text-sm text-[var(--muted)]">{order.customer.phone}</p>
                  </div>
                  <div className="space-y-2 text-left sm:text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      Total
                    </p>
                    <p className="text-2xl font-[var(--font-display)] text-[var(--foreground)]">
                      {order.total.toLocaleString("fr-FR")} MAD
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      Mise a jour: {new Date(order.updatedAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                    Articles
                  </p>
                  <div className="mt-4 space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[var(--foreground)]">
                            {item.name}
                          </p>
                          <p className="text-xs text-[var(--muted)]">
                            {item.brand} • {item.size} • x{item.quantity}
                          </p>
                        </div>
                        <p className="shrink-0 font-semibold text-[var(--foreground)]">
                          {(item.price * item.quantity).toLocaleString("fr-FR")} MAD
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
