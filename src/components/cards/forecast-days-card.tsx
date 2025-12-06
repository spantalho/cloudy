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
import * as carousel from "../ui/carousel";
import { Label } from "../ui/label";

export default function ForecastDaysCard() {
  const [location, setLocation] = useState<Forecast["location"]>();
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
    setLocation(data.location ?? null);
  }, [data]);

  if (isError) {
    console.error(`Error: ${(error as any).message}`);
  }

  if (isLoading || !city || days.length === 0) {
    return <Skeleton className="w-full h-[60px] shadow" />;
  }

  // return (
  //   <card.Card id="forecast" className="transition-colors pointer-events-none">
  //     <card.CardHeader className="text-center md:text-start">
  //       <card.CardTitle className="font-normal font-unbounded tracking-tight">
  //         {t("titles.forecast.title")}
  //       </card.CardTitle>
  //       <card.CardDescription>
  //         {t("titles.forecast.description", { days: days.length - 1 })}
  //       </card.CardDescription>
  //     </card.CardHeader>
  //     <card.CardContent className="flex flex-col gap-5 justify-around md:flex-row">
  //       {days.map((day: ModelDay) => (
  //         <div
  //           key={day.date}
  //           className="transition-colors items-center flex flex-col gap-1.5 px-3 py-1 rounded-lg"
  //         >
  //           <span className="text-base font-light text-muted capitalize">
  //             {formateDateDay(day.date, { lang: lang, short: true, timezone: location?.tzId })}
  //           </span>
  //           <WeatherIcon isDay={true} code={day.condition.code} size={38} />
  //           {day.chanceOfRain > 0 && (
  //             <span className="text-xs text-indigo-500 dark:text-indigo-300">
  //               {day.chanceOfRain}%
  //             </span>
  //           )}
  //           <div className="flex gap-1">
  //             <p className="font-semibold text-xs">
  //               {Math.trunc(
  //                 tempUnit === "celsius" ? day.temp.maxC : day.temp.maxF
  //               )}
  //               °
  //             </p>
  //             <p className="font-semibold text-xs text-muted">
  //               {Math.trunc(
  //                 tempUnit === "celsius" ? day.temp.minC : day.temp.minF
  //               )}
  //               °
  //             </p>
  //           </div>
  //         </div>
  //       ))}
  //     </card.CardContent>
  //   </card.Card>
  // );

  return (
    <carousel.Carousel
      opts={{ align: "start" }}
      className="transition-colors w-full"
      orientation="horizontal"
    >
      <carousel.CarouselContent>
        {days.map((day: ModelDay) => (
          <carousel.CarouselItem className="md:basis-1/2 lg:basis-1/3">
            <card.Card className="cursor-pointer transition-colors hover:border-primary">
              <card.CardContent className="flex flex-col justify-between min-h-[130px]">
                <Label className="tracking-tight text-xl capitalize">
                  <WeatherIcon code={day.condition.code} isDay={true} />
                  {formateDateDay(day.date, {
                    lang,
                    short: true,
                    timezone: location?.tzId,
                  })}
                </Label>
                <div className="flex flex-col gap-1">
                  <p className="text-muted">{day.condition.text}</p>
                  <div className="flex gap-2 text-2xl">
                    <span>{day.temp.maxC}°</span>
                    <span className="text-muted">{day.temp.minC}°</span>
                  </div>
                </div>
              </card.CardContent>
            </card.Card>
          </carousel.CarouselItem>
        ))}
      </carousel.CarouselContent>
    </carousel.Carousel>
  );
}
