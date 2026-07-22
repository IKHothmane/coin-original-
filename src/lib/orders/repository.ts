import { collection, addDoc, getDocs, orderBy, query, doc, updateDoc, Timestamp } from "firebase/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
import type { Order, OrderInput, OrderStatus } from "./types";

const ORDERS_STORAGE_KEY = "coin-original-orders";

export type OrderRepository = {
  create: (input: OrderInput) => Promise<{ data: Order | null; error: string | null }>;
  fetchAll: () => Promise<Order[]>;
  updateStatus: (id: string, status: OrderStatus) => Promise<{ data: Order | null; error: string | null }>;
};

function generateOrderId() {
  return `#CO-${Math.floor(10000 + Math.random() * 90000)}`;
}

function createOrderFromInput(input: OrderInput): Order {
  const now = new Date().toISOString();
  return {
    id: generateOrderId(),
    customer: input.customer,
    items: input.items,
    total: input.total,
    status: "pending",
    paymentMethod: "cash_on_delivery",
    createdAt: now,
    updatedAt: now,
  };
}

function removeUndefinedFields<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => removeUndefinedFields(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, fieldValue]) => fieldValue !== undefined)
        .map(([fieldKey, fieldValue]) => [fieldKey, removeUndefinedFields(fieldValue)]),
    ) as T;
  }

  return value;
}

function readOrdersFromStorage(): Order[] {
  if (typeof window === "undefined" || !window.localStorage) return [];

  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Order[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore invalid storage data
  }

  return [];
}

function writeOrdersToStorage(orders: Order[]) {
  if (typeof window === "undefined" || !window.localStorage) return;

  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // Ignore storage errors
  }
}

function createLocalOrderRepository(): OrderRepository {
  return {
    create: async (input) => {
      const order = createOrderFromInput(input);
      const orders = readOrdersFromStorage();
      orders.unshift(order);
      writeOrdersToStorage(orders);
      return { data: order, error: null };
    },
    fetchAll: async () => readOrdersFromStorage(),
    updateStatus: async (id, status) => {
      const orders = readOrdersFromStorage();
      const index = orders.findIndex((order) => order.id === id);
      if (index === -1) {
        return { data: null, error: "Commande introuvable." };
      }

      orders[index] = { ...orders[index], status, updatedAt: new Date().toISOString() };
      writeOrdersToStorage(orders);
      return { data: orders[index], error: null };
    },
  };
}

function getOrdersCollection() {
  return collection(getFirebaseDb(), "orders");
}

function normalizeDate(value: unknown) {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  if (typeof value === "number") return new Date(value).toISOString();
  if (value && typeof value === "object") {
    try {
      const maybeDate = (value as { toDate?: () => Date }).toDate?.();
      if (maybeDate) return maybeDate.toISOString();
    } catch {}
  }
  return new Date().toISOString();
}

function normalizeCustomer(data: Record<string, unknown>): Order["customer"] {
  const rawCustomer = data.customer;
  if (rawCustomer && typeof rawCustomer === "object") {
    const c = rawCustomer as Record<string, unknown>;
    return {
      fullName: String(c.fullName ?? ""),
      email: c.email ? String(c.email) : undefined,
      phone: String(c.phone ?? ""),
      city: String(c.city ?? ""),
      address: String(c.address ?? ""),
      notes: c.notes ? String(c.notes) : undefined,
    };
  }

  const rawAddress = data.address;
  const address = rawAddress && typeof rawAddress === "object" ? (rawAddress as Record<string, unknown>) : {};

  return {
    fullName: String(data.userName ?? ""),
    email: data.userEmail ? String(data.userEmail) : undefined,
    phone: String(address.phone ?? ""),
    city: String(address.city ?? ""),
    address: String(address.street ?? address.address ?? ""),
  };
}

function normalizeOrderItems(data: Record<string, unknown>): Order["items"] {
  const rawItems = data.items;
  if (!Array.isArray(rawItems)) return [];

  return rawItems.map((rawItem, index) => {
    const item = rawItem && typeof rawItem === "object" ? (rawItem as Record<string, unknown>) : {};
    const rawProduct = item.product;
    const product = rawProduct && typeof rawProduct === "object" ? (rawProduct as Record<string, unknown>) : {};
    const productImages = Array.isArray(product.images) ? (product.images as unknown[]) : [];
    const productFirstImage =
      productImages.length > 0 && typeof productImages[0] === "string" ? (productImages[0] as string) : "";
    const variants = Array.isArray(product.variants) ? (product.variants as unknown[]) : [];
    const firstVariant = variants.length > 0 ? String(variants[0] ?? "") : "";

    const quantityRaw = item.quantity ?? 1;
    const quantity = typeof quantityRaw === "number" ? quantityRaw : Number(quantityRaw) || 1;

    const priceRaw = product.priceValue ?? product.price ?? item.price ?? 0;
    const price = typeof priceRaw === "number" ? priceRaw : Number(priceRaw) || 0;

    const slug = String(product.slug ?? item.slug ?? item.productId ?? item.id ?? "");
    const id = String(item.id ?? item.productId ?? (slug || `item-${index}`));

    return {
      id,
      slug: slug || id,
      name: String(product.name ?? item.name ?? ""),
      brand: String(product.brand ?? item.brand ?? ""),
      size: String(item.size ?? firstVariant ?? ""),
      price,
      quantity,
      image: String(product.image ?? item.image ?? productFirstImage ?? ""),
    };
  });
}

function normalizeOrderTotal(data: Record<string, unknown>) {
  const raw = data.total ?? data.totalAmount ?? 0;
  return typeof raw === "number" ? raw : Number(raw) || 0;
}

function createFirebaseOrderRepository(): OrderRepository {
  return {
    create: async (input) => {
      try {
        const order = createOrderFromInput(input);
        // #region debug-point B:firebase-order-create-start
        fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"checkout-order-error",runId:"post-fix",hypothesisId:"B",location:"src/lib/orders/repository.ts:create:start",msg:"[DEBUG] firebase order create start",data:{projectConfigured:isFirebaseConfigured(),customerPhone:input.customer.phone,city:input.customer.city,itemCount:input.items.length,total:input.total},ts:Date.now()})}).catch(()=>{});
        // #endregion
        const docRef = await addDoc(
          getOrdersCollection(),
          removeUndefinedFields({
            ...order,
            createdAt: Timestamp.fromDate(new Date(order.createdAt)),
            updatedAt: Timestamp.fromDate(new Date(order.updatedAt)),
          }),
        );
        // #region debug-point B:firebase-order-create-success
        fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"checkout-order-error",runId:"post-fix",hypothesisId:"B",location:"src/lib/orders/repository.ts:create:success",msg:"[DEBUG] firebase order create success",data:{docId:docRef.id,generatedOrderId:order.id},ts:Date.now()})}).catch(()=>{});
        // #endregion

        return { data: { ...order, id: docRef.id }, error: null };
      } catch (error) {
        // #region debug-point B:firebase-order-create-error
        fetch("http://127.0.0.1:7777/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:"checkout-order-error",runId:"post-fix",hypothesisId:"B",location:"src/lib/orders/repository.ts:create:error",msg:"[DEBUG] firebase order create error",data:{errorMessage:error instanceof Error ? error.message : "unknown",errorName:error instanceof Error ? error.name : typeof error},ts:Date.now()})}).catch(()=>{});
        // #endregion
        return {
          data: null,
          error: error instanceof Error ? error.message : "Impossible de creer la commande.",
        };
      }
    },
    fetchAll: async () => {
      try {
        const snapshot = await getDocs(query(getOrdersCollection(), orderBy("createdAt", "desc")));
        return snapshot.docs.map((documentSnapshot) => {
          const data = documentSnapshot.data() as Record<string, unknown>;
          return {
            id: documentSnapshot.id,
            customer: normalizeCustomer(data),
            items: normalizeOrderItems(data),
            total: normalizeOrderTotal(data),
            status: (data.status as OrderStatus) ?? "pending",
            paymentMethod: "cash_on_delivery",
            createdAt: normalizeDate(data.createdAt),
            updatedAt: normalizeDate(data.updatedAt),
          };
        });
      } catch (error) {
        console.error("Firebase fetch orders failed:", error);
        return [];
      }
    },
    updateStatus: async (id, status) => {
      try {
        await updateDoc(doc(getFirebaseDb(), "orders", id), {
          status,
          updatedAt: Timestamp.now(),
        });
        return { data: null, error: null };
      } catch (error) {
        return {
          data: null,
          error: error instanceof Error ? error.message : "Impossible de mettre a jour la commande.",
        };
      }
    },
  };
}

export function getOrderRepository(): OrderRepository {
  if (isFirebaseConfigured()) {
    return createFirebaseOrderRepository();
  }

  return createLocalOrderRepository();
}
