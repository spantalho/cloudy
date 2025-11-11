import { useConfig } from "@/contexts/config-context";
import { Separator } from "./ui/separator";
import { motion } from "framer-motion"
import Settings from "./settings";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@uidotdev/usehooks";

export default function Header() {
  const { appConfig } = useConfig();
  const { theme } = useTheme();
  const { t } = useTranslation()

  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <header className={`${isDesktop ? "top-3" : "bottom-3"} z-50 fixed flex w-full items-center max-w-[95vw] md:max-w-3xl lg:max-w-4xl justify-between bg-accent/70 backdrop-blur-2xl shadow rounded-full border border-border text-xs py-2 px-4 ease-in-out`}

    >
      <div className="pointer-events-none flex gap-4 items-center">
        <motion.img
          aria-hidden
          className="absolute h-[2.5em]"
          src="/logo_light.png"
          alt=""
          animate={{
            opacity: theme === "dark" ? 0 : 1
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut"
          }}
        />
        <motion.img
          aria-hidden
          className="absolute h-[2.5em]"
          src="/logo_dark.png"
          alt=""
          animate={{
            opacity: theme === "light" ? 0 : 1
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut"
          }}
        />

        <h1 className="ml-16 font-semibold text-lg font-unbounded tracking-tighter">
          {appConfig.APP.name}
        </h1>
      </div>
      <div className="flex items-center">
        <Settings />
        {isDesktop && <Separator className="mx-3 h-6!" orientation="vertical" />}
        {isDesktop && (
          <nav className="flex gap-4 items-center capitalize">
            <a href="#current">{t("nav.current")}</a>
            <a href="#forecast">{t("nav.forecast")}</a>
            <a href="#chart">{t("nav.chart")}</a>
          </nav>
        )}
      </div>
    </header>
  );
}
