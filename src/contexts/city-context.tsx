import { getSession, setSession } from "@/lib/window-session";
import { ConfigManager } from "@/managers/config-manager";
import { fetchSearchByIp } from "@/services/search-service";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface CityContextType {
  city: string;
  setCity: (c: string) => void;
  geoDetected: boolean;
  setGeoDetected: (g: boolean) => void;
}

const configManager = ConfigManager.getInstance()
const CityContext = createContext<CityContextType | undefined>(undefined);

const NODE_ENV = import.meta.env.NODE_ENV as "development" | "staging" | "production"

const GEO_KEY = "geo"
const GEO_TTL = 1000 * 60 * 60 * 24;

const DEFAULT_CITY = configManager.getState().appConfig.CONSTANTS?.default_location || "Rio de Janeiro"

function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined" && window.localStorage !== null;
  } catch {
    return false
  }
}

function getGeoFromStorage(): string | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const raw = localStorage.getItem(GEO_KEY)
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "id" in parsed && "ts" in parsed) {
      const age = Date.now() - Number((parsed as any).ts);
      if (age < GEO_TTL) {
        return String((parsed as any).id)
      } else {
        localStorage.removeItem(GEO_KEY);
        return null;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function setGeoInStorage(id: string | number) {

  if (!isLocalStorageAvailable() && NODE_ENV !== "production") {
    console.debug("[CityProvider] localStorage not available, skipping geo cache write");
    return
  }
  try {
    localStorage.setItem(GEO_KEY, JSON.stringify(({ id: String(id), ts: Date.now() })))
    console.debug("[CityProvider] geo cached", id)
  } catch (err) {
    console.debug("[CityProvider] failed to write geo cache:", err)
  }
}

export function CityProvider({ children }: { children: ReactNode }) {

  const initialCity = (() => {
    const sessionCity = getSession("city");
    if (sessionCity) return sessionCity;

    const geoId = (() => {
      try {
        return getGeoFromStorage()
      } catch {
        return null;
      }
    })();

    if (geoId) return `id:${geoId}`

    // fallback
    return DEFAULT_CITY;
  })();

  const [city, setCity] = useState<string>(initialCity);
  const [geoDetected, setGeoDetected] = useState<boolean>(false);

  useEffect(() => {
    try {
      setSession("city", city);
    } catch (err) {
      // ignore
    }
  }, [city]);

  const hasGeoCache = (() => {
    try {
      return getGeoFromStorage() !== null;
    } catch {
      return false;
    }
  })();

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["geoLocation"],
    queryFn: () => fetchSearchByIp(),
    staleTime: GEO_TTL,
    gcTime: GEO_TTL,
    refetchOnWindowFocus: false,
    enabled: !hasGeoCache,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const res = data as any;
      const id =
        (res && res.results?.[0].id) ?? (res && res.detected?.id) ?? null;

      if (id) {
        setGeoInStorage(id)
        const newCity = `id:${id}`;
        if (city !== newCity) {
          setCity(newCity);
          setGeoDetected(true);
        } else {
          setCity(newCity);
        }
      } else {
        setCity(DEFAULT_CITY);
        setGeoDetected(false);
      }
    }
    if (isError) {
      setCity(DEFAULT_CITY);
      setGeoDetected(false);
    }
  }, [isSuccess, isError, data]);

  return (
    <CityContext.Provider
      value={{ city, setCity, geoDetected, setGeoDetected }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return ctx;
}
