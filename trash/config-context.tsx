import { createContext, useEffect, useState } from "react";


const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [appConfig, setAppConfig] = useState<AppConfig>(defaultAppConfig);
  const [userPreferences, setUserPreferences] =
    useState<UserPreferences>(defaultPreferences);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch("/config.json");

        if (!response.ok) {
          throw new Error(`HTTP ERROR! status: ${response.status}`);
        }

        const configData: Partial<FullConfig> = await response.json();

        setAppConfig((prev) => ({
          ...prev,
          ...configData.appConfig,
        }));

        const stored = localStorage.getItem("userPreferences");
        let finalPreferences: UserPreferences;

        if (stored) {
          try {
            finalPreferences = {
              ...defaultPreferences,
              ...configData.defaultPreferences,
              ...JSON.parse(stored),
            };
          } catch {
            console.warn("Invalid userPreferences in localStorage");
            finalPreferences = {
              ...defaultPreferences,
              ...configData.defaultPreferences,
            };
          }
        } else {
          finalPreferences = {
            ...defaultPreferences,
            ...configData.defaultPreferences,
          };
        }

        setUserPreferences(finalPreferences);
      } catch (err) {
        console.warn("Failed to load custom config, using defaults:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  useEffect(() => {
    if (i18n.language !== userPreferences.lang) {
      i18n.changeLanguage(userPreferences.lang || "en");
    }
  }, [userPreferences.lang]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
    }
  }, [userPreferences, loading]);

  return (
    <ConfigContext.Provider
      value={{
        appConfig,
        userPreferences,
        setAppConfig,
        setUserPreferences,
        loading,
        error,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within a ConfigProvider");
  return ctx;
}
