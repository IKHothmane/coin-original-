"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function MerciContent() {
  const searchParams = useSearchParams();
  const orderReference = searchParams.get("ref") ?? "Nouvelle commande";
  const status = searchParams.get("status") ?? "confirmation";
  const isConfirmation = status === "confirmation";

  return (
    <main className="brand-shell brand-grid min-h-screen bg-[var(--background)] px-4 py-24 text-[var(--foreground)] md:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 border-2 border-[var(--border-soft)] bg-[var(--surface)] p-6 shadow-[8px_8px_0_0_var(--primary-strong)] md:p-10 md:shadow-[12px_12px_0_0_var(--primary-strong)]">
        <div className="inline-flex w-fit border border-[var(--primary)]/40 bg-[var(--surface-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--primary)]">
          Confirmation envoyee
        </div>

        <div className="space-y-3">
          <h1 className="font-[var(--font-display)] text-3xl uppercase text-[var(--primary)] md:text-5xl">
            {isConfirmation ? "Commande En Confirmation" : "Merci Pour Votre Commande"}
          </h1>
          <p className="max-w-2xl text-sm text-[var(--muted)] md:text-base">
            {isConfirmation
              ? "Votre commande a bien ete enregistree et elle est maintenant passee a la confirmation. Nous allons vous contacter pour la valider rapidement."
              : "Votre commande a bien ete enregistree et sera traitee rapidement."}
          </p>
        </div>

        <div className="grid gap-4 border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 md:grid-cols-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
              Reference
            </p>
            <p className="mt-2 font-[var(--font-display)] text-2xl uppercase text-[var(--foreground)]">
              {orderReference}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">Paiement</p>
            <p className="mt-2 text-sm uppercase tracking-[0.12em] text-[var(--accent)] md:text-base">
              Cash a la livraison
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <Link
            href="/boutique"
            className="inline-flex items-center justify-center bg-[var(--primary-strong)] px-5 py-3 font-[var(--font-display)] text-sm uppercase tracking-[0.05em] text-[var(--background)] transition hover:brightness-110"
          >
            Continuer vos achats
          </Link>
          <Link
            href="/mon-compte"
            className="inline-flex items-center justify-center border border-[var(--border-soft)] px-5 py-3 font-[var(--font-display)] text-sm uppercase tracking-[0.05em] text-[var(--foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
          >
            Voir mon compte
          </Link>
        </div>
      </div>
    </main>
  );
}
