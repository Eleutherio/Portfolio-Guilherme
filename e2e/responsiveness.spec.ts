import { expect, openPage, runAxe, test } from "./support/portfolio";

test.describe("WCAG 2.2 AA — reflow e preferências", () => {
  test("tipografia carrega somente as famílias e subsets adotados", async ({ page }) => {
    await openPage(page, "/", { loadDeferredSections: false });
    await page.evaluate(async () => {
      await Promise.all([
        document.fonts.load('500 16px "Sora Subset"', "Sora"),
        document.fonts.load('600 16px "Caveat Subset"', "Caveat"),
        document.fonts.load('400 16px "Space Grotesk Variable"', "Space"),
      ]);
    });

    await expect(page.locator("body")).toHaveCSS("font-family", /Space Grotesk Variable/);
    await expect(page.locator("h1")).toHaveCSS("font-family", /Sora Subset/);
    await expect(page.locator("#home-heading .font-title")).toHaveCSS(
      "font-family",
      /Caveat Subset/,
    );

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
    expect(subsetResources).toHaveLength(3);
    expect(subsetResources.some((url) => url.includes("sora-heading-500"))).toBe(true);
    expect(subsetResources.some((url) => url.includes("caveat-signature-600"))).toBe(true);
    expect(subsetResources.some((url) => url.includes("space-grotesk-body"))).toBe(true);
    expect(fontResources.some((url) => url.includes("inter-latin-wght-normal"))).toBe(false);
  });

  test("home antecipa o footer e ativa seu runtime somente por proximidade", async ({ page }) => {
    const requestedModules: string[] = [];
    let healthRequests = 0;
    page.on("request", (request) => {
      const url = request.url();
      if (url.includes("/src/components/")) requestedModules.push(url);
      if (url.includes("/health/status")) healthRequests += 1;
    });
    await page.route("**/health/status", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          services: {
            backend: "operational",
            database: "operational",
            smtp: "operational",
            recaptcha: "operational",
          },
        }),
      });
    });

    await openPage(page, "/", { loadDeferredSections: false });
    await expect(page.locator('[data-deferred-section="contato"]')).toBeAttached();
    const footer = page.locator("footer");
    await expect(footer).toBeAttached();
    await expect(footer).toHaveAttribute("data-runtime-activity", "paused");
    expect(requestedModules.some((url) => url.includes("/sections/Contact.tsx"))).toBe(false);
    expect(healthRequests).toBe(0);

    await page.locator('[data-deferred-section="contato"]').scrollIntoViewIfNeeded();
    await expect(page.locator("#contact-name")).toBeAttached();
    expect(requestedModules.some((url) => url.includes("/sections/Contact.tsx"))).toBe(true);

    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toHaveAttribute("data-runtime-activity", "active");
    await expect.poll(() => healthRequests).toBeGreaterThan(0);

    await page.locator("#home").scrollIntoViewIfNeeded();
    await expect(footer).toHaveAttribute("data-runtime-activity", "paused");
  });

  test("botão de voltar ao topo aguarda intenção real de rolagem", async ({ page }) => {
    await openPage(page, "/", { loadDeferredSections: false });

    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" }),
    );
    await expect(page.locator("[data-back-to-top]")).toHaveCount(0);

    await page.mouse.down();
    await page.mouse.up();
    await expect(page.locator("[data-back-to-top]")).toBeVisible();
  });

  test("imagens adiadas usam prioridade e variantes responsivas corretas", async ({ page }) => {
    await openPage(page, "/", {
      width: 1023,
      height: 720,
      loadDeferredSections: false,
    });
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("portfolio:load-deferred-section", { detail: "sobre" }));
    });
    const about = page.locator("#sobre");
    const featured = about.getByRole("img", {
      name: "Guilherme apresentando o projeto GrenGame com um microfone.",
    });
    await expect(featured).toBeAttached();
    await featured.scrollIntoViewIfNeeded();
    await expect(featured).toHaveAttribute("loading", "lazy");
    await expect(featured).not.toHaveAttribute("fetchpriority", "high");
    await expect(featured).toHaveAttribute("width", "800");
    await expect(featured).toHaveAttribute("height", "1000");

    const featuredSources = featured.locator("xpath=..").locator("source");
    await expect(featuredSources).toHaveCount(2);
    await expect(featuredSources.nth(0)).toHaveAttribute("type", "image/avif");
    await expect(featuredSources.nth(1)).toHaveAttribute("type", "image/webp");
    for (const source of await featuredSources.all()) {
      await expect(source).toHaveAttribute("srcset", /320w.*,.*640w.*,.*800w/);
      await expect(source).toHaveAttribute(
        "sizes",
        "(max-width: 639px) 142px, (max-width: 767px) 292px, (max-width: 1023px) 35vw, 372px",
      );
    }
    await expect
      .poll(() =>
        featured.evaluate((element) =>
          element instanceof HTMLImageElement ? element.currentSrc : "",
        ),
      )
      .toMatch(/-400w(?:-[^/]+)?\.avif$/);
    await expect(
      page.locator('picture source:not([srcset]), picture source[srcset=""]'),
    ).toHaveCount(0);

    const workbench = about.getByRole("img", {
      name: "Notebooks desmontados durante a recuperação após a enchente.",
    });
    await expect(workbench).toHaveAttribute("width", "480");
    await expect(workbench).toHaveAttribute("height", "600");
    await expect(workbench).toHaveAttribute("src", /hardware-workbench-home[^/]*\.jpg/);

    const workbenchSources = workbench.locator("xpath=..").locator("source");
    for (const source of await workbenchSources.all()) {
      await expect(source).toHaveAttribute("srcset", /200w.*,.*240w.*,.*320w.*,.*400w.*,.*480w/);
      await expect(source).not.toHaveAttribute("srcset", /(?:640|800)w/);
    }
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
    await page.locator('a[href="#contato"]').click();
    await expect(page.locator("#contato-heading")).toBeFocused();
  });

  test("menu mantém foco no destino mais recente durante cargas fora de ordem", async ({
    page,
  }) => {
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
    await menuButton.click();
    await page
      .locator("#mobile-navigation")
      .getByRole("button", { name: "projetos", exact: true })
      .click();
    await expect(page.locator("#mobile-navigation")).toHaveCount(0);
    await menuButton.focus();
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await page
      .locator("#mobile-navigation")
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
        contactHeight: document.getElementById("contato")?.getBoundingClientRect().height ?? 0,
        sectionHeights: [...document.querySelectorAll("main > section")].map(
          (section) => section.getBoundingClientRect().height,
        ),
      };
    });
    for (const sectionHeight of desktopMetrics.sectionHeights) {
      expect(sectionHeight).toBeGreaterThanOrEqual(desktopMetrics.availableHeight - 1);
    }
    expect(desktopMetrics.contactHeight).toBeLessThanOrEqual(desktopMetrics.availableHeight + 1);

    await openPage(page, "/", { width: 375, height: 900 });
    const collapsedHeight = (await page.locator("header").first().boundingBox())?.height ?? 0;
    await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
    const expandedHeight = (await page.locator("header").first().boundingBox())?.height ?? 0;
    expect(expandedHeight).toBeGreaterThan(collapsedHeight);

    await page
      .locator("#mobile-navigation")
      .getByRole("button", { name: "projetos", exact: true })
      .click();
    await expect(page.locator("#mobile-navigation")).toHaveCount(0);
    await expect
      .poll(async () => {
        return page.evaluate(() => {
          const section = document.getElementById("projetos");
          const headerHeight = Number.parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--site-header-height"),
          );
          if (!section || !headerHeight) return Number.POSITIVE_INFINITY;
          return Math.abs(section.getBoundingClientRect().top - (headerHeight + 8));
        });
      })
      .toBeLessThanOrEqual(2);
  });

  for (const width of [320, 375, 500, 768, 1024, 1440]) {
    test(`sem overflow horizontal em ${width}px`, async ({ page }) => {
      await openPage(page, "/", { width, height: 900 });
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
    });
  }

  test("aviso de privacidade mantém reflow em 320px", async ({ page }) => {
    await openPage(page, "/privacidade", { width: 320, height: 900 });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
  });

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
