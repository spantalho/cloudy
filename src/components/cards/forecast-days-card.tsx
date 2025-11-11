import { useEffect, useState } from "react";
import * as card from "../ui/card";
import WeatherIcon from "@/utils/weather-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useCity } from "@/contexts/city-context";
import { formateDateDay } from "@/utils/format-date";
import { useTranslation } from "react-i18next";
import type { Forecast, ModelDay } from "@/interfaces";
import { useLang } from "@/hooks/use-lang";
import { useUnit } from "@/hooks/use-unit";
import { useConfig } from "@/contexts/config-context";
import { useForecast } from "@/hooks/services/use-forecast";

export default function ForecastDaysCard() {
  const [location, setLocation] = useState<Forecast["location"]>()
  const [days, setDays] = useState<Forecast["forecast"]>([]);
  const { city } = useCity();
  const { t } = useTranslation();
  const { lang } = useLang();
  const { tempUnit } = useUnit();
  const { appConfig } = useConfig();

  const { data, isLoading, isError, error } = useForecast(
    city,
    appConfig,
    false,
    3
  );

  useEffect(() => {
    if (!data) return;
    setDays(Array.isArray(data.forecast) ? data.forecast : []);
    setLocation(data.location ?? null)
  }, [data]);

  if (isError) {
    console.error(`Error: ${(error as any).message}`);
  }

  if (isLoading || !city || days.length === 0) {
    return <Skeleton className="w-full h-[230px]" />;
  }

  return (
    <card.Card id="forecast" className="transition-colors pointer-events-none">
      <card.CardHeader className="text-center md:text-start">
        <card.CardTitle className="font-normal font-unbounded tracking-tight">
          {t("titles.forecast.title")}
        </card.CardTitle>
        <card.CardDescription>
          {t("titles.forecast.description", { days: days.length - 1 })}
        </card.CardDescription>
      </card.CardHeader>
      <card.CardContent className="flex flex-col gap-5 justify-around md:flex-row">
        {days.map((day: ModelDay) => (
          <div
            key={day.date}
            className="transition-colors items-center flex flex-col gap-1.5 px-3 py-1 rounded-lg"
          >
            <span className="text-base font-light text-muted capitalize">
              {formateDateDay(day.date, { lang: lang, short: true, timezone: location?.tzId })}
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
              <p className="font-semibold text-xs text-muted">
                {Math.trunc(
                  tempUnit === "celsius" ? day.temp.minC : day.temp.minF
                )}
                °
              </p>
            </div>
          </div>
        ))}
      </card.CardContent>
    </card.Card>
  );
}
