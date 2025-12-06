import * as card from "../ui/card";
import { useEffect, useState } from "react";
import * as lucide from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCity } from "@/contexts/city-context";
import { useTranslation } from "react-i18next";

import { useMediaQuery } from "@uidotdev/usehooks";

import type { ModelDay } from "@/interfaces";
import { useUnit } from "@/hooks/use-unit";
import { useConfig } from "@/contexts/config-context";
import { useForecast } from "@/hooks/services/use-forecast";

export default function ForecastSummaryCard() {
  const [forecast, setForecast] = useState<ModelDay | undefined>();
  const [current, setCurrent] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  const { tempUnit, speedUnit } = useUnit();
  const { city } = useCity();
  const { t } = useTranslation();
  const { appConfig } = useConfig();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data, isLoading, isError, error } = useForecast(
    city,
    appConfig,
    false,
    1
  );

  useEffect(() => {
    if (!data) return;
    const day =
      Array.isArray(data.forecast) && data.forecast.length > 0
        ? data.forecast[0]
        : undefined;
    setForecast(day);
  }, [data]);

  if (isError) {
    console.error(`Error: ${(error as any).message}`);
  }

  if (isLoading || !city || !forecast) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  // return (
  //   <div className={`flex flex-col items-center ${isDesktop ? "" : "my-10"}`}>
  //     <carousel.Carousel
  //       setApi={setCarouselApi}
  //       opts={{ align: "start" }}
  //       className="transition-colors w-full"
  //       orientation={`${isDesktop ? "horizontal" : "vertical"}`}
  //     >
  //       <carousel.CarouselContent className="cursor-grab h-[200px]">
  //         <carousel.CarouselItem className="md:basis-1/2 lg:basis-1/3">
  //           <card.Card className="transition-colors">
  //             <card.CardContent className="h-[125px] flex flex-col gap-2 items-center">
  //               <lucideReact.ThermometerSun
  //                 size={38}
  //                 className="w-10 h-10 text-muted"
  //               />
  //               <p>{t("common.temp")}</p>
  //               <ul className="flex w-full justify-around text-xs text-muted">
  //                 <li>{t("common.avg")}</li>
  //                 <li>{t("common.max")}</li>
  //                 <li>{t("common.min")}</li>
  //               </ul>
  //               <ul className="flex w-full justify-around text-nowrap text-sm">
  //                 <li>
  //                   {Math.trunc(
  //                     tempUnit === "celsius"
  //                       ? forecast.temp.avgC
  //                       : forecast.temp.avgF
  //                   )}
  //                   °
  //                 </li>
  //                 <li>
  //                   {Math.trunc(
  //                     tempUnit === "celsius"
  //                       ? forecast.temp.maxC
  //                       : forecast.temp.maxF
  //                   )}
  //                   °
  //                 </li>
  //                 <li>
  //                   {Math.trunc(
  //                     tempUnit === "celsius"
  //                       ? forecast.temp.minC
  //                       : forecast.temp.minF
  //                   )}
  //                   °
  //                 </li>
  //               </ul>
  //             </card.CardContent>
  //           </card.Card>
  //         </carousel.CarouselItem>
  //         <carousel.CarouselItem className="md:basis-1/2 lg:basis-1/3">
  //           <card.Card className="transition-colors">
  //             <card.CardContent className="h-[125px] flex flex-col gap-2 items-center">
  //               <lucideReact.CloudRain size={38} className="text-muted" />
  //               <p>{t("weather.rain")}</p>
  //               <span className=" text-xs text-muted">{t("common.prob")}</span>
  //               <span className="text-sm">{forecast.chanceOfRain}%</span>
  //             </card.CardContent>
  //           </card.Card>
  //         </carousel.CarouselItem>
  //         <carousel.CarouselItem className="md:basis-1/2 lg:basis-1/3">
  //           <card.Card className="transition-colors">
  //             <card.CardContent className="h-[125px] flex flex-col gap-2 items-center">
  //               <lucideReact.Droplets size={38} className="w-10 h-10 text-muted" />
  //               <p>{t("weather.humidity")}</p>
  //               <span className=" text-xs text-muted">{t("common.avg")}</span>
  //               <span className="text-sm">{forecast.humidity}%</span>
  //             </card.CardContent>
  //           </card.Card>
  //         </carousel.CarouselItem>
  //         <carousel.CarouselItem className="md:basis-1/2 lg:basis-1/3">
  //           <card.Card className="transition-colors">
  //             <card.CardContent className="h-[125px] flex flex-col gap-2 items-center">
  //               <lucideReact.Wind className="w-10 h-10 text-muted" />
  //               <p>{t("weather.wind")}</p>
  //               <span className="text-xs text-muted">{t("common.max")}</span>
  //               <span className="text-sm">
  //                 {speedUnit === "kmh"
  //                   ? forecast.maxWind.kph
  //                   : forecast.maxWind.mph}{" "}
  //                 {speedUnit === "kmh" ? "km/h" : speedUnit}
  //               </span>
  //             </card.CardContent>
  //           </card.Card>
  //         </carousel.CarouselItem>
  //       </carousel.CarouselContent>
  //       {/* <carousel.CarouselPrevious className={`${isDesktop ? "" : "-top-12"}`} /> */}
  //       {/* <carousel.CarouselNext className={`${isDesktop ? "" : "-bottom-10"}`} /> */}
  //     </carousel.Carousel>
  //     {current && count && isDesktop && (
  //       <div className="-mt-1.5 flex gap-1">
  //         {Array.from({ length: count }).map((_, i) => (
  //           <span
  //             key={i}
  //             className={`delay-300 transition-all p-1 rounded-full ${current === i + 1 ? "px-2 bg-primary/70" : "bg-primary/30"
  //               }`}
  //           />
  //         ))}
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <card.Card>
      <card.CardHeader>
        <card.CardTitle className="text-xl tracking-tight">Day Details</card.CardTitle>
      </card.CardHeader>
      <card.CardContent>
        <div className="flex flex-col gap-2">
          <ul>
            <li className="flex w-full justify-between">
              <div className="flex gap-2 text-sm items-center text-muted">
                <lucide.Umbrella size={22}/>
                <span>Precipitação</span>
              </div>
              22%
            </li>
          </ul>
        </div>
      </card.CardContent>
    </card.Card>
  )
}
