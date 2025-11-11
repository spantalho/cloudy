import type { AppConfig } from "@/interfaces/config";
import type { LangType } from "../use-lang";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchWeather } from "@/services/weather-service";
import { ConfigManager } from "@/managers/config-manager";

const configManager = ConfigManager.getInstance()

export function useWeather(
  city: string,
  appConfig: AppConfig,
  lang?: LangType
) {
  const API_BASE = appConfig.URLS.internal.api_base;
  const CACHE_DURATION = configManager.getState().appConfig?.CONSTANTS?.cache_duration || 300000;

  return useQuery({
    queryKey: ["weather", API_BASE, city, lang || "en"],
    queryFn: () => fetchWeather(city, appConfig, lang),
    enabled: Boolean(city && API_BASE),
    staleTime: CACHE_DURATION,
    gcTime: CACHE_DURATION * 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
    placeholderData: keepPreviousData,
  });
}
