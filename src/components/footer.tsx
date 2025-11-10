import { Github } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang } from "@/hooks/use-lang";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import * as tooltip from "./ui/tooltip";
import * as avatar from "./ui/avatar";
import * as link from "./common/link";
import { useConfig } from "@/contexts/config-context";
import { useMediaQuery } from "@uidotdev/usehooks";

export default function Footer() {
  const { appConfig } = useConfig();
  const { t } = useTranslation();
  const { lang } = useLang();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <footer className="flex flex-col items-center border-t w-full py-5 pb-20 md:py-3 md:pb-3">
      <div className="flex flex-col md:flex-row items-start md:items-center w-full justify-between text-xs max-w-2xl md:max-w-3xl lg:max-w-4xl gap-5 md:gap-0">
        <ul className="flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-5 w-full md:w-auto text-center md:text-left">
          {isDesktop && (
            <li className="opacity-70">
              <span className="mr-2">&copy; 2025</span>
              <tooltip.Tooltip>
                <tooltip.TooltipTrigger>
                  <link.Link href={appConfig.URLS.app.author_github ?? "#"}>
                    {appConfig.APP.author || "[your name]"}
                  </link.Link>
                </tooltip.TooltipTrigger>
                <tooltip.TooltipContent className="flex items-center justify-center p-6">
                  <avatar.Avatar className="rounded-md scale-200">
                    <avatar.AvatarFallback>
                      {appConfig.APP.author?.slice(0, 3) ?? "usr"}
                    </avatar.AvatarFallback>
                    <avatar.AvatarImage
                      src={
                        appConfig.URLS.app.author_github
                          ? `${appConfig.URLS.app.author_github}.png`
                          : ""
                      }
                    />
                  </avatar.Avatar>
                </tooltip.TooltipContent>
              </tooltip.Tooltip>
            </li>
          )}

          <div className="hidden md:flex items-center">
            <Separator className="h-4!" orientation="vertical" />
          </div>

          {appConfig.URLS.app.repo && (
            <li>
              <link.Link href={`${appConfig.URLS.app.repo}#readme`}>
                {lang === "en" ? "About" : "Sobre"}
              </link.Link>
            </li>
          )}

          <li>
            <tooltip.Tooltip>
              <tooltip.TooltipTrigger>
                <link.Link href={`${appConfig.URLS.app.license}`}>
                  {lang === "en" ? "License" : "Licença"}
                </link.Link>
              </tooltip.TooltipTrigger>
              <tooltip.TooltipContent className="max-w-[25em]">
                <div>
                  <h2 className="font-unbounded tracking-tight font-bold mb-2 capitalize">
                    Third-Party Disclaimer
                  </h2>
                  <p>{t("license_disclaimer")}</p>
                </div>
              </tooltip.TooltipContent>
            </tooltip.Tooltip>
          </li>

          <li>
            <link.Link href={appConfig.URLS.app.services?.weather ?? "#"}>
              {t("powered", { service: appConfig.APP.services?.weather ?? "[weather service]" })}
            </link.Link>
          </li>
        </ul>

        <ul className="flex flex-row justify-center items-center gap-3 md:gap-5 w-full md:w-auto text-center md:text-right">
          <li>
            <link.IconLink
              href={appConfig.URLS.app.repo || "#"}
              icon={<Github size={16} />}
            >
              Github
            </link.IconLink>
          </li>

          <li>
            <Badge>v{appConfig.APP.version}</Badge>
          </li>
        </ul>

        {!isDesktop && appConfig.APP.author && (
          <div className="flex w-full justify-center text-xs opacity-70">
            <span className="mr-2">&copy; 2025</span>
            <a>{appConfig.APP.author}</a>
          </div>
        )}
      </div>
    </footer>
  );
}
