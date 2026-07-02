import { collection, addDoc, getDocs, orderBy, query, doc, updateDoc, Timestamp } from "firebase/firestore";
import { firebaseDb, isFirebaseConfigured } from "@/lib/firebase/client";
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

function createFirebaseOrderRepository(): OrderRepository {
  const ordersCollection = collection(firebaseDb, "orders");

  return {
    create: async (input) => {
      try {
        const order = createOrderFromInput(input);
        const docRef = await addDoc(ordersCollection, {
          ...order,
          createdAt: Timestamp.fromDate(new Date(order.createdAt)),
          updatedAt: Timestamp.fromDate(new Date(order.updatedAt)),
        });

        return { data: { ...order, id: docRef.id }, error: null };
      } catch (error) {
        return {
          data: null,
          error: error instanceof Error ? error.message : "Impossible de creer la commande.",
        };
      }
    },
    fetchAll: async () => {
      try {
        const snapshot = await getDocs(query(ordersCollection, orderBy("createdAt", "desc")));
        return snapshot.docs.map((documentSnapshot) => {
          const data = documentSnapshot.data();
          return {
            id: documentSnapshot.id,
            customer: data.customer as Order["customer"],
            items: data.items as Order["items"],
            total: data.total as number,
            status: data.status as OrderStatus,
            paymentMethod: data.paymentMethod as Order["paymentMethod"],
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate().toISOString()
                : String(data.createdAt),
            updatedAt:
              data.updatedAt instanceof Timestamp
                ? data.updatedAt.toDate().toISOString()
                : String(data.updatedAt),
          };
        });
      } catch (error) {
        console.error("Firebase fetch orders failed:", error);
        return [];
      }
    },
    updateStatus: async (id, status) => {
      try {
        await updateDoc(doc(firebaseDb, "orders", id), {
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
