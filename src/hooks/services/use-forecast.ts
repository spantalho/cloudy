import type { AppConfig } from "@/interfaces/config";
import { ConfigManager } from "@/managers/config-manager";
import { fetchForecast } from "@/services/forecast-service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import mock from "../../mocks/forecast.json";
import { mapApiForecastToModel } from "@/services/mappers";
import type { Forecast } from "@/interfaces";

const configManager = ConfigManager.getInstance();
const CACHE_DURATION =
  configManager.getState().appConfig?.CONSTANTS?.cache_duration || 300000;

export function useForecast(
  city: string,
  appConfig: AppConfig,
  showHours = false,
  days = 3
) {
  const isDev = appConfig.ENV === "development";
  const mockData = mapApiForecastToModel(mock);

  const API_BASE = appConfig.URLS.internal.api_base;

  if (isDev) {
    return useQuery({
      queryKey: [
        "forecast",
        API_BASE,
        city,
        showHours ? "hours" : "no-hours",
        days,
      ],
      queryFn: async () => {
        return mockData as Forecast;
      },
      enabled: Boolean(city),
      staleTime: CACHE_DURATION,
      gcTime: CACHE_DURATION * 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 0,
    });
  }

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
