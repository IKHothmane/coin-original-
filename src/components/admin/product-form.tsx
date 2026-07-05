"use client";

import { useEffect, useMemo, useRef, type ChangeEvent, type DragEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Info, Sparkles, Truck, ArrowUp, ArrowDown, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import type { AdminProductRecord } from "@/lib/products/types";
import { productSchema, type ProductFormData } from "@/lib/products/schema";
import {
  createInitialSizeStock,
  getBadgeConfig,
  getStatusFromProduct,
  normalizeCategory,
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  slugifyProductName,
} from "@/lib/products/utils";
import { useAdminProductImages } from "@/components/use-admin-product-images";

export type ProductFormProps = {
  initialProduct?: AdminProductRecord;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting: boolean;
  submitLabel: string;
};

export function ProductForm({ initialProduct, onSubmit, isSubmitting, submitLabel }: ProductFormProps) {
  const isEditMode = Boolean(initialProduct);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const targetImageIndexRef = useRef<number | null>(null);

  const defaultValues: ProductFormData = useMemo(() => {
    if (initialProduct) {
      return {
        slug: initialProduct.slug,
        brand: initialProduct.brand,
        category: normalizeCategory(initialProduct.category),
        name: initialProduct.name,
        priceValue: initialProduct.priceValue,
        compareAtPriceValue: initialProduct.compareAtPriceValue,
        description: initialProduct.description,
        image: initialProduct.image,
        gallery: initialProduct.gallery,
        stockBySize: initialProduct.stockBySize,
        badge: initialProduct.badge,
        soldOut: initialProduct.soldOut,
        hidden: initialProduct.hidden,
        authenticityLabel: initialProduct.authenticityLabel,
        deliveryLabel: initialProduct.deliveryLabel,
        deliveryRegion: initialProduct.deliveryRegion,
      };
    }

    return {
      brand: "Coin Original",
      category: "Vetements",
      name: "",
      priceValue: 0,
      description: "",
      image: "",
      gallery: [],
      stockBySize: createInitialSizeStock("Vetements"),
      authenticityLabel: "Original Authentique",
      deliveryLabel: "PAIEMENT A LA LIVRAISON",
      deliveryRegion: "MAROC",
    };
  }, [initialProduct]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormData>,
    defaultValues,
  });

  const category = useWatch({ control, name: "category" });
  const soldOut = useWatch({ control, name: "soldOut" });
  const hidden = useWatch({ control, name: "hidden" });
  const badge = useWatch({ control, name: "badge" });
  const status = badge ? getStatusFromProduct({ soldOut: soldOut ?? false, badge }) : "Aucun";

  const initialImageUrls = useMemo(
    () => (initialProduct?.gallery.length ? initialProduct.gallery.map((item) => item.src) : [initialProduct?.image ?? ""].filter(Boolean)),
    [initialProduct],
  );

  const {
    displayedUrls,
    primaryPreview,
    removeBackgroundMap,
    isProcessing,
    processError,
    progress,
    addFiles,
    toggleRemoveBackgroundForImage,
    removeImage,
  } = useAdminProductImages({
    initialImageUrls,
    defaultRemoveBackground: false,
  });

  useEffect(() => {
    setValue("image", displayedUrls[0] ?? "", { shouldValidate: true });
    setValue(
      "gallery",
      displayedUrls.map((src, index) => ({ src, alt: `Produit image ${index + 1}` })),
      { shouldValidate: true },
    );
  }, [displayedUrls, setValue]);

  const watchedName = useWatch({ control, name: "name" });

  useEffect(() => {
    const currentGallery = getValues("gallery");
    if (currentGallery.length > 0 && watchedName) {
      setValue(
        "gallery",
        currentGallery.map((item, index) => ({
          ...item,
          alt: `${watchedName.trim() || "Produit"} image ${index + 1}`,
        })),
        { shouldValidate: false },
      );
    }
  }, [watchedName, setValue, getValues]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    void addFiles(event.target.files, targetImageIndexRef.current ?? undefined);
    targetImageIndexRef.current = null;
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      void addFiles(event.dataTransfer.files, displayedUrls.length > 0 ? 0 : undefined);
    }
  };

  const openFilePickerForIndex = (index?: number) => {
    targetImageIndexRef.current = typeof index === "number" ? index : null;
    fileInputRef.current?.click();
  };

  const handleStatusChange = (nextStatus: string) => {
    const config = getBadgeConfig(nextStatus);
    if (config) {
      setValue("badge", { label: config.label, tone: config.tone }, { shouldValidate: true });
      setValue("soldOut", config.soldOut ?? false, { shouldValidate: true });
    } else {
      setValue("badge", undefined, { shouldValidate: true });
      setValue("soldOut", false, { shouldValidate: true });
    }
  };

  const moveGalleryImage = (index: number, direction: "up" | "down") => {
    const currentGallery = getValues("gallery");
    if (currentGallery.length < 2) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentGallery.length) return;
    const newGallery = [...currentGallery];
    [newGallery[index], newGallery[newIndex]] = [newGallery[newIndex], newGallery[index]];
    setValue("gallery", newGallery, { shouldValidate: true });
    if (newGallery.length > 0) {
      setValue("image", newGallery[0].src, { shouldValidate: true });
    }
  };

  const handleRemoveImage = (index: number) => {
    removeImage(index);
    const currentGallery = getValues("gallery");
    const newGallery = currentGallery.filter((_, i) => i !== index);
    setValue("gallery", newGallery, { shouldValidate: true });
    if (newGallery.length > 0) {
      setValue("image", newGallery[0].src, { shouldValidate: true });
    } else {
      setValue("image", "", { shouldValidate: true });
    }
  };

  const onFormSubmit = (data: ProductFormData) => {
    const payload: ProductFormData = {
      ...data,
      slug: isEditMode ? data.slug : slugifyProductName(data.name),
    };
    void onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit as never)} className="grid grid-cols-12 gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="col-span-12 space-y-4 lg:col-span-5">
        <div
          role="button"
          tabIndex={0}
          onClick={() => openFilePickerForIndex(displayedUrls.length > 0 ? 0 : undefined)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openFilePickerForIndex(displayedUrls.length > 0 ? 0 : undefined);
            }
          }}
          className={`relative aspect-square w-full cursor-pointer overflow-hidden border-2 border-dashed border-[#353534] bg-[#1A1A1A] transition-colors hover:border-[#ffb59e] ${
            primaryPreview ? "bg-[repeating-linear-gradient(45deg,#111_0,#111_14px,#1A1A1A_14px,#1A1A1A_28px)]" : ""
          }`}
        >
          {primaryPreview ? (
            <Image
              key={primaryPreview}
              src={primaryPreview}
              alt="Apercu du produit"
              fill
              sizes="(max-width: 1023px) 100vw, 40vw"
              className="object-contain"
            />
          ) : null}
          {isProcessing ? (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 px-6 text-center">
              <Sparkles size={32} className="mb-3 animate-pulse text-[#ffb59e]" />
              <p className="font-mono text-xs uppercase text-[#e5e2e1]">
                {progress
                  ? `${progress.key} ${Math.round((progress.current / progress.total) * 100)}%`
                  : "Suppression du fond..."}
              </p>
            </div>
          ) : null}
          {primaryPreview ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                toggleRemoveBackgroundForImage(0);
              }}
              className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center border transition-all ${
                removeBackgroundMap[0]
                  ? "border-[#ffb59e] bg-[#ffb59e] text-[#521300]"
                  : "border-[#ffb59e]/60 bg-[#0f0f0f]/70 text-[#ffb59e]"
              }`}
              title={removeBackgroundMap[0] ? "Fond supprime (actif)" : "Fond conserve (inactif)"}
            >
              <Sparkles size={16} />
            </button>
          ) : null}
          {!primaryPreview && !isProcessing ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/30 px-6 text-center">
              <ImagePlus size={52} className="mb-4 text-[#e6beb2]" />
              <p className="font-mono text-xs uppercase text-[#e5e2e1]">Glisser & deposer</p>
              <p className="mt-1 text-xs text-[#e6beb2]">PNG, JPG (MAX. 5MB)</p>
            </div>
          ) : null}
        </div>

        {errors.image ? (
          <p className="text-xs text-red-400">{errors.image.message}</p>
        ) : null}

        {processError ? (
          <div className="border border-red-500 bg-red-900/30 px-3 py-2 text-xs text-red-200">
            {processError}
          </div>
        ) : null}

        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => {
            const imageIndex = index + 1;
            const hasImage = displayedUrls[imageIndex];
            return (
              <div key={index} className="relative">
                <button
                  type="button"
                  onClick={() => openFilePickerForIndex(imageIndex)}
                  className={`relative aspect-square w-full overflow-hidden border-2 border-dashed border-[#353534] transition-all hover:border-[#ffb59e] ${
                    hasImage
                      ? "bg-[repeating-linear-gradient(45deg,#111_0,#111_14px,#1A1A1A_14px,#1A1A1A_28px)]"
                      : "bg-[#1A1A1A]"
                  }`}
                >
                  {hasImage ? (
                    <>
                      <Image
                        key={displayedUrls[imageIndex]}
                        src={displayedUrls[imageIndex]}
                        alt={`Apercu supplementaire ${imageIndex}`}
                        fill
                        sizes="120px"
                        className="object-contain"
                      />
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRemoveImage(imageIndex);
                        }}
                        className="absolute left-1 top-1 z-30 flex h-5 w-5 items-center justify-center border border-red-500/60 bg-red-900/70 text-red-400 transition-colors hover:bg-red-500 hover:text-white"
                        title="Supprimer l'image"
                      >
                        <X size={10} />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleRemoveBackgroundForImage(imageIndex);
                        }}
                        className={`absolute right-1 top-1 z-20 flex h-5 w-5 items-center justify-center border transition-all ${
                          removeBackgroundMap[imageIndex]
                            ? "border-[#ffb59e] bg-[#ffb59e] text-[#521300]"
                            : "border-[#ffb59e]/60 bg-[#0f0f0f]/70 text-[#ffb59e]"
                        }`}
                        title={removeBackgroundMap[imageIndex] ? "Fond supprime" : "Fond conserve"}
                      >
                        <Sparkles size={10} />
                      </button>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#e6beb2]">
                      <ImagePlus size={22} />
                    </div>
                  )}
                </button>
                {hasImage && displayedUrls.length > 2 ? (
                  <div className="absolute -bottom-7 left-0 right-0 flex justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveGalleryImage(imageIndex, "up")}
                      disabled={index === 0}
                      className="flex h-5 w-5 items-center justify-center border border-[#353534] bg-[#1A1A1A] text-[#e6beb2] transition-colors hover:border-[#ffb59e] hover:text-[#ffb59e] disabled:opacity-30"
                      title="Deplacer avant"
                    >
                      <ArrowUp size={10} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveGalleryImage(imageIndex, "down")}
                      disabled={index >= displayedUrls.length - 2}
                      className="flex h-5 w-5 items-center justify-center border border-[#353534] bg-[#1A1A1A] text-[#e6beb2] transition-colors hover:border-[#ffb59e] hover:text-[#ffb59e] disabled:opacity-30"
                      title="Deplacer apres"
                    >
                      <ArrowDown size={10} />
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="mt-6" />

        <div className="border-l-4 border-[#ffba20] bg-[#1A1A1A] p-6">
          <div className="flex items-start gap-4">
            <Info size={20} className="mt-0.5 text-[#ffba20]" />
            <div>
              <h4 className="mb-1 font-mono text-xs uppercase text-white">Guide de Photographie</h4>
              <p className="text-sm text-[#e6beb2]">
                Utilise un fond urbain neutre ou un studio propre pour garder l&apos;identite
                Coin Original.
              </p>
              <p className="mt-2 text-xs uppercase text-[#ffba20]">
                Images sur Cloudinary si configure, sinon sauvegarde directe temporaire.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 flex flex-col gap-4 lg:col-span-7">
        <section className="relative overflow-hidden space-y-6 border border-[#342f2d] bg-[linear-gradient(180deg,#151414_0%,#101010_100%)] p-6 shadow-[12px_12px_0_0_rgba(0,0,0,0.16)]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:26px_26px]" />
          <div className="relative z-10 flex items-center gap-2">
            <span className="h-[2px] w-8 bg-[#ffb59e]" />
            <h3 className="font-mono text-xs uppercase text-[#ffb59e]">Informations de Base</h3>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs uppercase text-[#e6beb2]">Nom du Produit</label>
              <input
                type="text"
                {...register("name")}
                placeholder="ex: OVERSIZED TEE CASABLANCA"
                className="border-2 border-[#2A2A2A] bg-transparent px-3 py-3 text-base text-[#e5e2e1] outline-none transition-all focus:border-[#ffb59e] focus:shadow-[0_0_10px_rgba(255,181,158,0.2)]"
              />
              {errors.name ? <p className="text-xs text-red-400">{errors.name.message}</p> : null}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs uppercase text-[#e6beb2]">Categorie</label>
              <input type="hidden" {...register("category")} />
              <div className="grid grid-cols-2 gap-2">
                {PRODUCT_CATEGORIES.map((productCategory) => {
                  const isActive = category === productCategory;

                  return (
                    <button
                      key={productCategory}
                      type="button"
                      onClick={() => setValue("category", productCategory, { shouldValidate: true })}
                      className={`border px-3 py-3 text-left font-mono text-xs uppercase transition-all ${
                        isActive
                          ? "border-[#ff8a62] bg-[linear-gradient(135deg,#ffcfbf_0%,#ff6a33_100%)] text-[#3b1205] shadow-[6px_6px_0_0_rgba(63,19,6,0.22)]"
                          : "border-[#2A2A2A] bg-[#201f1f] text-[#e5e2e1] hover:border-[#ffb59e] hover:text-[#ffb59e]"
                      }`}
                    >
                      {productCategory}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs uppercase text-[#e6beb2]">Prix de Vente (MAD)</label>
              <div className="relative">
                <input
                  type="number"
                  {...register("priceValue")}
                  placeholder="0.00"
                  className="w-full border-2 border-[#2A2A2A] bg-transparent px-3 py-3 pr-16 text-base text-[#e5e2e1] outline-none transition-all focus:border-[#ffb59e]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-[#ffb59e]">
                  MAD
                </span>
              </div>
              {errors.priceValue ? <p className="text-xs text-red-400">{errors.priceValue.message}</p> : null}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs uppercase text-[#e6beb2]">
                Prix Avant Solde (MAD)
              </label>
              <div className="relative">
                <input
                  type="number"
                  {...register("compareAtPriceValue")}
                  placeholder="0.00"
                  className="w-full border-2 border-[#2A2A2A] bg-transparent px-3 py-3 pr-16 text-base text-[#e5e2e1] outline-none transition-all focus:border-[#ffb59e]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-[#ffb59e]">
                  MAD
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs uppercase text-[#e6beb2]">Statut Produit</label>
              <select
                value={status}
                onChange={(event) => handleStatusChange(event.target.value)}
                className="border-2 border-[#2A2A2A] bg-[#201f1f] px-3 py-3 text-base text-[#e5e2e1] outline-none transition-all focus:border-[#ffb59e]"
              >
                {PRODUCT_STATUSES.map((productStatus) => (
                  <option key={productStatus} value={productStatus}>
                    {productStatus}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs uppercase text-[#e6beb2]">Visibilite</label>
              <button
                type="button"
                onClick={() => setValue("hidden", !(hidden ?? false), { shouldValidate: true })}
                className={`border-2 px-3 py-3 text-center font-mono text-xs uppercase transition-all ${
                  hidden
                    ? "border-red-500 bg-red-900/30 text-red-400"
                    : "border-[#ffb59e] bg-[#ffb59e] text-[#5e1700]"
                }`}
              >
                {hidden ? "Produit Masque" : "Produit Visible"}
              </button>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-2">
            <label className="font-mono text-xs uppercase text-[#e6beb2]">Description du Produit (optionnel)</label>
            <textarea
              rows={4}
              {...register("description")}
              placeholder="Details sur la coupe, la matiere et l'inspiration..."
              className="border-2 border-[#2A2A2A] bg-transparent px-3 py-3 text-base text-[#e5e2e1] outline-none transition-all focus:border-[#ffb59e]"
            />
            {errors.description ? <p className="text-xs text-red-400">{errors.description.message}</p> : null}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            href="/admin/products"
            className="border border-white py-5 text-center font-[var(--font-display)] uppercase text-white transition-all hover:bg-white hover:text-black active:scale-95"
          >
            ANNULER
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isProcessing}
            className="border border-[#ff8a62] bg-[linear-gradient(135deg,#ffcfbf_0%,#ff6a33_100%)] py-5 font-[var(--font-display)] uppercase text-[#5e1700] shadow-[10px_10px_0_0_rgba(63,19,6,0.28)] transition-all hover:brightness-110 active:scale-95"
          >
            {isSubmitting ? "ENREGISTREMENT..." : submitLabel}
          </button>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="flex w-full max-w-xl flex-col gap-4 border border-[#ffb59e] bg-[linear-gradient(180deg,#1a1716_0%,#121111_100%)] px-6 py-4 shadow-[10px_10px_0_0_rgba(0,0,0,0.16)] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Truck size={24} className="text-[#ffb59e]" />
              <div>
                <p className="font-mono text-xs uppercase text-white">Compatible COD</p>
                <p className="text-xs text-[#e6beb2]">Pret pour le paiement a la livraison au Maroc.</p>
              </div>
            </div>
            <div className="h-px bg-[#353534] sm:h-10 sm:w-px" />
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-[#ffb59e]" />
              <span className="font-mono text-xs uppercase text-white">ORIGINE: MA</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
