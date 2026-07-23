import "@fontsource-variable/dm-sans";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import { AppProvider } from "./i18n/AppContext";
import { ThemeProvider } from "./lib/theme";

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
