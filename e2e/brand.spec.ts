import { expect, openPage, test } from "./support/portfolio";

test.describe("Identidade visual", () => {
  test("a assinatura da marca usa o nome completo com pesos bold e light", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900 });

    const wordmarks = page.locator('[data-wordmark="guifer.tech"]');
    await expect(wordmarks).toHaveCount(2);

    for (const wordmark of await wordmarks.all()) {
      await expect(wordmark.locator('[data-wordmark-part="gui"]')).toHaveText("gui");
      await expect(wordmark.locator('[data-wordmark-part="guifer"]')).toHaveCSS(
        "font-weight",
        "700",
      );
      await expect(wordmark.locator('[data-wordmark-part="tech"]')).toHaveCSS("font-weight", "300");
    }

    const headerWordmark = page.locator("header").locator('[data-wordmark="guifer.tech"]');
    await expect(headerWordmark).toHaveCSS("font-size", "11.5px");
    await expect(page.locator("footer").locator('[data-wordmark="guifer.tech"]')).toHaveCSS(
      "font-size",
      "11.5px",
    );
    await expect(page.locator("header").getByText("GF", { exact: true })).toHaveCount(0);
  });

  test("o MIV preserva a capitalização original sem forçar caixa alta", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900 });

    const forcedTextTransforms = await page.locator("body *").evaluateAll((elements) =>
      elements
        .filter((element) => window.getComputedStyle(element).textTransform !== "none")
        .map((element) => ({
          tag: element.tagName,
          className: element.getAttribute("class"),
          textTransform: window.getComputedStyle(element).textTransform,
        })),
    );

    expect(forcedTextTransforms).toEqual([]);
    await expect(page.locator("header").getByText("EN", { exact: true })).toBeVisible();
    await expect(
      page.locator("footer").getByRole("link", { name: "Acessibilidade" }),
    ).toBeVisible();
    await expect(page.locator("footer").getByRole("button", { name: "Privacidade" })).toBeVisible();
  });

  test("o header concentra navegação e controles na metade direita", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900, loadDeferredSections: false });

    const headerContainer = page.locator("header .header-container").first();
    const headerRight = page.locator("[data-header-right]");
    const navigationItems = headerRight.locator("nav > button");

    await expect(navigationItems).toHaveCount(3);
    await expect(navigationItems).toHaveText(["sobre", "projetos", "contato"]);

    const containerBox = await headerContainer.boundingBox();
    const rightBox = await headerRight.boundingBox();
    expect(rightBox?.x ?? 0).toBeGreaterThanOrEqual(
      (containerBox?.x ?? 0) + (containerBox?.width ?? 0) / 2 - 1,
    );
    await expect(page.locator("[data-header-switches]")).toHaveClass(/rounded-full/);
  });
});
