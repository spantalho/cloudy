import { Cloudy, Droplets, Radiation, Thermometer, Wind } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { useCity } from "@/contexts/city-context";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";
import { fetchWeather } from "@/services/weather-service";
import { useQuery } from "@tanstack/react-query";
import { useMediaQuery } from "@uidotdev/usehooks";
import { formatDate } from "@/utils/format-date";
import WeatherIcon from "@/utils/weather-icons";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { Location, Weather } from "@/interfaces";
import { useUnit } from "@/hooks/use-unit";
import { useLang } from "@/hooks/use-lang";
import { useConfig } from "@/contexts/config-context";

export default function WeatherCurrentCard() {
  const [location, setLocation] = useState<Location>();
  const [weather, setWeather] = useState<Weather["current"]>();

  const { city } = useCity();
  const { lang } = useLang();
  const { speedUnit, tempUnit } = useUnit();
  const { t } = useTranslation();
  const { appConfig } = useConfig();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["weather", appConfig, lang],
    queryFn: () => fetchWeather(city, appConfig, lang),
  });

  useEffect(() => {
    if (!data) return;
    setLocation(data.location);
    setWeather(data.current);
  }, [data]);

  if (isError) {
    console.error(`Error: ${(error as any).message}`);
  }

  if (isLoading || !city || !weather || !location) {
    return <Skeleton className="w-full h-[230px]" />;
  }

  return (
    <Card className="transition-colors border-0 bg-gradient-to-r from-white to-sky-100 dark:from-black dark:to-sky-950/90">
      <CardHeader className="text-center md:text-start">
        <CardTitle className="pointer-events-none font-unbounded tracking-tight text-2xl md:text-lg">
          {location.name}, {location.country}
        </CardTitle>
        {isDesktop && (
          <CardDescription className="flex items-center justify-center md:justify-start">
            <span>{t("now")}</span>
            <Separator className="mx-2 h-4!" orientation="vertical" />
            <span>
              {formatDate(location.localtime.localtime, { lang: lang })}
            </span>
            <span className="ml-2">
              <Tooltip>
                <TooltipTrigger>
                  <span>({t("localtime").toLowerCase()})</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{location.tzId}</p>
                </TooltipContent>
              </Tooltip>
            </span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-8 text-center items-center md:gap-0 md:text-start md:justify-between md:flex-row">
        <div className="flex flex-col gap-2 pointer-events-none">
          <div className="flex gap-2 items-end justify-center md:justify-start">
            <WeatherIcon
              isDay={weather.isDay}
              code={weather.condition.code}
              size={isDesktop ? 48 : 56}
            />
            <h2 className="font-unbounded text-5xl md:text-4xl">
              {Math.trunc(
                tempUnit === "celsius" ? weather.temp.c : weather.temp.f
              )}
              °{tempUnit === "celsius" ? "C" : "F"}
            </h2>
          </div>
          <p className="text-2xl md:text-lg">{weather.condition.text}</p>
        </div>
        <ScrollArea className="h-full w-full p-2 rounded-md border shadow md:h-[100px] md:w-auto">
          <React.Fragment>
            <ul className="items-center text-sm flex flex-col md:text-xs">
              <li className="w-full flex justify-between items-center px-3 md:px-0 md:justify-start">
                <Cloudy
                  size={isDesktop ? 16 : 19}
                  className="mr-2 text-primary/70"
                />
                <span>
                  {t("cloudy")}: {weather.cloud}%
                </span>
              </li>
              <Separator className="my-2" />
              <li className="w-full flex justify-between items-center px-3 md:px-0 md:justify-start">
                <Thermometer
                  size={isDesktop ? 16 : 19}
                  className="mr-2 text-primary/70"
                />
                <span>
                  {t("feels_like")}:{" "}
                  {Math.trunc(
                    tempUnit === "celsius"
                      ? weather.feelslike.c
                      : weather.feelslike.f
                  )}
                  °{tempUnit === "celsius" ? "C" : "F"}
                </span>
              </li>
              <Separator className="my-2" />
              <li className="w-full flex justify-between items-center px-3 md:px-0 md:justify-start">
                <Droplets
                  size={isDesktop ? 16 : 19}
                  className="mr-2 text-primary/70"
                />
                <span>
                  {t("humidity")}: {weather.humidity}%
                </span>
              </li>
              <Separator className="my-2" />
              <li className="w-full flex justify-between items-center px-3 md:px-0 md:justify-start">
                <Wind
                  size={isDesktop ? 16 : 19}
                  className="mr-2 text-primary/70"
                />
                <span>
                  {t("wind")}:{" "}
                  {speedUnit === "kmh" ? weather.wind.kph : weather.wind.mph}{" "}
                  {speedUnit === "kmh" ? "km/h" : speedUnit}
                </span>
              </li>
              <Separator className="my-2" />
              <li className="w-full flex justify-between items-center px-3 md:px-0 md:justify-start">
                <Radiation
                  size={isDesktop ? 16 : 19}
                  className="mr-2 text-primary/70"
                />
                <span>
                  {t("uv")}: {weather.uv}
                </span>
              </li>
            </ul>
          </React.Fragment>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
