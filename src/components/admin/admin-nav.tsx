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
  { href: "/admin", label: "Dashboard", shortLabel: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", shortLabel: "Produits", icon: Package },
  { href: "/admin/orders", label: "Orders", shortLabel: "Commandes", icon: ShoppingCart },
  { href: "/admin/settings", label: "Settings", shortLabel: "Reglages", icon: Settings },
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
      className={`flex items-center gap-4 px-6 py-4 font-mono text-xs uppercase transition-all ${
        active
          ? "bg-[#ffb59e] font-bold text-[#5e1700]"
          : "text-[#e5e2e1] hover:bg-[#353534]"
      }`}
    >
      <Icon size={18} />
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
        active ? "text-[#ffb59e]" : "text-[#e5e2e1]"
      }`}
    >
      <Icon size={20} />
      <span className="font-mono text-[9px] uppercase">{item.shortLabel}</span>
    </Link>
  );
}
