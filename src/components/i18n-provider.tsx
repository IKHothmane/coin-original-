"use client";

import { LanguageProvider } from "@/lib/i18n/language-context";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
