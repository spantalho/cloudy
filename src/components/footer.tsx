import { Github } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang } from "@/hooks/use-lang";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { IconLink, Link } from "./common/link";
import { useConfig } from "@/contexts/config-context";

export default function Footer() {
  const { appConfig } = useConfig();
  const { t } = useTranslation();
  const { lang } = useLang();

  return (
    <footer className="flex flex-col items-center border-t w-full py-3">
      <div className="flex items-center w-full justify-between text-xs max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <ul className="flex items-center gap-5">
          <li className="text-muted">
            <span className="mr-2">&copy; 2025</span>
            <Tooltip>
              <TooltipTrigger>
                <Link href={appConfig.URLS.app.author_github ?? "#"}>
                  {appConfig.APP.author || "[your name]"}
                </Link>
              </TooltipTrigger>
              <TooltipContent className="flex items-center justify-center p-5">
                <Avatar className="rounded-md scale-200">
                  <AvatarFallback>
                    {appConfig.APP.author?.slice(0, 3) ?? "usr"}
                  </AvatarFallback>
                  <AvatarImage
                    src={`${appConfig.URLS.app.author_github}.png`}
                  />
                </Avatar>
              </TooltipContent>
            </Tooltip>
          </li>

          <Separator className="h-4!" orientation="vertical" />

          {appConfig.URLS.app.repo && (
            <li>
              <Link href={`${appConfig.URLS.app.repo}#readme`}>
                {lang === "en" ? "About" : "Sobre"}
              </Link>
            </li>
          )}

          <li>
            <Tooltip>
              <TooltipTrigger>
                <Link href={`${appConfig.URLS.app.license}`}>
                  {lang === "en" ? "License" : "Licença"}
                </Link>
              </TooltipTrigger>
              <TooltipContent className="max-w-[25em]">
                <div>
                  <h2 className="font-unbounded tracking-tight font-bold mb-2 capitalize">
                    &copy; {appConfig.APP.license}
                  </h2>
                  <p>{t("license_disclaimer")}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </li>

          <li>
            <Link href={appConfig.URLS.app.services?.weather ?? "#"}>
              {t("powered")}{" "}
              {appConfig.APP.services?.weather ?? "[weather service]"}
            </Link>
          </li>
        </ul>

        <ul className="flex items-center gap-5">
          <li>
            <IconLink
              href={appConfig.URLS.app.repo || "#"}
              icon={<Github size={16} />}
            >
              Github
            </IconLink>
          </li>

          <li>
            <Badge>v{appConfig.APP.version}</Badge>
          </li>
        </ul>
      </div>
    </footer>
  );
}
