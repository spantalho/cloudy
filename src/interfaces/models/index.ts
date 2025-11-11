import type {
  Condition,
  Localtime,
  Precip,
  TemperatureDay,
  TemperatureHour,
  Wind,
} from "../common";

export interface ModelHour {
  time: string;
  timeEpoch?: number;
  humidity?: number;
  isDay?: boolean;
  chanceOfRain: number;
  chanceOfSnow: number;
  uv?: number;
  temp: TemperatureHour;
  wind: Wind;
  condition: Condition;
  precip: Precip;
  snowCm?: number;
}

export interface ModelLocation {
  name: string;
  region: string;
  country: string;
  tzId: string;
  lat?: number;
  lon?: number;
  localtime: Localtime;
}

export interface ModelDay {
  date: string;
  dateEpoch: number;
  humidity?: number;
  willRain?: boolean;
  willSnow?: boolean;
  chanceOfRain: number;
  chanceOfSnow: number;
  maxWind: Wind;
  temp: TemperatureDay;
  condition: Condition;
  hours: ModelHour[];
}

export interface ModelCurrent {
  lastUpdated?: string;
  temp: TemperatureHour;
  feelslike?: { c: number; f: number };
  isDay?: boolean;
  condition: Condition;
  cloud?: number;
  humidity?: number;
  uv?: number;
  wind: Wind;
  precip: Precip;
}

export interface ModelSearchItem {
  id: number;
  name: string;
  region?: string;
  country?: string;
  lat?: number;
  lon?: number;
}