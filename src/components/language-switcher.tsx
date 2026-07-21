"use client";

import { useLanguage } from "@/lib/i18n/language-context";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const buttonClass = (active: boolean) =>
    `px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] transition-colors ${
      active ? "bg-[var(--primary)] text-white" : "text-[#b9b9c0] hover:text-white"
    }`;

  return (
    <div
      className="inline-flex items-center overflow-hidden rounded-full border border-[#2e2e33] bg-[#141417]"
      role="group"
      aria-label="Langue"
    >
      <button
        type="button"
        onClick={() => setLang("fr")}
        className={buttonClass(lang !== "ar")}
        aria-label="Français"
        aria-pressed={lang !== "ar"}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLang("ar")}
        className={buttonClass(lang === "ar")}
        aria-label="العربية"
        aria-pressed={lang === "ar"}
      >
        AR
      </button>
    </div>
  );
}
