"use client";

import { useState, useEffect, useCallback } from "react";

type Theme = "dark" | "light" | "system";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("atlas-theme") as Theme) ?? "dark";
  });
  const [resolved, setResolved] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = (t: Theme) => {
      const r = t === "system" ? (mediaQuery.matches ? "dark" : "light") : t;
      setResolved(r);
      document.documentElement.classList.toggle("dark", r === "dark");
      document.documentElement.classList.toggle("light", r === "light");
      document.documentElement.style.colorScheme = r;
    };

    apply(theme);

    const handler = () => {
      if (theme === "system") apply("system");
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("atlas-theme", t);
  }, []);

  return { theme, resolved, setTheme, isDark: resolved === "dark" };
}
