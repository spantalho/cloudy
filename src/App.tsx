import { useEffect, useState } from "react";
import { useCity } from "@/contexts/city-context";
import { Toaster } from "@/components/ui/sonner";
import { motion } from "framer-motion";
import { useSession } from "./hooks/use-session";
import { HotkeysProvider } from "react-hotkeys-hook";
import { useConfig } from "@/contexts/config-context";
import ForecastSummaryCard from "@/components/cards/forecast-summary-card";
import WeatherCurrentCard from "@/components/cards/weather-current-card";
import ForecastDaysCard from "@/components/cards/forecast-days-card";
import ForecastChartCard from "@/components/cards/forecast-chart-card";
import ConnectionWatcher from "@/features/toast/connection-watcher";
import CitySearch from "./components/city-search";
import Footer from "./components/footer";
import DebugCard from "./components/cards/debug-card";
import Header from "./components/header";

export default function App() {
  const { city } = useCity();
  const { appConfig, userPreferences } = useConfig();
  const { ensureSession } = useSession();

  const [sessionReady, setSessionReady] = useState<boolean>(false);
  const [sessionError, setSessionError] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const sessionSuccess = await ensureSession();
        if (mounted) {
          if (!sessionSuccess) {
            setSessionError(true);
          }
        }
      } catch (err: any) {
        if (mounted) {
          setSessionError(true);
          console.error("Session initialization failed:", err);
        }
      } finally {
        if (mounted) {
          setSessionReady(true);
        }
      }
    }
    init();

    return () => {
      mounted = false;
    };
  }, [ensureSession]);

  useEffect(() => {
    const disabled = userPreferences?.animations === false;
    if (disabled) {
      document.documentElement.setAttribute("data-reduced-motion", "true")
    } else {
      document.documentElement.removeAttribute("data-reduced-motion")
    }
  }, [userPreferences?.animations])

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
      <div className="transition-all flex flex-col md:pt-25 py-10 px-8 w-full min-h-screen justify-center items-center md:px-0">
        <Header />
        <HotkeysProvider>
          <CitySearch ready={sessionReady} />
        </HotkeysProvider>
        <div
          key={city}
          className="relative w-full max-w-2xl md:max-w-3xl lg:max-w-4xl grid grid-cols-1 gap-5"
        >
          <>
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
            {appConfig.ENV === "development" && <DebugCard />}
          </>
        </div>
      </div>
      <Footer />
    </main>
  );
}
