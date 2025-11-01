import { Search, X } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Kbd } from "./ui/kbd";
import { useEffect, useRef, useState } from "react";
import { fetchSearch } from "@/services/search-service";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "./ui/item";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Spinner } from "./ui/spinner";
import { useCity } from "@/contexts/city-context";
import { useTranslation } from "react-i18next";
import { useHotkeys } from "react-hotkeys-hook";
import { setSession } from "@/lib/window-session";

import { motion } from "framer-motion";
import { useMediaQuery } from "@uidotdev/usehooks";
import type { ModelSearchItem } from "@/interfaces";
import { Skeleton } from "./ui/skeleton";
import { useLang } from "@/hooks/use-lang";
import { useConfig } from "@/contexts/config-context";

export default function CitySearch(ready: { ready: boolean }) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setOpen] = useState<boolean>(false);

  const { setCity } = useCity();
  const { lang } = useLang();
  const { appConfig } = useConfig();
  const { t } = useTranslation();

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const cleanedQuery = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  useHotkeys("alt+k", () => {
    inputRef.current?.focus();
  });

  useEffect(() => {
    if (typeof query !== "string" || !query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        if (query === "" || query.length < 2) {
          setLoading(false);
          setOpen(false);
          return;
        }
        await fetchSearch(cleanedQuery, appConfig, lang).then(setResults);
      } catch (err) {
        console.error("Error (getSearch):", err);
      } finally {
        setLoading(false);
        setOpen(true);
      }
    }, 800);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelectCity = (cityId: number) => {
    setCity(`id:${cityId}`);
    setQuery("");
    setResults([]);
    setOpen(false);
    setSession("city", `id:${cityId}`);
  };

  if (!ready) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  return (
    <div
      id="search-container"
      ref={containerRef}
      className="relative w-full max-w-2xl md:max-w-3xl lg:max-w-4xl grid gap-2 mb-5 md:gap-3"
    >
      <InputGroup className="transition-colors">
        <InputGroupInput
          ref={inputRef}
          placeholder={t("search_placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <InputGroupAddon>{loading ? <Spinner /> : <Search />}</InputGroupAddon>
        <InputGroupAddon align="inline-end">
          {isDesktop && <Kbd>ALT + K</Kbd>}
        </InputGroupAddon>
      </InputGroup>

      {results.length > 0 && isOpen && (
        <motion.div
          key={query}
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{
            duration: 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="origin-top mt-2"
        >
          <Card className={`transition-all pb-0`}>
            <CardHeader>
              <CardTitle className="w-full flex justify-between">
                <div className="font-unbounded font-normal tracking-tight inline-flex flex-col gap-2 md:gap-1 md:flex-row">
                  {t("titles.search.title")}{" "}
                  <span className="font-bold">{query.toLowerCase()}</span>
                </div>
                <div className="absolute right-8">
                  <Button
                    onClick={() => setOpen(false)}
                    variant={"outline"}
                    size={"icon-sm"}
                  >
                    <X />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                {t("titles.search.description", { count: results.length })}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col px-3.5 pb-2 max-h-[300px] overflow-y-auto">
              {results.map((_cityObj: ModelSearchItem) => (
                <Item
                  key={`${_cityObj.id}-${_cityObj.name}`}
                  onClick={() => handleSelectCity(_cityObj.id)}
                  className="cursor-pointer my-2 first:mt-2.5 last:mb-2.5 hover:bg-accent"
                  variant={"outline"}
                >
                  <ItemContent>
                    <ItemTitle>{_cityObj.name}</ItemTitle>
                    {isDesktop && (
                      <ItemDescription className="text-xs flex gap-2">
                        {_cityObj.region && <span>{_cityObj.region}</span>}
                        {_cityObj.country && <span>{_cityObj.country}</span>}
                      </ItemDescription>
                    )}
                  </ItemContent>
                  <ItemActions>
                    <Button
                      onClick={() => handleSelectCity(_cityObj.id)}
                      variant={"outline"}
                      size={"sm"}
                    >
                      {t("titles.search.button")}
                    </Button>
                  </ItemActions>
                </Item>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
