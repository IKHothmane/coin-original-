import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import type { CatalogProduct, ProductBadgeTone } from "@/components/catalog-data";
import {
  firebaseDb,
  isFirebaseConfigured as isFirebaseClientConfigured,
} from "@/lib/firebase/client";

const DEBUG_SERVER_URL = "http://127.0.0.1:7777/event";
const DEBUG_SESSION_ID = "firebase-storage-cors";

type ProductGalleryItem = {
  src: string;
  alt: string;
};

type StockStatus = "Actif" | "Stock faible" | "Hors stock";

export type AdminProductRecord = {
  id: string;
  slug: string;
  brand: string;
  category: string;
  name: string;
  priceValue: number;
  priceLabel: string;
  compareAtPriceValue?: number;
  compareAtPriceLabel?: string;
  description: string;
  badge?: {
    label: string;
    tone: ProductBadgeTone;
  };
  image: string;
  gallery: ProductGalleryItem[];
  sizes: string[];
  stockBySize: Record<string, number>;
  stock: number;
  stockStatus: StockStatus;
  collectionLabel: string;
  soldOut: boolean;
  authenticityLabel?: string;
  deliveryLabel?: string;
  deliveryRegion?: string;
};

export type ProductMutationInput = {
  slug?: string;
  brand: string;
  category: string;
  name: string;
  priceValue: number;
  compareAtPriceValue?: number;
  description: string;
  image: string;
  gallery: ProductGalleryItem[];
  stockBySize: Record<string, number>;
  badge?: {
    label: string;
    tone: ProductBadgeTone;
  };
  soldOut?: boolean;
  authenticityLabel?: string;
  deliveryLabel?: string;
  deliveryRegion?: string;
};

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

function formatMad(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} MAD`;
}

export function slugifyProductName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCollectionLabel(product: { category: string }) {
  if (product.category === "Chaussures") {
    return "Collection Summer 24";
  }

  if (product.category === "Vetements" || product.category === "Hoodies") {
    return "Essentials Series";
  }

  return "Lifestyle Pack";
}

function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) {
    return "Hors stock";
  }

  if (stock <= 8) {
    return "Stock faible";
  }

  return "Actif";
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
    image: product.image,
    gallery: product.gallery?.length
      ? product.gallery
      : [{ src: product.image, alt: `${product.name} vue principale` }],
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
    // #region debug-point D:firebase-create-start
    fetch(DEBUG_SERVER_URL, {
      method: "POST",
      body: JSON.stringify({
        sessionId: DEBUG_SESSION_ID,
        runId: "pre-fix",
        hypothesisId: "D",
        location: "src/lib/firebase/products.ts:createAdminProduct:start",
        msg: "[DEBUG] Firestore create started",
        data: {
          slug,
          image: payload.image,
          galleryCount: payload.gallery.length,
        },
        ts: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    await setDoc(doc(firebaseDb, "products", slug), payload);

    // #region debug-point D:firebase-create-success
    fetch(DEBUG_SERVER_URL, {
      method: "POST",
      body: JSON.stringify({
        sessionId: DEBUG_SESSION_ID,
        runId: "pre-fix",
        hypothesisId: "D",
        location: "src/lib/firebase/products.ts:createAdminProduct:success",
        msg: "[DEBUG] Firestore create succeeded",
        data: {
          slug,
        },
        ts: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    return {
      data: mapFirebaseDocumentToAdminProduct(slug, payload),
      error: null,
    };
  } catch (error) {
    // #region debug-point D:firebase-create-error
    fetch(DEBUG_SERVER_URL, {
      method: "POST",
      body: JSON.stringify({
        sessionId: DEBUG_SESSION_ID,
        runId: "pre-fix",
        hypothesisId: "D",
        location: "src/lib/firebase/products.ts:createAdminProduct:error",
        msg: "[DEBUG] Firestore create failed",
        data: {
          error: error instanceof Error ? error.message : String(error),
          code:
            error && typeof error === "object" && "code" in error
              ? String((error as { code?: unknown }).code)
              : null,
        },
        ts: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
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

export async function fetchCatalogProductsFromFirebase() {
  const products = await fetchAdminProducts();
  return products.map(mapAdminProductToCatalogProduct);
}

export async function fetchCatalogProductBySlugFromFirebase(slug: string) {
  const product = await fetchAdminProductBySlug(slug);
  return product ? mapAdminProductToCatalogProduct(product) : null;
}
