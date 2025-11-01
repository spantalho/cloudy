import { Card, CardContent } from "../ui/card";
import { useEffect, useState } from "react";
import { CloudRain, Droplets, ThermometerSun, Wind } from "lucide-react";
import { fetchForecast } from "@/services/forecast-service";
import { Skeleton } from "@/components/ui/skeleton";
import { useCity } from "@/contexts/city-context";
import { useTranslation } from "react-i18next";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useMediaQuery } from "@uidotdev/usehooks";
import { useQuery } from "@tanstack/react-query";

import type { ModelDay } from "@/interfaces";
import { useUnit } from "@/hooks/use-unit";
import { useConfig } from "@/contexts/config-context";

export default function ForecastSummaryCard() {
  const [forecast, setForecast] = useState<ModelDay | undefined>();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  const { tempUnit, speedUnit } = useUnit();
  const { city } = useCity();
  const { t } = useTranslation();
  const { appConfig } = useConfig();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["forecast", appConfig, city, false, 1],
    queryFn: () => fetchForecast(city, appConfig, false, 1),
  });

  useEffect(() => {
    if (!data) return;
    const day =
      Array.isArray(data.forecast) && data.forecast.length > 0
        ? data.forecast[0]
        : undefined;
    setForecast(day);
  }, [data]);

  useEffect(() => {
    if (!carouselApi) return;

    setCount(carouselApi.scrollSnapList().length);
    setCurrent(carouselApi.selectedScrollSnap() + 1);

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap() + 1);
    });
  }, [carouselApi]);

  if (isError) {
    console.error(`Error: ${(error as any).message}`);
  }

  if (isLoading || !city || !forecast) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  return (
    <div className={`flex flex-col items-center ${isDesktop ? "" : "my-10"}`}>
      <Carousel
        setApi={setCarouselApi}
        opts={{ align: "start" }}
        className="transition-colors w-full"
        orientation={`${isDesktop ? "horizontal" : "vertical"}`}
      >
        <CarouselContent className="cursor-grab h-[200px]">
          <CarouselItem className="md:basis-1/2 lg:basis-1/3">
            <Card className="transition-colors">
              <CardContent className="h-[125px] flex flex-col gap-2 items-center">
                <ThermometerSun
                  size={38}
                  className="w-10 h-10 text-primary/70"
                />
                <p>{t("temp")}</p>
                <ul className="flex w-full justify-around text-xs text-primary/70">
                  <li>{t("avg")}</li>
                  <li>{t("max")}</li>
                  <li>{t("min")}</li>
                </ul>
                <ul className="flex w-full justify-around text-nowrap text-sm">
                  <li>
                    {Math.trunc(
                      tempUnit === "celsius"
                        ? forecast.temp.avgC
                        : forecast.temp.avgF
                    )}
                    °
                  </li>
                  <li>
                    {Math.trunc(
                      tempUnit === "celsius"
                        ? forecast.temp.maxC
                        : forecast.temp.maxF
                    )}
                    °
                  </li>
                  <li>
                    {Math.trunc(
                      tempUnit === "celsius"
                        ? forecast.temp.minC
                        : forecast.temp.minF
                    )}
                    °
                  </li>
                </ul>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="md:basis-1/2 lg:basis-1/3">
            <Card className="transition-colors">
              <CardContent className="h-[125px] flex flex-col gap-2 items-center">
                <CloudRain size={38} className="text-primary/70" />
                <p>{t("rain")}</p>
                <span className=" text-xs text-primary/70">{t("prob")}</span>
                <span className="text-sm">{forecast.chanceOfRain}%</span>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="md:basis-1/2 lg:basis-1/3">
            <Card className="transition-colors">
              <CardContent className="h-[125px] flex flex-col gap-2 items-center">
                <Droplets size={38} className="w-10 h-10 text-primary/70" />
                <p>{t("humidity")}</p>
                <span className=" text-xs text-primary/70">{t("avg")}</span>
                <span className="text-sm">{forecast.humidity}%</span>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="md:basis-1/2 lg:basis-1/3">
            <Card className="transition-colors">
              <CardContent className="h-[125px] flex flex-col gap-2 items-center">
                <Wind className="w-10 h-10 text-primary/70" />
                <p>{t("wind")}</p>
                <span className="text-xs text-primary/70">{t("max")}</span>
                <span className="text-sm">
                  {speedUnit === "kmh"
                    ? forecast.maxWind.kph
                    : forecast.maxWind.mph}{" "}
                  {speedUnit === "kmh" ? "km/h" : speedUnit}
                </span>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className={`${isDesktop ? "" : "-top-12"}`} />
        <CarouselNext className={`${isDesktop ? "" : "-bottom-10"}`} />
      </Carousel>
      {current && count && isDesktop && (
        <div className="-mt-1.5 flex gap-1">
          {Array.from({ length: count }).map((_, i) => (
            <span
              key={i}
              className={`delay-300 transition-all p-1 rounded-full ${
                current === i + 1 ? "px-2 bg-primary/70" : "bg-primary/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
