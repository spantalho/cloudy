import type { ModelCurrent, ModelDay, ModelLocation } from "../models";

export interface Forecast {
  location: ModelLocation;
  forecast: ModelDay[];
}

export interface Weather {
  location: ModelLocation;
  current: ModelCurrent;
}