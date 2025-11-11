import type { AppConfig, UserPreferences } from "@/interfaces/config";

// fallback for config.json
export const minimalFallback: AppConfig = {
  ENV: "production",
  APP: {
    version: "0.0.0",
    name: "Weather App",
    short_name: "Weather",
    author: "Unknown",
    license: "Apache 2.0"
  },
  URLS: {
    app: {
      repo: "",
      license: "",
      author_github: "",
    },
    resources: {
      weather_education: "",
      uv_guide:
        "",
    },
    internal: {
      api_base: "/api",
      assets: "/assets",
    },
  },
  FEATURES: {
    ui: {
      experimental: false,
    },
    functionality: {
      location_auto_detect: false,
      lang_auto_detect: false,
      theme_auto_detect: false,
    },
  },
  CONSTANTS: {
    cache_duration: 300000,
    request_timeout: 180000,
    default_location: "Rio de Janeiro",
  },
};

export const minimalPreferences: UserPreferences = {
  units: {
    temperature: "celsius",
    speed: "kmh",
  },
  lang: "system",
  theme: "system",
  notifications: true,
  animations: true,
};
