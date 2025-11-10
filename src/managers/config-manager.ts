import {
  minimalFallback,
  minimalPreferences,
} from "@/constants/config-defaults";
import type {
  AppConfig,
  UserPreferences,
} from "@/interfaces/config";

import i18n from "@/i18n";

class ConfigService {
  private config: AppConfig | null = null;
  private defaultPreferences: UserPreferences | null = null;

  async loadConfig(): Promise<{
    appConfig: AppConfig;
    defaultPreferences: UserPreferences;
  }> {
    if (this.config && this.defaultPreferences) {
      return {
        appConfig: this.config,
        defaultPreferences: this.defaultPreferences,
      };
    }

    try {
      const response = await fetch("/config.json");
      const configText = await response.text();

      const processedConfig = configText
        .replace(
          /\{VITE_APP_ENV}/g,
          import.meta.env.VITE_APP_ENV || "development"
        )
        .replace(/\{VITE_API_URL}/g, import.meta.env.VITE_API_URL || "")
        .replace(/\{VITE_APP_NAME}/g, import.meta.env.VITE_APP_NAME || "cloudy")
        .replace(
          /\{VITE_APP_SHORT_NAME}/g,
          import.meta.env.VITE_APP_SHORT_NAME || import.meta.env.VITE_APP_NAME
        );

      const parsedConfig = JSON.parse(processedConfig);

      this.config = this.mergeWithFallback(parsedConfig.appConfig);
      this.defaultPreferences = this.mergePreferences(
        parsedConfig.defaultPreferences
      );

      return {
        appConfig: this.config,
        defaultPreferences: this.defaultPreferences,
      };
    } catch (err) {
      console.warn("Failed to load config.json, using minimal fallback:", err);
      this.config = minimalFallback;
      this.defaultPreferences = minimalPreferences;
      return {
        appConfig: this.config,
        defaultPreferences: this.defaultPreferences,
      };
    }
  }

  private mergeWithFallback(loadedConfig: Partial<AppConfig>): AppConfig {
    return {
      ...minimalFallback,
      ...loadedConfig,
      APP: {
        ...minimalFallback.APP,
        ...loadedConfig.APP,
      },
      URLS: {
        ...minimalFallback.URLS,
        ...loadedConfig.URLS,
        internal: {
          ...minimalFallback.URLS.internal,
          ...loadedConfig.URLS?.internal,
        },
        app: {
          ...minimalFallback.URLS.app,
          ...loadedConfig.URLS?.app,
        },
      },
      FEATURES: {
        ...minimalFallback.FEATURES,
        ...loadedConfig.FEATURES,
        ui: {
          ...minimalFallback.FEATURES.ui,
          ...loadedConfig.FEATURES?.ui,
        },
        functionality: {
          ...minimalFallback.FEATURES.functionality,
          ...loadedConfig.FEATURES?.functionality,
        },
      },
      CONSTANTS: {
        ...minimalFallback.CONSTANTS,
        ...loadedConfig.CONSTANTS,
      },
    };
  }

  private mergePreferences(
    loadedPrefs: Partial<UserPreferences>
  ): UserPreferences {
    return {
      ...minimalPreferences,
      ...loadedPrefs,
      units: {
        ...minimalPreferences.units,
        ...loadedPrefs.units,
      },
    };
  }

  async loadUserPreferences(): Promise<UserPreferences> {
    if (!this.defaultPreferences) {
      await this.loadConfig();
    }

    try {
      const stored = localStorage.getItem("userPreferences");
      if (stored) {
        const parsed: UserPreferences = JSON.parse(stored);
        return {
          ...this.defaultPreferences!,
          ...parsed,
          units: {
            ...this.defaultPreferences!.units,
            ...parsed.units,
          },
        };
      }
    } catch (err) {
      console.warn("Invalid userPreferences in localStorage:", err);
    }

    return { ...this.defaultPreferences! };
  }

  saveUserPreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
    } catch (err) {
      console.error("Failed to save user preferences:", err);
    }
  }
}

export class ConfigManager {
  private static instance: ConfigManager;
  private service: ConfigService;
  private appConfig: AppConfig;
  private userPreferences: UserPreferences;
  private defaultPreferences: UserPreferences;
  private loading: boolean;
  private error: string | null;
  private initialized: boolean = false;

  private constructor() {
    this.service = new ConfigService();
    this.appConfig = minimalFallback;
    this.userPreferences = minimalPreferences;
    this.defaultPreferences = minimalPreferences;
    this.loading = true;
    this.error = null;
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  getState() {
    return {
      appConfig: this.appConfig,
      userPreferences: this.userPreferences,
      loading: this.loading,
      error: this.error,
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const { appConfig, defaultPreferences } = await this.service.loadConfig();
      this.appConfig = appConfig;
      this.defaultPreferences = defaultPreferences;

      const loadedUserPreferences = await this.service.loadUserPreferences();
      this.userPreferences = loadedUserPreferences;

      this.ensurePreferencesPersisted();
      this.applyLanguage(this.userPreferences);

      this.initialized = true;
    } catch (err) {
      console.error("Failed to initialize config:", err);
      this.error = err instanceof Error ? err.message : "Unknown error";
    } finally {
      this.loading = false;
    }
  }

  setAppConfig(newConfig: Partial<AppConfig>): void {
    this.appConfig = {
      ...this.appConfig,
      ...newConfig,
      APP: { ...this.appConfig.APP, ...newConfig.APP },
      URLS: { ...this.appConfig.URLS, ...newConfig.URLS },
      FEATURES: { ...this.appConfig.FEATURES, ...newConfig.FEATURES },
      CONSTANTS: { ...this.appConfig.CONSTANTS, ...newConfig.CONSTANTS },
    };
  }

  private ensurePreferencesPersisted(): void {
    try {
      const stored = localStorage.getItem("userPreferences");
      if (!stored) {
        this.service.saveUserPreferences(this.userPreferences);
      } else {
        const storedPrefs: UserPreferences = JSON.parse(stored);
        const mergedPrefs = {
          ...this.defaultPreferences,
          ...storedPrefs,
          units: {
            ...this.defaultPreferences.units,
            ...storedPrefs.units,
          },
        };

        if (JSON.stringify(storedPrefs) !== JSON.stringify(mergedPrefs)) {
          this.service.saveUserPreferences(mergedPrefs);
          this.userPreferences = mergedPrefs;
        }
      }
    } catch (err) {
      console.error("Error ensuring preferences persistence:", err);
    }
  }

  setUserPreferences(newPreferences: Partial<UserPreferences>): void {
    const updatedPreferences = {
      ...this.userPreferences,
      ...newPreferences,
      units: {
        ...this.userPreferences.units,
        ...newPreferences.units,
      },
    };

    this.userPreferences = updatedPreferences;
    this.service.saveUserPreferences(updatedPreferences);
    this.applyLanguage(updatedPreferences);
  }

  private applyLanguage(preferences: UserPreferences): void {
    if (typeof window === "undefined") return;

    let langToApply: "pt" | "en";

    if (preferences.lang === "system") {
      const browserLang = navigator.language.toLowerCase();
      langToApply = browserLang.startsWith("pt") ? "pt" : "en";
    } else {
      langToApply = preferences.lang;
    }

    if (i18n.language !== langToApply) {
      i18n.changeLanguage(langToApply);
    }
  }
}
