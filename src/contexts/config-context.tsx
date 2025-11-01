import { ConfigManager } from "@/config-manager";
import type {
  AppConfig,
  ConfigContextType,
  UserPreferences,
} from "@/interfaces/config";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

function useConfigManager() {
  const [manager] = useState(() => ConfigManager.getInstance());
  const [state, setState] = useState(manager.getState());

  useEffect(() => {
    const init = async () => {
      await manager.initialize();
      setState(manager.getState());
    };

    init();
  }, [manager]);

  const updateState = () => setState(manager.getState());

  function setAppConfig(newConfig: Partial<AppConfig>) {
    manager.setAppConfig(newConfig);
    updateState();
  }

  function setUserPreferences(newPreferences: Partial<UserPreferences>) {
    manager.setUserPreferences(newPreferences);
    updateState();
  }

  return {
    appConfig: state.appConfig,
    userPreferences: state.userPreferences,
    loading: state.loading,
    error: state.error,
    setAppConfig,
    setUserPreferences,
  };
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const configManager = useConfigManager();

  function setAppConfig(action: React.SetStateAction<AppConfig>): void {
    if (typeof action === "function") {
      const newConfig = action(configManager.appConfig);
      configManager.setAppConfig(newConfig);
    } else {
      configManager.setAppConfig(action);
    }
  }

  function setUserPreferences(
    action: React.SetStateAction<UserPreferences>
  ): void {
    if (typeof action === "function") {
      const newPreferences = action(configManager.userPreferences);
      configManager.setUserPreferences(newPreferences);
    } else {
      configManager.setUserPreferences(action);
    }
  }

  return (
    <ConfigContext.Provider
      value={{
        appConfig: configManager.appConfig,
        userPreferences: configManager.userPreferences,
        setAppConfig,
        setUserPreferences,
        loading: configManager.loading,
        error: configManager.error,
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
