import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import pt from "./locales/pt/translation.json";

const isDev = import.meta.env.DEV;

i18n
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "pt"],
    debug: isDev,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: en },
      pt: { translation: pt },
    },
    // detection: {
    //   order: ["localStorage", "navigator", "htmlTag"],
    //   caches: ["localStorage"],
    // },
  });

export default i18n;