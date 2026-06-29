"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Save,
  Settings,
  Shield,
  ShoppingCart,
  Store,
  Truck,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
};

type SettingsState = {
  storeName: string;
  currency: string;
  language: string;
  maintenanceMode: boolean;
  codFees: string;
  shippingDays: number;
  freeShippingEnabled: boolean;
  freeShippingThreshold: string;
  adminEmail: string;
  newPassword: string;
  twoFactorEnabled: boolean;
};

const desktopNavItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, active: false },
  { href: "/admin/products", label: "Products", icon: Package, active: false },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, active: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, active: true },
];

const mobileDockItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, active: false },
  { href: "/admin/products", label: "Produits", icon: Package, active: false },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingCart, active: false },
  { href: "/admin/settings", label: "Reglages", icon: Settings, active: true },
];

const initialSettings: SettingsState = {
  storeName: "COIN ORIGINAL CASABLANCA",
  currency: "MAD",
  language: "FR",
  maintenanceMode: false,
  codFees: "15",
  shippingDays: 3,
  freeShippingEnabled: true,
  freeShippingThreshold: "500",
  adminEmail: "admin@coin-original.ma",
  newPassword: "",
  twoFactorEnabled: false,
};

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

function ToggleField({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`relative inline-flex h-7 w-14 items-center border-2 transition-colors ${
        checked ? "border-[#ff571a] bg-[#ff571a]" : "border-[#353534] bg-[#2a2a2a]"
      }`}
    >
      <span
        className={`absolute h-5 w-5 bg-white transition-transform ${
          checked ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-2 border-[#353534] bg-[#1a1a1a] p-5 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <Icon size={20} className="text-[#ffba20]" />
        <h3 className="font-[var(--font-display)] text-2xl uppercase text-[#e5e2e1]">{title}</h3>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block font-mono text-[10px] uppercase tracking-widest text-[#e6beb2]">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsState>(initialSettings);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const updateField = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaveMessage("");
  };

  const handleSave = () => {
    setSaveMessage("Reglages sauvegardes localement dans l'interface admin.");
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setSaveMessage("Reglages reinitialises.");
  };

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
        <button type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Ouvrir le menu admin">
          <Menu size={24} />
        </button>
        <div className="font-[var(--font-display)] text-xl uppercase tracking-tight text-[#ffb59e]">
          Coin Original
        </div>
        <div className="flex items-center gap-4">
          <Bell size={20} />
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

      <main className="min-h-screen px-3 pb-40 pt-20 lg:ml-64 lg:px-5 lg:pt-0">
        <header className="sticky top-0 z-30 -mx-4 hidden h-20 items-center justify-between border-b-2 border-[#353534] bg-[#131313] px-10 lg:mx-0 lg:flex">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#ffb59e]">
              Admin / Reglages
            </p>
            <h1 className="font-[var(--font-display)] text-3xl uppercase tracking-tight text-[#e5e2e1]">
              Coin Original
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="p-2 text-[#e5e2e1] transition-colors hover:text-[#ffb59e]">
              <Bell size={20} />
            </button>
            <button type="button" className="p-2 text-[#e5e2e1] transition-colors hover:text-[#ffb59e]">
              <User size={20} />
            </button>
          </div>
        </header>

        <div className="py-6 lg:py-10">
          <div className="mb-8 flex flex-col gap-6 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#ffb59e]">
                Configuration boutique
              </p>
              <h2 className="mt-2 font-[var(--font-display)] text-4xl leading-none text-[#e5e2e1] sm:text-5xl lg:text-7xl">
                SETTINGS
              </h2>
              <p className="mt-4 max-w-2xl text-sm text-[#e6beb2] sm:text-base">
                Controle le nom de la boutique, la livraison COD, la securite admin et les
                parametres de fonctionnement depuis un seul ecran.
              </p>
            </div>
            <div className="inline-flex items-center gap-3 self-start border border-[#5c4037] bg-[#201f1f] px-4 py-3 lg:self-end">
              <Settings size={18} className="text-[#ff571a]" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#ffb59e]">
                Version 2.4.0
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              <SectionCard icon={Store} title="Boutique">
                <Field label="Store Name">
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(event) => updateField("storeName", event.target.value)}
                    className="w-full border-b-2 border-[#353534] bg-transparent py-3 text-base text-[#e5e2e1] outline-none transition-colors focus:border-[#ff571a]"
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Currency">
                    <select
                      value={settings.currency}
                      onChange={(event) => updateField("currency", event.target.value)}
                      className="w-full border-b-2 border-[#353534] bg-[#1a1a1a] py-3 text-base text-[#e5e2e1] outline-none transition-colors focus:border-[#ff571a]"
                    >
                      <option value="MAD">MAD (Dirham)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="USD">USD (Dollar)</option>
                    </select>
                  </Field>

                  <Field label="Language">
                    <select
                      value={settings.language}
                      onChange={(event) => updateField("language", event.target.value)}
                      className="w-full border-b-2 border-[#353534] bg-[#1a1a1a] py-3 text-base text-[#e5e2e1] outline-none transition-colors focus:border-[#ff571a]"
                    >
                      <option value="FR">Francais</option>
                      <option value="AR">Arabe</option>
                    </select>
                  </Field>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-[#2a2a2a] pt-4">
                  <div>
                    <p className="text-base text-[#e5e2e1]">Mode maintenance</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#e6beb2]">
                      Masque la boutique aux clients
                    </p>
                  </div>
                  <ToggleField
                    checked={settings.maintenanceMode}
                    onChange={(checked) => updateField("maintenanceMode", checked)}
                  />
                </div>
              </SectionCard>

              <SectionCard icon={Truck} title="Livraison & COD">
                <div className="border-l-4 border-[#ffba20] bg-[#ffba20]/10 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#ffba20]">
                    Optimise pour la livraison contre remboursement au Maroc
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="COD Handling Fees (MAD)">
                    <input
                      type="number"
                      value={settings.codFees}
                      onChange={(event) => updateField("codFees", event.target.value)}
                      className="w-full border-b-2 border-[#353534] bg-transparent py-3 text-base text-[#e5e2e1] outline-none transition-colors focus:border-[#ff571a]"
                    />
                  </Field>

                  <Field label="Free Shipping Threshold (MAD)">
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(event) => updateField("freeShippingThreshold", event.target.value)}
                      className="w-full border-b-2 border-[#353534] bg-transparent py-3 text-base text-[#e5e2e1] outline-none transition-colors focus:border-[#ff571a]"
                    />
                  </Field>
                </div>

                <Field label="Est. Shipping Time (Days)">
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={7}
                      value={settings.shippingDays}
                      onChange={(event) => updateField("shippingDays", Number(event.target.value))}
                      className="h-2 w-full accent-[#ff571a]"
                    />
                    <span className="min-w-10 font-mono text-xs uppercase text-[#ffb59e]">
                      {settings.shippingDays}D
                    </span>
                  </div>
                </Field>

                <div className="flex items-center justify-between gap-4 border-t border-[#2a2a2a] pt-4">
                  <div>
                    <p className="text-base text-[#e5e2e1]">Livraison gratuite active</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#e6beb2]">
                      Active le seuil de commande gratuite
                    </p>
                  </div>
                  <ToggleField
                    checked={settings.freeShippingEnabled}
                    onChange={(checked) => updateField("freeShippingEnabled", checked)}
                  />
                </div>
              </SectionCard>

              <SectionCard icon={Shield} title="Compte & Securite">
                <Field label="Admin Email">
                  <input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(event) => updateField("adminEmail", event.target.value)}
                    className="w-full border-b-2 border-[#353534] bg-transparent py-3 text-base text-[#e5e2e1] outline-none transition-colors focus:border-[#ff571a]"
                  />
                </Field>

                <Field label="New Password">
                  <input
                    type="password"
                    value={settings.newPassword}
                    onChange={(event) => updateField("newPassword", event.target.value)}
                    placeholder="••••••••"
                    className="w-full border-b-2 border-[#353534] bg-transparent py-3 text-base text-[#e5e2e1] outline-none transition-colors placeholder:text-[#6b625f] focus:border-[#ff571a]"
                  />
                </Field>

                <div className="flex items-center justify-between gap-4 border-t border-[#2a2a2a] pt-4">
                  <div>
                    <p className="text-base text-[#e5e2e1]">Double authentification</p>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#e6beb2]">
                      Protection supplementaire pour l&apos;admin
                    </p>
                  </div>
                  <ToggleField
                    checked={settings.twoFactorEnabled}
                    onChange={(checked) => updateField("twoFactorEnabled", checked)}
                  />
                </div>
              </SectionCard>

              {saveMessage ? (
                <div className="border border-[#ffb59e] bg-[#201f1f] px-4 py-3 text-sm text-[#ffdbd0]">
                  {saveMessage}
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <section className="overflow-hidden border-2 border-[#353534] bg-[#1a1a1a]">
                <div className="relative h-64">
                  <Image
                    src="/hero-home.jpg"
                    alt="Univers Coin Original"
                    fill
                    sizes="(max-width: 1279px) 100vw, 360px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/55" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#ffb59e]">
                      Premium Standard
                    </p>
                    <h3 className="mt-3 font-[var(--font-display)] text-4xl uppercase leading-none text-white">
                      Coin
                      <br />
                      Original
                    </h3>
                  </div>
                </div>
              </section>

              <section className="border-2 border-[#353534] bg-[#201f1f] p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#ffb59e]">
                  Resume rapide
                </p>
                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3">
                    <span className="font-mono text-[10px] uppercase text-[#e6beb2]">Devise</span>
                    <span className="font-[var(--font-display)] text-2xl text-[#e5e2e1]">
                      {settings.currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3">
                    <span className="font-mono text-[10px] uppercase text-[#e6beb2]">Livraison</span>
                    <span className="font-[var(--font-display)] text-2xl text-[#e5e2e1]">
                      {settings.shippingDays} J
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-3">
                    <span className="font-mono text-[10px] uppercase text-[#e6beb2]">Mode shop</span>
                    <span className="font-[var(--font-display)] text-2xl text-[#e5e2e1]">
                      {settings.maintenanceMode ? "OFF" : "ON"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-[#e6beb2]">2FA</span>
                    <span className="font-[var(--font-display)] text-2xl text-[#e5e2e1]">
                      {settings.twoFactorEnabled ? "ACTIVE" : "OFF"}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-16 left-0 right-0 z-40 p-4 lg:bottom-0 lg:left-64">
        <div className="mx-auto max-w-6xl border-2 border-[#353534] bg-[#131313]/95 p-3 backdrop-blur sm:p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleReset}
              className="border-2 border-white px-4 py-4 font-[var(--font-display)] text-lg uppercase text-white transition-colors hover:bg-white hover:text-black active:scale-95"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center justify-center gap-3 bg-[#ff571a] px-4 py-4 font-[var(--font-display)] text-lg uppercase text-[#521300] shadow-[6px_6px_0px_0px_#521300] transition-all hover:brightness-110 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <footer className="hidden border-t-2 border-[#353534] bg-[#0e0e0e] py-6 lg:ml-64 lg:block">
        <div className="flex items-center justify-between px-10">
          <div className="font-[var(--font-display)] text-3xl uppercase text-[#e5e2e1] opacity-50">
            COIN ORIGINAL
          </div>
          <p className="font-mono text-[10px] text-[#e6beb2]">
            © 2024 COIN ORIGINAL MOROCCO. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-4 font-mono text-[10px] uppercase text-[#e6beb2]">
            <Link href="/support" className="transition-colors hover:text-[#ffb59e]">
              Support
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-[#ffb59e]">
              Privacy Policy
            </Link>
            <Link href="/status" className="transition-colors hover:text-[#ffb59e]">
              System Status
            </Link>
          </div>
        </div>
      </footer>

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
