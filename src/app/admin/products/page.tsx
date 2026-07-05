"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, PlusSquare, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminMetricCard, AdminPageIntro, AdminPanel } from "@/components/admin/admin-ui";
import type { AdminProductRecord } from "@/lib/products/types";
import { getActiveProductBackendLabel, getProductRepository } from "@/lib/products/repository";

function ProductStatus({ stockStatus }: { stockStatus: string }) {
  if (stockStatus === "Stock faible") {
    return (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#ffba20]" />
        <span className="font-mono text-[10px] uppercase text-[#ffba20]">Stock faible</span>
      </div>
    );
  }

  if (stockStatus === "Hors stock") {
    return (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#ffb4ab]" />
        <span className="font-mono text-[10px] uppercase text-[#ffb4ab]">Hors stock</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-[#ffb4a8]" />
      <span className="font-mono text-[10px] uppercase text-[#ffb4a8]">Actif</span>
    </div>
  );
}

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryProducts, setInventoryProducts] = useState<AdminProductRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      const products = await getProductRepository().fetchAll();

      if (isMounted) {
        setInventoryProducts(products);
        setIsLoading(false);
      }
    };

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return inventoryProducts;
    }

    return inventoryProducts.filter((product) =>
      [product.name, product.slug, product.category, product.brand].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [inventoryProducts, searchQuery]);

  const totalProducts = inventoryProducts.length;
  const lowStockCount = inventoryProducts.filter((product) => product.stockStatus === "Stock faible").length;
  const visibleCount = filteredProducts.length;

  return (
    <AdminShell pageTitle="Produits" pageSubtitle="Catalogue / Inventaire">
      <div className="space-y-6 py-6 lg:space-y-8 lg:py-10">
        <AdminPageIntro
          eyebrow="Catalogue"
          title="Gestion des produits"
          description="Pilotage du stock, de la visibilite et du contenu produit dans un back-office plus structure et plus premium."
          badge={getActiveProductBackendLabel()}
          action={
            <Link
              href="/admin/products/new"
              className="inline-flex items-center justify-center gap-3 self-start border border-[#ff8f68] bg-[linear-gradient(135deg,#ffb59e_0%,#ff6a33_100%)] px-6 py-4 font-[var(--font-display)] text-xl text-[#5e1700] transition-all hover:scale-[1.01] active:scale-95"
            >
              <PlusSquare size={22} />
              Ajouter un produit
            </Link>
          }
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminMetricCard
            label="Total produits"
            value={isLoading ? "..." : String(totalProducts)}
            detail="Catalogue visible"
            icon={PlusSquare}
            accent="sand"
          />
          <AdminMetricCard
            label="Stock faible"
            value={isLoading ? "..." : String(lowStockCount)}
            detail="References a reapprovisionner"
            icon={Search}
            accent="gold"
          />
          <AdminMetricCard label="Ventes 24h" value="+45" detail="Rythme jour" icon={Pencil} accent="orange" />
          <AdminMetricCard label="Systeme" value="ON" detail="Flux catalogue operationnel" icon={PlusSquare} accent="sand" />
        </div>

        <AdminPanel
          eyebrow="Inventaire"
          title="Catalogue complet"
          action={
            <div className="relative w-full min-w-[260px] sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="RECHERCHER UN PRODUIT..."
                className="w-full border border-[#2f2b29] bg-[#161514] px-4 py-3 pr-11 font-mono text-[10px] uppercase tracking-widest text-[#e5e2e1] outline-none transition-all placeholder:text-[#a38d86] focus:border-[#ff571a]"
              />
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#e6beb2]" />
            </div>
          }
        >
        <div className="overflow-hidden border border-[#2f2b29] bg-[#161514]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#2f2b29] bg-[#1d1b1a]">
                  <th className="p-6 font-mono text-[10px] uppercase text-[#e6beb2]">Produit</th>
                  <th className="p-6 font-mono text-[10px] uppercase text-[#e6beb2]">SKU</th>
                  <th className="p-6 font-mono text-[10px] uppercase text-[#e6beb2]">Prix</th>
                  <th className="p-6 font-mono text-[10px] uppercase text-[#e6beb2]">Stock</th>
                  <th className="p-6 font-mono text-[10px] uppercase text-[#e6beb2]">Status</th>
                  <th className="p-6 text-right font-mono text-[10px] uppercase text-[#e6beb2]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2f2b29]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center font-mono text-xs uppercase text-[#e6beb2]">
                      Chargement des produits...
                    </td>
                  </tr>
                ) : null}

                {!isLoading && filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center font-mono text-xs uppercase text-[#e6beb2]">
                      {getActiveProductBackendLabel() === "Catalogue statique"
                        ? "Aucun backend produit configure"
                        : `Aucun produit dans ${getActiveProductBackendLabel()}`}
                    </td>
                  </tr>
                ) : null}

                {filteredProducts.map((product) => (
                  <tr key={product.slug} className="group transition-colors hover:bg-[#1b1a19]">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden border border-[#5c4037] bg-[#353534]">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div>
                          <p className="font-[var(--font-display)] text-lg uppercase tracking-tight text-[#e5e2e1]">
                            {product.name}
                          </p>
                          <p className="font-mono text-[10px] text-[#e6beb2]">{product.collectionLabel}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 font-mono text-xs text-[#e5e2e1]">{product.slug}</td>
                    <td className="p-6">
                      <span className="font-[var(--font-display)] text-lg text-[#ffb59e]">
                        {product.priceLabel}
                      </span>
                    </td>
                    <td className="p-6">
                      <span
                        className={`inline-flex border px-3 py-1 font-mono text-[10px] uppercase ${
                          product.stockStatus === "Stock faible"
                            ? "border-[#ffb4ab] bg-[#93000a] text-[#ffdad6]"
                            : product.stockStatus === "Hors stock"
                              ? "border-[#ffb4ab] bg-[#690005] text-[#ffdad6]"
                              : "border-[#5c4037] bg-[#353534] text-[#e5e2e1]"
                        }`}
                      >
                        {product.stock} unites
                      </span>
                    </td>
                    <td className="p-6">
                      <ProductStatus stockStatus={product.stockStatus} />
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/edit?slug=${product.slug}`}
                          className="border border-[#353534] p-2 text-[#e5e2e1] transition-all hover:border-[#ff571a] hover:text-[#ff571a]"
                          aria-label={`Modifier ${product.name}`}
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm(`Supprimer "${product.name}" ? Cette action est irreversible.`)) {
                              const result = await getProductRepository().delete(product.slug);
                              if (result.error) {
                                alert(result.error);
                              } else {
                                setInventoryProducts((current) =>
                                  current.filter((item) => item.slug !== product.slug),
                                );
                              }
                            }
                          }}
                          className="relative z-10 cursor-pointer border border-[#353534] bg-[#201f1f] p-2 text-[#e5e2e1] transition-all hover:border-[#ffb4ab] hover:text-[#ffb4ab]"
                          aria-label={`Supprimer ${product.name}`}
                          title={`Supprimer ${product.name}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#2f2b29] bg-[#1d1b1a] p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-xs text-[#e6beb2]">
              Affichage de 1-{visibleCount} sur {totalProducts} produits
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled
                className="border border-[#353534] p-2 text-[#e5e2e1] opacity-50"
                aria-label="Page precedente"
              >
                <ChevronLeft size={18} />
              </button>
              <button type="button" className="bg-[#ffb59e] px-4 py-2 font-mono text-xs text-[#5e1700]">
                1
              </button>
              <button
                type="button"
                className="border border-[#353534] px-4 py-2 font-mono text-xs text-[#e5e2e1] transition-colors hover:bg-[#353534]"
              >
                2
              </button>
              <button
                type="button"
                className="border border-[#353534] px-4 py-2 font-mono text-xs text-[#e5e2e1] transition-colors hover:bg-[#353534]"
              >
                3
              </button>
              <button
                type="button"
                className="border border-[#353534] p-2 text-[#e5e2e1] transition-colors hover:bg-[#353534]"
                aria-label="Page suivante"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
