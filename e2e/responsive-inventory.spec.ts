import { expect } from "@playwright/test";
import { openAccessibilityWidget, openPage, ROUTES, test } from "./support/portfolio";
import {
  assertOverlayWithinViewport,
  assertResponsiveInventory,
  EXTREME_SCENARIOS,
  mapKeyboardFocus,
  primeResponsiveVisual,
  STRUCTURAL_VIEWPORTS,
} from "./support/responsive";

const STRUCTURAL_ROUTES = ["/", "/sobre", "/projetos/grengame", "/acessibilidade"] as const;
const MODE_ROTATION = [
  { language: "pt", theme: "light" },
  { language: "en", theme: "dark" },
  { language: "pt", theme: "dark" },
  { language: "en", theme: "light" },
] as const;

test.describe("RESP-01 — inventário responsivo", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  for (const route of ROUTES) {
    for (const scenario of EXTREME_SCENARIOS) {
      test(`${route} | ${scenario.name}`, async ({ page }, testInfo) => {
        await openPage(page, route, {
          language: scenario.language,
          theme: scenario.theme,
          width: scenario.width,
          height: scenario.height,
        });
        await assertResponsiveInventory(page, testInfo, `${route}-${scenario.name}`);
      });
    }
  }

  for (const [routeIndex, route] of STRUCTURAL_ROUTES.entries()) {
    for (const [viewportIndex, viewport] of STRUCTURAL_VIEWPORTS.entries()) {
      const mode = MODE_ROTATION[(routeIndex + viewportIndex) % MODE_ROTATION.length];
      test(`${route} | ${viewport.name} | ${mode.language}-${mode.theme}`, async ({
        page,
      }, testInfo) => {
        await openPage(page, route, {
          ...mode,
          width: viewport.width,
          height: viewport.height,
        });
        await assertResponsiveInventory(page, testInfo, `${route}-${viewport.name}`);
      });
    }
  }

  for (const viewport of [
    { name: "mobile", width: 320, height: 568, language: "pt", theme: "light" },
    { name: "desktop", width: 1440, height: 900, language: "en", theme: "dark" },
  ] as const) {
    test(`home mapeia ciclo de foco no ${viewport.name}`, async ({ page }, testInfo) => {
      await openPage(page, "/", viewport);
      await mapKeyboardFocus(page, testInfo, `home-${viewport.name}`);
    });
  }

  test("menu mobile permanece dentro da viewport baixa", async ({ page }, testInfo) => {
    await openPage(page, "/", { width: 320, height: 568, loadDeferredSections: false });
    await page.locator('header a:has([data-wordmark="guifer.tech"])').focus();
    await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
    await assertOverlayWithinViewport(page, testInfo, "mobile-menu", [
      page.locator("#primary-navigation-panel"),
    ]);
  });

  test("widget de acessibilidade permanece dentro da viewport baixa", async ({
    page,
  }, testInfo) => {
    await openPage(page, "/", { width: 320, height: 568, loadDeferredSections: false });
    const host = await openAccessibilityWidget(page);
    await assertOverlayWithinViewport(page, testInfo, "accessibility-widget", [
      host.locator(".acc-menu"),
    ]);
  });

  test("aviso de privacidade permanece dentro da viewport baixa", async ({ page }, testInfo) => {
    await openPage(page, "/", { width: 320, height: 568 });
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await footer.getByRole("button", { name: "Privacidade", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await assertOverlayWithinViewport(page, testInfo, "privacy-dialog", [dialog]);
  });

  test("controles flutuantes não colidem na viewport baixa", async ({ page }, testInfo) => {
    await openPage(page, "/", { width: 375, height: 568 });
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" }),
    );
    await page.mouse.down();
    await page.mouse.up();
    const [launcherBox, backToTopBox] = await assertOverlayWithinViewport(
      page,
      testInfo,
      "floating-controls",
      [
        page
          .locator("#accessibility-widget-launcher, #acc-widget-host #accessibilityWidget")
          .first(),
        page.locator("[data-back-to-top]"),
      ],
    );
    const intersects =
      Math.min(launcherBox.x + launcherBox.width, backToTopBox.x + backToTopBox.width) -
        Math.max(launcherBox.x, backToTopBox.x) >
        1 &&
      Math.min(launcherBox.y + launcherBox.height, backToTopBox.y + backToTopBox.height) -
        Math.max(launcherBox.y, backToTopBox.y) >
        1;
    expect(intersects).toBe(false);
  });

  for (const visual of [
    { name: "hero-mobile", route: "/", width: 320, height: 568, selector: "#home" },
    { name: "projects-landscape", route: "/", width: 667, height: 375, selector: "#projetos" },
    { name: "about-tablet", route: "/", width: 768, height: 1024, selector: "#sobre" },
    { name: "footer-landscape", route: "/", width: 667, height: 375, selector: "footer" },
    {
      name: "case-tablet-landscape",
      route: "/projetos/martha-izabel",
      width: 1024,
      height: 768,
      selector: "main",
    },
    {
      name: "case-wide",
      route: "/projetos/grengame",
      width: 1920,
      height: 1080,
      selector: "main",
    },
  ] as const) {
    test(`captura baseline visual ${visual.name}`, async ({ page }, testInfo) => {
      await openPage(page, visual.route, { width: visual.width, height: visual.height });
      const target = page.locator(visual.selector).first();
      await target.scrollIntoViewIfNeeded();
      await expect(target).toBeVisible();
      await primeResponsiveVisual(page, target);
      if (visual.name === "projects-landscape") {
        await expect(target.locator("[data-project-card]")).toHaveCount(3);
        await expect(target.getByRole("heading", { level: 3 })).toHaveText([
          "GrenGame",
          "Website Abriu Chaveiro ®",
          "Portfólio profissional",
        ]);
      }
      if (visual.name === "about-tablet") {
        await expect(target.locator(".about-template__portrait img")).toHaveAttribute(
          "alt",
          /Guilherme/,
        );
        await expect(target.locator(".about-template__content")).toContainText(
          "Guilherme Eleuthério",
        );
      }
      if (visual.name === "footer-landscape") {
        const vital = target.getByRole("button", { name: /^LCP:/u });
        await vital.focus();
        await expect(vital).toBeFocused();
        await assertOverlayWithinViewport(page, testInfo, "footer-vitals-tooltip", [
          vital.locator("xpath=following-sibling::span"),
        ]);
      }
      const screenshotPath = testInfo.outputPath(`${visual.name}.png`);
      await target.screenshot({
        path: screenshotPath,
        animations: "disabled",
        caret: "hide",
        style: [
          "header.fixed, nav.fixed,",
          "#accessibility-widget-launcher, [data-back-to-top],",
          "#custom-cursor, #custom-cursor-tooltip { visibility: hidden !important; }",
        ].join(" "),
      });
      await testInfo.attach(`${visual.name}.png`, {
        path: screenshotPath,
        contentType: "image/png",
      });
    });
  }
});
