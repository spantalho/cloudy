import type { AppConfig, UserPreferences } from "@/interfaces/config";

export const defaultAppConfig: AppConfig = {
  ENV: "production",
  APP: {
    version: "0.1.0",
    name: "cloudy",
    short_name: "CLDY",
    author: "Lou",
    license: "CC0 1.0"
  },
  URLS: {
    app: {
      repo: "https://github.com/spantalho/cloudy",
      license: "https://creativecommons.org/publicdomain/zero/1.0/",
      author_github: "https://github.com/spantalho",
    },
    resources: {
      weather_education: "https://wmo.int",
      uv_guide:
        "https://www.who.int/news-room/questions-and-answers/item/radiation-the-ultraviolet-(uv)-index",
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
      location_auto_detect: true,
      lang_auto_detect: true,
      theme_auto_detect: true,
      multiple_locations: false,
    },
  },
  CONSTANTS: {
    cache_duration: 300000,
    request_timeout: 10000,
    default_location: "Rio de Janeiro",
  },
};

export const defaultPreferences: UserPreferences = {
  units: {
    temperature: "celsius",
    speed: "kmh",
  },
  lang: "system",
  theme: "system",
  notifications: true,
  animations: true,
};
