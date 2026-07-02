"use client";

import { useSyncExternalStore } from "react";
import type { Order, OrderStatus } from "./types";
import { getOrderRepository } from "./repository";

type OrdersStore = {
  orders: Order[];
  listeners: Set<() => void>;
  loaded: boolean;
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => Order[];
  load: () => Promise<void>;
  create: (input: { customer: Order["customer"]; items: Order["items"]; total: number }) => Promise<{ data: Order | null; error: string | null }>;
  updateStatus: (id: string, status: OrderStatus) => Promise<void>;
};

function createOrdersStore(): OrdersStore {
  const store: OrdersStore = {
    orders: [],
    listeners: new Set(),
    loaded: false,
    subscribe(callback) {
      store.listeners.add(callback);
      if (!store.loaded) {
        void store.load();
      }
      return () => {
        store.listeners.delete(callback);
      };
    },
    getSnapshot() {
      return store.orders;
    },
    async load() {
      const repository = getOrderRepository();
      store.orders = await repository.fetchAll();
      store.loaded = true;
      store.listeners.forEach((callback) => callback());
    },
    async create(input) {
      const repository = getOrderRepository();
      const result = await repository.create(input);
      if (result.data) {
        store.orders = [result.data, ...store.orders];
        store.listeners.forEach((callback) => callback());
      }
      return result;
    },
    async updateStatus(id, status) {
      const repository = getOrderRepository();
      const result = await repository.updateStatus(id, status);
      if (!result.error) {
        store.orders = store.orders.map((order) =>
          order.id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order,
        );
        store.listeners.forEach((callback) => callback());
      }
    },
  };

  return store;
}

const ordersStore = createOrdersStore();

export function useOrders() {
  return useSyncExternalStore(ordersStore.subscribe, ordersStore.getSnapshot, () => []);
}

export function createOrder(input: { customer: Order["customer"]; items: Order["items"]; total: number }) {
  return ordersStore.create(input);
}


export function updateOrderStatus(id: string, status: OrderStatus) {
  return ordersStore.updateStatus(id, status);
}

export function refreshOrders() {
  return ordersStore.load();
}
