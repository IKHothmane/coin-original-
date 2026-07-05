"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageIntro } from "@/components/admin/admin-ui";
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
    <AdminShell pageTitle="Nouveau produit" pageSubtitle="Catalogue / Creation">
      <main className="min-h-screen space-y-6 pb-24 pt-6 lg:space-y-8 lg:pb-10 lg:pt-10">
        <AdminPageIntro
          eyebrow="Catalogue"
          title="Ajouter un produit"
          description="Cree une nouvelle fiche produit avec un habillage coherent avec le reste du back-office."
          badge="Stock Morocco Cloud"
        />

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
