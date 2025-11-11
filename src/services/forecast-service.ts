import { ApiForecastSchema } from "./schema/forecast";
import { mapApiForecastToModel } from "./mappers";
import type { AppConfig } from "@/interfaces/config";
import { apiWrapper } from "./api-wrapper";

export async function fetchForecast(
  city: string,
  appConfig: AppConfig,
  showHours?: boolean,
  days?: number,
  lang?: string
) {
  const res = await apiWrapper.get(
    `${appConfig.URLS.internal.api_base}/forecast`,
    {
      params: {
        city,
        days: days || "3",
        hours: showHours || false,
        lang: lang || "en",
      },
    }
  );

  const parse = ApiForecastSchema.safeParse(res);
  if (!parse.success) {
    console.error("Invalid forecast API response", parse.error);
    throw new Error("Invalid forecast API response");
  }

  return mapApiForecastToModel(parse.data);
}
