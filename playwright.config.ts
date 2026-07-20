import { defineConfig } from "@playwright/test";

process.env.VITE_RECAPTCHA_SITE_KEY ??= "playwright-test-site-key";

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  outputDir: "test-results",
  fullyParallel: true,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL: BASE_URL,
    browserName: "chromium",
    locale: "pt-BR",
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
