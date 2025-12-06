import type { AppConfig } from "@/interfaces/config";
import type { LangType } from "../use-lang";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchWeather } from "@/services/weather-service";
import { ConfigManager } from "@/managers/config-manager";

import mock from "../../mocks/weather.json"

const configManager = ConfigManager.getInstance()
const CACHE_DURATION = configManager.getState().appConfig?.CONSTANTS?.cache_duration || 300000;

export function useWeather(
  city: string,
  appConfig: AppConfig,
  lang?: LangType
) {
  const isDev = appConfig?.ENV === "development";
  const API_BASE = appConfig.URLS.internal.api_base;

  if (isDev) {
    return useQuery({
      queryKey: ["weather", "mock", city, lang || "en"],
      queryFn: async () => {
        return mock as any;
      },
      enabled: Boolean(city),
      staleTime: CACHE_DURATION,
      gcTime: CACHE_DURATION * 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 0,
      // placeholderData: keepPreviousData,
    });
  }

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
