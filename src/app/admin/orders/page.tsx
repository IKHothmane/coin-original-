"use client";

import { useMemo, useState } from "react";
import {
  Package,
  RefreshCw,
  Search,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminMetricCard, AdminPageIntro } from "@/components/admin/admin-ui";
import { useOrders, updateOrderStatus, refreshOrders } from "@/lib/orders/store";
import type { Order, OrderStatus } from "@/lib/orders/types";

const statusOptions: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Tout" },
  { value: "pending", label: "En attente" },
  { value: "shipped", label: "Expediee" },
  { value: "delivered", label: "Livree" },
  { value: "cancelled", label: "Annulee" },
];

function getStatusStyle(status: OrderStatus) {
  if (status === "pending") {
    return { label: "En attente", badgeClass: "bg-[#ffba20] text-[#412d00]", icon: ShoppingCart };
  }

  if (status === "shipped") {
    return { label: "Expediee", badgeClass: "bg-[#3b82f6] text-white", icon: Truck };
  }

  if (status === "delivered") {
    return { label: "Livree", badgeClass: "bg-[#16a34a] text-white", icon: Package };
  }

  return { label: "Annulee", badgeClass: "bg-[#ef4444] text-white", icon: ShoppingCart };
}

function getPaymentLabel() {
  return { label: "Paiement a la livraison", icon: ShoppingCart };
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "A l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  if (diffDays === 1) return "Hier";
  return `Il y a ${diffDays} j`;
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
          : "border-[#2f2b29] bg-[#161514] text-[#d2bbb4] hover:border-[#ff571a] hover:text-[#ffb59e]"
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
    <article className="relative overflow-hidden border border-[#2f2b29] bg-[#141313] p-4 transition-all active:scale-[0.98] hover:border-[#ffb59e] sm:p-5">
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

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#2f2b29] pt-3">
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
                : "border-[#2f2b29] text-[#e6beb2] hover:border-[#ff571a] hover:text-[#ffb59e]"
            }`}
          >
            {getStatusStyle(nextStatus).label}
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
    <AdminShell pageTitle="Commandes" pageSubtitle="Operations / Flux client">
      <div className="space-y-6 py-6 lg:space-y-8 lg:py-10">
        <AdminPageIntro
          eyebrow="Live feed"
          title="Gestion des commandes"
          description="Tri, recherche et mise a jour du statut commandes dans une interface plus compacte et plus haut de gamme."
          badge={`${orders.length} commandes`}
        />

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <AdminMetricCard label="Total" value={String(orders.length)} detail="Flux global" icon={ShoppingCart} accent="sand" />
          <AdminMetricCard label="En attente" value={String(pendingCount)} detail="A preparer" icon={ShoppingCart} accent="gold" />
          <AdminMetricCard label="Expediees" value={String(shippedCount)} detail="En livraison" icon={Truck} accent="orange" />
          <AdminMetricCard label="Livrees" value={String(deliveredCount)} detail="Encaissement valide" icon={Package} accent="sand" />
        </div>

        <section className="border border-[#2f2b29] bg-[#141313]">
          <div className="flex flex-col gap-4 border-b border-[#2f2b29] px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ffb59e]">
                  Filtrage
                </p>
                <h2 className="mt-2 font-[var(--font-display)] text-3xl uppercase text-[#fff4ef]">
                  Commandes client
                </h2>
              </div>
              <div className="relative w-full xl:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e6beb2]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="RECHERCHER UNE COMMANDE..."
                  className="w-full border border-[#2f2b29] bg-[#161514] py-3 pl-10 pr-4 font-mono text-[10px] uppercase tracking-widest text-[#e5e2e1] outline-none placeholder:text-[#6b625f] focus:border-[#ff571a]"
                />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
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

          <div className="flex flex-col gap-4 p-5 sm:p-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
            ))}

            {filteredOrders.length === 0 ? (
              <div className="border border-dashed border-[#353534] bg-[#1a1918] px-4 py-10 text-center">
                <p className="font-[var(--font-display)] text-3xl uppercase text-[#e5e2e1]">
                  Aucun resultat
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#e6beb2]">
                  Essaie un autre filtre ou une autre recherche
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <button
        type="button"
        onClick={() => void refreshOrders()}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center border border-[#ff8b63] bg-[linear-gradient(135deg,#ffb59e_0%,#ff6a33_100%)] text-[#5e1700] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform active:scale-90 lg:bottom-6 lg:right-6"
        aria-label="Rafraichir les commandes"
      >
        <RefreshCw size={20} />
      </button>
    </AdminShell>
  );
}
