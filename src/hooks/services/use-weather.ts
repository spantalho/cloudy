import type { AppConfig } from "@/interfaces/config";
import type { LangType } from "../use-lang";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchWeather } from "@/services/weather-service";

export function useWeather(
  city: string,
  appConfig: AppConfig,
  lang?: LangType
) {
  const API_BASE = appConfig.URLS.internal.api_base;

  return useQuery({
    queryKey: ["weather", API_BASE, city, lang || "en"],
    queryFn: () => fetchWeather(city, appConfig, lang),
    enabled: Boolean(city && API_BASE),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
    placeholderData: keepPreviousData,
  });
}
