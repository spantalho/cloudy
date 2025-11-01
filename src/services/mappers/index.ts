import type {
  ModelCurrent,
  ModelDay,
  ModelLocation,
  ModelSearchItem,
  ModelSession,
} from "@/interfaces";
import type { ApiForecast } from "../schema/forecast";
import type { ApiWeather } from "../schema/weather";
import type { ApiSearchItemType } from "../schema/search";
import type { ApiSessionType } from "../schema/session";

export function mapApiHour(
  api: ApiForecast["forecast"][number]["hours"][number]
) {
  return {
    time: api.time,
    timeEpoch: api.time_epoch,
    humidity: api.humidity,
    isDay: Boolean(api.is_day),
    chanceOfRain: api.chance_of_rain,
    chanceOfSnow: api.chance_of_snow,
    uv: api.uv,
    temp: api.temp,
    condition: api.condition,
    precip: api.precip,
    snowCm: api.snow_cm,
    wind: api.wind,
  };
}

export function mapApiDay(api: ApiForecast["forecast"][number]): ModelDay {
  return {
    date: api.date,
    dateEpoch: api.date_epoch,
    humidity: api.humidity,
    willRain: Boolean(api.will_rain),
    willSnow: Boolean(api.will_snow),
    chanceOfRain: api.chance_of_rain,
    chanceOfSnow: api.chance_of_snow,
    maxWind: api.max_wind,
    temp: {
      maxC: api.temp.max_c,
      minC: api.temp.min_c,
      avgC: api.temp.avg_c,
      maxF: api.temp.max_f,
      minF: api.temp.min_f,
      avgF: api.temp.avg_f,
    },
    condition: api.condition,
    hours: Array.isArray(api.hours) ? api.hours.map(mapApiHour) : undefined,
  };
}

function mapApiCurrent(api: ApiWeather["current"]): ModelCurrent {
  return {
    lastUpdated: api.last_updated,
    temp: api.temp,
    feelslike: api.feelslike,
    isDay: Boolean(api.is_day),
    condition: api.condition,
    cloud: api.cloud,
    humidity: api.humidity,
    uv: api.uv,
    wind: api.wind,
    precip: api.precip,
  };
}

function mapApiLocation(api: ApiForecast["location"]): ModelLocation {
  return {
    name: api.name,
    region: api.region,
    country: api.country,
    tzId: api.tz_id,
    lat: api.lat || undefined,
    lon: api.lon || undefined,
    localtime: {
      epoch: api.localtime.epoch ?? 0,
      localtime: api.localtime.localtime ?? "",
    },
  };
}

export function mapApiSessionToModel(api: ApiSessionType): ModelSession {
  const expiresAt =
    api.expires_in != null ? Date.now() + api.expires_in * 1000 : null;
  return {
    token: api.token ?? null,
    expiresIn: api.expires_in ?? null,
    expiresAt: expiresAt,
    message: api.message ?? undefined,
  };
}

export function mapApiSearchItemToModel(
  item: ApiSearchItemType
): ModelSearchItem {
  return {
    id: item.id,
    name: item.name,
    region: item.region ?? undefined,
    country: item.country ?? undefined,
    lat: item.lat,
    lon: item.lon,
  };
}

export function mapApiSearchToModel(api: ApiSearchItemType[]) {
  return api.map(mapApiSearchItemToModel);
}

export function mapApiForecastToModel(api: ApiForecast) {
  return {
    location: api.location ? mapApiLocation(api.location) : undefined,
    forecast: Array.isArray(api.forecast) ? api.forecast.map(mapApiDay) : [],
  } as {
    location?: ModelLocation;
    forecast: ModelDay[];
  };
}

export function mapApiWeatherToModel(api: ApiWeather) {
  return {
    location: api.location ? mapApiLocation(api.location) : undefined,
    current: api.current ? mapApiCurrent(api.current) : undefined,
  } as {
    location?: ModelLocation;
    current: ModelCurrent;
  };
}
