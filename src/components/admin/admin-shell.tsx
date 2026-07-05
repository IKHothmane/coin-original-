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
    <div className="min-h-screen overflow-x-hidden bg-[#0e0d0d] font-[var(--font-body)] text-[#f2ece9]">
      <aside className="fixed left-0 top-0 hidden h-full w-72 flex-col border-r border-[#2a2624] bg-[linear-gradient(180deg,#141313_0%,#0f0f0f_100%)] lg:flex">
        <div className="border-b border-[#2a2624] px-7 pb-7 pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-[#ffb59e]">
            Coin Original
          </p>
          <h1 className="mt-4 font-[var(--font-display)] text-4xl uppercase leading-none text-[#fff4ef]">
            Admin
          </h1>
          <p className="mt-2 max-w-[12rem] font-mono text-[10px] uppercase tracking-[0.24em] text-[#aa8f87]">
            Back office premium pour piloter boutique, commandes et catalogue.
          </p>
        </div>

        <div className="px-7 py-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-[#2e2826] bg-[#171615] p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9f8680]">Canal</p>
              <p className="mt-2 font-[var(--font-display)] text-2xl text-[#fff4ef]">MAD</p>
            </div>
            <div className="border border-[#2e2826] bg-[#171615] p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9f8680]">Region</p>
              <p className="mt-2 font-[var(--font-display)] text-2xl text-[#fff4ef]">MA</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {adminNavItems.map((item) => (
            <AdminNavLink
              key={item.label}
              item={item}
              active={item.href === activeItem.href}
            />
          ))}
        </nav>

        <div className="mt-auto border-t border-[#2a2624] px-6 py-6">
          <Link
            href="/admin/products/new"
            className="block w-full border border-[#ff8a62] bg-[linear-gradient(135deg,#ffb59e_0%,#ff6a33_100%)] px-4 py-4 text-center font-[var(--font-display)] text-lg uppercase tracking-wide text-[#381103] transition-all hover:brightness-110 active:scale-95"
          >
            Nouveau produit
          </Link>
          <Link
            href="/"
            className="mt-3 flex items-center justify-center gap-2 border border-[#3a302d] bg-[#171615] py-3 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-[#f0d1c7] transition-colors hover:border-[#ffb59e] hover:text-[#ffb59e]"
          >
            Retour au site
          </Link>
          <Link
            href="/logout"
            className="mt-3 flex items-center gap-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#b69c95] transition-colors hover:text-[#ffb59e]"
          >
            <LogOut size={18} />
            Deconnexion
          </Link>
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[#2a2624] bg-[#0f0f0f]/95 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Ouvrir le menu admin"
        >
          <Menu size={24} className="text-[#ffb59e]" />
        </button>
        <div className="font-[var(--font-display)] text-xl uppercase tracking-tight text-[#fff4ef]">
          Coin Original
        </div>
        <div className="flex items-center gap-4">
          <Bell size={20} className="text-[#d6beb7]" />
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
          <div className="absolute left-0 top-0 h-full w-72 border-r border-[#2a2624] bg-[linear-gradient(180deg,#141313_0%,#0f0f0f_100%)] py-6">
            <div className="mb-6 flex items-center justify-between px-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ffb59e]">
                  Coin Original
                </p>
                <h2 className="mt-3 font-[var(--font-display)] text-3xl uppercase text-[#fff4ef]">
                  Admin
                </h2>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#a58d86]">
                  Management suite
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
            <nav className="space-y-1 px-3">
              {adminNavItems.map((item) => (
                <AdminNavLink
                  key={item.label}
                  item={item}
                  active={item.href === activeItem.href}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </nav>
            <div className="mt-6 border-t border-[#2a2624] px-4 pt-4">
              <Link
                href="/admin/products/new"
                onClick={() => setMobileMenuOpen(false)}
                className="mb-3 flex items-center justify-center border border-[#ff8a62] bg-[linear-gradient(135deg,#ffb59e_0%,#ff6a33_100%)] py-4 font-[var(--font-display)] text-lg uppercase text-[#381103]"
              >
                Nouveau produit
              </Link>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 border border-[#3a302d] bg-[#171615] py-3 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-[#f0d1c7] transition-colors hover:border-[#ffb59e] hover:text-[#ffb59e]"
              >
                Retour au site
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <main className="min-h-screen px-3 pb-28 pt-16 lg:ml-72 lg:px-8 lg:pb-10 lg:pt-0">
        {pageTitle ? (
          <header className="sticky top-0 z-30 hidden border-b border-[#2a2624] bg-[#0e0d0d]/95 py-6 backdrop-blur lg:flex lg:items-end lg:justify-between">
            <div className="min-w-0">
              {pageSubtitle ? (
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#ffb59e]">
                  {pageSubtitle}
                </p>
              ) : null}
              <h1 className="mt-3 font-[var(--font-display)] text-4xl uppercase tracking-tight text-[#f5f1ef]">
                {pageTitle}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="border border-[#2d2725] bg-[#161514] px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#9d8780]">
                  Section active
                </p>
                <p className="mt-2 font-[var(--font-display)] text-xl uppercase text-[#fff4ef]">
                  {activeItem.label}
                </p>
              </div>
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center border border-[#2d2725] bg-[#161514] text-[#e5d8d4] transition-colors hover:border-[#ffb59e] hover:text-[#ffb59e]"
              >
                <Bell size={20} />
              </button>
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center border border-[#2d2725] bg-[#161514] text-[#e5d8d4] transition-colors hover:border-[#ffb59e] hover:text-[#ffb59e]"
              >
                <User size={20} />
              </button>
            </div>
          </header>
        ) : null}

        {children}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-[#2a2624] bg-[#0f0f0f]/95 backdrop-blur lg:hidden">
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
