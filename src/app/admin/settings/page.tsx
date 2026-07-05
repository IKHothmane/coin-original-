"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Save,
  Shield,
  Store,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPageIntro } from "@/components/admin/admin-ui";

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

const initialSettings: SettingsState = {
  storeName: "COIN ORIGINAL CASABLANCA",
  currency: "MAD",
  language: "FR",
  maintenanceMode: false,
  codFees: "15",
  shippingDays: 3,
  freeShippingEnabled: true,
  freeShippingThreshold: "500",
  adminEmail: "admin@coinoriginal.shop",
  newPassword: "",
  twoFactorEnabled: false,
};

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
      className={`relative inline-flex h-8 w-16 items-center border transition-colors ${
        checked ? "border-[#ff6a33] bg-[#ff6a33]" : "border-[#353534] bg-[#191818]"
      }`}
    >
      <span
        className={`absolute h-6 w-6 bg-white transition-transform ${
          checked ? "translate-x-8" : "translate-x-1"
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
    <section className="relative overflow-hidden border border-[#342f2d] bg-[linear-gradient(180deg,#141313_0%,#101010_100%)] p-5 shadow-[12px_12px_0_0_rgba(0,0,0,0.16)] sm:p-6">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:26px_26px]" />
      <div className="mb-6 flex items-center gap-3">
        <div className="relative z-10 flex h-10 w-10 items-center justify-center border border-[#3a2f2b] bg-[#1d1817]">
          <Icon size={18} className="text-[#ffba20]" />
        </div>
        <h3 className="relative z-10 font-[var(--font-display)] text-2xl uppercase text-[#e5e2e1]">{title}</h3>
      </div>
      <div className="relative z-10 space-y-6">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
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
  const [settings, setSettings] = useState<SettingsState>(initialSettings);
  const [saveMessage, setSaveMessage] = useState("");

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
    <AdminShell pageTitle="Reglages" pageSubtitle="Configuration / Boutique">
      <div className="space-y-6 py-6 lg:space-y-8 lg:py-10">
        <AdminPageIntro
          eyebrow="Configuration boutique"
          title="Reglages admin"
          description="Centralise les preferences boutique, la logistique marocaine et la securite du compte dans un seul ecran plus net et plus premium."
          badge="Version 2.4.0"
        />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <SectionCard icon={Store} title="Boutique">
              <Field label="Nom de la boutique">
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(event) => updateField("storeName", event.target.value)}
                  className="w-full border-b-2 border-[#353534] bg-transparent py-3 text-base text-[#e5e2e1] outline-none transition-colors focus:border-[#ff571a]"
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Devise">
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

                <Field label="Langue">
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
              <div className="border-l-4 border-[#ffba20] bg-[#1d1812] p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#ffba20]">
                  Optimise pour la livraison contre remboursement au Maroc
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Frais COD (MAD)">
                  <input
                    type="number"
                    value={settings.codFees}
                    onChange={(event) => updateField("codFees", event.target.value)}
                    className="w-full border-b-2 border-[#353534] bg-transparent py-3 text-base text-[#e5e2e1] outline-none transition-colors focus:border-[#ff571a]"
                  />
                </Field>

                <Field label="Seuil livraison gratuite (MAD)">
                  <input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(event) => updateField("freeShippingThreshold", event.target.value)}
                    className="w-full border-b-2 border-[#353534] bg-transparent py-3 text-base text-[#e5e2e1] outline-none transition-colors focus:border-[#ff571a]"
                  />
                </Field>
              </div>

              <Field label="Delai estime (jours)">
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
              <Field label="Email admin">
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(event) => updateField("adminEmail", event.target.value)}
                  className="w-full border-b-2 border-[#353534] bg-transparent py-3 text-base text-[#e5e2e1] outline-none transition-colors focus:border-[#ff571a]"
                />
              </Field>

              <Field label="Nouveau mot de passe">
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
            <section className="overflow-hidden border border-[#3a3431] bg-[linear-gradient(180deg,#141313_0%,#0f0f10_100%)] shadow-[14px_14px_0_0_rgba(0,0,0,0.18)]">
              <div className="relative h-64">
                <Image
                  src="/hero-home.jpg"
                  alt="Univers Coin Original"
                  fill
                  sizes="(max-width: 1279px) 100vw, 360px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:26px_26px]" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#ffcfbf]">
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

            <section className="relative overflow-hidden border border-[#3a3431] bg-[linear-gradient(180deg,#141313_0%,#0f0f10_100%)] p-5 shadow-[14px_14px_0_0_rgba(0,0,0,0.18)]">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:26px_26px]" />
              <div className="absolute inset-y-0 left-0 w-1 bg-[linear-gradient(180deg,#ffcfbf_0%,#ff6a33_100%)] opacity-80" />
              <p className="relative z-10 font-mono text-[10px] uppercase tracking-widest text-[#ffb59e]">
                Resume rapide
              </p>
              <div className="relative z-10 mt-5 space-y-4">
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

      <div className="fixed bottom-16 left-0 right-0 z-40 p-4 lg:bottom-0 lg:left-72">
        <div className="mx-auto max-w-6xl border border-[#2f2b29] bg-[#111111]/95 p-3 backdrop-blur sm:p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleReset}
              className="border border-[#f2ece9] px-4 py-4 font-[var(--font-display)] text-lg uppercase text-white transition-colors hover:bg-white hover:text-black active:scale-95"
            >
              Reinitialiser
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center justify-center gap-3 border border-[#ff8a62] bg-[linear-gradient(135deg,#ffb59e_0%,#ff6a33_100%)] px-4 py-4 font-[var(--font-display)] text-lg uppercase text-[#521300] transition-all hover:brightness-110 active:scale-[0.99]"
            >
              <Save size={20} />
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
