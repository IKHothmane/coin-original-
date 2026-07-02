"use client";

import { useEffect, useState } from "react";
import { Bell, LogOut, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  adminNavItems,
  AdminNavLink,
  AdminMobileDockLink,
} from "./admin-nav";

type AdminShellProps = {
  children: React.ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
};

export function AdminShell({ children, pageTitle, pageSubtitle }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const activeItem =
    adminNavItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ??
    adminNavItems[0];

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
          {adminNavItems.map((item) => (
            <AdminNavLink
              key={item.label}
              item={item}
              active={item.href === activeItem.href}
            />
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
            href="/"
            className="mt-3 flex items-center justify-center gap-2 border border-[#ffb59e] py-3 text-center font-mono text-xs uppercase text-[#ffb59e] transition-colors hover:bg-[#ffb59e] hover:text-[#521300]"
          >
            Retour au site
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
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Ouvrir le menu admin"
        >
          <Menu size={24} className="text-[#ffb59e]" />
        </button>
        <div className="font-[var(--font-display)] text-xl uppercase tracking-tight text-[#ffb59e]">
          Coin Original
        </div>
        <div className="flex items-center gap-4">
          <Bell size={20} className="text-[#e6beb2]" />
          <User size={20} className="text-[#ffb59e]" />
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
                <h2 className="font-[var(--font-display)] text-2xl text-[#ffb59e]">
                  ADMIN PANEL
                </h2>
                <p className="font-mono text-[10px] tracking-widest text-[#e6beb2] opacity-60">
                  Management Suite
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fermer le drawer"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-1">
              {adminNavItems.map((item) => (
                <AdminNavLink
                  key={item.label}
                  item={item}
                  active={item.href === activeItem.href}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </nav>
            <div className="mt-6 border-t border-[#353534] px-4 pt-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 border border-[#ffb59e] py-3 text-center font-mono text-xs uppercase text-[#ffb59e] transition-colors hover:bg-[#ffb59e] hover:text-[#521300]"
              >
                Retour au site
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <main className="min-h-screen px-3 pb-28 pt-16 lg:ml-64 lg:px-0 lg:pr-5 lg:pb-10 lg:pt-0">
        {pageTitle ? (
          <header className="sticky top-0 z-30 -mx-4 hidden h-20 items-center justify-between border-b-2 border-[#353534] bg-[#131313] px-10 lg:mx-0 lg:flex">
            <div>
              {pageSubtitle ? (
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#ffb59e]">
                  {pageSubtitle}
                </p>
              ) : null}
              <h1 className="font-[var(--font-display)] text-3xl uppercase tracking-tight text-[#e5e2e1]">
                {pageTitle}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="p-2 text-[#e5e2e1] transition-colors hover:text-[#ffb59e]"
              >
                <Bell size={20} />
              </button>
              <button
                type="button"
                className="p-2 text-[#e5e2e1] transition-colors hover:text-[#ffb59e]"
              >
                <User size={20} />
              </button>
            </div>
          </header>
        ) : null}

        {children}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t-2 border-[#353534] bg-[#131313] lg:hidden">
        {adminNavItems.map((item) => (
          <AdminMobileDockLink
            key={item.label}
            item={item}
            active={item.href === activeItem.href}
          />
        ))}
      </div>
    </div>
  );
}
