import * as lucideReact from "lucide-react";
import React, { useEffect, useState } from "react";
import * as card from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { useCity } from "@/contexts/city-context";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@uidotdev/usehooks";
import { formatDate } from "@/utils/format-date";
import WeatherIcon from "@/utils/weather-icons";

import * as tooltip from "../ui/tooltip";
import type { Location, Weather } from "@/interfaces";
import { useUnit } from "@/hooks/use-unit";
import { useLang } from "@/hooks/use-lang";
import { useConfig } from "@/contexts/config-context";
import { useWeather } from "@/hooks/services/use-weather";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";

export default function WeatherCurrentCard() {
  const [weather, setWeather] = useState<Weather["current"]>();
  const [location, setLocation] = useState<Location>();

  const { city } = useCity();
  const { lang } = useLang();
  const { speedUnit, tempUnit } = useUnit();
  const { t } = useTranslation();
  const { appConfig } = useConfig();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data, isLoading, isError, error } = useWeather(city, appConfig, lang);

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
    <card.Card
      id="current"
      className="transition-colors border-0 bg-gradient-to-tr from-white to-sky-100 dark:from-black dark:to-sky-950/90"
    >
      <card.CardHeader className="text-center md:text-start">
        <card.CardTitle className="max-w-xs font-normal tracking-tight font-unbounded capitalize">
          {t("titles.current.title")} <span className="tracking-tighter font-bold">{location.name}</span>
        </card.CardTitle>
      </card.CardHeader>
      <card.CardContent className="-mt-3 flex flex-col">
        <div className="flex flex-col gap-8 text-center items-center md:gap-0 md:text-start md:justify-between md:flex-row">
          <div className="flex flex-col gap-2 pointer-events-none">
            <div className="flex gap-2 items-end justify-center md:justify-start">
              <WeatherIcon
                isDay={weather.isDay}
                code={weather.condition.code}
                size={isDesktop ? 40 : 56}
              />
              <h2 className="font-unbounded text-5xl md:text-4xl">
                {Math.trunc(
                  tempUnit === "celsius" ? weather.temp.c : weather.temp.f
                )}
                °{tempUnit === "celsius" ? "C" : "F"}
              </h2>
            </div>
            <p className="text-2xl md:text-lg">{weather.condition.text}</p>
            {appConfig.ENV === "development" && <span className="text-[9px] text-muted">condition.code: {weather.condition.code}</span>}
          </div>
          <ScrollArea className="h-full w-full p-2 rounded-md border shadow md:h-[100px] md:w-auto">
            <React.Fragment>
              <ul className="items-center text-sm flex flex-col md:text-xs">
                <li className="w-full flex justify-between items-center px-3 md:px-0 md:justify-start">
                  <lucideReact.Cloudy
                    size={isDesktop ? 16 : 19}
                    className="mr-2 text-muted"
                  />
                  <span>
                    {t("weather.cloudy")}: {weather.cloud}%
                  </span>
                </li>
                <Separator className="my-2" />
                <li className="w-full flex justify-between items-center px-3 md:px-0 md:justify-start">
                  <lucideReact.Thermometer
                    size={isDesktop ? 16 : 19}
                    className="mr-2 text-muted"
                  />
                  <span>
                    {t("weather.feels_like")}:{" "}
                    {Math.trunc(
                      tempUnit === "celsius"
                        ? weather.feelslike?.c ?? 0
                        : weather.feelslike?.f ?? 0
                    )}
                    °{tempUnit === "celsius" ? "C" : "F"}
                  </span>
                </li>
                <Separator className="my-2" />
                <li className="w-full flex justify-between items-center px-3 md:px-0 md:justify-start">
                  <lucideReact.Droplets
                    size={isDesktop ? 16 : 19}
                    className="mr-2 text-muted"
                  />
                  <span>
                    {t("weather.humidity")}: {weather.humidity}%
                  </span>
                </li>
                <Separator className="my-2" />
                <li className="w-full flex justify-between items-center px-3 md:px-0 md:justify-start">
                  <lucideReact.Wind size={isDesktop ? 16 : 19} className="mr-2 text-muted" />
                  <span>
                    {t("weather.wind")}:{" "}
                    {speedUnit === "kmh" ? weather.wind.kph : weather.wind.mph}{" "}
                    {speedUnit === "kmh" ? "km/h" : speedUnit}
                  </span>
                </li>
                <Separator className="my-2" />
                <li className="w-full flex justify-between items-center px-3 md:px-0 md:justify-start">
                  <lucideReact.Radiation
                    size={isDesktop ? 16 : 19}
                    className="mr-2 text-muted"
                  />
                  <span>
                    {t("weather.uv")}: {weather.uv}
                  </span>
                </li>
              </ul>
            </React.Fragment>
          </ScrollArea>
        </div>
      </card.CardContent>
      <card.CardFooter className="flex justify-center md:justify-start">
        <Badge className="rounded-r-none">
          <lucideReact.Clock />
          <tooltip.Tooltip>
            <tooltip.TooltipTrigger>
              <Label className="text-xs">
                {formatDate(location.localtime.epoch, { lang: lang, timezone: location.tzId })}
              </Label>
            </tooltip.TooltipTrigger>
            <tooltip.TooltipContent>
              <p>{location.tzId}</p>
            </tooltip.TooltipContent>
          </tooltip.Tooltip>
        </Badge>
        <Badge className="-ml-0.5 rounded-l-none border border-border" variant="secondary">
          {location.region && (
            <Label className="text-xs">
              {location.region}
            </Label>
          )}
          {location.region && <Separator className="mx-1 h-4!" orientation="vertical" />}
          {location.country && (
            <Label className="text-xs">
              {location.country}
            </Label>
          )}
          <lucideReact.MapPin />
        </Badge>

      </card.CardFooter>
    </card.Card>
  );
}
