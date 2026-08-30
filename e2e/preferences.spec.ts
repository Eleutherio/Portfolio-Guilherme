import { expect, openPage, test } from "./support/portfolio";

test.describe("preferências globais", () => {
  test("aplica tema e idioma salvos antes da montagem do React", async ({ page }) => {
    let mainModuleBlocked = false;
    await page.addInitScript(() => {
      window.localStorage.setItem("gf-lang", "en");
      window.localStorage.setItem("gf-theme", "dark");
    });
    await page.route(/\/src\/main\.tsx(?:\?|$)/u, async (route) => {
      mainModuleBlocked = true;
      await route.abort();
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });

    expect(mainModuleBlocked).toBe(true);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
    await expect(page.locator("#root")).toBeEmpty();
  });

  test("sincroniza alterações entre abas e persiste a seleção", async ({ page, context }) => {
    await openPage(page, "/", { language: "pt", theme: "light" });
    const secondPage = await context.newPage();
    await secondPage.goto("/", { waitUntil: "domcontentloaded" });

    const switches = page.locator("[data-header-switches]");
    await switches.locator("button").nth(0).click();
    await switches.locator("button").nth(1).click();

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
    await expect
      .poll(() =>
        page.evaluate(() => [localStorage.getItem("gf-lang"), localStorage.getItem("gf-theme")]),
      )
      .toEqual(["en", "dark"]);

    await expect(secondPage.locator("html")).toHaveAttribute("lang", "en");
    await expect(secondPage.locator("html")).toHaveClass(/dark/);

    const restoredPage = await context.newPage();
    await restoredPage.goto("/", { waitUntil: "domcontentloaded" });
    await expect(restoredPage.locator("html")).toHaveAttribute("lang", "en");
    await expect(restoredPage.locator("html")).toHaveClass(/dark/);
    await restoredPage.close();
    await secondPage.close();
  });
});
