import { expect, openPage, test } from "./support/portfolio";

test.describe("Identidade visual", () => {
  test("papéis tipográficos compartilham tokens e preservam as exceções da marca", async ({
    page,
  }) => {
    await page.route("**/api/coffee", (route) => route.fulfill({ json: { count: 0 } }));
    await openPage(page, "/", { width: 1440, height: 900 });
    const tokens = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return Object.fromEntries(
        ["heading", "display", "editorial", "body", "interface", "meta", "numeric"].map((role) => [
          role,
          styles.getPropertyValue(`--type-weight-${role}`).trim(),
        ]),
      );
    });
    expect(tokens).toEqual({
      heading: "500",
      display: "600",
      editorial: "400",
      body: "400",
      interface: "500",
      meta: "400",
      numeric: "400",
    });
    await expect(page.locator("#home-heading")).toHaveCSS("font-weight", "600");
    await expect(page.locator("#home-heading > span").last()).toHaveCSS("font-weight", "500");
    await expect(page.locator(".about-template__details p").first()).toHaveCSS(
      "font-weight",
      "400",
    );
    await expect(page.locator("[data-coffee-counter] .tabular-nums")).toHaveCSS(
      "font-family",
      /Space Grotesk Variable/u,
    );
    await expect(page.locator("[data-coffee-counter] .tabular-nums")).toHaveCSS(
      "font-weight",
      "400",
    );
    await expect(page.locator(".testimonial-editorial-copy").first()).toHaveCSS(
      "font-family",
      /DM Sans Subset/u,
    );
    await expect(page.locator(".testimonial-editorial-copy").first()).toHaveCSS(
      "font-weight",
      "400",
    );
    await expect(page.locator(".testimonial-editorial-author-label").first()).toHaveCSS(
      "font-weight",
      "400",
    );
    await expect(page.locator("footer .footer-link-list a").first()).toHaveCSS(
      "font-weight",
      "400",
    );
  });

  test("a assinatura da marca usa o nome completo com pesos bold e light", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900 });
    const marks = page.locator('[data-wordmark="guifer.tech"]');
    await expect(marks).toHaveCount(2);
    for (const mark of await marks.all()) {
      await expect(mark.locator('[data-wordmark-part="gui"]')).toHaveText("gui");
      await expect(mark.locator('[data-wordmark-part="guifer"]')).toHaveCSS("font-weight", "700");
      await expect(mark.locator('[data-wordmark-part="tech"]')).toHaveCSS("font-weight", "300");
      await expect(mark).toHaveCSS("font-size", "11.5px");
    }
    await expect(page.getByRole("banner").getByText("GF", { exact: true })).toHaveCount(0);
  });

  test("o MIV preserva a capitalização original sem forçar caixa alta", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900 });
    await page.locator('header a:has([data-wordmark="guifer.tech"])').hover();
    const transforms = await page.locator("body *").evaluateAll((elements) =>
      elements
        .filter(
          (element) =>
            getComputedStyle(element).textTransform !== "none" &&
            !element.matches(
              ".testimonials-editorial-eyebrow, .testimonial-editorial-author-label",
            ),
        )
        .map((element) => ({
          tag: element.tagName,
          className: element.getAttribute("class"),
          transform: getComputedStyle(element).textTransform,
        })),
    );
    expect(transforms).toEqual([]);
    await expect(
      page.locator("[data-header-actions]").getByText("ENG/US", { exact: true }),
    ).toBeVisible();
    await expect(
      page.locator("footer").getByRole("link", { name: "Acessibilidade" }),
    ).toBeVisible();
    await expect(page.locator("footer").getByRole("button", { name: "Privacidade" })).toBeVisible();
  });

  test("o header centraliza navegação e mantém controles no lado direito", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900 });
    await page.locator('header a:has([data-wordmark="guifer.tech"])').hover();
    const navigation = page.getByRole("navigation", { name: "Navegação principal" });
    await expect(navigation.getByRole("button")).toHaveText([
      "início",
      "sobre",
      "projetos",
      "habilidades",
      "depoimentos",
    ]);
    const box = await navigation.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.x + box!.width / 2 - 720)).toBeLessThanOrEqual(1);
    const switches = page.locator("[data-header-actions] [data-header-switches]");
    await expect(switches).toBeVisible();
    const switchBox = await switches.boundingBox();
    expect(switchBox!.x).toBeGreaterThan(box!.x + box!.width);
  });

  test("header adaptativo preserva uma única árvore semântica", async ({ page }, testInfo) => {
    await openPage(page, "/", { width: 375, height: 900 });
    const panel = page.locator("#primary-navigation-panel");
    const header = page.getByRole("banner");
    const menu = page.getByRole("button", { name: "Abrir menu", exact: true });
    await expect(panel).toHaveCount(1);
    await expect(panel).toHaveAttribute("aria-hidden", "true");
    await expect(panel).toHaveAttribute("inert", "");
    await expect(page.getByRole("navigation", { name: "Navegação principal" })).toHaveCount(0);
    await expect(menu).toBeVisible();
    await menu.click();
    await expect(panel).toHaveAttribute("aria-hidden", "false");
    await expect(page.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Mudar para tema escuro", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Mudar idioma", exact: true })).toBeVisible();
    await expect(panel.locator("nav > button")).toHaveText([
      "início",
      "sobre",
      "projetos",
      "habilidades",
      "depoimentos",
      "contato",
    ]);
    await header.screenshot({
      path: testInfo.outputPath("header-mobile.png"),
      animations: "disabled",
    });
    await page.setViewportSize({ width: 1440, height: 900 });
    await header.locator('a:has([data-wordmark="guifer.tech"])').focus();
    await expect(page.getByRole("navigation", { name: "Navegação principal" })).toHaveCount(1);
    await expect(
      page.getByRole("button", { name: "Mudar para tema escuro", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Mudar idioma", exact: true })).toBeVisible();
    await expect(header).toHaveCount(1);
    await header.screenshot({
      path: testInfo.outputPath("header-desktop.png"),
      animations: "disabled",
    });
  });

  test("containers preservam insets locais e a marca inteira na viewport", async ({
    page,
  }, testInfo) => {
    for (const scenario of [
      { width: 320, inset: 24 },
      { width: 667, inset: 24 },
      { width: 768, inset: 32 },
      { width: 1440, inset: 57.6 },
    ]) {
      await openPage(page, "/", { width: scenario.width, height: 900 });
      const metrics = await page
        .locator("#home .section-container")
        .evaluate((element) => element.getBoundingClientRect().toJSON());
      expect(metrics.x).toBeCloseTo(scenario.inset, 0);
      expect(metrics.right).toBeCloseTo(scenario.width - scenario.inset, 0);
      if (scenario.width < 1024)
        await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
      else await page.locator('header a:has([data-wordmark="guifer.tech"])').hover();
      const brand = await page.locator("header .header-brand-link").boundingBox();
      expect(brand).not.toBeNull();
      expect(brand!.x).toBeGreaterThanOrEqual(4);
      expect(brand!.x + brand!.width).toBeLessThanOrEqual(scenario.width - 4);
      await page.getByRole("banner").screenshot({
        path: testInfo.outputPath(`header-${scenario.width}.png`),
        animations: "disabled",
      });
    }
  });
});
