import type React from "react";

export interface AppConfig {
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
      multiple_locations: boolean;
    };
  };
  CONSTANTS: {
    cache_duration: number;
    request_timeout: number;
    default_location: string;
  };
}

export interface UserPreferences {
  units: {
    temperature: "celsius" | "fahrenheit";
    speed: "kmh" | "mph";
  };
  theme: "system" | "dark" | "light"
  lang: "system" | "pt" | "en";
  notifications: boolean;
  animations: boolean;
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
