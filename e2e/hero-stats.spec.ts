import { expect, test } from "./support/portfolio";

test.describe("indicadores externos do hero", () => {
  test("preserva zero como dado válido", async ({ page }) => {
    let releaseResponses = () => {};
    const pendingResponses = new Promise<void>((resolve) => {
      releaseResponses = resolve;
    });
    await page.route("**/api/github", async (route) => {
      await pendingResponses;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        // O formato legado permanece aceito durante deploys independentes de Pages e Render.
        body: JSON.stringify({ total: 0, year: 2026 }),
      });
    });
    await page.route("**/api/coffee", async (route) => {
      await pendingResponses;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ count: 0 }),
      });
    });

    await page.goto("/");

    await expect(page.getByRole("link", { name: /carregando commits/u })).toBeVisible();
    await expect(page.getByRole("button", { name: "Oferecer um café" })).toContainText(
      "carregando cafés",
    );
    releaseResponses();
    await expect(page.getByRole("link", { name: /0 commits/u })).toBeVisible();
    await expect(page.getByRole("button", { name: "Oferecer um café" })).toContainText(
      /0\s*cafés/u,
    );
  });

  test("comunica indisponibilidade sem inventar valores", async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem("gf-lang", "en"));
    await page.route("**/api/github", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: "unavailable" }),
      }),
    );
    await page.route("**/api/coffee", (route) =>
      route.fulfill({ status: 503, contentType: "application/json", body: '{"ok":false}' }),
    );

    await page.goto("/");

    await expect(page.getByRole("link", { name: /commits unavailable/u })).toBeVisible();
    await expect(page.getByRole("button", { name: "Buy me a coffee" })).toContainText(
      "coffees unavailable",
    );
  });
});
