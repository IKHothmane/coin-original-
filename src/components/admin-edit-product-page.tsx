"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { uploadProductImageUrlsToCloudinary } from "@/lib/cloudinary";
import type { AdminProductRecord } from "@/lib/products/types";
import type { ProductFormData } from "@/lib/products/schema";
import { getProductRepository } from "@/lib/products/repository";

type AdminEditProductPageProps = {
  product: AdminProductRecord;
};

export function AdminEditProductPage({ product }: AdminEditProductPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setSaveMessage("");

    const productSlug = product.slug;
    const galleryUrls = data.gallery.map((item) => item.src);

    const uploadResult = await uploadProductImageUrlsToCloudinary(productSlug, galleryUrls);
    if (uploadResult.error) {
      setSaveMessage(uploadResult.error);
      setIsSubmitting(false);
      return;
    }

    const imageUrls = uploadResult.urls;

    const result = await getProductRepository().update(productSlug, {
      ...data,
      slug: productSlug,
      image: imageUrls[0],
      gallery: imageUrls.map((src, index) => ({
        src,
        alt: `${data.name.trim()} image ${index + 1}`,
      })),
    });

    if (result.error || !result.data) {
      setSaveMessage(result.error ?? "Impossible de mettre a jour le produit.");
      setIsSubmitting(false);
      return;
    }

    setSaveMessage("Produit mis a jour.");
    setIsSubmitting(false);
    router.push("/admin/products");
  };

  const handleDelete = async () => {
    if (window.confirm(`Supprimer "${product.name}" definitivement ? Cette action est irreversible.`)) {
      const result = await getProductRepository().delete(product.slug);
      if (result.error) {
        alert(result.error);
      } else {
        router.push("/admin/products");
      }
    }
  };

  return (
    <div>
      <header className="mb-10 flex flex-col gap-5 border-b-4 border-[#ffb59e] pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <nav className="mb-2 flex items-center gap-2 font-mono text-xs uppercase text-[#e6beb2]">
            <span>Admin</span>
            <span>/</span>
            <span>Catalogue</span>
          </nav>
          <h1 className="font-[var(--font-display)] text-4xl uppercase leading-none text-white sm:text-5xl lg:text-7xl">
            MODIFIER UN PRODUIT
          </h1>
        </div>
      </header>

      <ProductForm
        initialProduct={product}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="ENREGISTRER LES MODIFICATIONS"
      />

      <button
        type="button"
        onClick={handleDelete}
        className="mt-8 flex w-full cursor-pointer items-center justify-center gap-2 border-2 border-red-500 py-4 font-[var(--font-display)] uppercase text-red-400 transition-all hover:bg-red-500 hover:text-white active:scale-95"
      >
        <Trash2 size={20} />
        Supprimer ce produit
      </button>

      {saveMessage ? (
        <div className="mt-6 border border-[#ffb59e] bg-[#201f1f] px-4 py-3 text-sm text-[#ffdbd0]">
          {saveMessage}
        </div>
      ) : null}
    </div>
  );
}
