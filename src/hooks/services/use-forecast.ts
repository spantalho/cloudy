import type { AppConfig } from "@/interfaces/config";
import { fetchForecast } from "@/services/forecast-service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

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
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
    placeholderData: keepPreviousData,
  });
}
