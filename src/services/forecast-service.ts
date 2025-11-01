import api from "../api";
import { ApiForecastSchema } from "./schema/forecast";
import { mapApiForecastToModel } from "./mappers";
import type { AppConfig } from "@/interfaces/config";

export async function fetchForecast(
  city: string,
  appConfig: AppConfig,
  showHours?: boolean,
  days?: number,
  lang?: string
) {
  const res = await api.get(`${appConfig.URLS.internal.api_base}/forecast`, {
    params: {
      city,
      days: days || "3",
      hours: showHours || false,
      lang: lang || "en",
    },
  });

  const parse = ApiForecastSchema.safeParse(res.data);
  if (!parse.success) {
    console.error("Invalid forecast API response", parse.error);
    throw new Error("Invalid forecast API response");
  }

  return mapApiForecastToModel(parse.data);
}
