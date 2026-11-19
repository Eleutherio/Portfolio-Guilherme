import { defineConfig } from "@playwright/test";

process.env.VITE_RECAPTCHA_SITE_KEY ??= "playwright-test-site-key";

const PORT = Number(process.env.E2E_PORT ?? 4173);
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error("E2E_PORT deve ser uma porta válida entre 1 e 65535.");
}
const COMMIT_GATE = process.env.E2E_COMMIT_GATE === "1";
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  outputDir: "test-results",
  fullyParallel: true,
  timeout: 60_000,
  globalTimeout: COMMIT_GATE ? 25 * 60_000 : undefined,
  expect: { timeout: 10_000 },
  forbidOnly: COMMIT_GATE || Boolean(process.env.CI),
  retries: COMMIT_GATE ? 0 : process.env.CI ? 2 : 0,
  workers: 2,
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  // Os baselines são isolados por engine. Testes com variação comprovada de rasterização
  // acrescentam a plataforma ao próprio nome do snapshot.
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
    reuseExistingServer: !COMMIT_GATE && !process.env.CI,
    timeout: 120_000,
  },
});
