import "./styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import { AppProvider } from "./i18n/AppContext";
import { initializePreferences } from "./lib/preferences";
import { ThemeProvider } from "./lib/theme";

initializePreferences();

const router = getRouter();
const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ThemeProvider>
  </StrictMode>,
);
