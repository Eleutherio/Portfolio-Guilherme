import { expect, openPage, test } from "./support/portfolio";
import { primeResponsiveVisual, stabilizeResponsiveLayout } from "./support/responsive";
import { fileURLToPath } from "node:url";

const SNAPSHOT_STYLE = fileURLToPath(new URL("./support/screenshot.css", import.meta.url));

test.describe("baselines visuais selecionados", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

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

  test("home no desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "baseline mantido no engine principal");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "/", {
      width: 1440,
      height: 900,
      language: "en",
      theme: "light",
      loadDeferredSections: false,
    });

    const target = page.locator("#home");
    await stabilizeResponsiveLayout(page);
    await expect(target.locator("[data-hero-video-control]")).toBeVisible();
    await expect(target).toHaveScreenshot("home-desktop.png", {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.015,
      stylePath: SNAPSHOT_STYLE,
    });
  });

  test("home no mobile escuro", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "baseline mantido no engine principal");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "/", {
      width: 320,
      height: 700,
      language: "pt",
      theme: "dark",
      loadDeferredSections: false,
    });

    const target = page.locator("#home");
    await stabilizeResponsiveLayout(page);
    await expect(target.locator("[data-hero-video-control]")).toBeVisible();
    await expect(target).toHaveScreenshot("home-mobile-dark.png", {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.015,
      stylePath: SNAPSHOT_STYLE,
    });
  });

  test("depoimentos no desktop claro", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "baseline mantido no engine principal");
    await openPage(page, "/", {
      width: 1440,
      height: 900,
      language: "pt",
      theme: "light",
    });

    const target = page.locator("#depoimentos");
    await primeResponsiveVisual(page, target);
    await expect(target).toHaveScreenshot("testimonials-desktop-light.png", {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.015,
      stylePath: SNAPSHOT_STYLE,
    });
  });

  test("depoimentos no mobile escuro", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "baseline mantido no engine principal");
    await openPage(page, "/", {
      width: 412,
      height: 915,
      language: "en",
      theme: "dark",
    });

    const target = page.locator("#depoimentos");
    await primeResponsiveVisual(page, target);
    await target.evaluate((section) => section.scrollIntoView({ block: "start" }));
    const anchorClearance = await page.evaluate(() => {
      const header = document.querySelector<HTMLElement>("header")!.getBoundingClientRect();
      const heading = document
        .querySelector<HTMLElement>("#depoimentos-heading")!
        .getBoundingClientRect();
      return { headerBottom: header.bottom, headingTop: heading.top };
    });
    expect(anchorClearance.headingTop).toBeGreaterThanOrEqual(anchorClearance.headerBottom);
    await expect(target).toHaveScreenshot("testimonials-mobile-dark.png", {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.015,
      stylePath: SNAPSHOT_STYLE,
    });
  });

  test("case GrenGame no desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "baseline mantido no engine principal");
    await openPage(page, "/projetos/grengame", { width: 1440, height: 900 });

    const target = page.locator("#grengame-overview");
    await primeResponsiveVisual(page, target);
    await expect(target).toHaveScreenshot("case-grengame-desktop.png", {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.015,
      stylePath: SNAPSHOT_STYLE,
    });
  });
});
