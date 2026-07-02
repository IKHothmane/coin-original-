"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { uploadProductImageUrlsToCloudinary } from "@/lib/cloudinary";
import type { ProductFormData } from "@/lib/products/schema";
import { slugifyProductName } from "@/lib/products/utils";
import { getProductRepository } from "@/lib/products/repository";

export default function AdminNewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setSaveMessage("");

    const productSlug = slugifyProductName(data.name);
    const galleryUrls = data.gallery.map((item) => item.src);

    const uploadResult = await uploadProductImageUrlsToCloudinary(productSlug, galleryUrls);
    if (uploadResult.error) {
      setSaveMessage(uploadResult.error);
      setIsSubmitting(false);
      return;
    }

    const imageUrls = uploadResult.urls;

    const result = await getProductRepository().create({
      ...data,
      slug: productSlug,
      image: imageUrls[0],
      gallery: imageUrls.map((src, index) => ({
        src,
        alt: `${data.name.trim()} image ${index + 1}`,
      })),
    });

    if (result.error || !result.data) {
      setSaveMessage(result.error ?? "Impossible d'enregistrer le produit.");
      setIsSubmitting(false);
      return;
    }

    setSaveMessage("Produit enregistre.");
    setIsSubmitting(false);
    router.push(`/admin/products/edit?slug=${result.data.slug}`);
  };

  return (
    <AdminShell>
      <main className="min-h-screen px-3 pb-24 pt-4 lg:px-5 lg:pb-10 lg:pt-10">
        <header className="mb-10 flex flex-col gap-5 border-b-4 border-[#ffb59e] pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <nav className="mb-2 flex items-center gap-2 font-mono text-xs uppercase text-[#e6beb2]">
              <span>Admin</span>
              <span>/</span>
              <span>Catalogue</span>
            </nav>
            <h1 className="font-[var(--font-display)] text-4xl uppercase leading-none text-white sm:text-5xl lg:text-7xl">
              AJOUTER UN PRODUIT
            </h1>
          </div>
          <div className="flex items-center gap-2 self-start border border-green-500/50 bg-green-900/30 px-3 py-2 lg:self-end">
            <span className="font-mono text-[10px] uppercase text-green-400">
              Stock Morocco Cloud
            </span>
          </div>
        </header>

        <ProductForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="ENREGISTRER LE PRODUIT"
        />

        {saveMessage ? (
          <div className="mt-6 border border-[#ffb59e] bg-[#201f1f] px-4 py-3 text-sm text-[#ffdbd0]">
            {saveMessage}
          </div>
        ) : null}
      </main>
    </AdminShell>
  );
}
