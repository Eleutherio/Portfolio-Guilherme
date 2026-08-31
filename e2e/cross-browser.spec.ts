import { expect, openPage, test } from "./support/portfolio";

test.describe("contratos essenciais entre engines", () => {
  test("home carrega e navega para uma seção diferida", async ({ page }) => {
    await openPage(page, "/", {
      width: 1280,
      height: 800,
      loadDeferredSections: false,
    });

    await page.getByRole("link", { name: /ver projetos/i }).click();
    await expect(page.locator('[data-projects-hydrated="true"]')).toBeAttached();
    await expect(page.locator("#projetos")).toBeInViewport();
  });

  test("case mantém leitura e reflow no viewport móvel", async ({ page }) => {
    await openPage(page, "/projetos/grengame", { width: 375, height: 812 });
    await expect(page.locator("h1")).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
  });
});
