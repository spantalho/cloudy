import { useCallback, useEffect, useState, type JSX } from "react";
import * as dialog from "./ui/dialog";
import * as drawer from "./ui/drawer";
import * as button from "./ui/button";
import * as lucideReact from "lucide-react";
import * as popover from "./ui/popover";
import * as command from "./ui/command";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import * as radioGroup from "./ui/radio-group";
import { Kbd } from "./ui/kbd";
import { useTranslation } from "react-i18next";
import { Switch } from "./ui/switch";
import { useConfig } from "@/contexts/config-context";
import { Separator } from "./ui/separator";
import { useTheme } from "@/hooks/use-theme";
import { useLang, type LangType } from "@/hooks/use-lang";
import { useUnit, type SpeedUnit, type TempUnit } from "@/hooks/use-unit";
import { useHotkeys } from "react-hotkeys-hook";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Badge } from "./ui/badge";
import { detectAppLangs } from "@/utils/common";

export default function Settings(): JSX.Element {
  // combobox
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const { t } = useTranslation();

  const { userPreferences, setUserPreferences } = useConfig();
  const { theme, systemTheme, setTheme } = useTheme();
  const { lang: activeLang, setLang } = useLang();
  const { tempUnit, speedUnit, setSpeedUnit, setTempUnit } = useUnit();

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const appLangs = detectAppLangs();

  const [toggles, setToggles] = useState<{
    notifications: boolean;
    animations: boolean;
    shortcuts: boolean;
    uiExperiments: boolean;
  }>({
    notifications: !!userPreferences?.notifications,
    animations: !!userPreferences?.animations,
    shortcuts: !!userPreferences?.shortcuts,
    uiExperiments: !!userPreferences?.ui_experiments,
  });

  useEffect(() => {
    setToggles({
      notifications: !!userPreferences?.notifications,
      animations: !!userPreferences?.animations,
      shortcuts: !!userPreferences?.shortcuts,
      uiExperiments: !!userPreferences?.ui_experiments,
    });
  }, [userPreferences?.notifications, userPreferences?.animations]);

  const handleToggleChange = (
    key: "notifications" | "animations" | "uiExperiments" | "shortcuts",
    checked: boolean
  ) => {
    // optimistic UI update
    setToggles((prev) => ({ ...prev, [key]: checked }));

    try {
      setUserPreferences?.((prev: any) => ({
        ...prev,
        [key]: checked,
      }));
    } catch (err) {
      console.warn("Error trying to setUserPreferences:", err);
    }
  };

  if (userPreferences.shortcuts) {
    useHotkeys(
      "alt+t",
      useCallback(() => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
      }, [theme, setTheme])
    );
  }

  const SettingsContent = () => (
    <div className="flex gap-5 flex-col overflow-y-auto max-h-[400px] lg:max-h-[700px]">
      {/* interface (language, theme) */}
      <div className="flex flex-col gap-3">
        <Label className="font-bold tracking-tight text-lg">
          {t("settings.titles.interface")}
        </Label>
        <div className="flex flex-col gap-5">
          {/* languages */}
          <div className="flex flex-col gap-3">
            <Label>{t("settings.options.interface.languages")}</Label>
            <popover.Popover open={open} onOpenChange={setOpen}>
              <popover.PopoverTrigger asChild>
                <button.Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {value
                    ? appLangs.find((l) => l.lang === value)?.lang
                    : appLangs.find((l) => l.lang === activeLang)
                        ?.lang}
                  <lucideReact.ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button.Button>
              </popover.PopoverTrigger>
              <popover.PopoverContent className="w-[200px] p-0">
                <command.Command>
                  <command.CommandInput placeholder="Search language..." />
                  <command.CommandList>
                    <command.CommandEmpty>
                      No language found.
                    </command.CommandEmpty>
                    <command.CommandGroup>
                      {appLangs.map((l) => (
                        <command.CommandItem
                          key={l.lang}
                          value={l.lang}
                          onSelect={(currentValue) => {
                            try {
                              setLang(currentValue as LangType);
                            } catch (err) {
                              console.warn("setLang error:", err);
                            }
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          <lucideReact.CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === l.lang ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {l.lang} <span className="text-muted text-xs">({l.percentage}%)</span>
                        </command.CommandItem>
                      ))}
                    </command.CommandGroup>
                  </command.CommandList>
                </command.Command>
              </popover.PopoverContent>
            </popover.Popover>
          </div>
          {/* themes */}
          <div className="flex flex-col gap-3 ">
            <Label>
              {t("settings.options.interface.theme")}{" "}
              {isDesktop && <Kbd>alt+t</Kbd>}
            </Label>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setTheme("dark")}
                className={`transition-colors flex items-center justify-center p-2 border rounded-md hover:bg-accent/70 ${
                  systemTheme === "dark"
                    ? "bg-primary text-primary-foreground hover:bg-primary"
                    : ""
                }`}
              >
                <lucideReact.Moon size={16} />
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`transition-colors flex items-center justify-center p-2 border rounded-md hover:bg-accent/70 ${
                  systemTheme === "light"
                    ? "bg-primary text-primary-foreground hover:bg-primary"
                    : ""
                }`}
              >
                <lucideReact.Sun size={16} />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`transition-colors flex items-center justify-center p-2 border rounded-md hover:bg-accent/70 ${
                  systemTheme === "system"
                    ? "bg-primary text-primary-foreground hover:bg-primary"
                    : ""
                }`}
              >
                <lucideReact.Monitor size={16} />
              </button>
            </div>
          </div>
          {/* animations */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="animations">
              {t("settings.options.interface.animations")}
            </Label>
            <Switch
              id="animations"
              checked={toggles.animations}
              onCheckedChange={(v) =>
                handleToggleChange("animations", Boolean(v))
              }
            />
          </div>
          {/* shortcuts */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="shortcuts">Shortcuts</Label>
            <Switch
              id="shortcuts"
              checked={toggles.shortcuts}
              onCheckedChange={(v) =>
                handleToggleChange("shortcuts", Boolean(v))
              }
            />
          </div>
        </div>
      </div>

      {/* unit */}
      <div className="mt-3 flex flex-col gap-3">
        <Label className="font-bold tracking-tight text-lg">
          {t("settings.titles.unit")}
        </Label>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <Label>{t("settings.options.unit.temp")}</Label>
            <radioGroup.RadioGroup
              onValueChange={(t: TempUnit) => setTempUnit(t)}
            >
              <div className="flex items-center space-x-2">
                <radioGroup.RadioGroupItem
                  checked={tempUnit === "celsius"}
                  value="celsius"
                />
                <Label htmlFor="celsius">
                  Celsius <span className="text-xs text-muted">(°C)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <radioGroup.RadioGroupItem
                  checked={tempUnit === "fahrenheit"}
                  value="fahrenheit"
                />
                <Label htmlFor="fahrenheit">
                  Fahrenheit
                  <span className="text-xs text-muted">(°F)</span>
                </Label>
              </div>
            </radioGroup.RadioGroup>
          </div>
          <div className="flex flex-col gap-3">
            <Label>{t("settings.options.unit.speed")}</Label>
            <radioGroup.RadioGroup
              onValueChange={(s: SpeedUnit) => setSpeedUnit(s)}
            >
              <div className="flex items-center space-x-2">
                <radioGroup.RadioGroupItem
                  checked={speedUnit === "kmh"}
                  value="kmh"
                />
                <Label htmlFor="kmh">
                  km/h
                  <span className="text-xs text-muted">
                    {t("settings.options.unit.kmh")}
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <radioGroup.RadioGroupItem
                  checked={speedUnit === "mph"}
                  value="mph"
                />
                <Label htmlFor="mph">
                  mph
                  <span className="text-xs text-muted">
                    {t("settings.options.unit.mph")}
                  </span>
                </Label>
              </div>
            </radioGroup.RadioGroup>
          </div>
        </div>

        <Separator className="mt-3" />
        {/* advanced */}
        <div className="flex flex-col gap-3">
          <Label className="font-bold tracking-tight text-lg">
            {t("settings.titles.advanced")}
          </Label>
          <div className="flex flex-col gap-3 space-x-2">
            <Label htmlFor="notifications">
              {t("settings.options.advanced.notifications")}
            </Label>
            <p className="-mt-1 text-xs text-muted max-w-xs">
              {t("settings.options.brief.notifications")}
            </p>
            <Switch
              id="notifications"
              checked={toggles.notifications}
              onCheckedChange={(v) =>
                handleToggleChange("notifications", Boolean(v))
              }
            />
          </div>
          {/* Experiments. Rounded corners ("fullscreen"), etc. */}
          <div className="flex flex-col gap-3">
            <Label htmlFor="ui_experiments">
              UI Experiments
              <Badge variant={"outline"}>Experiment</Badge>
            </Label>
            <p className="-mt-1 text-xs text-muted max-w-xs">
              Funcionalidades *malucas* que estão por aí. As bordas arredondadas
              no canto superior fazem parte. Se não lhe for interessante,
              desative.
            </p>
            <Switch
              id="ui_experiments"
              checked={toggles.uiExperiments}
              onCheckedChange={(v) =>
                handleToggleChange("uiExperiments", Boolean(v))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <dialog.Dialog>
        <dialog.DialogTrigger asChild>
          <button.Button variant={"outline"} size={"icon-sm"}>
            <lucideReact.SettingsIcon />
          </button.Button>
        </dialog.DialogTrigger>
        <dialog.DialogContent>
          <dialog.DialogHeader>
            <dialog.DialogTitle className="font-unbounded tracking-tight">
              {t("settings.label")}
            </dialog.DialogTitle>
            <dialog.DialogDescription>
              {t("settings.description")}
            </dialog.DialogDescription>
          </dialog.DialogHeader>
          <div className="mt-5">
            <SettingsContent />
          </div>
        </dialog.DialogContent>
      </dialog.Dialog>
    );
  }

  return (
    <drawer.Drawer>
      <drawer.DrawerTrigger asChild>
        <button.Button variant={"outline"} size={"icon-sm"}>
          <lucideReact.SettingsIcon />
        </button.Button>
      </drawer.DrawerTrigger>
      <drawer.DrawerContent>
        <drawer.DrawerHeader>
          <drawer.DrawerTitle className="font-unbounded tracking-tight">
            {t("settings.label")}
          </drawer.DrawerTitle>
          <drawer.DrawerDescription>
            {t("settings.description")}
          </drawer.DrawerDescription>
        </drawer.DrawerHeader>
        <div className="px-4 pb-4">
          <SettingsContent />
        </div>
      </drawer.DrawerContent>
    </drawer.Drawer>
  );
}
