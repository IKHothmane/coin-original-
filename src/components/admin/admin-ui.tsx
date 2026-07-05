"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type AdminPageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  action?: ReactNode;
};

export function AdminPageIntro({
  eyebrow,
  title,
  description,
  badge,
  action,
}: AdminPageIntroProps) {
  return (
    <section className="relative overflow-hidden border border-[#3b3431] bg-[linear-gradient(135deg,#110f10_0%,#1b1413_42%,#0d0d0e_100%)] p-5 shadow-[18px_18px_0_0_rgba(0,0,0,0.26)] sm:p-6 lg:p-9">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),radial-gradient(circle_at_top_right,rgba(255,106,51,0.32),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,210,184,0.14),transparent_32%)] bg-[size:32px_32px,32px_32px,auto,auto]" />
      <div className="absolute inset-y-0 left-0 w-1 bg-[linear-gradient(180deg,#ffcfbf_0%,#ff6a33_100%)]" />
      <div className="absolute bottom-0 right-0 h-24 w-24 border-l border-t border-white/10 bg-black/10 backdrop-blur-sm" />
      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-[#5a443b] bg-[#171414]/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.35em] text-[#ffcfbf] backdrop-blur-sm">
              {eyebrow}
            </span>
            {badge ? (
              <span className="border border-[#4a3731] bg-[#201b19]/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#f6d3c9] backdrop-blur-sm">
                {badge}
              </span>
            ) : null}
          </div>
          <h1 className="mt-5 max-w-[12ch] font-[var(--font-display)] text-4xl uppercase leading-[0.84] text-[#fff7f2] sm:text-6xl lg:text-[5.4rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[#d4c0b9] sm:text-base">
            {description}
          </p>
        </div>
        {action ? <div className="flex shrink-0 items-center self-start xl:self-end">{action}</div> : null}
      </div>
    </section>
  );
}

type AdminMetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  accent?: "orange" | "sand" | "gold";
};

const metricAccentClassMap = {
  orange: "text-[#ff6a33] border-[#553328] bg-[linear-gradient(180deg,#1e1412_0%,#111011_100%)]",
  sand: "text-[#ffd7c9] border-[#4d3a36] bg-[linear-gradient(180deg,#191616_0%,#101010_100%)]",
  gold: "text-[#ffba20] border-[#56441f] bg-[linear-gradient(180deg,#1d180f_0%,#111010_100%)]",
} as const;

export function AdminMetricCard({
  label,
  value,
  detail,
  icon: Icon,
  accent = "orange",
}: AdminMetricCardProps) {
  return (
    <article
      className={`group relative overflow-hidden border p-5 shadow-[12px_12px_0_0_rgba(0,0,0,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[16px_16px_0_0_rgba(0,0,0,0.24)] hover:border-[#7b5750] sm:p-6 ${metricAccentClassMap[accent]}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:26px_26px]" />
      <div className="absolute inset-y-0 left-0 w-1 bg-current opacity-80" />
      <div className="absolute right-0 top-0 h-24 w-24 bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_60%)] opacity-50" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#bea8a1]">{label}</p>
          <p className="mt-5 font-[var(--font-display)] text-4xl leading-none text-[#fff7f2] sm:text-5xl">
            {value}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center border border-current/25 bg-black/15 backdrop-blur">
          <Icon size={20} />
        </div>
      </div>
      <p className="relative mt-6 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#bfa7a0]">
        {detail}
      </p>
    </article>
  );
}

type AdminPanelProps = {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AdminPanel({
  title,
  eyebrow,
  action,
  children,
  className = "",
}: AdminPanelProps) {
  return (
    <section className={`relative overflow-hidden border border-[#383230] bg-[linear-gradient(180deg,#141313_0%,#0e0e0f_100%)] shadow-[14px_14px_0_0_rgba(0,0,0,0.18)] ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute inset-y-0 left-0 w-1 bg-[linear-gradient(180deg,#ffcfbf_0%,#ff6a33_100%)] opacity-80" />
      <div className="relative flex flex-col gap-4 border-b border-[#383230] px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          {eyebrow ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ffb59e]">{eyebrow}</p>
          ) : null}
          <h2 className="mt-2 font-[var(--font-display)] text-2xl uppercase text-[#fff7f2] sm:text-3xl">
            {title}
          </h2>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      <div className="relative p-5 sm:p-6">{children}</div>
    </section>
  );
}
