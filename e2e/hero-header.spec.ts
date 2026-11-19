import { expect, openPage, test } from "./support/portfolio";

const representativeMatrix = [
  { width: 320, language: "pt", theme: "dark" },
  { width: 412, language: "en", theme: "light" },
  { width: 768, language: "pt", theme: "light" },
  { width: 1024, language: "en", theme: "dark" },
  { width: 1440, language: "en", theme: "light" },
] as const;

test.describe("baseline do Hero", () => {
  for (const scenario of representativeMatrix) {
    test(`${scenario.width}px ${scenario.language}/${scenario.theme} preserva copy e geometria`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await openPage(page, "/", {
        width: scenario.width,
        height: 900,
        language: scenario.language,
        theme: scenario.theme,
        loadDeferredSections: false,
      });

      const hero = page.locator("#home");
      const heading = hero.getByRole("heading", { level: 1 });
      const band = hero.locator("[data-hero-content-band]");
      await expect(heading).toContainText(
        scenario.language === "pt"
          ? "Tecnologia para conectar pessoas, ideias e negócios."
          : "Innovation, strategy, and software development.",
      );
      await expect(heading).toContainText(
        scenario.language === "pt"
          ? "Programação, análise de software e serviços de TI."
          : "Programming, software analysis and IT services.",
      );
      await expect(heading).toHaveCSS("font-family", /DM Sans Subset/u);
      await expect(band).toBeVisible();
      await expect(hero.locator("[data-dynamic-contrast]")).toHaveCount(0);
      await expect(hero.locator("[data-hero-social-links]")).toHaveCount(0);
      await expect(hero.locator("[data-github-stats-source]")).toHaveCount(0);

      const mediaControl = hero.locator("[data-hero-video-control]");
      const accessibilityLauncher = page
        .locator("#accessibility-widget-launcher, #acc-widget-host #accessibilityWidget")
        .first();
      const [mediaBox, accessibilityBox] = await Promise.all([
        mediaControl.boundingBox(),
        accessibilityLauncher.boundingBox(),
      ]);
      expect(mediaBox).not.toBeNull();
      expect(accessibilityBox).not.toBeNull();
      expect(
        Math.abs(
          (mediaBox?.x ?? 0) +
            (mediaBox?.width ?? 0) -
            ((accessibilityBox?.x ?? 0) + (accessibilityBox?.width ?? 0)),
        ),
      ).toBeLessThanOrEqual(1);
      expect(
        (mediaBox?.y ?? 0) - ((accessibilityBox?.y ?? 0) + (accessibilityBox?.height ?? 0)),
      ).toBe(8);

      const geometry = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(geometry.content).toBeLessThanOrEqual(geometry.viewport + 1);
    });
  }
});

test.describe("contrato do cabeçalho recolhível", () => {
  test("inicia recolhido, preserva marca e não torna controles ocultos navegáveis", async ({
    page,
  }) => {
    await openPage(page, "/", { width: 1440, height: 900, loadDeferredSections: false });

    const header = page.getByRole("banner");
    const actions = page.locator("[data-header-actions]");
    const brand = header.locator('a:has([data-wordmark="guifer.tech"])');
    await expect(header).toHaveAttribute("data-header-expanded", "false");
    await expect(actions).toHaveAttribute("data-header-expanded", "false");
    await expect(brand).toBeVisible();
    await expect(brand).toHaveAttribute("href", "/");
    await expect(actions.getByRole("button", { name: "Entre em contato" })).toBeHidden();
    await expect(actions.locator("[data-header-switches]")).toHaveCount(0);
    await expect(header.getByRole("navigation", { name: "Navegação principal" })).toBeHidden();
    await expect(header.locator("#primary-navigation-panel")).toHaveAttribute("inert", "");
    await expect(header.locator('a[href="/"]')).toHaveCount(1);
  });

  test("expande por hover e foco e recolhe por saída, Escape e clique externo", async ({
    page,
  }) => {
    await openPage(page, "/", { width: 1440, height: 900, loadDeferredSections: false });
    const header = page.getByRole("banner");
    const brand = header.locator('a:has([data-wordmark="guifer.tech"])');

    await brand.hover();
    await expect(header).toHaveAttribute("data-header-expanded", "true");
    await page.mouse.move(720, 220);
    await expect(header).toHaveAttribute("data-header-expanded", "false");

    await brand.focus();
    await expect(header).toHaveAttribute("data-header-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(header).toHaveAttribute("data-header-expanded", "false");

    await brand.focus();
    await page.locator("#home-heading").focus();
    await expect(header).toHaveAttribute("data-header-expanded", "false");

    await brand.hover();
    await page.locator("#home-heading").click({ position: { x: 0, y: 0 } });
    await expect(header).toHaveAttribute("data-header-expanded", "false");
  });

  test("mantém expansão enquanto foco ou ponteiro permanecerem no cabeçalho composto", async ({
    page,
  }) => {
    await openPage(page, "/", { width: 1440, height: 900, loadDeferredSections: false });
    const header = page.getByRole("banner");
    const brand = header.locator('a:has([data-wordmark="guifer.tech"])');
    const heading = page.locator("#home-heading");

    await brand.hover();
    await brand.focus();
    await heading.focus();
    await expect(header).toHaveAttribute("data-header-expanded", "true");
    await page.mouse.move(720, 220);
    await expect(header).toHaveAttribute("data-header-expanded", "false");

    await brand.focus();
    await page.mouse.move(720, 220);
    await expect(header).toHaveAttribute("data-header-expanded", "true");
    await heading.focus();
    await expect(header).toHaveAttribute("data-header-expanded", "false");
  });

  test("preserva transição de 200 ms e a remove sob movimento reduzido", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900, loadDeferredSections: false });
    const surface = page.locator("[data-header-surface]");
    await expect(surface).toHaveCSS("transition-duration", "0.2s");
    await expect(surface).toHaveCSS("transition-timing-function", "cubic-bezier(0, 0, 0.2, 1)");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(async () =>
        Number.parseFloat(
          await surface.evaluate((node) => getComputedStyle(node).transitionDuration),
        ),
      )
      .toBeLessThan(0.001);
  });

  test("segue a direção do scroll sem deslocar o conteúdo", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900, loadDeferredSections: false });
    const header = page.getByRole("banner");
    const main = page.locator("main");
    const initialTop = await main.evaluate((node) => node.getBoundingClientRect().top);

    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.minHeight = "3000px";
      window.scrollTo(0, 800);
    });
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(800);
    await page.waitForTimeout(50);
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(600);
    await expect(header).toHaveAttribute("data-header-expanded", "true");

    await page.evaluate(() => window.scrollTo(0, 900));
    await expect(header).toHaveAttribute("data-header-expanded", "false");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect
      .poll(() => main.evaluate((node) => node.getBoundingClientRect().top))
      .toBe(initialTop);
  });
});

test.describe("contrato touch do cabeçalho", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 375, height: 812 } });

  test("toque na área útil expande e Escape fecha o menu e recolhe", async ({ page }) => {
    await openPage(page, "/", { width: 375, height: 812, loadDeferredSections: false });
    const header = page.getByRole("banner");
    const menu = header.locator('button[aria-controls="primary-navigation-panel"]');

    await header.tap({ position: { x: 150, y: 30 } });
    await expect(header).toHaveAttribute("data-header-expanded", "true");
    await menu.tap();
    await expect(menu).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(header).toHaveAttribute("data-header-expanded", "false");
  });
});
