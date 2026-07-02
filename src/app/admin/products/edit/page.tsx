"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AdminEditProductPage } from "@/components/admin-edit-product-page";
import { AdminShell } from "@/components/admin/admin-shell";
import type { AdminProductRecord } from "@/lib/products/types";
import { getProductRepository } from "@/lib/products/repository";

function AdminEditProductLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#131313] px-6 text-center text-[#e5e2e1]">
      <p className="font-mono text-xs uppercase tracking-widest text-[#e6beb2]">
        Chargement du produit...
      </p>
    </div>
  );
}

function AdminEditProductContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [product, setProduct] = useState<AdminProductRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!slug) {
        setProduct(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const nextProduct = await getProductRepository().fetchBySlug(slug);

      if (isMounted) {
        setProduct(nextProduct);
        setIsLoading(false);
      }
    };

    void loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return <AdminEditProductLoading />;
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#131313] px-6 text-center text-[#e5e2e1]">
        <p className="font-[var(--font-display)] text-4xl uppercase">Produit introuvable</p>
        <Link
          href="/admin/products"
          className="border border-[#ffb59e] px-5 py-3 font-mono text-xs uppercase text-[#ffb59e]"
        >
          Retour a la liste
        </Link>
      </div>
    );
  }

  return <AdminEditProductPage key={product.slug} product={product} />;
}

export default function AdminEditProductStaticPage() {
  return (
    <AdminShell>
      <main className="min-h-screen px-3 pb-24 pt-4 lg:px-5 lg:pb-10 lg:pt-10">
        <Suspense fallback={<AdminEditProductLoading />}>
          <AdminEditProductContent />
        </Suspense>
      </main>
    </AdminShell>
  );
}
