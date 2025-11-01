import { z } from "zod";
import {
  ApiCondition,
  ApiLocation,
  ApiPrecip,
  ApiTemperatureHour,
  ApiWind,
} from "./common";

export const ApiCurrent = z.object({
  last_updated: z.string(),
  temp: ApiTemperatureHour,
  feelslike: ApiTemperatureHour,
  is_day: z.boolean(),
  condition: ApiCondition,
  cloud: z.number(),
  humidity: z.number(),
  uv: z.number(),
  wind: ApiWind,
  precip: ApiPrecip,
});

export const ApiWeatherSchema = z.object({
  location: ApiLocation,
  current: ApiCurrent,
});

export type ApiWeather = z.infer<typeof ApiWeatherSchema>;
