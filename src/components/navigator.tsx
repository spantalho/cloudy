import { useConfig } from "@/contexts/config-context";
import { motion } from "framer-motion";
import Settings from "./settings";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "react-i18next";
import * as lucide from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";

export default function Navigator() {
  const { appConfig } = useConfig();
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <nav
      role="navigation"
      className={`flex w-full items-center justify-between text-sm ease-in-out`}
    >
      <div className="pointer-events-none flex gap-4 items-center relative">
        <motion.img
          aria-hidden
          className="absolute w-auto h-9"
          src="images/logo_light.png"
          alt=""
          animate={{
            opacity: theme === "dark" ? 0 : 1,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        />
        <motion.img
          aria-hidden
          className="absolute w-auto h-9"
          src="images/logo_dark.png"
          alt=""
          animate={{
            opacity: theme === "light" ? 0 : 1,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        />

        <h1 className="ml-20 font-semibold text-lg font-unbounded tracking-tighter lowercase">
          {appConfig.APP.name}
        </h1>
      </div>

      <div className="flex gap-2 items-center">
        <Button className="backdrop-blur-sm" size={"sm"} variant={"outline"}>
          <lucide.MapPin /> São Paulo <lucide.ChevronDown />
        </Button>
        <Button className="backdrop-blur-sm" size={"icon-sm"} variant={"outline"}>
          <lucide.Search />
        </Button>
        <Button className="backdrop-blur-sm" size={"icon-sm"} variant={"outline"}>
          <lucide.Map />
        </Button>
        <Separator className="h-6! mx-1" orientation="vertical" />
        <Settings />
      </div>
    </nav>
  );
}
