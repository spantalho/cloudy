import type React from "react";

export interface AppConfig {
  schemaVersion: 1,
  ENV: "development" | "staging" | "production";
  APP: {
    version: string;
    name: string;
    short_name: string;
    author?: string;
    license?: string;
    services?: {
      weather: string;
    };
  };
  URLS: {
    app: {
      repo?: string;
      author_github?: string;
      license?: string;
      services?: {
        weather: string;
      };
    };
    resources: Record<string, string>;
    internal: {
      api_base: string;
      assets: string;
    };
  };
  FEATURES: {
    ui: {
      experimental: boolean;
    };
    functionality: {
      location_auto_detect: boolean;
      lang_auto_detect: boolean;
      theme_auto_detect: boolean;
    };
  };
  CONSTANTS: {
    cache_duration: number;
    request_timeout: number;
    default_location: string;
  };
}

export interface UserPreferences {
  schemaVersion: 1,
  units: {
    temperature: "celsius" | "fahrenheit";
    speed: "kmh" | "mph";
  };
  places: {
    detected: string | null,
    favorite: string | null,
    history: [] | null,
  },
  theme: "system" | "dark" | "light"
  lang: "system" | "pt" | "en";
  notifications: boolean;
  animations: boolean;
  shortcuts: boolean;
  ui_experiments: boolean;
}

export interface FullConfig {
  appConfig: AppConfig;
  defaultPreferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

export interface ConfigContextType {
  appConfig: AppConfig;
  userPreferences: UserPreferences;
  setAppConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  setUserPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  loading: boolean;
  error: string | null;
}
