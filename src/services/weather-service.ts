import { ApiWeatherSchema } from "./schema/weather";
import { mapApiWeatherToModel } from "./mappers";
import type { AppConfig } from "@/interfaces/config";
import { apiWrapper } from "./api-wrapper";

export async function fetchWeather(
  city: string,
  appConfig: AppConfig,
  lang?: string
) {
  const res = await apiWrapper.get(
    `${appConfig.URLS.internal.api_base}/weather/current`,
    {
      params: {
        city,
        lang: lang || "en",
      },
    }
  );

  const parse = ApiWeatherSchema.safeParse(res);
  if (!parse.success) {
    console.error("Invalid weather API response", parse.error);
    throw new Error("Invalid weather API response");
  }

  return mapApiWeatherToModel(parse.data);
}
