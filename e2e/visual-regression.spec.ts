import { expect, openPage, test } from "./support/portfolio";

test.describe("baselines visuais selecionados", () => {
  test.use({ reducedMotion: "reduce" });

  test("cabeçalho da privacidade no desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "baseline mantido no engine principal");
    await openPage(page, "/privacidade", { width: 1280, height: 800 });

    await expect(page.locator('section[aria-labelledby="privacy-heading"]')).toHaveScreenshot(
      "privacy-header-desktop.png",
      { animations: "disabled", caret: "hide", maxDiffPixelRatio: 0.015 },
    );
  });

  test("cabeçalho de acessibilidade no mobile escuro", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "baseline mantido no engine principal");
    await openPage(page, "/acessibilidade", {
      theme: "dark",
      width: 375,
      height: 812,
    });

    await expect(page.locator('section[aria-labelledby="accessibility-heading"]')).toHaveScreenshot(
      `accessibility-header-mobile-dark-${process.platform}.png`,
      {
        animations: "disabled",
        caret: "hide",
        maxDiffPixelRatio: 0.015,
      },
    );
  });
});
