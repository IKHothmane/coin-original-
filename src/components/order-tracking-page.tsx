"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clipboard, Search } from "lucide-react";
import {
  BottomDock,
  DesktopTopBar,
  MobileDrawer,
  MobileTopBar,
} from "@/components/homepage-sections";
import { OrderTrackingDetailPage } from "@/components/order-tracking-detail-page";

export function OrderTrackingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reference, setReference] = useState("");
  const normalizedReference = useMemo(() => reference.trim(), [reference]);
  const trackedOrderId = searchParams.get("id")?.trim() ?? "";

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!normalizedReference) return;
    router.push(`/suivi?id=${encodeURIComponent(normalizedReference)}`);
  };

  const handlePaste = async () => {
    if (!navigator.clipboard) return;
    try {
      const text = await navigator.clipboard.readText();
      if (text) setReference(text);
    } catch {}
  };

  if (trackedOrderId) {
    return <OrderTrackingDetailPage orderId={trackedOrderId} />;
  }

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
          <div className="surface-panel w-full max-w-2xl p-6 md:p-10">
            <p className="inline-flex rounded-full bg-[var(--primary-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--primary)]">
              Suivi
            </p>
            <h1 className="section-title mt-3 text-[var(--foreground)]">
              Suivi de commande
            </h1>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Colle la reference affichee sur la page Merci (ref) ou le message
              WhatsApp, puis lance le suivi.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <label className="block">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Reference de commande
                </span>
                <div className="mt-2 flex items-stretch gap-2">
                  <div className="relative min-w-0 flex-1">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                      aria-hidden="true"
                    />
                    <input
                      value={reference}
                      onChange={(event) => setReference(event.target.value)}
                      placeholder="Ex: 2aBcdEfGh..."
                      className="h-12 w-full rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] pl-10 pr-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => void handlePaste()}
                    className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 text-xs font-bold uppercase tracking-[0.12em] text-[var(--foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    <Clipboard size={16} aria-hidden="true" />
                    Coller
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={!normalizedReference}
                className="btn btn--primary w-full disabled:opacity-50"
              >
                Ouvrir le suivi
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
