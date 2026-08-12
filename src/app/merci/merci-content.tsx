"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import {
  BottomDock,
  DesktopTopBar,
  MobileDrawer,
  MobileTopBar,
} from "@/components/homepage-sections";

export function MerciContent() {
  const searchParams = useSearchParams();
  const orderReferenceParam = searchParams.get("ref");
  const orderReference = orderReferenceParam ?? "Nouvelle commande";
  const status = searchParams.get("status") ?? "confirmation";
  const isConfirmation = status === "confirmation";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

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
          <div className="surface-panel w-full max-w-2xl p-6 text-center md:p-10">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--primary)]">
              <CheckCircle2 size={32} aria-hidden="true" />
            </span>

            <p className="mt-5 inline-flex rounded-full bg-[var(--primary-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--primary)]">
              Confirmation envoyee
            </p>

            <h1 className="section-title mt-3 text-[var(--foreground)]">
              {isConfirmation ? "Commande en confirmation" : "Merci pour votre commande"}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm text-[var(--muted)]">
              {isConfirmation
                ? "Votre commande a bien ete enregistree et elle est maintenant passee a la confirmation. Nous allons vous contacter pour la valider rapidement."
                : "Votre commande a bien ete enregistree et sera traitee rapidement."}
            </p>

            <div className="mt-6 grid gap-4 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 text-left sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Reference
                </p>
                <p className="mt-1.5 break-all text-sm font-bold text-[var(--foreground)]">
                  {orderReference}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Paiement
                </p>
                <p className="mt-1.5 text-sm font-bold text-[var(--primary)]">
                  Cash a la livraison
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/boutique" className="btn btn--primary w-full sm:w-auto">
                Continuer vos achats
              </Link>
              <Link href="/mon-compte" className="btn btn--outline w-full sm:w-auto">
                Voir mon compte
              </Link>
              {orderReferenceParam ? (
                <Link
                  href={`/suivi?id=${encodeURIComponent(orderReferenceParam)}`}
                  className="btn btn--outline w-full sm:w-auto"
                >
                  Suivre ma commande
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
