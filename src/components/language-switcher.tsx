"use client";

import { useLanguage } from "@/lib/i18n/language-context";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const isArabic = lang === "ar";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Langue :</span>
      <button
        onClick={() => setLang("fr")}
        className={`px-3 py-1 text-sm rounded transition-colors ${
          !isArabic
            ? "bg-orange-500 text-white"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
        aria-label="Français"
      >
        FR
      </button>
      <button
        onClick={() => setLang("ar")}
        className={`px-3 py-1 text-sm rounded transition-colors ${
          isArabic
            ? "bg-orange-500 text-white"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
        aria-label="العربية"
      >
        AR
      </button>
    </div>
  );
}
