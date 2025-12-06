import i18n from "@/i18n";

/**
 * Automatically detect languages available in the application based on i18n (i18next) localization files.
 */

export function detectAppLangs() {
  const resources = i18n.services.resourceStore.data;
  const baseLang = "en"; // for comparison
  const baseKeys = resources[baseLang] ? Object.keys(resources[baseLang].translation) : [];

  if (baseKeys.length === 0) {
    return [];
  }

  return Object.keys(resources).map((lang) => {
    const langKeys = Object.keys(resources[lang].translation);
    const translatedCount = baseKeys.filter((key) =>
      langKeys.includes(key)
    ).length;

    const percentage = Math.round((translatedCount / baseKeys.length) * 100);

    return {
      lang,
      percentage,
    };
  });
}
