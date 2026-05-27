import { useCallback, useEffect, useState } from "react";

export type ProfessionalTheme = "light" | "dark";

const STORAGE_KEY = "ayaan-professional-theme";

export function useProfessionalTheme() {
  const [theme, setTheme] = useState<ProfessionalTheme>(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" ? "light" : "dark";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
}
