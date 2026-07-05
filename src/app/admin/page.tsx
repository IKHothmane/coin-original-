"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Package2, ShoppingCart, TrendingUp, Truck, Users } from "lucide-react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminMetricCard, AdminPageIntro, AdminPanel } from "@/components/admin/admin-ui";

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
    <AdminShell pageTitle="Tableau de bord" pageSubtitle="Pilotage / Vue d&apos;ensemble">
      <div className="space-y-6 py-6 lg:space-y-8 lg:py-10">
        <AdminPageIntro
          eyebrow="Pilotage quotidien"
          title="Vue globale de la boutique"
          description="Suivi des ventes, du flux commandes et des signaux catalogue dans une interface admin plus nette, plus dense et plus premium."
          badge="COD Maroc actif"
          action={
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-3 border border-[#ff8f68] bg-[linear-gradient(135deg,#ffb59e_0%,#ff6a33_100%)] px-5 py-4 font-[var(--font-display)] text-lg uppercase text-[#381103] transition-transform hover:-translate-y-0.5"
            >
              Ouvrir les commandes
              <ArrowUpRight size={18} />
            </Link>
          }
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminMetricCard
            label={stats[0].title}
            value={stats[0].value}
            detail={stats[0].change}
            icon={TrendingUp}
            accent="orange"
          />
          <AdminMetricCard
            label={stats[1].title}
            value={stats[1].value}
            detail="Trafic commandes en hausse"
            icon={ShoppingCart}
            accent="sand"
          />
          <AdminMetricCard
            label={stats[2].title}
            value={stats[2].value}
            detail="2 references a surveiller"
            icon={Package2}
            accent="gold"
          />
          <AdminMetricCard
            label={stats[3].title}
            value={stats[3].value}
            detail="Acquisition locale acceleree"
            icon={Users}
            accent="sand"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
          <AdminPanel
            eyebrow="Performance"
            title="Ventes 30 jours"
            action={
              <span className="border border-[#5a2c22] bg-[#261716] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#ffb59e]">
                +14.2%
              </span>
            }
          >
            <div className="space-y-8">
              <div className="flex flex-wrap items-baseline gap-3">
                <h3 className="font-[var(--font-display)] text-5xl text-[#f5f1ef] sm:text-6xl lg:text-7xl">
                  128,450
                </h3>
                <span className="font-[var(--font-display)] text-2xl text-[#ffb59e] sm:text-4xl">
                  MAD
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {revenueBars.map((bar) => (
                  <div key={bar.offset} className="flex h-44 items-end bg-[#1d1b1a] p-2">
                    <div className={`w-full ${bar.height} ${bar.tone}`} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="border border-[#2f2b29] bg-[#191817] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a68d86]">Conversion</p>
                  <p className="mt-3 font-[var(--font-display)] text-3xl text-[#fff4ef]">4.8%</p>
                </div>
                <div className="border border-[#2f2b29] bg-[#191817] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a68d86]">Panier moyen</p>
                  <p className="mt-3 font-[var(--font-display)] text-3xl text-[#fff4ef]">620</p>
                </div>
                <div className="border border-[#2f2b29] bg-[#191817] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a68d86]">Retours</p>
                  <p className="mt-3 font-[var(--font-display)] text-3xl text-[#fff4ef]">1.2%</p>
                </div>
                <div className="border border-[#2f2b29] bg-[#191817] p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a68d86]">Upsell</p>
                  <p className="mt-3 font-[var(--font-display)] text-3xl text-[#fff4ef]">18%</p>
                </div>
              </div>
            </div>
          </AdminPanel>

          <AdminPanel eyebrow="Operations" title="Signals live">
            <div className="space-y-4">
              <div className="border border-[#2f2b29] bg-[#191817] p-4">
                <div className="flex items-center gap-3">
                  <Truck size={18} className="text-[#ffba20]" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#ffba20]">
                    Paiement a la livraison
                  </p>
                </div>
                <p className="mt-4 font-[var(--font-display)] text-3xl text-[#fff4ef]">Actif</p>
                <p className="mt-2 text-sm text-[#bea8a1]">Couverture prioritaire sur Casablanca, Rabat et Marrakech.</p>
              </div>
              <div className="border border-[#2f2b29] bg-[#191817] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#ffb59e]">
                  Nouveaux clients
                </p>
                <div className="mt-4 flex h-28 items-end gap-2">
                  {customerBars.map((height, index) => (
                    <div
                      key={`${height}-${index}`}
                      className={`w-full ${height} ${
                        index === customerBars.length - 1 ? "bg-[#ffb59e]" : "bg-[#6c5b56]"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-4 font-[var(--font-display)] text-3xl text-[#fff4ef]">324</p>
              </div>
              <div className="border border-[#2f2b29] bg-[#191817] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#a68d86]">Objectif semaine</p>
                <p className="mt-3 font-[var(--font-display)] text-3xl text-[#fff4ef]">72%</p>
                <div className="mt-4 h-2 bg-[#252220]">
                  <div className="h-full w-[72%] bg-[linear-gradient(90deg,#ffb59e_0%,#ff6a33_100%)]" />
                </div>
              </div>
            </div>
          </AdminPanel>
        </div>

        <AdminPanel
          eyebrow="Dernieres activites"
          title="Commandes recentes"
          action={
            <Link
              href="/admin/orders"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ffb59e] transition-colors hover:text-white"
            >
              Voir tout
            </Link>
          }
        >
          <div className="grid gap-4 lg:hidden">
            {recentOrders.map((order) => (
              <article key={order.id} className="border border-[#252322] bg-[#1a1918] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#aa8e86]">{order.id}</p>
                    <p className="mt-2 text-base text-[#f2ece9]">{order.client}</p>
                    <p className="mt-1 text-sm text-[#c9b4ad]">{order.city}</p>
                  </div>
                  <StatusBadge status={order.status} tone={order.statusTone} />
                </div>
                <div className="mt-4 border-t border-[#252322] pt-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#aa8e86]">Montant</p>
                  <p className="mt-1 font-[var(--font-display)] text-2xl text-[#ffb59e]">{order.amount}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-[#2f2b29] font-mono text-[10px] uppercase tracking-[0.22em] text-[#aa8e86]">
                  <th className="py-3">ID</th>
                  <th className="py-3">Client</th>
                  <th className="py-3">Ville</th>
                  <th className="py-3">Statut</th>
                  <th className="py-3 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252322]">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-[#1a1918]">
                    <td className="py-4 font-mono text-sm text-[#f2ece9]">{order.id}</td>
                    <td className="py-4 text-sm text-[#f2ece9]">{order.client}</td>
                    <td className="py-4 text-sm text-[#c9b4ad]">{order.city}</td>
                    <td className="py-4">
                      <StatusBadge status={order.status} tone={order.statusTone} />
                    </td>
                    <td className="py-4 text-right font-[var(--font-display)] text-xl text-[#ffb59e]">
                      {order.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
