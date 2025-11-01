import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CityProvider } from "./contexts/city-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "./contexts/config-context";
import App from "./App";

import "./i18n";
import "./styles/index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <CityProvider>
          <App />
        </CityProvider>
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>
);
