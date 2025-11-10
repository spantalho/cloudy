import * as chart from "../ui/chart";
import * as recharts from "recharts";
import * as card from "../ui/card";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useCity } from "@/contexts/city-context";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@uidotdev/usehooks";
import * as tooltip from "../ui/tooltip";
import { Info } from "lucide-react";
import type { ModelHour } from "@/interfaces";
import { useUnit } from "@/hooks/use-unit";
import { Link } from "../common/link";
import { useConfig } from "@/contexts/config-context";
import { useForecast } from "@/hooks/services/use-forecast";
import * as tabs from "../ui/tabs";

// TODO: alterar os botões de mudança de gráfico para TABS!

export default function ForecastChartCard() {
  const [hours, setHours] = useState<ModelHour[]>([]);

  const { city } = useCity();
  const { t } = useTranslation();
  const { tempUnit } = useUnit();
  const { appConfig } = useConfig();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data, isLoading, isError, error } = useForecast(
    city,
    appConfig,
    true,
    1
  );

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

  const chartConfig = {
    temp: {
      label: `${t("common.temp")} (°${tempUnit === "celsius" ? "C" : "F"})`,
      color: "var(--temp-chart)",
    },
    rain: {
      label: `${t("titles.chart.rain")} (%)`,
      color: "var(--rain-chart)",
    },
    snow: {
      label: `${t("titles.chart.snow")} (%)`,
      color: "var(--snow-chart)",
    },
    uv: {
      label: `${t("weather.uv_full")} (${t("weather.uv").toLowerCase()})`,
      color: "var(--uv-chart)",
    },
    humidity: {
      label: `${t("weather.humidity")} (%)`,
      color: "var(--humidity-chart)",
    },
  } satisfies chart.ChartConfig;

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

  const getTabLabel = (key: "temp" | "rain" | "humidity" | "uv") => {
    if (key === "rain") return rainShouldShowSnow ? t("weather.snow") : t("weather.rain");

    switch (key) {
      case "temp":
        return t("common.temp")
      case "humidity":
        return t("weather.humidity")
      case "uv":
        return t("weather.uv")
    }
  }

  return (
    <card.Card id="chart" className="transition-colors bg-transparent">
      <tabs.Tabs defaultValue="temp" className="w-full">
        <card.CardFooter className="flex gap-5 mb-3">
          <tabs.TabsList className="transition-colors flex gap-3 bg-transparent border hover:bg-accent/30">
            <tabs.TabsTrigger
              value="temp"
              id="weatherTemp"
              className="text-xs text-muted border-0 data-[state=active]:font-bold data-[state=active]:text-foreground"
            >
              {getTabLabel("temp")}
            </tabs.TabsTrigger>
            <tabs.TabsTrigger
              value="rain"
              id="weatherRain"
              className="text-xs text-muted border-0 data-[state=active]:font-bold data-[state=active]:text-foreground"
            >
              {getTabLabel("rain")}
            </tabs.TabsTrigger>
            <tabs.TabsTrigger
              value="humidity"
              id="weatherHumidity"
              className="text-xs text-muted border-0 data-[state=active]:font-bold data-[state=active]:text-foreground"
            >
              {getTabLabel("humidity")}
            </tabs.TabsTrigger>
            <tabs.TabsTrigger
              value="uv"
              id="weatherUV"
              className="text-xs text-muted border-0 data-[state=active]:font-bold data-[state=active]:text-foreground"
            >
              {getTabLabel("uv")}
            </tabs.TabsTrigger>
          </tabs.TabsList>
        </card.CardFooter>

        <tabs.TabsContent value="temp" className="outline-none">
          <card.CardHeader>
            <card.CardTitle className="flex items-center font-normal font-unbounded tracking-tight">
              {chartConfig.temp.label.replace(/\s*\(.*?\)\s*/g, "").trim()}
            </card.CardTitle>
            <card.CardDescription>
              {t("titles.chart.desc", { hours: chartData.length })}
            </card.CardDescription>
          </card.CardHeader>

          <card.CardContent className="mt-5">
            <chart.ChartContainer config={chartConfig} className="h-50 w-full">
              <recharts.AreaChart accessibilityLayer data={chartData} margin={{ top: 10, right: 25 }}>
                <recharts.CartesianGrid vertical={false} />
                <recharts.XAxis dataKey="time" tickLine={false} tickMargin={8} axisLine={false} tickFormatter={(v) => v} />
                <recharts.YAxis domain={["auto", "auto"]} />
                <chart.ChartTooltip content={<chart.ChartTooltipContent indicator="line" />} />
                <chart.ChartLegend content={<chart.ChartLegendContent />} />
                <recharts.Area fillOpacity={0.4} stroke="var(--color-temp)" dataKey="temp" fill="var(--color-temp)" />
              </recharts.AreaChart>
            </chart.ChartContainer>
          </card.CardContent>
        </tabs.TabsContent>

        <tabs.TabsContent value="rain" className="outline-none">
          {(() => {
            const effectiveKey = rainShouldShowSnow ? "snow" : "rain";
            return (
              <>
                <card.CardHeader>
                  <card.CardTitle className="flex items-center font-normal font-unbounded tracking-tight">
                    {chartConfig[effectiveKey].label.replace(/\s*\(.*?\)\s*/g, "").trim()}
                  </card.CardTitle>
                  <card.CardDescription>
                    {t("titles.chart.desc", { hours: chartData.length })}
                  </card.CardDescription>
                </card.CardHeader>

                <card.CardContent className="mt-5">
                  <chart.ChartContainer config={chartConfig} className="h-50 w-full">
                    <recharts.BarChart accessibilityLayer data={chartData} margin={{ right: 25 }}>
                      <recharts.CartesianGrid vertical={true} />
                      <recharts.XAxis dataKey="time" tickLine={false} tickMargin={8} axisLine={false} tickFormatter={(v) => v} />
                      <recharts.YAxis domain={[0, 100]} />
                      <chart.ChartTooltip content={<chart.ChartTooltipContent indicator="dot" />} />
                      <chart.ChartLegend content={<chart.ChartLegendContent />} />
                      <recharts.Bar
                        stroke={chartConfig[effectiveKey].color}
                        dataKey={effectiveKey}
                        fill={chartConfig[effectiveKey].color}
                        fillOpacity={0.4}
                        radius={4}
                      />
                    </recharts.BarChart>
                  </chart.ChartContainer>
                </card.CardContent>
              </>
            );
          })()}
        </tabs.TabsContent>

        <tabs.TabsContent value="humidity" className="outline-none">
          <card.CardHeader>
            <card.CardTitle className="flex items-center font-normal font-unbounded tracking-tight">
              {chartConfig.humidity.label.replace(/\s*\(.*?\)\s*/g, "").trim()}
            </card.CardTitle>
            <card.CardDescription>
              {t("titles.chart.desc", { hours: chartData.length })}
            </card.CardDescription>
          </card.CardHeader>

          <card.CardContent className="mt-5">
            <chart.ChartContainer config={chartConfig} className="h-50 w-full">
              <recharts.AreaChart accessibilityLayer data={chartData} margin={{ right: 25 }}>
                <recharts.CartesianGrid vertical={false} />
                <recharts.XAxis dataKey="time" tickLine={false} tickMargin={8} axisLine={false} tickFormatter={(v) => v} />
                <recharts.YAxis domain={["auto", "auto"]} />
                <chart.ChartTooltip content={<chart.ChartTooltipContent indicator="line" />} />
                <chart.ChartLegend content={<chart.ChartLegendContent />} />
                <recharts.Area fillOpacity={0.4} stroke="var(--color-humidity)" dataKey="humidity" fill="var(--color-humidity)" />
              </recharts.AreaChart>
            </chart.ChartContainer>
          </card.CardContent>
        </tabs.TabsContent>

        <tabs.TabsContent value="uv" className="outline-none">
          <card.CardHeader>
            <card.CardTitle className="flex items-center font-normal font-unbounded tracking-tight">
              {chartConfig.uv.label.replace(/\s*\(.*?\)\s*/g, "").trim()}
              <tooltip.Tooltip>
                <tooltip.TooltipTrigger>
                  <Info size={18} className="ml-2 text-muted" />
                </tooltip.TooltipTrigger>
                <tooltip.TooltipContent>
                  <div>
                    <h2 className="font-bold font-unbounded tracking-tight capitalize mb-3">{t("weather.uv")}</h2>
                    <ul className="flex flex-col gap-2 text-xs">
                      <li>1. (1,2) {t("uv_index.low")}</li>
                      <li>2. (3,4,5) {t("uv_index.moderate")}</li>
                      <li>3. (6,7) {t("uv_index.high")}</li>
                      <li>4. (8,9,10) {t("uv_index.very_high")}</li>
                      <li>5. (11+) {t("uv_index.extreme")}</li>
                      <li className="my-1 capitalize">
                        <Link href={appConfig.URLS.resources.uv_guide}>
                          {t("common.read_more")} {"->"}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </tooltip.TooltipContent>
              </tooltip.Tooltip>
            </card.CardTitle>
            <card.CardDescription>
              {t("titles.chart.desc", { hours: chartData.length })}
            </card.CardDescription>
          </card.CardHeader>

          <card.CardContent className="mt-5">
            <chart.ChartContainer config={chartConfig} className="h-50 w-full">
              <recharts.BarChart accessibilityLayer data={chartData} margin={{ right: 25 }}>
                <recharts.CartesianGrid vertical={true} />
                <recharts.XAxis dataKey="time" tickLine={false} tickMargin={8} axisLine={false} tickFormatter={(v) => v} />
                <recharts.YAxis domain={[0, 11]} />
                <chart.ChartTooltip content={<chart.ChartTooltipContent indicator="dot" />} />
                <chart.ChartLegend content={<chart.ChartLegendContent />} />
                <recharts.Bar stroke="var(--color-uv)" dataKey="uv" fill="var(--color-uv)" fillOpacity={0.4} radius={4} />
              </recharts.BarChart>
            </chart.ChartContainer>
          </card.CardContent>
        </tabs.TabsContent>
      </tabs.Tabs>
    </card.Card>
  );
}
