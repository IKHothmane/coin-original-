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
    <section className="relative overflow-hidden border border-[#2c2a29] bg-[linear-gradient(135deg,#171514_0%,#111111_48%,#1a1716_100%)] p-5 sm:p-6 lg:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,87,26,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,181,158,0.12),transparent_38%)]" />
      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#ffb59e]">
              {eyebrow}
            </span>
            {badge ? (
              <span className="border border-[#4a3731] bg-[#201b19] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#f6d3c9]">
                {badge}
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 font-[var(--font-display)] text-4xl uppercase leading-[0.95] text-[#f5f1ef] sm:text-5xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#c7b4ae] sm:text-base">
            {description}
          </p>
        </div>
        {action ? <div className="flex shrink-0 items-center">{action}</div> : null}
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
  orange: "text-[#ff6a33] border-[#4e2e24] bg-[#1b1716]",
  sand: "text-[#ffcfbf] border-[#4e3a33] bg-[#181616]",
  gold: "text-[#ffba20] border-[#4e4020] bg-[#1b1811]",
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
      className={`group relative overflow-hidden border p-5 transition-colors hover:border-[#6b4940] sm:p-6 ${metricAccentClassMap[accent]}`}
    >
      <div className="absolute right-0 top-0 h-20 w-20 bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_60%)] opacity-50" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#bfa7a0]">{label}</p>
          <p className="mt-4 font-[var(--font-display)] text-4xl leading-none text-[#f5f1ef] sm:text-5xl">
            {value}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center border border-current/30 bg-black/10">
          <Icon size={20} />
        </div>
      </div>
      <p className="relative mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-[#bfa7a0]">
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
    <section className={`border border-[#2f2b29] bg-[#141313] ${className}`}>
      <div className="flex flex-col gap-4 border-b border-[#2f2b29] px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          {eyebrow ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ffb59e]">{eyebrow}</p>
          ) : null}
          <h2 className="mt-2 font-[var(--font-display)] text-2xl uppercase text-[#f5f1ef] sm:text-3xl">
            {title}
          </h2>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
