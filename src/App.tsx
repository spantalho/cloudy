import { useEffect, useState } from "react";
import { useCity } from "@/contexts/city-context";
import { Toaster } from "@/components/ui/sonner";
import { motion } from "framer-motion";
import { useSession } from "./hooks/use-session";
import { HotkeysProvider } from "react-hotkeys-hook";
import { useConfig } from "@/contexts/config-context";
import Header from "@/components/header";
import Settings from "@/components/settings";
import ForecastSummaryCard from "@/components/cards/forecast-summary-card";
import WeatherCurrentCard from "@/components/cards/weather-current-card";
import ForecastDaysCard from "@/components/cards/forecast-days-card";
import ForecastChartCard from "@/components/cards/forecast-chart-card";
import ConnectionWatcher from "@/features/toast/connection-watcher";
import CitySearch from "./components/city-search";
import Footer from "./components/footer";

export default function App() {
  const [sessionReady, setSessionReady] = useState<boolean>(false);
  const [sessionError, setSessionError] = useState<boolean>(false);
  const { city } = useCity();
  const { appConfig, userPreferences } = useConfig();
  const { ensureSession } = useSession()

  useEffect(() => {
    async function init() {
      try {
        await ensureSession();
      } catch (err: any) {
        setSessionError(true);
      } finally {
        setSessionReady(true);
      }
    }
    init();
  }, [ensureSession]);

  const cards = [
    <WeatherCurrentCard key="current" />,
    <ForecastSummaryCard key="summary" />,
    <ForecastDaysCard key="days" />,
    <ForecastChartCard key="chart" />,
  ];

  return (
    <main>
      {userPreferences.notifications === true && (
        <>
          <Toaster expand={true} />
          <ConnectionWatcher ready={sessionReady} error={sessionError} />
        </>
      )}
      <div className="transition-all flex flex-col pb-16 px-8 w-full min-h-screen justify-center items-center md:px-0">
        <Header />
        <HotkeysProvider>
          <Settings />
          <CitySearch ready={sessionReady} />
        </HotkeysProvider>
        <div
          key={city}
          className="relative w-full max-w-2xl md:max-w-3xl lg:max-w-4xl grid grid-cols-1 gap-5"
        >
          {cards.map((Card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.65,
                delay: index * 0.15, // delay
                ease: "easeOut",
              }}
              className="origin-top"
            >
              {Card}
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
      {appConfig.ENV === "development" && (
        <div className="fixed bottom-3.5 left-3 max-w-[350px] bg-accent border p-2.5 rounded-md shadow">
          <h3 className="font-unbounded tracking-tighter uppercase text-sm">
            {appConfig.ENV}
          </h3>
          <ul className="mt-3 flex flex-col gap-2 text-xs">
            <li>
              <span className="font-bold">ENV:</span>
              <span className="ml-2">{appConfig.ENV}</span>
            </li>
            <li>
              <span className="font-bold">API:</span>
              <span className="ml-2 blur-xs hover:blur-none">{import.meta.env.VITE_API_URL}</span>
            </li>
          </ul>
        </div>
      )}
    </main>
  );
}
