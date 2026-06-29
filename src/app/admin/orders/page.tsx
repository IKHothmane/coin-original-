"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CreditCard,
  Filter,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  User,
  X,
} from "lucide-react";
import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
};

type OrderStatus = "pending" | "shipped" | "delivered";
type PaymentMethod = "cash_on_delivery" | "prepaid";
type FilterValue = "all" | OrderStatus;

type OrderRecord = {
  id: string;
  customer: string;
  total: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  city: string;
};

const desktopNavItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, active: false },
  { href: "/admin/products", label: "Products", icon: Package, active: false },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, active: true },
  { href: "/admin/settings", label: "Settings", icon: Settings, active: false },
];

const mobileDockItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, active: false },
  { href: "/admin/products", label: "Produits", icon: Package, active: false },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingCart, active: true },
  { href: "/admin/settings", label: "Reglages", icon: Settings, active: false },
];

const orders: OrderRecord[] = [
  {
    id: "#CO-49210",
    customer: "ANAS EL FASSI",
    total: "1,250 MAD",
    status: "pending",
    paymentMethod: "cash_on_delivery",
    createdAt: "2 MIN AGO",
    city: "Casablanca",
  },
  {
    id: "#CO-49208",
    customer: "YASMINE BENNANI",
    total: "890 MAD",
    status: "shipped",
    paymentMethod: "cash_on_delivery",
    createdAt: "1 HOUR AGO",
    city: "Rabat",
  },
  {
    id: "#CO-49205",
    customer: "OMAR ZOUHRI",
    total: "2,400 MAD",
    status: "delivered",
    paymentMethod: "prepaid",
    createdAt: "4 HOURS AGO",
    city: "Marrakech",
  },
  {
    id: "#CO-49201",
    customer: "LAYLA CHRAIBI",
    total: "550 MAD",
    status: "pending",
    paymentMethod: "cash_on_delivery",
    createdAt: "YESTERDAY",
    city: "Agadir",
  },
  {
    id: "#CO-49199",
    customer: "DRISS MEKKI",
    total: "3,100 MAD",
    status: "shipped",
    paymentMethod: "cash_on_delivery",
    createdAt: "YESTERDAY",
    city: "Tanger",
  },
  {
    id: "#CO-49195",
    customer: "SALMA ALAOUI",
    total: "1,780 MAD",
    status: "delivered",
    paymentMethod: "prepaid",
    createdAt: "2 DAYS AGO",
    city: "Fes",
  },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: NavItem & { onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-4 font-mono text-xs uppercase transition-all ${
        active ? "bg-[#ffb59e] font-bold text-[#5e1700]" : "text-[#e5e2e1] hover:bg-[#353534]"
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}

function getStatusStyle(status: OrderStatus) {
  if (status === "pending") {
    return {
      label: "PENDING",
      badgeClass: "bg-[#ffba20] text-[#412d00]",
      icon: ShoppingCart,
    };
  }

  if (status === "shipped") {
    return {
      label: "SHIPPED",
      badgeClass: "bg-[#3b82f6] text-white",
      icon: Truck,
    };
  }

  return {
    label: "DELIVERED",
    badgeClass: "bg-[#16a34a] text-white",
    icon: Package,
  };
}

function getPaymentLabel(method: PaymentMethod) {
  if (method === "prepaid") {
    return {
      label: "PREPAID",
      icon: CreditCard,
    };
  }

  return {
    label: "CASH ON DELIVERY",
    icon: ShoppingCart,
  };
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

function OrderCard({ order }: { order: OrderRecord }) {
  const status = getStatusStyle(order.status);
  const payment = getPaymentLabel(order.paymentMethod);
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
            {order.customer}
          </h3>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#e6beb2]">
            {order.city}
          </p>
        </div>

        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#e6beb2]">Total</p>
          <p className="font-[var(--font-display)] text-2xl text-[#e5e2e1]">{order.total}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#353534] pt-3">
        <div className="flex items-center gap-2 text-[#e6beb2]">
          <PaymentIcon size={16} className="text-[#ff571a]" />
          <span className="font-mono text-[10px] uppercase tracking-widest">{payment.label}</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#e6beb2]">
          {order.createdAt}
        </span>
      </div>
    </article>
  );
}

export default function AdminOrdersPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesFilter = activeFilter === "all" ? true : order.status === activeFilter;
      const matchesQuery = query
        ? [order.id, order.customer, order.city, order.total].some((value) =>
            value.toLowerCase().includes(query),
          )
        : true;

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, searchQuery]);

  const newTodayCount = orders.filter((order) => order.createdAt.includes("AGO")).length;
  const pendingCount = orders.filter((order) => order.status === "pending").length;
  const shippedCount = orders.filter((order) => order.status === "shipped").length;
  const deliveredCount = orders.filter((order) => order.status === "delivered").length;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#131313] font-[var(--font-body)] text-[#e5e2e1]">
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col gap-4 border-r-2 border-[#353534] bg-[#201f1f] py-8 lg:flex">
        <div className="mb-8 px-6">
          <h1 className="font-[var(--font-display)] text-3xl leading-none text-[#ffb59e]">
            ADMIN PANEL
          </h1>
          <p className="font-mono text-[10px] tracking-widest text-[#e6beb2] opacity-60">
            Management Suite
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {desktopNavItems.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </nav>

        <div className="mt-auto border-t border-[#353534] px-6 pt-4">
          <Link
            href="/admin/products/new"
            className="block w-full bg-[#ff571a] px-2 py-4 text-center font-[var(--font-display)] text-lg text-[#521300] transition-all hover:brightness-110 active:scale-95"
          >
            NEW PRODUCT
          </Link>
          <Link
            href="/logout"
            className="mt-2 flex items-center gap-4 py-6 font-mono text-xs uppercase text-[#e5e2e1] transition-colors hover:text-[#ffb59e]"
          >
            <LogOut size={18} />
            Logout
          </Link>
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b-2 border-[#353534] bg-[#131313] px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Ouvrir le menu admin">
            <Menu size={24} className="text-[#ffb59e]" />
          </button>
          <div className="font-[var(--font-display)] text-xl uppercase tracking-tight text-[#ffb59e]">
            Coin Original
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Search size={18} className="text-[#e6beb2]" />
          <Filter size={18} className="text-[#e6beb2]" />
          <div className="flex h-8 w-8 items-center justify-center border border-[#ffb59e] bg-[#2a2a2a] font-mono text-[10px] uppercase text-[#ffb59e]">
            CO
          </div>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Fermer le menu admin"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 border-r-2 border-[#353534] bg-[#201f1f] py-6">
            <div className="mb-6 flex items-center justify-between px-6">
              <div>
                <h2 className="font-[var(--font-display)] text-2xl text-[#ffb59e]">ADMIN PANEL</h2>
                <p className="font-mono text-[10px] tracking-widest text-[#e6beb2] opacity-60">
                  Management Suite
                </p>
              </div>
              <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Fermer le drawer">
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-1">
              {desktopNavItems.map((item) => (
                <NavLink key={item.label} {...item} onClick={() => setMobileMenuOpen(false)} />
              ))}
            </nav>
          </div>
        </div>
      ) : null}

      <main className="px-4 pb-28 pt-20 lg:ml-64 lg:px-6 lg:pb-36 lg:pt-0">
        <header className="sticky top-0 z-30 hidden h-20 items-center justify-between border-b-2 border-[#353534] bg-[#131313] px-10 lg:flex">
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
              <div className="border border-[#5c4037] bg-[#201f1f] px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-[#ffba20]">
                {newTodayCount} New Today
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
                <p className="mt-3 font-[var(--font-display)] text-4xl text-[#e5e2e1]">
                  {deliveredCount}
                </p>
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
              <FilterChip label="ALL" active={activeFilter === "all"} onClick={() => setActiveFilter("all")} />
              <FilterChip
                label="PENDING"
                active={activeFilter === "pending"}
                onClick={() => setActiveFilter("pending")}
              />
              <FilterChip
                label="SHIPPED"
                active={activeFilter === "shipped"}
                onClick={() => setActiveFilter("shipped")}
              />
              <FilterChip
                label="DELIVERED"
                active={activeFilter === "delivered"}
                onClick={() => setActiveFilter("delivered")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
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
      </main>

      <button
        type="button"
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center bg-[#ffb59e] text-[#5e1700] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform active:scale-90 lg:bottom-6 lg:right-6"
        aria-label="Ajouter une commande"
      >
        <Plus size={22} />
      </button>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t-2 border-[#353534] bg-[#131313] lg:hidden">
        {mobileDockItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 ${
                item.active ? "text-[#ffb59e]" : "text-[#e5e2e1]"
              }`}
            >
              <Icon size={20} />
              <span className="font-mono text-[9px] uppercase">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
