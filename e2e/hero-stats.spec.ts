import { expect, openPage, test } from "./support/portfolio";
import { resolveUnavailableGithubStats } from "../src/components/hero/github-commit-state";

test.describe("contador de cafés e estado remoto", () => {
  test("carrega sem crypto.randomUUID e mantém um identificador UUID válido", async ({ page }) => {
    let submittedVisitorId = "";
    await page.addInitScript(() =>
      Object.defineProperty(Crypto.prototype, "randomUUID", {
        configurable: true,
        value: undefined,
      }),
    );
    await page.route("**/api/coffee", async (route) => {
      if (route.request().method() === "POST")
        submittedVisitorId = (route.request().postDataJSON() as { visitorId: string }).visitorId;
      await route.fulfill({ json: { count: submittedVisitorId ? 1 : 0 } });
    });
    await openPage(page, "/");
    const coffee = page.getByRole("button", { name: "Oferecer um café" });
    await coffee.scrollIntoViewIfNeeded();
    await coffee.click();
    await expect
      .poll(() => submittedVisitorId)
      .toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u);
    await expect(page.locator("[data-coffee-counter]")).toContainText(/1\s*café/u);
  });

  test("preserva o estado de carregamento e zero como dado válido", async ({ page }) => {
    let release = () => {};
    const pending = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route("**/api/coffee", async (route) => {
      await pending;
      await route.fulfill({ json: { count: 0 } });
    });
    const opening = openPage(page, "/");
    await expect(page.locator("[data-coffee-counter]")).toContainText("carregando cafés");
    release();
    await opening;
    const coffee = page.locator("[data-coffee-counter]");
    await coffee.scrollIntoViewIfNeeded();
    await expect(coffee).toContainText(/0\s*cafés/u);
    await expect(coffee).toHaveAttribute("aria-disabled", "false");
  });

  test("exibe contagem positiva confirmada pela API sem contador de commits obsoleto", async ({
    page,
  }) => {
    await page.route("**/api/coffee", (route) => route.fulfill({ json: { count: 247 } }));
    await openPage(page, "/");
    const coffee = page.locator("[data-coffee-counter]");
    await coffee.scrollIntoViewIfNeeded();
    await expect(coffee).toContainText(/247\s*cafés/u);
    await expect(
      page.locator("#home [data-github-stats-source], footer [data-github-stats-source]"),
    ).toHaveCount(0);
  });

  test("não inventa contagem de commits quando a API falha em produção", () => {
    expect(resolveUnavailableGithubStats(false)).toEqual({ status: "unavailable" });
  });

  test("fallback de commits permanece identificado e exclusivo do desenvolvimento", () => {
    expect(resolveUnavailableGithubStats(true)).toEqual({
      status: "ready",
      value: { total: 128, source: "fallback" },
    });
  });

  test("falha remota de cafés é explícita e não fabrica um valor", async ({ page }) => {
    await page.route("**/api/coffee", (route) =>
      route.fulfill({ status: 503, json: { ok: false } }),
    );
    await openPage(page, "/", { language: "en" });
    const coffee = page.getByRole("button", { name: "Buy me a coffee" });
    await coffee.scrollIntoViewIfNeeded();
    await expect(coffee).toContainText("coffees unavailable");
    await expect(coffee).toHaveAttribute("aria-disabled", "false");
    await coffee.click();
    await expect(coffee).toHaveAttribute("aria-disabled", "false");
    await expect(coffee).toHaveAccessibleName("Buy me a coffee");
    await expect(coffee.locator(".tabular-nums")).toHaveCount(0);
  });
});
