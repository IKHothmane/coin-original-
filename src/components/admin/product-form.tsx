"use client";

import { useEffect, useMemo, useRef, type ChangeEvent, type DragEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Info, Sparkles, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import type { AdminProductRecord } from "@/lib/products/types";
import { productSchema, type ProductFormData } from "@/lib/products/schema";
import {
  createInitialSizeStock,
  getBadgeConfig,
  getSizeLabelsByCategory,
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
  const badge = useWatch({ control, name: "badge" });
  const sizeStock = useWatch({ control, name: "stockBySize" }) ?? {};
  const status = badge ? getStatusFromProduct({ soldOut: soldOut ?? false, badge }) : "Aucun";

  const initialImageUrls = useMemo(
    () => (initialProduct?.gallery.length ? initialProduct.gallery.map((item) => item.src) : [initialProduct?.image ?? ""].filter(Boolean)),
    [initialProduct],
  );

  const {
    displayedUrls,
    primaryPreview,
    removeBackground,
    isProcessing,
    processError,
    progress,
    addFiles,
    toggleRemoveBackground,
  } = useAdminProductImages({
    initialImageUrls,
    defaultRemoveBackground: false,
  });

  useEffect(() => {
    if (displayedUrls.length > 0) {
      setValue("image", displayedUrls[0], { shouldValidate: true });
      setValue(
        "gallery",
        displayedUrls.map((src, index) => ({ src, alt: `Produit image ${index + 1}` })),
        { shouldValidate: true },
      );
    }
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

  const sizeLabels = useMemo(() => getSizeLabelsByCategory(category), [category]);

  useEffect(() => {
    const currentStock = getValues("stockBySize");
    const nextStock = sizeLabels.reduce<Record<string, number>>((acc, size) => {
      acc[size] = currentStock[size] ?? 0;
      return acc;
    }, {});
    setValue("stockBySize", nextStock, { shouldValidate: false });
  }, [category, sizeLabels, setValue, getValues]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    void addFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      void addFiles(event.dataTransfer.files);
    }
  };

  const toggleSize = (size: string) => {
    const currentStock = getValues("stockBySize");
    const current = currentStock[size] ?? 0;
    setValue("stockBySize", { ...currentStock, [size]: current > 0 ? 0 : 1 }, { shouldValidate: true });
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
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              fileInputRef.current?.click();
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
                toggleRemoveBackground();
              }}
              className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center border transition-all ${
                removeBackground
                  ? "border-[#ffb59e] bg-[#ffb59e] text-[#521300]"
                  : "border-[#ffb59e]/60 bg-[#0f0f0f]/70 text-[#ffb59e]"
              }`}
              title={removeBackground ? "Fond supprime (actif)" : "Fond conserve (inactif)"}
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

        {primaryPreview ? (
          <div className="flex items-center justify-between border border-[#353534] bg-[#1A1A1A] px-3 py-2">
            <span className="font-mono text-xs uppercase text-[#e6beb2]">Fond automatique</span>
            <button
              type="button"
              onClick={() => toggleRemoveBackground()}
              className={`flex items-center gap-2 px-3 py-1 font-mono text-[10px] uppercase transition-all ${
                removeBackground
                  ? "bg-[#ffb59e] text-[#521300]"
                  : "border border-[#ffb59e]/60 text-[#ffb59e]"
              }`}
            >
              <Sparkles size={12} />
              {removeBackground ? "Actif" : "Inactif"}
            </button>
          </div>
        ) : null}

        {processError ? (
          <div className="border border-red-500 bg-red-900/30 px-3 py-2 text-xs text-red-200">
            {processError}
          </div>
        ) : null}

        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`relative aspect-square overflow-hidden border-2 border-dashed border-[#353534] transition-all hover:border-[#ffb59e] ${
                displayedUrls[index + 1]
                  ? "bg-[repeating-linear-gradient(45deg,#111_0,#111_14px,#1A1A1A_14px,#1A1A1A_28px)]"
                  : "bg-[#1A1A1A]"
              }`}
            >
              {displayedUrls[index + 1] ? (
                <>
                  <Image
                    key={displayedUrls[index + 1]}
                    src={displayedUrls[index + 1]}
                    alt={`Apercu supplementaire ${index + 1}`}
                    fill
                    sizes="120px"
                    className="object-contain"
                  />
                  <div className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center border border-[#ffb59e]/60 bg-[#0f0f0f]/70 text-[#ffb59e]">
                    <Sparkles size={14} />
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-[#e6beb2]">
                  <ImagePlus size={22} />
                </div>
              )}
            </button>
          ))}
        </div>

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
        <section className="space-y-6 border border-[#2A2A2A] bg-[#1A1A1A] p-6">
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-8 bg-[#ffb59e]" />
            <h3 className="font-mono text-xs uppercase text-[#ffb59e]">Informations de Base</h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              <select
                {...register("category")}
                className="border-2 border-[#2A2A2A] bg-[#201f1f] px-3 py-3 text-base text-[#e5e2e1] outline-none transition-all focus:border-[#ffb59e]"
              >
                {PRODUCT_CATEGORIES.map((productCategory) => (
                  <option key={productCategory} value={productCategory}>
                    {productCategory}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase text-[#e6beb2]">Description du Produit</label>
            <textarea
              rows={4}
              {...register("description")}
              placeholder="Details sur la coupe, la matiere et l'inspiration..."
              className="border-2 border-[#2A2A2A] bg-transparent px-3 py-3 text-base text-[#e5e2e1] outline-none transition-all focus:border-[#ffb59e]"
            />
            {errors.description ? <p className="text-xs text-red-400">{errors.description.message}</p> : null}
          </div>
        </section>

        <section className="space-y-6 border border-[#2A2A2A] bg-[#1A1A1A] p-6">
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-8 bg-[#ffb59e]" />
            <h3 className="font-mono text-xs uppercase text-[#ffb59e]">Gestion des Tailles</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {sizeLabels.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`border-2 p-4 text-center transition-all ${
                  (sizeStock[size] ?? 0) > 0
                    ? "border-[#ffb59e] bg-[#ffb59e] text-[#5e1700]"
                    : "border-[#2A2A2A] bg-transparent text-[#e5e2e1]"
                }`}
              >
                <div className="font-mono text-xs uppercase">{size}</div>
              </button>
            ))}
          </div>
          {errors.stockBySize ? <p className="text-xs text-red-400">{String(errors.stockBySize.message)}</p> : null}
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Link
            href="/admin/products"
            className="border-2 border-white py-5 text-center font-[var(--font-display)] uppercase text-white transition-all hover:bg-white hover:text-black active:scale-95"
          >
            ANNULER
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isProcessing}
            className="bg-[#ffb59e] py-5 font-[var(--font-display)] uppercase text-[#5e1700] shadow-[0_0_20px_rgba(255,181,158,0.2)] transition-all hover:brightness-110 active:scale-95"
          >
            {isSubmitting ? "ENREGISTREMENT..." : submitLabel}
          </button>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="flex w-full max-w-xl flex-col gap-4 border-2 border-dashed border-[#ffb59e] bg-[#2a2a2a] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
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
