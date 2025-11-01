import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useEffect, useState } from "react";
import { fetchForecast } from "@/services/forecast-service";
import { Skeleton } from "../ui/skeleton";
import { useCity } from "@/contexts/city-context";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { ModelHour } from "@/interfaces";
import { useUnit } from "@/hooks/use-unit";
import { Link } from "../common/link";
import { useConfig } from "@/contexts/config-context";

export default function ForecastChartCard() {
  const [activeChart, setActiveChart] = useState<
    "temp" | "rain" | "snow" | "uv" | "humidity"
  >("temp");

  const [hours, setHours] = useState<ModelHour[]>([]);

  const { city } = useCity();
  const { t } = useTranslation();
  const { tempUnit } = useUnit();
  const { appConfig } = useConfig();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["forecast", appConfig, city, true, 1],
    queryFn: () => fetchForecast(city, appConfig, true, 1),
  });

  useEffect(() => {
    if (!data) return;
    const day = Array.isArray(data.forecast) ? data.forecast[0] : undefined;
    setHours(Array.isArray(day?.hours) ? (day!.hours as ModelHour[]) : []);
  }, [data]);

  if (isError) {
    console.error(`Error: ${(error as any).message}`);
  }

  if (isLoading || !city || hours.length === 0) {
    return <Skeleton className="w-full h-[350px]" />;
  }

  const maxSnow = Math.max(
    ...hours.map((h: ModelHour) => h.chanceOfSnow ?? 0),
    0
  );
  const maxRain = Math.max(
    ...hours.map((h: ModelHour) => h.chanceOfRain ?? 0),
    0
  );

  const rainShouldShowSnow: boolean = maxSnow > maxRain;

  const effectiveChartKey =
    activeChart === "rain" && rainShouldShowSnow ? "snow" : activeChart;

  const chartConfig = {
    temp: {
      label: `${t("temp")} (°${tempUnit === "celsius" ? "C" : "F"})`,
      color: "var(--temp-chart)",
    },
    rain: {
      label: `${t("titles.chart.rain")} (%)`,
      color: "var(--rain-chart)",
    },
    snow: {
      label: "Chance de Neve (%)",
      color: "var(--snow-chart)",
    },
    uv: {
      label: `${t("uv_full")} (${t("uv").toLowerCase()})`,
      color: "var(--uv-chart)",
    },
    humidity: {
      label: `${t("humidity")} (%)`,
      color: "var(--humidity-chart)",
    },
  } satisfies ChartConfig;

  const chartData = hours
    .map((h: ModelHour) => ({
      time: h.time.split(" ")[1].slice(0, 5), // ex.: "12:00"
      temp: Math.trunc(
        tempUnit === "celsius" ? h.temp?.c ?? 0 : h.temp?.f ?? 0
      ),
      rain: h.chanceOfRain ?? 0,
      snow: h.chanceOfSnow ?? 0,
      humidity: h.humidity ?? 0,
      uv: h.uv ?? 0,
    }))
    .slice(0, 24);

  if (!isDesktop) {
    return <div></div>;
  }

  return (
    <Card className="transition-colors bg-transparent">
      <CardFooter className="flex gap-5 mb-3">
        <button
          onClick={() => setActiveChart("temp")}
          id="weatherTemp"
          className={`text-xs ${
            activeChart === "temp" ? "font-bold" : "text-primary/70"
          }`}
        >
          {t("temp")}
        </button>
        <button
          id="weatherRain"
          onClick={() => setActiveChart("rain")}
          className={`text-xs ${
            activeChart === "rain" ? "font-bold" : "text-primary/70"
          }`}
        >
          {rainShouldShowSnow ? "Neve" : t("rain")}
        </button>
        <button
          id="weatherHumidity"
          onClick={() => setActiveChart("humidity")}
          className={`text-xs ${
            activeChart === "humidity" ? "font-bold" : "text-primary/70"
          }`}
        >
          {t("humidity")}
        </button>
        <button
          id="weatherUV"
          onClick={() => setActiveChart("uv")}
          className={`text-xs ${
            activeChart === "uv" ? "font-bold" : "text-primary/70"
          }`}
        >
          {t("uv")}
        </button>
      </CardFooter>
      <CardHeader>
        <CardTitle className="flex items-center font-unbounded tracking-tight">
          {chartConfig[effectiveChartKey].label
            .replace(/\s*\(.*?\)\s*/g, "")
            .trim()}
          {effectiveChartKey === "uv" && (
            <Tooltip>
              <TooltipTrigger>
                <Info size={18} className="ml-2 text-primary/70" />
              </TooltipTrigger>
              <TooltipContent>
                <div>
                  <h2 className="font-bold font-unbounded tracking-tight capitalize mb-3">
                    {t("uv")}
                  </h2>
                  <ul className="flex flex-col gap-2 text-xs">
                    <li>1. (1,2) {t("uv_index.low")}</li>
                    <li>2. (3,4,5) {t("uv_index.moderate")}</li>
                    <li>3. (6,7) {t("uv_index.high")}</li>
                    <li>4. (8,9,10) {t("uv_index.very_high")}</li>
                    <li>5. (11+) {t("uv_index.extreme")}</li>
                    <li className="my-1">
                      <Link href={appConfig.URLS.resources.uv_guide}>
                        {t("read")} {"->"}
                      </Link>
                    </li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </CardTitle>
        <CardDescription>
          {t("titles.chart.desc", { hours: chartData.length })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-50 w-full">
          {activeChart === "temp" ? (
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 10, right: 25 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis domain={["auto", "auto"]} />
              <ChartTooltip
                content={<ChartTooltipContent indicator="line" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                fillOpacity={0.4}
                stroke="var(--color-temp)"
                dataKey="temp"
                fill="var(--color-temp)"
              />
            </AreaChart>
          ) : effectiveChartKey === "rain" || effectiveChartKey === "snow" ? (
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ right: 25 }}
            >
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="time"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                stroke={chartConfig[effectiveChartKey].color}
                dataKey={effectiveChartKey}
                fill={chartConfig[effectiveChartKey].color}
                fillOpacity={0.4}
                radius={4}
              />
            </BarChart>
          ) : activeChart === "humidity" ? (
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ right: 25 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis domain={["auto", "auto"]} />
              <ChartTooltip
                content={<ChartTooltipContent indicator="line" />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                fillOpacity={0.4}
                stroke="var(--color-humidity)"
                dataKey="humidity"
                fill="var(--color-humidity)"
              />
            </AreaChart>
          ) : activeChart === "uv" ? (
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ right: 25 }}
            >
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="time"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <YAxis domain={[0, 11]} />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                stroke="var(--color-uv)"
                dataKey="uv"
                fill="var(--color-uv)"
                fillOpacity={0.4}
                radius={4}
              />
            </BarChart>
          ) : (
            <div />
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
