import { expect, expectFocusedTooltip, openPage, runAxe, test } from "./support/portfolio";

test.describe("WCAG 2.2 AA — estados interativos", () => {
  test("footer exibe selo sustentável e links legais padronizados", async ({ page }, testInfo) => {
    let greenBadgeRequests = 0;
    page.on("request", (request) => {
      if (request.url().includes("/images/green-hosting.webp")) {
        greenBadgeRequests += 1;
      }
    });
    await openPage(page, "/", { width: 320, height: 900, loadDeferredSections: false });
    const footer = page.locator("footer");
    const accessibility = footer.getByRole("link", { name: "Acessibilidade", exact: true });
    const privacy = footer.getByRole("button", { name: "Privacidade", exact: true });
    const badgeLink = footer.getByRole("link", {
      name: "Este site usa hospedagem verde, verificada pela Green Web Foundation",
    });
    const badge = badgeLink.getByRole("img");

    await expect(footer).toBeAttached();
    await expect.poll(() => greenBadgeRequests).toBe(1);
    const footerPosition = await footer.evaluate((element) => ({
      top: element.getBoundingClientRect().top,
      viewport: window.innerHeight,
    }));
    expect(footerPosition.top).toBeGreaterThanOrEqual(footerPosition.viewport);
    await footer.scrollIntoViewIfNeeded();
    await expect(accessibility).toBeVisible();
    await expect(privacy).toBeVisible();
    await expect(badgeLink).toHaveAttribute(
      "href",
      "https://www.thegreenwebfoundation.org/green-web-check/?url=guifer.tech",
    );
    await expect(badgeLink).toHaveAttribute("target", "_blank");
    await expect(badgeLink).toHaveAttribute(
      "data-cursor-open",
      "a verificação de hospedagem verde",
    );
    await expect(badge).toBeVisible();
    await expect(badge).toHaveAttribute("src", "/images/green-hosting.webp");
    await expect(badge).toHaveAttribute("width", "200");
    await expect(badge).toHaveAttribute("height", "95");
    await expect(badge).toHaveAttribute("loading", "eager");
    await expect(badge).toHaveAttribute("fetchpriority", "low");
    await expect(badge).toHaveAttribute("decoding", "async");
    await expect(badge).toHaveAttribute("referrerpolicy", "no-referrer");

    const legalBox = await accessibility.locator("xpath=../..").boundingBox();
    const badgeBox = await badge.boundingBox();
    expect(legalBox?.y ?? 0).toBeGreaterThan(badgeBox?.y ?? 0);
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
    await expect(footer.getByText("Obrigado pela visita!", { exact: true })).toBeVisible();
    await expect(footer.getByRole("navigation", { name: /Explore/ })).toBeAttached();
    await expect(footer.getByText("Core Web Vitals", { exact: true })).toBeVisible();
    await expect(footer.getByText("WCAG 2.2", { exact: false })).toHaveCount(0);
    await expect(footer.getByText("Internet.nl", { exact: false })).toHaveCount(0);
    await runAxe(page, testInfo, "footer-green-badge", "footer");

    await openPage(page, "/", { language: "en", width: 320, height: 900 });
    await expect(footer.getByRole("link", { name: "Accessibility", exact: true })).toBeVisible();
    await expect(footer.getByRole("button", { name: "Privacy", exact: true })).toBeVisible();
    const englishBadgeLink = footer.getByRole("link", {
      name: "This website uses green hosting, verified by the Green Web Foundation",
    });
    const englishBadge = englishBadgeLink.getByRole("img");
    await expect(englishBadgeLink).toHaveAttribute(
      "data-cursor-open",
      "the green-hosting verification",
    );
    await expect(englishBadge).toHaveAttribute(
      "alt",
      "This website uses green hosting, verified by the Green Web Foundation",
    );
    await expect(footer.getByRole("navigation", { name: /Explore/ })).toBeAttached();
    await expect(footer.getByText("Core Web Vitals", { exact: true })).toBeVisible();
    await expect(footer.getByText("Thanks for visiting!", { exact: true })).toBeVisible();
  });

  test("badge Website Carbon apresenta a resposta central e a escala oficial", async ({
    page,
    baseURL,
  }) => {
    let result = {
      grade: "C",
      carbon: 0.2,
      cleanerThan: 54,
      updatedAt: "2026-08-26T12:00:00.000Z",
      source: "api",
    };
    await page.route("**/api/website-carbon", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(result),
      });
    });

    const loadFooter = async () => {
      await page.evaluate(() => {
        window.dispatchEvent(
          new CustomEvent("portfolio:load-deferred-section", { detail: "rodape" }),
        );
      });
      await expect(page.locator("footer")).toBeAttached();
    };
    const externalOrigin = new URL(baseURL!);
    externalOrigin.hostname = "guifer.localhost";
    await openPage(page, externalOrigin.href);
    await loadFooter();
    const badge = page.locator(
      'footer a[href="https://www.websitecarbon.com/website/guifer-tech/"]',
    );
    await badge.scrollIntoViewIfNeeded();
    await expect(badge).toHaveAccessibleName(
      /Nota C\. 0,20 g de CO₂\/visita\. Esta página é mais limpa que 54% de todas as páginas globalmente\. Atualizado em 26\/08\/2026/,
    );
    await expect(
      badge.getByText("Esta página é mais limpa que 54% de todas as páginas globalmente", {
        exact: true,
      }),
    ).toBeVisible();

    result = { ...result, grade: "F" };
    await openPage(page, externalOrigin.href, { language: "en" });
    await loadFooter();
    await badge.scrollIntoViewIfNeeded();
    await expect(badge).toHaveAccessibleName(
      /Grade F\. 0\.20 g of CO₂\/view\. This is cleaner than 54% of all web pages globally\. Updated on 26\/08\/2026/,
    );
    await expect(
      badge.getByText("This is cleaner than 54% of all web pages globally", { exact: true }),
    ).toBeVisible();

    await openPage(page, "/privacidade", { language: "pt" });
    await expect(page.getByText(/Website Carbon \/ Wholegrain Digital/)).toBeVisible();
    await expect(
      page.getByText(/no máximo uma vez a cada 24 horas para todo o site/),
    ).toBeVisible();
  });

  for (const [grade, color] of Object.entries({
    "A+": "#00f5bd",
    A: "#54f56f",
    B: "#9bfb35",
    C: "#caff00",
    D: "#f5f000",
    E: "#ffb800",
    F: "#ff2028",
  })) {
    test(`badge Website Carbon aplica a cor oficial da nota ${grade}`, async ({
      page,
      baseURL,
    }) => {
      await page.route("**/api/website-carbon", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            grade,
            carbon: 0.2,
            cleanerThan: 54,
            updatedAt: "2026-08-26T12:00:00.000Z",
            source: "api",
          }),
        });
      });
      const externalOrigin = new URL(baseURL!);
      externalOrigin.hostname = "guifer.localhost";
      await openPage(page, externalOrigin.href);
      const badge = page.locator(
        'footer a[href="https://www.websitecarbon.com/website/guifer-tech/"]',
      );
      await badge.scrollIntoViewIfNeeded();
      await expect(badge.locator(":scope > span > span").first()).toHaveText(grade);
      await expect
        .poll(() =>
          badge.evaluate((element) => getComputedStyle(element).getPropertyValue("--carbon-grade")),
        )
        .toBe(color);
    });
  }

  test("badge Website Carbon usa o A+ publicado quando a API própria falha", async ({
    page,
    baseURL,
  }) => {
    await page.route("**/api/website-carbon", async (route) => {
      await route.fulfill({ status: 503, contentType: "application/json", body: '{"ok":false}' });
    });
    await page.addInitScript(() => {
      localStorage.setItem("website-carbon:grade:https://guifer.tech/", '{"grade":"C"}');
      localStorage.setItem("website-carbon:v2:grade:https://guifer.tech/", '{"grade":"C"}');
    });

    const externalOrigin = new URL(baseURL!);
    externalOrigin.hostname = "guifer.localhost";
    await openPage(page, externalOrigin.href);
    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent("portfolio:load-deferred-section", { detail: "rodape" }),
      );
    });
    const badge = page.locator(
      'footer a[href="https://www.websitecarbon.com/website/guifer-tech/"]',
    );
    await badge.scrollIntoViewIfNeeded();
    await expect(badge).toHaveAccessibleName(
      /Nota A\+\. Esta página é mais limpa que 97% de todas as páginas globalmente\. Atualizado em 25\/08\/2026/,
    );
    await expect(
      badge.getByText("Esta página é mais limpa que 97% de todas as páginas globalmente", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(badge.locator(":scope > span > span").first()).toHaveText("A+");
    await expect
      .poll(() =>
        page.evaluate(() => localStorage.getItem("website-carbon:grade:https://guifer.tech/")),
      )
      .toBeNull();
    await expect
      .poll(() =>
        page.evaluate(() => localStorage.getItem("website-carbon:v2:grade:https://guifer.tech/")),
      )
      .toBeNull();
  });

  test("rodapé preserva navegação e assinatura mesmo com API indisponível", async ({ page }) => {
    await page.route("**/health/status", (route) => route.fulfill({ status: 503, body: "{}" }));
    await openPage(page, "/", { width: 1440 });
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    const navigation = footer.getByRole("navigation", { name: "Explore a página" });
    await expect(navigation.getByRole("link")).toHaveCount(6);
    const destinations = await navigation
      .getByRole("link")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    expect(destinations).toEqual([
      "/#home",
      "/#sobre",
      "/#projetos",
      "/#habilidades",
      "/#depoimentos",
      "/#contato",
    ]);
    await expect(footer.locator('.footer-copyright [data-wordmark="guifer.tech"]')).toHaveCount(1);
    await expect(footer.locator(".footer-copyright")).toContainText(
      `© ${new Date().getFullYear()} Guilherme Eleuthério`,
    );
    await expect(footer.locator(".footer-local-time")).toContainText(
      /Brasil - Porto Alegre, RS — BRT · Hora local: \d{2}:\d{2}/,
    );
  });

  test("linha institucional mantém alinhamento desktop e reflow mobile", async ({ page }) => {
    await openPage(page, "/", { width: 1440 });
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    const geometry = await footer.evaluate((element) => {
      const rect = (selector: string) => element.querySelector(selector)!.getBoundingClientRect();
      const row = rect(".footer-institutional-row");
      const copyright = rect(".footer-copyright");
      return {
        center: copyright.x + copyright.width / 2 - row.x - row.width / 2,
        time: rect(".footer-local-time").x,
        legal: rect(".footer-legal-block").x,
      };
    });
    expect(Math.abs(geometry.center)).toBeLessThan(1);
    expect(geometry.time).toBeLessThan(geometry.legal);
    for (const width of [320, 412]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(footer.locator(".footer-copyright")).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      expect(overflow).toBe(false);
    }
  });
  test("cada métrica vital expõe sua explicação em hover e foco", async ({ page }) => {
    await openPage(page, "/");
    const scenarios = [
      [/LCP:/, "Mede quanto tempo leva para o maior elemento visível aparecer."],
      [/INP:/, "Mede o tempo de resposta da interface à interação mais lenta."],
      [/CLS:/, "Mede mudanças inesperadas de posição dos elementos."],
    ] as const;

    const firstTooltip = page
      .getByRole("button", { name: scenarios[0][0] })
      .locator("xpath=following-sibling::span[1]");
    await page.getByRole("button", { name: scenarios[0][0] }).hover();
    await expect(firstTooltip).toBeVisible();
    await page.mouse.move(0, 0);
    for (const [name, description] of scenarios) {
      const button = page.getByRole("button", { name });
      await expectFocusedTooltip(button, description);
    }

    await openPage(page, "/", { language: "en" });
    const englishScenarios = [
      [/LCP:/, "Measures how long the largest visible element takes to appear."],
      [/INP:/, "Measures how quickly the interface responds to its slowest interaction."],
      [/CLS:/, "Measures unexpected changes in the position of page elements."],
    ] as const;

    for (const [name, description] of englishScenarios) {
      const button = page.getByRole("button", { name });
      await expect(button).toHaveAccessibleName(
        new RegExp(description.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      );
    }
  });
});
