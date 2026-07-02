import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import type { CatalogProduct } from "@/components/catalog-data";
import { getCloudinaryBackgroundRemovedUrl } from "@/lib/cloudinary";
import type {
  AdminProductRecord,
  ProductBadgeTone,
  ProductGalleryItem,
  ProductMutationInput,
} from "@/lib/products/types";
import {
  formatMad,
  getCollectionLabel,
  getStockStatus,
  slugifyProductName,
} from "@/lib/products/utils";
import {
  firebaseDb,
  isFirebaseConfigured as isFirebaseClientConfigured,
} from "@/lib/firebase/client";

type FirebaseProductDocument = {
  slug: string;
  brand: string;
  category: string;
  name: string;
  priceValue: number;
  compareAtPriceValue?: number;
  description: string;
  image: string;
  gallery: ProductGalleryItem[];
  sizes: string[];
  stockBySize: Record<string, number>;
  soldOut: boolean;
  badge?: {
    label: string;
    tone: ProductBadgeTone;
  };
  authenticityLabel?: string;
  deliveryLabel?: string;
  deliveryRegion?: string;
  createdAt: number;
  updatedAt: number;
};

const productsCollection = collection(firebaseDb, "products");

export function isFirebaseConfigured() {
  return isFirebaseClientConfigured();
}

function mapInputToFirebaseDocument(
  input: ProductMutationInput,
  existingCreatedAt?: number,
): FirebaseProductDocument {
  const sizes = Object.entries(input.stockBySize)
    .filter(([, quantity]) => quantity > 0)
    .map(([size]) => size);
  const totalStock = Object.values(input.stockBySize).reduce((sum, quantity) => sum + quantity, 0);
  const now = Date.now();

  return {
    slug: input.slug ?? slugifyProductName(input.name),
    brand: input.brand,
    category: input.category,
    name: input.name,
    priceValue: input.priceValue,
    description: input.description,
    image: input.image,
    gallery: input.gallery,
    sizes,
    stockBySize: input.stockBySize,
    soldOut: input.soldOut ?? totalStock <= 0,
    createdAt: existingCreatedAt ?? now,
    updatedAt: now,
    ...(input.compareAtPriceValue !== undefined
      ? { compareAtPriceValue: input.compareAtPriceValue }
      : {}),
    ...(input.badge ? { badge: input.badge } : {}),
    ...(input.authenticityLabel ? { authenticityLabel: input.authenticityLabel } : {}),
    ...(input.deliveryLabel ? { deliveryLabel: input.deliveryLabel } : {}),
    ...(input.deliveryRegion ? { deliveryRegion: input.deliveryRegion } : {}),
  };
}

function mapFirebaseDocumentToAdminProduct(
  id: string,
  product: FirebaseProductDocument,
): AdminProductRecord {
  const stockBySize = product.stockBySize ?? {};
  const sizes = product.sizes?.length
    ? product.sizes
    : Object.keys(stockBySize).filter((size) => (stockBySize[size] ?? 0) > 0);
  const computedStock = Object.values(stockBySize).reduce((sum, quantity) => sum + quantity, 0);
  const stock = product.soldOut ? 0 : computedStock;
  const productImage = getCloudinaryBackgroundRemovedUrl(product.image);
  const productGallery = (product.gallery?.length
    ? product.gallery
    : [{ src: product.image, alt: `${product.name} vue principale` }]
  ).map((galleryItem) => ({
    ...galleryItem,
    src: getCloudinaryBackgroundRemovedUrl(galleryItem.src),
  }));

  return {
    id,
    slug: product.slug,
    brand: product.brand,
    category: product.category,
    name: product.name,
    priceValue: product.priceValue,
    priceLabel: formatMad(product.priceValue),
    compareAtPriceValue: product.compareAtPriceValue,
    compareAtPriceLabel: product.compareAtPriceValue ? formatMad(product.compareAtPriceValue) : undefined,
    description: product.description,
    badge: product.badge,
    image: productImage,
    gallery: productGallery,
    sizes,
    stockBySize,
    stock,
    stockStatus: getStockStatus(stock),
    collectionLabel: getCollectionLabel(product),
    soldOut: product.soldOut,
    authenticityLabel: product.authenticityLabel,
    deliveryLabel: product.deliveryLabel,
    deliveryRegion: product.deliveryRegion,
  };
}

export function mapAdminProductToCatalogProduct(product: AdminProductRecord): CatalogProduct {
  return {
    slug: product.slug,
    brand: product.brand,
    category: product.category,
    name: product.name,
    price: product.priceLabel.replace("MAD", "DH").trim(),
    compareAtPrice: product.compareAtPriceLabel?.replace("MAD", "DH").trim(),
    description: product.description,
    badge: product.badge,
    image: product.image,
    gallery: product.gallery,
    sizes: product.sizes,
    soldOut: product.soldOut,
    authenticityLabel: product.authenticityLabel,
    deliveryLabel: product.deliveryLabel,
    deliveryRegion: product.deliveryRegion,
  };
}

export async function fetchAdminProducts() {
  if (!isFirebaseClientConfigured()) {
    return [];
  }

  try {
    const snapshot = await getDocs(query(productsCollection, orderBy("createdAt", "desc")));

    return snapshot.docs.map((documentSnapshot) =>
      mapFirebaseDocumentToAdminProduct(
        documentSnapshot.id,
        documentSnapshot.data() as FirebaseProductDocument,
      ),
    );
  } catch (error) {
    console.error("Firebase fetch products failed:", error);
    return [];
  }
}

export async function fetchAdminProductBySlug(slug: string) {
  if (!isFirebaseClientConfigured()) {
    return null;
  }

  try {
    const documentSnapshot = await getDoc(doc(firebaseDb, "products", slug));

    if (!documentSnapshot.exists()) {
      return null;
    }

    return mapFirebaseDocumentToAdminProduct(
      documentSnapshot.id,
      documentSnapshot.data() as FirebaseProductDocument,
    );
  } catch (error) {
    console.error("Firebase fetch product failed:", error);
    return null;
  }
}

export async function createAdminProduct(input: ProductMutationInput) {
  if (!isFirebaseClientConfigured()) {
    return {
      data: null,
      error: "Firebase n'est pas configure.",
    };
  }

  try {
    const slug = input.slug ?? slugifyProductName(input.name);
    const payload = mapInputToFirebaseDocument({ ...input, slug });
    await setDoc(doc(firebaseDb, "products", slug), payload);

    return {
      data: mapFirebaseDocumentToAdminProduct(slug, payload),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Impossible d'enregistrer le produit dans Firebase.",
    };
  }
}

export async function updateAdminProduct(slug: string, input: ProductMutationInput) {
  if (!isFirebaseClientConfigured()) {
    return {
      data: null,
      error: "Firebase n'est pas configure.",
    };
  }

  try {
    const existingSnapshot = await getDoc(doc(firebaseDb, "products", slug));
    const existingProduct = existingSnapshot.exists()
      ? (existingSnapshot.data() as FirebaseProductDocument)
      : undefined;
    const payload = mapInputToFirebaseDocument(
      { ...input, slug },
      existingProduct?.createdAt,
    );

    await setDoc(doc(firebaseDb, "products", slug), payload);

    return {
      data: mapFirebaseDocumentToAdminProduct(slug, payload),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Impossible de mettre a jour le produit dans Firebase.",
    };
  }
}

export async function deleteAdminProduct(slug: string) {
  if (!isFirebaseClientConfigured()) {
    return {
      data: null,
      error: "Firebase n'est pas configure.",
    };
  }

  try {
    await deleteDoc(doc(firebaseDb, "products", slug));

    return {
      data: { slug },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Impossible de supprimer le produit.",
    };
  }
}

export async function fetchCatalogProductsFromFirebase() {
  const products = await fetchAdminProducts();
  return products.map(mapAdminProductToCatalogProduct);
}

export async function fetchCatalogProductBySlugFromFirebase(slug: string) {
  const product = await fetchAdminProductBySlug(slug);
  return product ? mapAdminProductToCatalogProduct(product) : null;
}
