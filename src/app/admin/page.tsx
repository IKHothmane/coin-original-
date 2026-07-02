"use client";

import type { LucideIcon } from "lucide-react";
import {
  Package2,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";

type StatCard = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down";
};

type RecentOrder = {
  id: string;
  client: string;
  city: string;
  status: string;
  amount: string;
  statusTone: "neutral" | "success";
};

const stats: StatCard[] = [
  { title: "Ventes Totales", value: "128,450 MAD", change: "+14.2%", icon: TrendingUp, trend: "up" },
  { title: "Commandes", value: "842", change: "+8.1%", icon: ShoppingCart, trend: "up" },
  { title: "Produits Actifs", value: "56", change: "-2", icon: Package2, trend: "down" },
  { title: "Nouveaux Clients", value: "324", change: "+23%", icon: Users, trend: "up" },
];

const recentOrders: RecentOrder[] = [
  { id: "#9821", client: "Amine Belkhayat", city: "Casablanca", status: "EN COURS", amount: "850 MAD", statusTone: "neutral" },
  { id: "#9820", client: "Yasmine Tazi", city: "Marrakech", status: "LIVRE", amount: "1,200 MAD", statusTone: "success" },
];

const revenueBars = [
  { height: "h-3/4", offset: "left-0", tone: "bg-[#ff571a]" },
  { height: "h-1/2", offset: "left-[26%]", tone: "bg-[#ff571a]/60" },
  { height: "h-full", offset: "left-[52%]", tone: "bg-[#ff571a]" },
  { height: "h-2/3", offset: "left-[78%]", tone: "bg-[#ff571a]/80" },
];

const customerBars = ["h-1/4", "h-2/4", "h-1/3", "h-3/4", "h-full"];

function StatusBadge({ status, tone }: { status: string; tone: RecentOrder["statusTone"] }) {
  return (
    <span
      className={`px-2 py-1 ${
        tone === "success" ? "bg-[#e60000] text-white" : "bg-[#2A2A2A] text-[#e5e2e1]"
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminPage() {
  return (
    <AdminShell pageTitle="Tableau De Bord" pageSubtitle="Vue d&apos;ensemble / Statistiques">
      <div className="py-6 lg:py-10">
        <div className="mb-6 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-[var(--font-display)] text-3xl uppercase leading-none md:text-6xl">
              Tableau De Bord
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-1 w-12 bg-[#ff571a]" />
              <p className="font-mono text-[10px] uppercase text-[#e6beb2]">
                Bienvenue Chez Coin Original
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 border border-[#2A2A2A] bg-[#1c1b1b] p-3 md:p-4">
            <Truck size={18} className="text-[#ffba20]" />
            <div>
              <p className="font-mono text-[10px] uppercase">Paiement a la livraison</p>
              <p className="font-mono text-xs font-bold">Actif : Maroc</p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-12 gap-3 md:mb-10 md:gap-4">
          <div className="col-span-12 overflow-hidden border-2 border-[#2A2A2A] bg-[#1c1b1b] p-5 sm:p-6 lg:col-span-8 lg:p-8">
            <div className="relative z-10">
              <div className="mb-10 flex items-start justify-between gap-4 sm:mb-12">
                <p className="font-mono text-[10px] uppercase tracking-tight text-[#ffb59e]">
                  Ventes Totales (30 Jours)
                </p>
                <span className="bg-[#e60000] px-3 py-1 font-mono text-[10px] text-white">
                  +14.2%
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-4">
                <h3 className="font-[var(--font-display)] text-4xl text-[#e5e2e1] sm:text-6xl lg:text-7xl">
                  128,450.00
                </h3>
                <span className="font-[var(--font-display)] text-2xl text-[#ffb59e] sm:text-4xl">
                  MAD
                </span>
              </div>
              <div className="mt-8 flex gap-2">
                <div className="relative h-16 w-full overflow-hidden bg-[#2A2A2A]">
                  {revenueBars.map((bar) => (
                    <div
                      key={bar.offset}
                      className={`absolute bottom-0 ${bar.offset} w-1/4 ${bar.height} ${bar.tone}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-6 flex min-h-[180px] flex-col justify-between border-2 border-[#2A2A2A] bg-[#1c1b1b] p-4 transition-colors hover:bg-[#2A2A2A] sm:p-6 lg:col-span-4 lg:p-8">
            <div>
              <ShoppingCart size={32} className="mb-4 text-[#ff571a]" />
              <p className="font-mono text-[10px] uppercase text-[#e6beb2]">{stats[1].title}</p>
            </div>
            <p className="font-[var(--font-display)] text-4xl text-[#e5e2e1] sm:text-5xl">
              {stats[1].value}
            </p>
          </div>

          <div className="col-span-6 flex min-h-[180px] cursor-pointer flex-col justify-between overflow-hidden border-2 border-[#ff571a] bg-[#ff571a] p-4 text-[#521300] sm:p-6 lg:col-span-4 lg:p-8">
            <div className="transition-transform hover:-translate-y-1">
              <Package2 size={32} className="mb-4 text-[#521300]" />
              <p className="font-mono text-[10px] uppercase text-[#521300]">{stats[2].title}</p>
            </div>
            <div className="flex items-end justify-between gap-4">
              <p className="font-[var(--font-display)] text-4xl sm:text-5xl">{stats[2].value}</p>
              <span className="font-mono text-xs uppercase">{stats[2].change}</span>
            </div>
          </div>

          <div className="col-span-12 flex flex-col justify-between border-2 border-[#2A2A2A] bg-[#1c1b1b] p-5 sm:p-6 lg:col-span-8 lg:flex-row lg:items-center lg:p-8">
            <div className="lg:w-1/2">
              <p className="mb-2 font-mono text-[10px] uppercase text-[#e6beb2]">
                Nouveaux Clients
              </p>
              <h4 className="font-[var(--font-display)] text-3xl uppercase text-[#e5e2e1] sm:text-4xl">
                324 Membres
              </h4>
              <p className="mt-4 max-w-md text-sm text-[#e6beb2] sm:text-base">
                Fidelite locale en hausse a Casablanca et Marrakech.
              </p>
            </div>
            <div className="mt-6 flex h-32 items-end justify-end gap-2 lg:mt-0 lg:w-1/2">
              {customerBars.map((height, index) => (
                <div
                  key={`${height}-${index}`}
                  className={`w-7 sm:w-8 ${height} ${
                    index === customerBars.length - 1 ? "bg-[#ffb59e]" : "bg-[#e6beb2]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-2 border-[#2A2A2A] bg-[#131313] p-4 md:mt-10 md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="font-[var(--font-display)] text-2xl uppercase md:text-3xl">
              Commandes Recentes
            </h3>
            <button className="border-b-2 border-[#ff571a] font-mono text-[10px] uppercase text-[#ff571a] transition-colors hover:text-white">
              Voir Tout
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left font-mono text-xs">
              <thead>
                <tr className="border-b-2 border-[#2A2A2A] uppercase text-[#e6beb2]">
                  <th className="py-3">ID</th>
                  <th className="py-3">Client</th>
                  <th className="py-3">Ville</th>
                  <th className="py-3">Statut</th>
                  <th className="py-3 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-[#1c1b1b]">
                    <td className="py-4 font-bold">{order.id}</td>
                    <td className="py-4">{order.client}</td>
                    <td className="py-4">{order.city}</td>
                    <td className="py-4">
                      <StatusBadge status={order.status} tone={order.statusTone} />
                    </td>
                    <td className="py-4 text-right font-bold text-[#ff571a]">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
