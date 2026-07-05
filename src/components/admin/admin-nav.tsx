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
      className={`group flex items-center gap-4 border-l-2 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.22em] transition-all ${
        active
          ? "border-[#ffb59e] bg-[linear-gradient(90deg,rgba(255,181,158,0.2),rgba(255,181,158,0.04))] font-bold text-[#fff3ee]"
          : "border-transparent text-[#cdb8b2] hover:border-[#6c4b42] hover:bg-[#181717] hover:text-[#fff3ee]"
      }`}
    >
      <Icon size={18} className={active ? "text-[#ffb59e]" : "text-[#9d847d] transition-colors group-hover:text-[#ffb59e]"} />
      {item.label}
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
        active ? "text-[#ffb59e]" : "text-[#d7c4be]"
      }`}
    >
      <Icon size={20} />
      <span className="font-mono text-[9px] uppercase">{item.shortLabel}</span>
    </Link>
  );
}
