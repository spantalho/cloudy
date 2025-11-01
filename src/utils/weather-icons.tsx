import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudDrizzle,
  CloudSunRain,
  Moon,
  Cloudy,
  CloudMoon,
  CloudMoonRain,
} from "lucide-react";
import type { JSX } from "react";

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  size?: number;
  className?: string;
}

/**
 * https://www.weatherapi.com/docs/weather_conditions.json
 */

const weatherCodeMap: Record<
  number,
  (props: { isDay?: boolean; size: number; className?: string }) => JSX.Element
> = {
  1000: ({ isDay, size, className }) =>
    isDay ? (
      <Sun size={size} className={className} />
    ) : (
      <Moon size={size} className={className} />
    ),

  1003: ({ isDay, size, className }) =>
    isDay ? (
      <CloudSun size={size} className={className} />
    ) : (
      <CloudMoon size={size} className={className} />
    ),

  1006: ({ size, className }) => <Cloud size={size} className={className} />,
  1009: ({ size, className }) => <Cloudy size={size} className={className} />,

  1030: ({ size, className }) => <CloudFog size={size} className={className} />,

  1063: ({ isDay, size, className }) =>
    isDay ? (
      <CloudSunRain size={size} className={className} />
    ) : (
      <CloudMoonRain size={size} className={className} />
    ),

  1150: ({ size, className }) => (
    <CloudDrizzle size={size} className={className} />
  ),
  1189: ({ size, className }) => (
    <CloudDrizzle size={size} className={className} />
  ),

  1183: ({ size, className }) => (
    <CloudRain size={size} className={className} />
  ),

  1195: ({ size, className }) => (
    <CloudRain size={size} className={className} />
  ),

  1240: ({ size, className }) => (
    <CloudRain size={size} className={className} />
  ),

  1276: ({ size, className }) => (
    <CloudLightning size={size} className={className} />
  ),

  1210: ({ size, className }) => (
    <CloudSnow size={size} className={className} />
  ),

  1135: ({ size, className }) => <CloudFog size={size} className={className} />,
};

export default function WeatherIcon({
  isDay = true,
  code,
  size = 32,
  className,
}: WeatherIconProps) {
  const Icon = weatherCodeMap[code];

  if (Icon) {
    return <Icon isDay={isDay} size={size} className={className} />;
  }

  return <Cloud size={size} className={className} />;
}
