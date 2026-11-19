import { expect, openPage, ROUTES, test } from "./support/portfolio";

const homeMatrix = [
  { width: 320, language: "pt", theme: "dark" },
  { width: 412, language: "en", theme: "light" },
  { width: 768, language: "pt", theme: "light" },
  { width: 1440, language: "en", theme: "dark" },
] as const;

test.describe("arquitetura tipográfica", () => {
  for (const scenario of homeMatrix) {
    test(`Home em ${scenario.width}px, ${scenario.language}/${scenario.theme}`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await openPage(page, "/", { ...scenario, height: 900 });

      await expect(page.locator("body")).toHaveCSS("font-family", /Space Grotesk Variable/u);
      await expect(page.locator("body")).toHaveCSS("font-weight", "400");
      await expect(page.locator("#home-heading")).toHaveCSS("font-family", /DM Sans Subset/u);
      await expect(page.locator("#home-heading")).toHaveCSS("font-weight", "600");
      await expect(page.locator("#home-heading > span").last()).toHaveCSS("font-weight", "500");
      await expect(page.locator(".testimonial-editorial-copy").first()).toHaveCSS(
        "font-weight",
        "400",
      );
      await expect(page.locator(".testimonial-editorial-author-label").first()).toHaveCSS(
        "font-weight",
        "400",
      );
      await expect(page.locator(".about-template__details p").first()).toHaveCSS(
        "font-family",
        /Space Grotesk Variable/u,
      );
      await expect(page.locator(".about-template__details p").first()).toHaveCSS(
        "font-weight",
        "400",
      );

      const geometry = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth + 1);
    });
  }

  for (const [index, route] of ROUTES.filter(
    (candidate) => candidate !== "/rota-inexistente",
  ).entries()) {
    test(`${route} herda as famílias e pesos canônicos`, async ({ page }) => {
      await openPage(page, route, {
        width: index % 2 === 0 ? 412 : 1440,
        height: 900,
        language: index % 2 === 0 ? "pt" : "en",
        theme: index % 2 === 0 ? "light" : "dark",
      });

      await expect(page.locator("body")).toHaveCSS("font-family", /Space Grotesk Variable/u);
      await expect(page.locator("body")).toHaveCSS("font-weight", "400");
      await expect(page.locator("main h1, main h2").first()).toHaveCSS(
        "font-family",
        /DM Sans Subset/u,
      );

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});
