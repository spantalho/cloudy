import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme, type Theme } from "@/hooks/use-theme";
import { useHotkeys } from "react-hotkeys-hook";
import { useCallback, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Kbd } from "./ui/kbd";

export default function ThemeToggler() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { t } = useTranslation();

  useHotkeys(
    "alt+t",
    useCallback(() => {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    }, [theme, setTheme])
  );

  const getMainButtonConfig = () => {
    switch (systemTheme) {
      case "dark":
        return { icon: <Moon />, nextTheme: "light", label: "Dark" };
      case "light":
        return { icon: <Sun />, nextTheme: "dark", label: "Light" };
      case "system":
      default:
        return { icon: <Monitor />, nextTheme: "dark", label: "System" };
    }
  };

  const mainTheme = getMainButtonConfig();

  return (
    <Tooltip>
      <TooltipTrigger>
        <motion.div
          className="flex gap-2 rounded-lg border shadow-sm"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          animate={{ width: isExpanded ? "auto" : "fit-content" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* main button */}
          <Button
            onClick={() => setTheme(mainTheme.nextTheme as Theme)}
            variant="ghost"
            size={"icon-sm"}
            title={systemTheme.toLowerCase()}
          >
            {mainTheme.icon}
          </Button>

          <AnimatePresence>
            {isExpanded && (
              <>
                {["light", "dark", "system"].map((t, index) => {
                  if (t === systemTheme) return null;

                  const icons = {
                    light: <Sun />,
                    dark: <Moon />,
                    system: <Monitor />,
                  };

                  const labels = {
                    light: "Light",
                    dark: "Dark",
                    system: "System",
                  };

                  return (
                    <motion.div
                      key={t}
                      initial={{ opacity: 0, scale: 0.8, width: 0 }}
                      animate={{ opacity: 1, scale: 1, width: "auto" }}
                      exit={{ opacity: 0, scale: 0.8, width: 0 }}
                      transition={{ duration: 0.1, delay: index * 0.05 }}
                      style={{ overflow: "hidden" }}
                    >
                      <Button
                        onClick={() => setTheme(t as Theme)}
                        variant="ghost"
                        size={"icon-sm"}
                        title={labels[t as keyof typeof labels].toLowerCase()}
                      >
                        {icons[t as keyof typeof icons]}
                      </Button>
                    </motion.div>
                  );
                })}
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex items-center">
          <p>{t("settings.theme.btn")} </p>
          <Kbd className="ml-2 bg-accent! text-primary! border">Alt+T</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
