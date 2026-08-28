import { expect, expectFocusedTooltip, openPage, runAxe, test } from "./support/portfolio";

test.describe("WCAG 2.2 AA — estados interativos", () => {
  test("footer exibe selo sustentável e links legais padronizados", async ({ page }, testInfo) => {
    let greenBadgeRequests = 0;
    page.on("request", (request) => {
      if (request.url().includes("/api/v3/greencheckimage/guifer.tech")) {
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
    expect(footerPosition.top).toBeGreaterThan(footerPosition.viewport);
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
    await expect(badge).toHaveAttribute(
      "src",
      "https://app.greenweb.org/api/v3/greencheckimage/guifer.tech",
    );
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
    await expect(footer.getByText("Obrigado pela visita", { exact: false })).toHaveCount(0);
    await expect(footer.getByText(/Porto Alegre .* Hora local:/)).toBeVisible();
    await expect(footer.getByText("WCAG 2.2", { exact: false })).toHaveCount(0);
    await expect(footer.getByText("Internet.nl", { exact: false })).toHaveCount(0);
    await runAxe(page, testInfo, "footer-green-badge");

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
    await expect(footer.getByText(/Porto Alegre .* Local time:/)).toBeVisible();
    await expect(footer.getByText("Thanks for stopping by", { exact: false })).toHaveCount(0);
  });

  test("badge Website Carbon apresenta a resposta central e a escala oficial", async ({ page }) => {
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
    const externalOrigin = "http://guifer.localhost:4173/";
    await openPage(page, externalOrigin);
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

    const gradeColors = {
      "A+": "#00f5bd",
      A: "#54f56f",
      B: "#9bfb35",
      C: "#caff00",
      D: "#f5f000",
      E: "#ffb800",
      F: "#ff2028",
    } as const;
    for (const [grade, color] of Object.entries(gradeColors)) {
      result = { ...result, grade };
      await page.reload({ waitUntil: "domcontentloaded" });
      await loadFooter();
      await badge.scrollIntoViewIfNeeded();
      await expect(badge.locator(":scope > span > span").first()).toHaveText(grade);
      await expect
        .poll(() =>
          badge.evaluate((element) => getComputedStyle(element).getPropertyValue("--carbon-grade")),
        )
        .toBe(color);
    }

    await openPage(page, externalOrigin, { language: "en" });
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

  test("badge Website Carbon usa o A+ publicado quando a API própria falha", async ({ page }) => {
    await page.route("**/api/website-carbon", async (route) => {
      await route.fulfill({ status: 503, contentType: "application/json", body: '{"ok":false}' });
    });
    await page.addInitScript(() => {
      localStorage.setItem("website-carbon:grade:https://guifer.tech/", '{"grade":"C"}');
      localStorage.setItem("website-carbon:v2:grade:https://guifer.tech/", '{"grade":"C"}');
    });

    await openPage(page, "http://guifer.localhost:4173/");
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

  test("infraestrutura comunica estados sem depender somente de cor", async ({ page }) => {
    await page.route("**/health/status", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: false,
          checkedAt: new Date().toISOString(),
          services: {
            backend: "operational",
            database: "unavailable",
            smtp: "operational",
            recaptcha: "operational",
          },
        }),
      });
    });
    await openPage(page, "/");
    await page.locator("footer").scrollIntoViewIfNeeded();

    await expect(page.getByRole("button", { name: /Backend: operacional/ })).toBeVisible();
    const database = page.getByRole("button", { name: /Database: indisponível/ });
    await expect(database).toBeVisible();
    await expect(database.locator(".bg-red-500")).toBeVisible();
  });

  test("cada serviço de infraestrutura explica sua verificação em hover e foco", async ({
    page,
  }) => {
    await openPage(page, "/");
    const scenarios = [
      [/Backend:/, "Indica se a API do site está respondendo normalmente."],
      [/Database:/, "Indica se o armazenamento e a leitura de dados estão disponíveis."],
      [/SMTP service:/, "Indica se o serviço responsável pelo envio de mensagens está disponível."],
      [/reCAPTCHA v3:/, "Indica se a proteção contra envios automatizados está disponível."],
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
      [/Backend:/, "Indicates whether the website API is responding normally."],
      [/Database:/, "Indicates whether data storage and retrieval are available."],
      [
        /SMTP service:/,
        "Indicates whether the service responsible for sending messages is available.",
      ],
      [/reCAPTCHA v3:/, "Indicates whether protection against automated submissions is available."],
    ] as const;

    for (const [name, description] of englishScenarios) {
      const button = page.getByRole("button", { name });
      await expect(button).toHaveAccessibleName(
        new RegExp(description.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      );
    }
  });

  test("cada métrica vital expõe sua explicação em hover e foco", async ({ page }) => {
    await openPage(page, "/");
    const scenarios = [
      [/LCP:/, "Mede quanto tempo leva para o maior elemento visível aparecer."],
      [/INP:/, "Mede o tempo de resposta da interface à interação mais lenta."],
      [/CLS:/, "Mede mudanças inesperadas de posição dos elementos."],
      [/FPS:/, "Mede a fluidez da animação em quadros por segundo."],
      [/sessão:/, "Mostra há quanto tempo esta página está aberta nesta aba."],
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
      [/FPS:/, "Measures animation smoothness in frames per second."],
      [/session:/, "Shows how long this page has been open in this tab."],
    ] as const;

    for (const [name, description] of englishScenarios) {
      const button = page.getByRole("button", { name });
      await expect(button).toHaveAccessibleName(
        new RegExp(description.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      );
    }
  });
});
