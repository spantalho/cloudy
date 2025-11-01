import { useConfig } from "@/contexts/config-context";
import { useEffect, useMemo } from "react";

export type Theme = "system" | "dark" | "light";

export function useTheme() {
  const { userPreferences, setUserPreferences } = useConfig();

  const currentTheme = useMemo(() => {
    if (typeof window === "undefined") return "dark";

    if (userPreferences.theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    return userPreferences.theme || "dark";
  }, [userPreferences.theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(currentTheme);
  }, [currentTheme]);

  const setTheme = (nextTheme: Theme) => {
    setUserPreferences((prev) => ({
      ...prev,
      theme: nextTheme,
    }));
  };

  return {
    theme: currentTheme,
    systemTheme: userPreferences.theme,
    setTheme,
  };
}
