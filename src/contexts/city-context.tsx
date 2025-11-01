import { getSession, setSession } from "@/lib/window-session";
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

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: ReactNode }) {

  const initialCity = (() => {
    const sessionCity = getSession("city");
    if (sessionCity) return sessionCity;
    try {
      const geo = localStorage.getItem("geo");
      if (geo) return `id:${geo}`;
    } catch (err) {
      // SSR or blocked access
    }

    // fallback
    return "Rio de Janeiro";
  })();

  const [city, setCity] = useState<string>(initialCity);
  const [geoDetected, setGeoDetected] = useState<boolean>(false);

  useEffect(() => {
    try {
      setSession("city", city);
    } catch (err) {}
  }, [city]);

  const hasGeoCache = (() => {
    try {
      return Boolean(localStorage.getItem("geo"));
    } catch {
      return false;
    }
  })();

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["geoLocation"],
    queryFn: () => fetchSearchByIp(),
    staleTime: 1000 * 60 * 60 * 24, // 24h
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    enabled: !hasGeoCache,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const res = data as any;
      const id =
        (res && res.results?.[0].id) ?? (res && res.detected?.id) ?? null;

      if (id) {
        try {
          localStorage.setItem("geo", String(id));
        } catch {}
        const newCity = `id:${id}`;
        if (city !== newCity) {
          setCity(newCity);
          setGeoDetected(true);
        } else {
          setCity(newCity);
        }
      } else {
        setCity("Rio de Janeiro");
        setGeoDetected(false);
      }
    }
    if (isError) {
      setCity("Rio de Janeiro");
      setGeoDetected(false);
    }
  }, [isSuccess, isError, data, setCity, city]);

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
