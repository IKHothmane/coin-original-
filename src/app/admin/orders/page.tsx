"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useOrders, updateOrderStatus, refreshOrders } from "@/lib/orders/store";
import type { Order, OrderStatus } from "@/lib/orders/types";

const statusOptions: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "pending", label: "PENDING" },
  { value: "shipped", label: "SHIPPED" },
  { value: "delivered", label: "DELIVERED" },
  { value: "cancelled", label: "CANCELLED" },
];

function getStatusStyle(status: OrderStatus) {
  if (status === "pending") {
    return { label: "PENDING", badgeClass: "bg-[#ffba20] text-[#412d00]", icon: ShoppingCart };
  }

  if (status === "shipped") {
    return { label: "SHIPPED", badgeClass: "bg-[#3b82f6] text-white", icon: Truck };
  }

  if (status === "delivered") {
    return { label: "DELIVERED", badgeClass: "bg-[#16a34a] text-white", icon: Package };
  }

  return { label: "CANCELLED", badgeClass: "bg-[#ef4444] text-white", icon: ShoppingCart };
}

function getPaymentLabel() {
  return { label: "CASH ON DELIVERY", icon: ShoppingCart };
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "A L'INSTANT";
  if (diffMins < 60) return `${diffMins} MIN AGO`;
  if (diffHours < 24) return `${diffHours} HOUR${diffHours > 1 ? "S" : ""} AGO`;
  if (diffDays === 1) return "YESTERDAY";
  return `${diffDays} DAYS AGO`;
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap border px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all ${
        active
          ? "border-[#ffb59e] bg-[#ffb59e] text-[#5e1700]"
          : "border-[#353534] bg-[#201f1f] text-[#e6beb2] hover:border-[#ff571a] hover:text-[#ffb59e]"
      }`}
    >
      {label}
    </button>
  );
}

function OrderCard({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  const status = getStatusStyle(order.status);
  const payment = getPaymentLabel();
  const StatusIcon = status.icon;
  const PaymentIcon = payment.icon;

  return (
    <article className="relative overflow-hidden border border-[#353534] bg-[#1c1b1b] p-4 transition-all active:scale-[0.98] hover:border-[#ffb59e]">
      <div
        className={`absolute right-0 top-0 flex items-center gap-1 px-3 py-1 font-mono text-[10px] font-bold uppercase ${status.badgeClass}`}
      >
        <StatusIcon size={14} />
        {status.label}
      </div>

      <div className="flex items-start justify-between gap-4 pt-6">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#e6beb2]">{order.id}</p>
          <h3 className="mt-1 font-[var(--font-display)] text-2xl uppercase leading-none text-[#ffb59e]">
            {order.customer.fullName}
          </h3>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#e6beb2]">
            {order.customer.city}
          </p>
        </div>

        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#e6beb2]">Total</p>
          <p className="font-[var(--font-display)] text-2xl text-[#e5e2e1]">
            {order.total.toLocaleString("fr-FR")} MAD
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#353534] pt-3">
        <div className="flex items-center gap-2 text-[#e6beb2]">
          <PaymentIcon size={16} className="text-[#ff571a]" />
          <span className="font-mono text-[10px] uppercase tracking-widest">{payment.label}</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#e6beb2]">
          {formatRelativeTime(order.createdAt)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["pending", "shipped", "delivered", "cancelled"] as OrderStatus[]).map((nextStatus) => (
          <button
            key={nextStatus}
            type="button"
            onClick={() => onStatusChange(order.id, nextStatus)}
            disabled={order.status === nextStatus}
            className={`border px-3 py-1 font-mono text-[10px] uppercase transition-colors ${
              order.status === nextStatus
                ? "border-[#ffb59e] bg-[#ffb59e] text-[#5e1700]"
                : "border-[#353534] text-[#e6beb2] hover:border-[#ff571a] hover:text-[#ffb59e]"
            }`}
          >
            {nextStatus}
          </button>
        ))}
      </div>
    </article>
  );
}

export default function AdminOrdersPage() {
  const orders = useOrders();
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesFilter = activeFilter === "all" ? true : order.status === activeFilter;
      const matchesQuery = query
        ? [order.id, order.customer.fullName, order.customer.city, String(order.total)].some((value) =>
            value.toLowerCase().includes(query),
          )
        : true;

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, searchQuery, orders]);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    await updateOrderStatus(id, status);
  };

  const pendingCount = orders.filter((order) => order.status === "pending").length;
  const shippedCount = orders.filter((order) => order.status === "shipped").length;
  const deliveredCount = orders.filter((order) => order.status === "delivered").length;

  return (
    <AdminShell>
      <header className="sticky top-0 z-30 -mx-4 hidden h-20 items-center justify-between border-b-2 border-[#353534] bg-[#131313] px-10 lg:mx-0 lg:flex">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#ffb59e]">Live Feed</p>
          <h1 className="font-[var(--font-display)] text-3xl uppercase tracking-tight text-[#e5e2e1]">
            Orders
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e6beb2]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="RECHERCHER UNE COMMANDE..."
              className="w-72 border border-[#353534] bg-[#201f1f] py-3 pl-10 pr-4 font-mono text-[10px] uppercase tracking-widest text-[#e5e2e1] outline-none placeholder:text-[#6b625f] focus:border-[#ff571a]"
            />
          </div>
          <button type="button" className="p-2 text-[#e5e2e1] transition-colors hover:text-[#ffb59e]">
            <Bell size={20} />
          </button>
          <button type="button" className="p-2 text-[#e5e2e1] transition-colors hover:text-[#ffb59e]">
            <User size={20} />
          </button>
        </div>
      </header>

      <div className="py-6 lg:py-10">
        <div className="mb-8 flex flex-col gap-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#ffb59e]">
                Live Feed
              </p>
              <h2 className="mt-1 font-[var(--font-display)] text-4xl uppercase leading-none text-[#e5e2e1] sm:text-5xl lg:hidden">
                Orders
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="border border-[#353534] bg-[#1c1b1b] p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#e6beb2]">Total</p>
              <p className="mt-3 font-[var(--font-display)] text-4xl text-[#e5e2e1]">{orders.length}</p>
            </div>
            <div className="border border-[#353534] bg-[#1c1b1b] p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#ffba20]">Pending</p>
              <p className="mt-3 font-[var(--font-display)] text-4xl text-[#e5e2e1]">{pendingCount}</p>
            </div>
            <div className="border border-[#353534] bg-[#1c1b1b] p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#60a5fa]">Shipped</p>
              <p className="mt-3 font-[var(--font-display)] text-4xl text-[#e5e2e1]">{shippedCount}</p>
            </div>
            <div className="border border-[#353534] bg-[#1c1b1b] p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#4ade80]">Delivered</p>
              <p className="mt-3 font-[var(--font-display)] text-4xl text-[#e5e2e1]">{deliveredCount}</p>
            </div>
          </div>

          <div className="lg:hidden">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e6beb2]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="RECHERCHER UNE COMMANDE..."
                className="w-full border border-[#353534] bg-[#201f1f] py-3 pl-10 pr-4 font-mono text-[10px] uppercase tracking-widest text-[#e5e2e1] outline-none placeholder:text-[#6b625f] focus:border-[#ff571a]"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {statusOptions.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                active={activeFilter === option.value}
                onClick={() => setActiveFilter(option.value)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
          ))}

          {filteredOrders.length === 0 ? (
            <div className="border border-dashed border-[#353534] bg-[#1c1b1b] px-4 py-10 text-center">
              <p className="font-[var(--font-display)] text-3xl uppercase text-[#e5e2e1]">
                Aucun resultat
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#e6beb2]">
                Essaie un autre filtre ou une autre recherche
              </p>
            </div>
          ) : null}
        </div>

        <footer className="mt-12 border-t-2 border-[#353534] pb-4 pt-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Truck size={16} className="text-[#ff571a]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#e5e2e1]">
              Proudly Moroccan Origin
            </span>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#e6beb2]">
            © 2024 Coin Original Clothing. All Rights Reserved.
          </p>
        </footer>
      </div>

      <button
        type="button"
        onClick={() => void refreshOrders()}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center bg-[#ffb59e] text-[#5e1700] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform active:scale-90 lg:bottom-6 lg:right-6"
        aria-label="Rafraichir les commandes"
      >
        <Plus size={22} />
      </button>
    </AdminShell>
  );
}
