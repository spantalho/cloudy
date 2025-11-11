import { z } from "zod";
import {
  ApiCondition,
  ApiLocation,
  ApiPrecip,
  ApiTemperatureDay,
  ApiTemperatureHour,
  ApiWind,
} from "./common";

export const ApiHour = z.object({
  time: z.string().optional(),
  time_epoch: z.number(),
  humidity: z.number(),
  is_day: z.boolean(),
  chance_of_rain: z.number().optional(),
  chance_of_snow: z.number().optional(),
  uv: z.number(),
  temp: ApiTemperatureHour,
  wind: ApiWind,
  condition: ApiCondition,
  precip: ApiPrecip,
  snow_cm: z.number(),
});

export const ApiDay = z.object({
  date: z.string(),
  date_epoch: z.number(),
  humidity: z.number(),
  will_rain: z.boolean(),
  will_snow: z.boolean(),
  chance_of_rain: z.number().optional(),
  chance_of_snow: z.number().optional(),
  max_wind: ApiWind,
  temp: ApiTemperatureDay,
  condition: ApiCondition,
  hours: z.array(ApiHour),
});

export const ApiForecastSchema = z.object({
  location: ApiLocation,
  forecast: z.array(ApiDay),
});

export type ApiForecast = z.infer<typeof ApiForecastSchema>;
