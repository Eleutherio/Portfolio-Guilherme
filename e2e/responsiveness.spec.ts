import { expect, HOME_SECTION_IDS, openPage, runAxe, test } from "./support/portfolio";

test.describe("WCAG 2.2 AA — reflow e preferências", () => {
  test("home preserva ordem semântica e fluxo linear com movimento reduzido", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "/", { width: 412, height: 915 });

    const structure = await page.evaluate((sectionIds) => {
      const sections = sectionIds.map((id) => document.getElementById(id));
      return {
        allPresent: sections.every((section) => section instanceof HTMLElement),
        followsDomOrder: sections.every((section, index) => {
          const next = sections[index + 1];
          return (
            !next ||
            Boolean(
              section && section.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING,
            )
          );
        }),
        tops: sections.map((section) => section?.getBoundingClientRect().top ?? null),
        heroPosition: getComputedStyle(document.getElementById("home")!).position,
      };
    }, HOME_SECTION_IDS);

    expect(structure.allPresent).toBe(true);
    expect(structure.followsDomOrder).toBe(true);
    expect(structure.heroPosition).toBe("relative");
    expect(structure.tops.every((top) => top !== null)).toBe(true);
    expect(
      structure.tops.every(
        (top, index, tops) => index === 0 || (top ?? 0) >= (tops[index - 1] ?? 0),
      ),
    ).toBe(true);
    await expect(page.locator("#trajetoria, #processo")).toHaveCount(0);
  });

  test("hash de Habilidades solicita a seção adiada e focaliza seu heading", async ({ page }) => {
    await openPage(page, "/#habilidades", {
      width: 375,
      height: 900,
      loadDeferredSections: false,
    });

    const heading = page.locator("#habilidades-heading");
    await expect(heading).toBeAttached();
    await expect(heading).toBeFocused();
  });

  test("tipografia carrega somente as famílias e subsets adotados", async ({ page }) => {
    await openPage(page, "/", { loadDeferredSections: false });
    await page.evaluate(async () => {
      await Promise.all([
        document.fonts.load('600 16px "DM Sans Subset"', "DM Sans"),
        document.fonts.load('400 16px "Space Grotesk Variable"', "Space"),
      ]);
    });

    await expect(page.locator("body")).toHaveCSS("font-family", /Space Grotesk Variable/);
    await expect(page.locator("h1")).toHaveCSS("font-family", /DM Sans Subset/);

    const fontResources = await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .map((entry) => entry.name)
        .filter((url) => url.includes("-wght-normal.woff2")),
    );
    expect(fontResources).toHaveLength(0);
    const subsetResources = await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .map((entry) => entry.name)
        .filter((url) => url.includes(".woff2")),
    );
    expect(subsetResources).toHaveLength(2);
    expect(subsetResources.some((url) => url.includes("dm-sans-heading"))).toBe(true);
    expect(subsetResources.some((url) => url.includes("space-grotesk-body"))).toBe(true);
    expect(subsetResources.some((url) => url.includes("sora-heading"))).toBe(false);
    expect(subsetResources.some((url) => url.includes("caveat-signature"))).toBe(false);
    expect(fontResources.some((url) => url.includes("inter-latin-wght-normal"))).toBe(false);
  });

  test("hero preserva a primeira dobra sem ações ou terminal legados", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const scenario of [
      { width: 320 },
      { width: 360 },
      { width: 390 },
      { width: 412 },
      { width: 640 },
      { width: 768 },
      { width: 1023 },
      { width: 1024 },
    ]) {
      await openPage(page, "/", {
        width: scenario.width,
        height: 900,
        loadDeferredSections: false,
      });

      const hero = page.locator("#home");
      await expect(hero.locator(".hero-code, .btn-primary, a[download]")).toHaveCount(0);
      await expect(hero.locator("[data-hero-social-links]")).toHaveCount(0);
      const metrics = await hero.evaluate((element) => {
        const box = (selector: string) =>
          element.querySelector<HTMLElement>(selector)?.getBoundingClientRect() ?? null;
        const heroBox = element.getBoundingClientRect();
        const containerBox = box(":scope > .section-container");
        const bandBox = box("[data-hero-content-band]");

        return {
          height: heroBox.height,
          contentOffset: containerBox ? containerBox.top - heroBox.top : null,
          containerLeft: containerBox?.left ?? null,
          containerRight: containerBox?.right ?? null,
          bandLeft: bandBox?.left ?? null,
          bandRight: bandBox?.right ?? null,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        };
      });

      expect(metrics.scrollWidth).toBe(metrics.clientWidth);
      expect(metrics.height).toBeGreaterThan(750);
      if (scenario.width < 1024) {
        expect(metrics.contentOffset).not.toBeNull();
        expect(metrics.contentOffset ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(82);
      }
      expect(metrics.bandLeft ?? 0).toBeGreaterThanOrEqual(metrics.containerLeft ?? 0);
      expect(metrics.bandRight ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(
        metrics.containerRight ?? Number.NEGATIVE_INFINITY,
      );
    }
  });

  test("home prepara todas as seções e ativa footer somente por proximidade", async ({ page }) => {
    await openPage(page, "/", { loadDeferredSections: false });
    for (const id of ["sobre", "projetos", "habilidades", "depoimentos", "contato"]) {
      await expect(page.locator("#" + id)).toBeAttached();
    }
    const footer = page.locator("footer");
    await expect(footer).toHaveAttribute("data-runtime-activity", "paused");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toHaveAttribute("data-runtime-activity", "active");
    await page.locator("#home").scrollIntoViewIfNeeded();
    await expect(footer).toHaveAttribute("data-runtime-activity", "paused");
  });

  test("botão de voltar ao topo aparece após rolagem e retorna ao início", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "/", { loadDeferredSections: false });
    await expect(page.locator("[data-back-to-top]")).toHaveCount(0);

    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" }),
    );
    await expect(page.locator("[data-back-to-top]")).toBeVisible();
    await page.locator("[data-back-to-top]").click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.locator("[data-back-to-top]")).toHaveCount(0);
  });

  test("imagens preparadas usam variantes responsivas sem fontes vazias", async ({ page }) => {
    await openPage(page, "/", { width: 1023, height: 720 });
    const featured = page.locator('[data-project-card="grengame"] img');
    await featured.scrollIntoViewIfNeeded();
    await expect(featured).toHaveAttribute("loading", "lazy");
    await expect(featured).toHaveAttribute("decoding", "async");
    const sources = featured.locator("xpath=..").locator('source[type="image/avif"]');
    await expect(sources).toHaveCount(2);
    await expect(sources.last()).toHaveAttribute("srcset", /400w.*,.*800w.*,.*1000w.*,.*1600w/);
    await expect(sources.last()).toHaveAttribute("sizes", "100vw");
    expect(
      await featured.evaluate((image) => (image as HTMLImageElement).naturalWidth),
    ).toBeGreaterThan(0);
    expect(
      await page
        .locator('picture source:not([srcset]), picture source[srcset=""]')
        .evaluateAll(
          (elements) =>
            elements.filter((element) => !element.closest('figure[aria-hidden="true"]')).length,
        ),
    ).toBe(0);
    await expect(
      page.locator("#depoimentos figure:not([aria-hidden]) .testimonial-editorial-portrait img"),
    ).toBeAttached();
  });

  test("hash direto solicita e focaliza uma seção adiada", async ({ page }) => {
    await page.route("**/src/components/sections/Contact.tsx*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2_500));
      await route.continue();
    });
    await openPage(page, "/#contato", { loadDeferredSections: false });
    const heading = page.locator("#contato-heading");
    await expect(heading).toBeAttached();
    await expect(heading).toBeFocused();
  });

  test("CTA nativo carrega e focaliza uma seção adiada", async ({ page }) => {
    await openPage(page, "/", { loadDeferredSections: false });
    await page.locator('header a:has([data-wordmark="guifer.tech"])').focus();
    await page.getByRole("button", { name: "Entre em contato", exact: true }).click();
    await expect(page.locator("#contato-heading")).toBeFocused();
  });

  test("menu mantém foco no destino mais recente após seleções consecutivas", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.route("**/src/components/sections/Projects.tsx*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2_500));
      await route.continue();
    });
    await openPage(page, "/", {
      width: 375,
      height: 900,
      loadDeferredSections: false,
    });

    const menuButton = page.getByRole("button", { name: "Abrir menu", exact: true });
    const brand = page.locator('header a:has([data-wordmark="guifer.tech"])');
    await brand.focus();
    await menuButton.click();
    await page
      .locator("#primary-navigation-panel")
      .getByRole("button", { name: "projetos", exact: true })
      .click();
    await expect(page.locator("#primary-navigation-panel")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("#primary-navigation-panel")).toHaveAttribute("inert", "");
    await expect(page.locator("#projetos-heading")).toBeFocused();
    await page.evaluate(() => window.scrollTo({ top: window.scrollY, behavior: "auto" }));
    await page.mouse.move(200, 200);
    await brand.focus();
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await page
      .locator("#primary-navigation-panel")
      .getByRole("button", { name: "contato", exact: true })
      .click();

    const contactHeading = page.locator("#contato-heading");
    await expect(contactHeading).toBeFocused();
    await page.waitForTimeout(3_000);
    await expect(contactHeading).toBeFocused();
  });

  test("Sobre e cases compartilham a identidade visual do portfólio", async ({ page }) => {
    await openPage(page, "/sobre", { theme: "light" });
    const aboutVisual = page.locator(".portfolio-visual");
    await expect(aboutVisual).toBeVisible();
    await expect(aboutVisual).toHaveCSS("background-color", "rgb(247, 246, 242)");
    const spacer = page.locator(".site-header-spacer");
    const header = page.locator("header").first();
    expect((await spacer.boundingBox())?.height).toBe((await header.boundingBox())?.height);

    await openPage(page, "/projetos/abriu-chaveiro", { theme: "dark" });
    const caseVisual = page.locator(".portfolio-visual");
    await expect(caseVisual).toHaveCSS("background-color", "rgb(14, 19, 27)");
    await expect(page.locator(".case-study .technology-badge").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "ver projeto" })).toBeVisible();
    await expect(page.locator(".case-study .btn-outline").first()).toBeVisible();
  });

  test("seções usam o viewport útil e o menu móvel respeita o header", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900 });
    const desktopMetrics = await page.evaluate(() => {
      const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
      return {
        availableHeight: window.innerHeight - headerHeight,
        heroHeight: document.getElementById("home")?.getBoundingClientRect().height ?? 0,
        contactHeight: document.getElementById("contato")?.getBoundingClientRect().height ?? 0,
      };
    });
    expect(desktopMetrics.heroHeight).toBeGreaterThanOrEqual(desktopMetrics.availableHeight - 1);
    expect(desktopMetrics.contactHeight).toBeGreaterThan(0);

    await openPage(page, "/", { width: 375, height: 900 });
    const collapsedHeight = (await page.locator("header").first().boundingBox())?.height ?? 0;
    await page.locator('header a:has([data-wordmark="guifer.tech"])').focus();
    await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
    const expandedHeight = (await page.locator("header").first().boundingBox())?.height ?? 0;
    expect(expandedHeight).toBeGreaterThanOrEqual(collapsedHeight);
    const menuBox = await page.locator("#primary-navigation-panel").boundingBox();
    expect(menuBox!.x).toBeGreaterThanOrEqual(0);
    expect(menuBox!.x + menuBox!.width).toBeLessThanOrEqual(375);

    await page
      .locator("#primary-navigation-panel")
      .getByRole("button", { name: "projetos", exact: true })
      .click();
    await expect(page.locator("#primary-navigation-panel")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("#primary-navigation-panel")).toHaveAttribute("inert", "");
    const destination = page.locator("#projetos-heading");
    await expect(destination).toBeFocused();
    await expect(destination).toBeInViewport();
    await expect
      .poll(async () => (await destination.boundingBox())?.y ?? -1)
      .toBeGreaterThanOrEqual(0);
  });

  test("acordeão de projetos preserva hierarquia, reflow e ações", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const width of [320, 360, 390, 412, 640, 767, 768, 1023, 1024, 1440, 1920]) {
      await openPage(page, "/", { width, height: 900 });
      const grid = page.locator("[data-project-grid]");
      await grid.scrollIntoViewIfNeeded();
      const cards = grid.locator("[data-project-card]");
      await expect(cards).toHaveCount(3);
      await expect(grid.locator('[data-project-variant="showcase"]')).toHaveCount(3);
      const layout = await grid.evaluate((element) => {
        const outer = element.getBoundingClientRect();
        const cards = [...element.querySelectorAll("[data-project-card]")].map((card) => {
          const r = card.getBoundingClientRect();
          const actions = [...card.querySelectorAll(".project-showcase-actions a")].map((a) => {
            const b = a.getBoundingClientRect();
            return { left: b.left, right: b.right, top: b.top, bottom: b.bottom };
          });
          return {
            left: r.left,
            right: r.right,
            top: r.top,
            bottom: r.bottom,
            width: r.width,
            height: r.height,
            actions,
          };
        });
        return { left: outer.left, right: outer.right, width: outer.width, cards };
      });
      for (const card of layout.cards) {
        expect(Math.abs(card.width - layout.width)).toBeLessThanOrEqual(1);
        expect(card.height).toBeGreaterThanOrEqual(175);
        for (const action of card.actions) {
          expect(action.left).toBeGreaterThanOrEqual(card.left - 1);
          expect(action.right).toBeLessThanOrEqual(card.right + 1);
          expect(action.top).toBeGreaterThanOrEqual(card.top - 1);
          expect(action.bottom).toBeLessThanOrEqual(card.bottom + 1);
        }
      }
      expect(layout.cards[1].top).toBeGreaterThan(layout.cards[0].bottom);
      expect(layout.cards[2].top).toBeGreaterThan(layout.cards[1].bottom);
      await expect(grid.locator("[data-project-preview]")).toHaveCount(3);
    }
  });

  test("aviso de privacidade mantém reflow em 320px", async ({ page }) => {
    await openPage(page, "/privacidade", { width: 320, height: 900 });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
  });

  for (const route of ["/sobre", "/projetos/grengame", "/acessibilidade"] as const) {
    test(`${route} mantém reflow em 320px`, async ({ page }) => {
      await openPage(page, route, { width: 320, height: 900 });
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
    });
  }

  test("forced colors mantém estrutura e nomes", async ({ page }, testInfo) => {
    await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
    await openPage(page, "/acessibilidade", { width: 1280, height: 800 });
    await runAxe(page, testInfo, "forced-colors");
  });

  test("espaçamento textual não corta conteúdo", async ({ page }) => {
    await openPage(page, "/", { width: 320, height: 900 });
    await page.addStyleTag({
      content: `
        * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
        p { margin-bottom: 2em !important; }
      `,
    });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
  });
});
