"use client";

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

export type AdminNavItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
};

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Tableau de bord", shortLabel: "Accueil", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produits", shortLabel: "Produits", icon: Package },
  { href: "/admin/orders", label: "Commandes", shortLabel: "Commandes", icon: ShoppingCart },
  { href: "/admin/settings", label: "Reglages", shortLabel: "Reglages", icon: Settings },
];

export function AdminNavLink({
  item,
  active,
  onClick,
}: {
  item: AdminNavItem;
  active: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`group relative flex items-center gap-4 overflow-hidden border-l-2 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.22em] transition-all ${
        active
          ? "border-[#ff6a33] bg-[linear-gradient(90deg,rgba(255,106,51,0.22),rgba(255,106,51,0.04))] font-bold text-[#fff7f2]"
          : "border-transparent text-[#cdb8b2] hover:border-[#6c4b42] hover:bg-[#141313] hover:text-[#fff7f2]"
      }`}
    >
      <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02),transparent)] opacity-0 transition-opacity group-hover:opacity-100" />
      <Icon
        size={18}
        className={`relative z-10 ${
          active ? "text-[#ff6a33]" : "text-[#9d847d] transition-colors group-hover:text-[#ffb59e]"
        }`}
      />
      <span className="relative z-10 flex-1">{item.label}</span>
      <span
        className={`relative z-10 h-2 w-2 rounded-full ${
          active ? "bg-[#ff6a33]" : "bg-[#3a3130] transition-colors group-hover:bg-[#ffb59e]"
        }`}
      />
    </Link>
  );
}

export function AdminMobileDockLink({
  item,
  active,
}: {
  item: AdminNavItem;
  active: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`flex flex-col items-center gap-1 ${
        active ? "text-[#ff6a33]" : "text-[#d7c4be]"
      }`}
    >
      <Icon size={20} />
      <span className="font-mono text-[9px] uppercase tracking-[0.18em]">{item.shortLabel}</span>
    </Link>
  );
}
