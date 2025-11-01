import { Languages, Ruler } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTranslation } from "react-i18next";

import { useUnit, type SpeedUnit, type TempUnit } from "@/hooks/use-unit";
import { useLang, type LangType } from "@/hooks/use-lang";
import ThemeToggler from "./theme-toggler";

export default function Settings() {
  const { lang, setLang } = useLang();
  const { tempUnit, speedUnit, setTempUnit, setSpeedUnit } = useUnit();
  const { t } = useTranslation();

  return (
    <div className="flex w-full mb-5 items-end justify-between max-w-2xl md:max-w-3xl lg:max-w-4xl md:grid-cols-3">
      <ThemeToggler />
      <div className="flex gap-2">
        {/* unit */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div
              className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5`}
            >
              <Ruler /> {t("settings.unit.btn")}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="ml-3">
            <DropdownMenuLabel>{t("settings.unit.label")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{t("temp")}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={tempUnit}
                  onValueChange={(val) => setTempUnit(val as TempUnit)}
                >
                  <DropdownMenuRadioItem value="celsius">
                    °C <span className="text-xs text-primary/70">Celsius</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="fahrenheit">
                    °F{" "}
                    <span className="text-xs text-primary/70">Fahrenheit</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{t("speed")}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={speedUnit}
                  onValueChange={(val) => setSpeedUnit(val as SpeedUnit)}
                >
                  <DropdownMenuRadioItem value="kmh">
                    KM/H
                    <span className="text-xs text-primary/70">{t("kmh")}</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="mph">
                    MPH
                    <span className="text-xs text-primary/70">{t("mph")}</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* languages */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div
              className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5`}
            >
              <Languages /> {t("settings.lng.btn")}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="ml-3">
            <DropdownMenuLabel>{t("settings.lng.label")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={lang}
              onValueChange={(val) => setLang(val as LangType)}
            >
              <DropdownMenuRadioItem value="en">
                {t("settings.lng.en")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pt">
                {t("settings.lng.pt")}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
