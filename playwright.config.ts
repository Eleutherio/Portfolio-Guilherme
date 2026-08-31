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
  // O baseline é compartilhado entre sistemas, mas isolado por engine. As fontes são locais e
  // a tolerância perceptual absorve apenas diferenças de rasterização entre Windows e Linux.
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{projectName}/{arg}{ext}",
  use: {
    baseURL: BASE_URL,
    locale: "pt-BR",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
    {
      name: "webkit-smoke",
      testMatch: /cross-browser\.spec\.ts/u,
      use: { browserName: "webkit" },
    },
  ],
  webServer: {
    command: `node ./node_modules/vite/bin/vite.js --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
