import {
  defaultAppConfig,
  defaultPreferences,
} from "@/constants/config-defaults";
import type {
  AppConfig,
  FullConfig,
  UserPreferences,
} from "@/interfaces/config";

import i18n from "@/i18n";

class ConfigService {
  private config: AppConfig | null = null;

  async loadConfig(): Promise<AppConfig> {
    if (this.config) return this.config;

    try {
      const response = await fetch("/config.json");
      const configText = await response.text();

      const processedConfig = configText
        .replace(
          /\{VITE_APP_ENV}/g,
          import.meta.env.VITE_APP_ENV || "development"
        )
        .replace(/\{VITE_API_URL}/g, import.meta.env.VITE_API_URL || "");

      const parsedConfig = JSON.parse(processedConfig);
      this.config = this.mergeWithDefaults(parsedConfig);
      return this.config;
    } catch (err) {
      console.warn("Failed to load custom config, using defaults:", err);
      return this.getDefaultConfig().appConfig;
    }
  }

  private mergeWithDefaults(loadedConfig: Partial<FullConfig>): AppConfig {
    return {
      ...defaultAppConfig,
      ...loadedConfig.appConfig,
      APP: {
        ...defaultAppConfig.APP,
        ...loadedConfig.appConfig?.APP,
      },
      URLS: {
        ...defaultAppConfig.URLS,
        ...loadedConfig.appConfig?.URLS,
        internal: {
          ...defaultAppConfig.URLS.internal,
          ...loadedConfig.appConfig?.URLS?.internal,
        },
        app: {
          ...defaultAppConfig.URLS.app,
          ...loadedConfig.appConfig?.URLS?.app,
        },
      },
      FEATURES: {
        ...defaultAppConfig.FEATURES,
        ...loadedConfig.appConfig?.FEATURES,
        ui: {
          ...defaultAppConfig.FEATURES.ui,
          ...loadedConfig.appConfig?.FEATURES?.ui,
        },
        functionality: {
          ...defaultAppConfig.FEATURES.functionality,
          ...loadedConfig.appConfig?.FEATURES?.functionality,
        },
      },
      CONSTANTS: {
        ...defaultAppConfig.CONSTANTS,
        ...loadedConfig.appConfig?.CONSTANTS,
      },
    };
  }

  private getDefaultConfig(): FullConfig {
    const env = import.meta.env.VITE_APP_ENV || "development";

    return {
      appConfig: {
        ...defaultAppConfig,
        ENV: env as "development" | "staging" | "production",
      },
      defaultPreferences: {
        ...defaultPreferences,
      },
      updatePreferences: () => {},
      resetPreferences: () => {},
    };
  }

  async loadUserPreferences(): Promise<UserPreferences> {
    try {
      const stored = localStorage.getItem("userPreferences");
      if (stored) {
        const parsed: UserPreferences = JSON.parse(stored);
        return {
          ...defaultPreferences,
          ...parsed,
          units: {
            ...defaultPreferences.units,
            ...parsed.units,
          },
        };
      }
    } catch (err) {
      console.warn("Invalid userPreferences in localStorage:", err);
    }

    return { ...defaultPreferences };
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
  private loading: boolean;
  private error: string | null;
  private initialized: boolean = false;

  private constructor() {
    this.service = new ConfigService();
    this.appConfig = defaultAppConfig;
    this.userPreferences = defaultPreferences;
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
      const [loadedAppConfig, loadedUserPreferences] = await Promise.all([
        this.service.loadConfig(),
        this.service.loadUserPreferences(),
      ]);

      this.appConfig = loadedAppConfig;
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
          ...defaultPreferences,
          ...storedPrefs,
          units: {
            ...defaultPreferences.units,
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
