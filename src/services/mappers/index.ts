import type * as interfaces from "@/interfaces";
import type { ApiForecast } from "../schema/forecast";
import type { ApiWeather } from "../schema/weather";
import type { ApiSearchItemType } from "../schema/search";

const DEFAULT_CONDITION: interfaces.Condition = { text: "", code: 1000 };
const DEFAULT_TEMP_HOUR: interfaces.TemperatureHour = { c: 0, f: 32 };
const DEFAULT_TEMP_DAY: interfaces.TemperatureDay = {
  maxC: 0,
  minC: 0,
  avgC: 0,
  maxF: 32,
  minF: 32,
  avgF: 32,
};

const DEFAULT_WIND: interfaces.Wind = { kph: 0, mph: 0 };
const DEFAULT_PRECIP: interfaces.Precip = { mm: 0, in: 0 };

export function mapApiHour(
  api: ApiForecast["forecast"][number]["hours"][number]
): interfaces.ModelHour {
  return {
    time: api?.time ?? "",
    timeEpoch: api?.time_epoch ?? undefined,
    humidity: api?.humidity ?? undefined,
    isDay: api?.is_day != null ? Boolean(api.is_day) : undefined,
    chanceOfRain: api?.chance_of_rain ?? 0,
    chanceOfSnow: api?.chance_of_snow ?? 0,
    uv: api?.uv ?? undefined,
    temp:
      api?.temp != null
        ? {
          c:
            (api.temp as any).c ?? (api as any).temp_c ?? DEFAULT_TEMP_HOUR.c,
          f:
            (api.temp as any).f ?? (api as any).temp_f ?? DEFAULT_TEMP_HOUR.f,
        }
        : DEFAULT_TEMP_HOUR,
    condition:
      api?.condition != null
        ? {
          text: api.condition.text ?? "",
          code: api.condition.code ?? DEFAULT_CONDITION.code,
        }
        : DEFAULT_CONDITION,
    precip:
      api?.precip != null
        ? {
          mm: api.precip.mm ?? (api as any).precip_mm ?? DEFAULT_PRECIP.mm,
          in:
            (api.precip as any)?.in ??
            (api as any).precip_in ??
            DEFAULT_PRECIP.in,
        }
        : DEFAULT_PRECIP,
    snowCm: api?.snow_cm ?? undefined,
    wind:
      api?.wind != null
        ? {
          kph:
            (api.wind as any).kph ??
            (api.wind as any).wind_kph ??
            (api as any).wind_kph ??
            DEFAULT_WIND.kph,
          mph:
            (api.wind as any).mph ??
            (api.wind as any).wind_mph ??
            (api as any).wind_mph ??
            DEFAULT_WIND.mph,
        }
        : DEFAULT_WIND,
  };
}

export function mapApiDay(api: ApiForecast["forecast"][number]): interfaces.ModelDay {
  const tempDay: interfaces.TemperatureDay = api?.temp
    ? {
      maxC: api.temp.max_c ?? (api.temp as any).maxC ?? DEFAULT_TEMP_DAY.maxC,
      minC: api.temp.min_c ?? (api.temp as any).minC ?? DEFAULT_TEMP_DAY.minC,
      avgC: api.temp.avg_c ?? (api.temp as any).avgC ?? DEFAULT_TEMP_DAY.avgC,
      maxF: api.temp.max_f ?? (api.temp as any).maxF ?? DEFAULT_TEMP_DAY.maxF,
      minF: api.temp.min_f ?? (api.temp as any).minF ?? DEFAULT_TEMP_DAY.minF,
      avgF: api.temp.avg_f ?? (api.temp as any).avgF ?? DEFAULT_TEMP_DAY.avgF,
    }
    : DEFAULT_TEMP_DAY;

  const hours = Array.isArray(api?.hours) ? api.hours.map(mapApiHour) : [];

  return {
    date: api?.date ?? "",
    dateEpoch: api?.date_epoch ?? 0,
    humidity: api?.humidity ?? undefined,
    willRain: api?.will_rain != null ? Boolean(api.will_rain) : undefined,
    willSnow: api?.will_snow != null ? Boolean(api.will_snow) : undefined,
    chanceOfRain: api?.chance_of_rain ?? 0,
    chanceOfSnow: api?.chance_of_snow ?? 0,
    maxWind:
      api?.max_wind != null
        ? {
          kph:
            (api.max_wind as any).kph ??
            (api.max_wind as any).wind_kph ??
            (api as any).max_wind_kph ??
            DEFAULT_WIND.kph,
          mph:
            (api.max_wind as any).mph ??
            (api.max_wind as any).wind_mph ??
            (api as any).max_wind_mph ??
            DEFAULT_WIND.mph,
        }
        : DEFAULT_WIND,
    temp: tempDay,
    condition:
      api?.condition != null
        ? {
          text: api.condition.text ?? "",
          code: api.condition.code ?? DEFAULT_CONDITION.code,
        }
        : DEFAULT_CONDITION,
    hours,
  };
}

function mapApiCurrent(api: ApiWeather["current"]): interfaces.ModelCurrent {
  return {
    lastUpdated: api?.last_updated ?? undefined,
    temp:
      api?.temp != null
        ? {
          c:
            (api.temp as any).c ??
            (api.temp as any).temp_c ??
            DEFAULT_TEMP_HOUR.c,
          f:
            (api.temp as any).f ??
            (api.temp as any).temp_f ??
            DEFAULT_TEMP_HOUR.f,
        }
        : DEFAULT_TEMP_HOUR,
    feelslike:
      api?.feelslike != null
        ? {
          c:
            (api.feelslike as any).c ??
            (api.feelslike as any).feelslike_c ??
            undefined,
          f:
            (api.feelslike as any).f ??
            (api.feelslike as any).feelslike_f ??
            undefined,
        }
        : undefined,
    isDay: api?.is_day != null ? Boolean(api.is_day) : undefined,
    condition:
      api?.condition != null
        ? {
          text: api.condition.text ?? "",
          code: api.condition.code ?? DEFAULT_CONDITION.code,
        }
        : DEFAULT_CONDITION,
    cloud: api?.cloud ?? undefined,
    humidity: api?.humidity ?? undefined,
    uv: api?.uv ?? undefined,
    wind:
      api?.wind != null
        ? {
          kph:
            (api.wind as any).kph ??
            (api.wind as any).wind_kph ??
            (api as any).wind_kph ??
            DEFAULT_WIND.kph,
          mph:
            (api.wind as any).mph ??
            (api.wind as any).wind_mph ??
            (api as any).wind_mph ??
            DEFAULT_WIND.mph,
        }
        : DEFAULT_WIND,
    precip:
      api?.precip != null
        ? {
          mm:
            api.precip.mm ??
            (api.precip as any).precip_mm ??
            DEFAULT_PRECIP.mm,
          in:
            (api.precip as any)?.in ??
            (api.precip as any).precip_in ??
            DEFAULT_PRECIP.in,
        }
        : DEFAULT_PRECIP,
  };
}

function mapApiLocation(api: ApiForecast["location"]): interfaces.ModelLocation {
  if (!api) {
    return {
      name: "",
      region: "",
      country: "",
      tzId: "",
      lat: 0,
      lon: 0,
      localtime: { epoch: 0, localtime: "" },
    };
  }

  const rawLocal = (api as any).localtime;
  const rawEpoch = (api as any).localtime_epoch;

  let localtime: { epoch: number; localtime: string } | undefined;

  if (rawLocal && typeof rawLocal === "object") {
    localtime = {
      epoch: Number(rawLocal.epoch ?? rawEpoch ?? 0),
      localtime: String(rawLocal.localtime ?? rawLocal?.local_time ?? ""),
    };
  } else if (typeof rawLocal === "string") {
    localtime = {
      epoch: Number(rawEpoch ?? 0),
      localtime: rawLocal,
    };
  } else if (rawEpoch != null) {
    localtime = {
      epoch: Number(rawEpoch),
      localtime: "",
    };
  } else {
    localtime = { epoch: 0, localtime: "" };
  }

  return {
    name: api.name ?? "",
    region: api.region ?? "",
    country: api.country ?? "",
    tzId: (api as any).tz_id ?? (api as any).tzId ?? "",
    lat: typeof api.lat === "number" ? api.lat : 0,
    lon: typeof api.lon === "number" ? api.lon : 0,
    localtime,
  };
}

export function mapApiSearchItemToModel(
  item: ApiSearchItemType
): interfaces.ModelSearchItem {
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

export function mapApiForecastToModel(api: ApiForecast): interfaces.Forecast {
  return {
    location: mapApiLocation(api.location as any),
    forecast: Array.isArray(api.forecast) ? api.forecast.map(mapApiDay) : [],
  };
}

export function mapApiWeatherToModel(api: ApiWeather) {
  return {
    location: api.location ? mapApiLocation(api.location) : (undefined as any),
    current: api.current
      ? mapApiCurrent(api.current)
      : mapApiCurrent({} as any),
  } as {
    location?: interfaces.ModelLocation;
    current: interfaces.ModelCurrent;
  };
}
