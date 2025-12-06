import { useEffect, useState } from "react";
import { useCity } from "@/contexts/city-context";
import { Toaster } from "@/components/ui/sonner";
import { motion } from "framer-motion";
import { useSession } from "./hooks/use-session";
import { HotkeysProvider } from "react-hotkeys-hook";
import { useConfig } from "@/contexts/config-context";
import ForecastSummaryCard from "@/components/cards/forecast-summary-card";
import ForecastDaysCard from "@/components/cards/forecast-days-card";
import ForecastChartCard from "@/components/cards/forecast-chart-card";
import ConnectionWatcher from "@/components/connection-watcher";
import CitySearch from "./components/city-search";
import Footer from "./components/footer";
import DebugCard from "./components/cards/debug-card";
import Navigator from "./components/navigator";
import Current from "./components/current";
import WeatherCurrentCard from "./components/cards/weather-current-card";
import InteractiveMap from "./components/interactive-map";

export default function App() {
  const { city } = useCity();
  const { appConfig, userPreferences } = useConfig();
  const { ensureSession } = useSession();

  const [sessionReady, setSessionReady] = useState<boolean>(false);
  const [sessionError, setSessionError] = useState<boolean>(false);

  // useEffect(() => {
  //   let mounted = true;

  //   async function init() {
  //     try {
  //       const sessionSuccess = await ensureSession();
  //       if (mounted) {
  //         if (!sessionSuccess) {
  //           setSessionError(true);
  //         }
  //       }
  //     } catch (err: any) {
  //       if (mounted) {
  //         setSessionError(true);
  //         console.error("Session initialization failed:", err);
  //       }
  //     } finally {
  //       if (mounted) {
  //         setSessionReady(true);
  //       }
  //     }
  //   }
  //   init();

  //   return () => {
  //     mounted = false;
  //   };
  // }, [ensureSession]);

  useEffect(() => {
    const disabled = userPreferences?.animations === false;
    if (disabled) {
      document.documentElement.setAttribute("data-reduced-motion", "true");
    } else {
      document.documentElement.removeAttribute("data-reduced-motion");
    }
  }, [userPreferences?.animations]);

  const cards = [
    <ForecastChartCard key="chart" />,
    <ForecastSummaryCard key="summary" />,
    <ForecastDaysCard key="days" />,
  ];

  return (
    <main className="bg-background lg:p-2 lg:pb-0">
      <div className="relative transition-all flex flex-col lg:flex-row w-full justify-center min-h-screen items-center lg:border-2 lg:border-b-0 dark:border-foreground/30 border-foreground/50 rounded-t-md">
        <div className="relative flex justify-center w-full h-auto rounded-l-md">
          <InteractiveMap active={false} lat={40} lon={-100} />
          <div className="flex flex-col w-full h-full items-center justify-between absolute bg-gradient-to-tr from-white/30 dark:from-black/80 to-transparent p-8">
            <Navigator />
            <Current />
          </div>
        </div>

        <div className="flex flex-col bg-background rounded-tr-md relative w-full max-h-screen overflow-y-auto p-8 pt-2 pb-0">
          <div
            key={city}
            className="flex flex-col gap-5"
          >
            {cards.map((Card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                className="origin-top"
              >
                {Card}
              </motion.div>
            ))}
            {appConfig.ENV === "development" && <DebugCard />}
          </div>
          <Footer />
        </div>
      </div>

      {userPreferences.notifications === true && (
        <>
          <Toaster expand={true} />
          <ConnectionWatcher ready={sessionReady} error={sessionError} />
        </>
      )}
    </main>
  );
}
