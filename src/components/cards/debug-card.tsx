import { useConfig } from "@/contexts/config-context";
import * as card from "../ui/card";
import { useTranslation } from "react-i18next";
import { Label } from "../ui/label";
import { Code, Package } from "lucide-react";

export default function DebugCard() {
  const { appConfig } = useConfig();
  const { t } = useTranslation();

  return (
    <card.Card
      id="debug-card"
      className="dev-mode-overlay"
    >
      <card.CardHeader>
        <card.CardTitle className="flex items-center font-normal font-unbounded tracking-tight capitalize">
          {appConfig.ENV} mode
        </card.CardTitle>
        <card.CardDescription className="max-w-sm">
          {t("build_disclaimer", { build: appConfig.ENV })}
        </card.CardDescription>
      </card.CardHeader>
      <card.CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs">
          <Label className="text-xs">
            <Code size={16} />
            API:
          </Label>
          <a
            href={import.meta.env.VITE_API_URL}
            className="transition-all ml-2 blur-xs hover:blur-none"
          >
            {import.meta.env.VITE_API_URL}
          </a>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Label className="text-xs">
            <Package size={16} />
            Running:
          </Label>
          <span className="bg-accent border p-0.5 rounded-sm">v. {appConfig.APP.version}</span>
        </div>
      </card.CardContent>
    </card.Card>
  );
}
