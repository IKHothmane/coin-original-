"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "urban-maghreb-theme";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const savedTheme = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const systemPrefersLight = window.matchMedia(
      "(prefers-color-scheme: light)",
    ).matches;

    return savedTheme ?? (systemPrefersLight ? "light" : "dark");
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 min-w-11 items-center justify-center border border-[var(--border-soft)] px-3 text-[var(--foreground)] hover:bg-[var(--surface-soft)]"
      aria-label="Changer le theme"
    >
      <span className="text-xl" aria-hidden="true" suppressHydrationWarning>
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
      <span
        className="ml-2 text-xs uppercase tracking-[0.16em] md:hidden"
        suppressHydrationWarning
      >
        {theme === "dark" ? "Dark" : "Light"}
      </span>
    </button>
  );
}
