import { z } from "zod";

export const ApiCondition = z.object({
  text: z.string(),
  code: z.number(),
});

export const ApiTemperatureHour = z.object({
  c: z.number(),
  f: z.number(),
});

export const ApiTemperatureDay = z.object({
  max_c: z.number(),
  min_c: z.number(),
  avg_c: z.number(),
  max_f: z.number(),
  min_f: z.number(),
  avg_f: z.number(),
});

export const ApiWind = z.object({
  kph: z.number(),
  mph: z.number(),
});

export const ApiPrecip = z.object({
  mm: z.number(),
  in: z.number(),
});

export const Localtime = z.object({
  epoch: z.number(),
  localtime: z.string(),
});

export const ApiLocation = z.object({
  name: z.string(),
  region: z.string(),
  country: z.string(),
  tz_id: z.string(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  localtime: Localtime
});