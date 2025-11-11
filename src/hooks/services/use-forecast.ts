import type { AppConfig } from "@/interfaces/config";
import { ConfigManager } from "@/managers/config-manager";
import { fetchForecast } from "@/services/forecast-service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const configManager = ConfigManager.getInstance()
const CACHE_DURATION = configManager.getState().appConfig?.CONSTANTS?.cache_duration || 300000;

export function useForecast(
  city: string,
  appConfig: AppConfig,
  showHours = false,
  days = 3
) {
  const API_BASE = appConfig.URLS.internal.api_base;

  return useQuery({
    queryKey: [
      "forecast",
      API_BASE,
      city,
      showHours ? "hours" : "no-hours",
      days,
    ],
    queryFn: () => fetchForecast(city, appConfig, showHours, days),
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
