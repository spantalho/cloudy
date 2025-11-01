import { useConfig } from "@/contexts/config-context";
import i18n from "@/i18n";
import { useEffect, useMemo } from "react";

export type LangType = "system" | "en" | "pt";

export function useLang() {
  const { userPreferences, setUserPreferences } = useConfig();

  const currentLang = useMemo(() => {
    if (typeof window === "undefined") return "en";

    if (userPreferences.lang === "system") {
      const browserLang = navigator.language.toLowerCase();

      if (browserLang.startsWith("pt")) {
        return "pt";
      }

      return "en";
    }

    return userPreferences.lang;
  }, [userPreferences.lang]);

  useEffect(() => {
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }
  }, [currentLang]);

  const setLang = (lang: LangType) => {
    setUserPreferences((prev) => ({
      ...prev,
      lang,
    }));
  };

  return {
    lang: currentLang,
    systemLang: userPreferences.lang,
    setLang,
  };
}
