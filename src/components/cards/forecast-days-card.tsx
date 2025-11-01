import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import WeatherIcon from "@/utils/weather-icons";
import { fetchForecast } from "@/services/forecast-service";
import { Skeleton } from "@/components/ui/skeleton";
import { useCity } from "@/contexts/city-context";
import { formateDateDay } from "@/utils/format-date";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import type { Forecast, ModelDay } from "@/interfaces";
import { useLang } from "@/hooks/use-lang";
import { useUnit } from "@/hooks/use-unit";
import { useConfig } from "@/contexts/config-context";

export default function ForecastDaysCard() {
  const [days, setDays] = useState<Forecast["forecast"]>([]);
  const { city } = useCity();
  const { t } = useTranslation();
  const { lang } = useLang();
  const { tempUnit } = useUnit();
  const { appConfig } = useConfig();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["forecast", appConfig, city, 3],
    queryFn: () => fetchForecast(city, appConfig, false, 3),
  });

  useEffect(() => {
    if (!data) return;
    setDays(Array.isArray(data.forecast) ? data.forecast : []);
  }, [data]);

  if (isError) {
    console.error(`Error: ${(error as any).message}`);
  }

  if (isLoading || !city || days.length === 0) {
    return <Skeleton className="w-full h-[230px]" />;
  }

  return (
    <Card className="transition-colors pointer-events-none">
      <CardHeader className="text-center md:text-start">
        <CardTitle className="font-unbounded tracking-tight">
          {t("titles.forecast.title")}
        </CardTitle>
        <CardDescription>
          {t("titles.forecast.description", { days: days.length })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col  gap-5 justify-around md:flex-row">
        {days.map((day: ModelDay) => (
          <div
            key={day.date}
            className="transition-colors items-center flex flex-col gap-1.5 px-3 py-1 rounded-lg"
          >
            <span className="font-light text-primary/70">
              {formateDateDay(day.date, { lang: lang, short: true })}
            </span>
            <WeatherIcon isDay={true} code={day.condition.code} size={38} />
            {day.chanceOfRain > 0 && (
              <span className="text-xs text-indigo-500 dark:text-indigo-300">
                {day.chanceOfRain}%
              </span>
            )}
            <div className="flex gap-1">
              <p className="font-semibold text-xs">
                {Math.trunc(
                  tempUnit === "celsius" ? day.temp.maxC : day.temp.maxF
                )}
                °
              </p>
              <p className="font-semibold text-xs text-primary/70">
                {Math.trunc(
                  tempUnit === "celsius" ? day.temp.minC : day.temp.minF
                )}
                °
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
