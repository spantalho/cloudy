export interface Condition {
  text: string;
  code: number;
}

export interface Wind {
  kph: number;
  mph: number;
}

export interface Precip {
  mm: number;
  in: number;
}

export interface Localtime {
  epoch: number;
  localtime: string;
}

export interface TemperatureDay {
  maxC: number;
  minC: number;
  avgC: number;
  maxF: number;
  minF: number;
  avgF: number;
}

export interface TemperatureHour {
  c: number;
  f: number;
}

export interface Location {
  name: string;
  region: string;
  country: string;
  tzId: string;
  lat?: number;
  lon?: number;
  localtime: Localtime;
}
