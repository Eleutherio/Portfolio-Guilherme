import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type TestInfo } from "@playwright/test";

type Language = "pt" | "en";
type Theme = "light" | "dark";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];
const ROUTES = [
  "/",
  "/sobre",
  "/projetos/grengame",
  "/projetos/abriu-chaveiro",
  "/projetos/martha-izabel",
  "/acessibilidade",
  "/privacidade",
  "/rota-inexistente",
] as const;
const MODES = [
  { language: "pt" as const, theme: "light" as const, viewport: "desktop" as const },
  { language: "pt" as const, theme: "dark" as const, viewport: "desktop" as const },
  { language: "en" as const, theme: "light" as const, viewport: "desktop" as const },
  { language: "en" as const, theme: "dark" as const, viewport: "desktop" as const },
  { language: "pt" as const, theme: "light" as const, viewport: "mobile" as const },
  { language: "pt" as const, theme: "dark" as const, viewport: "mobile" as const },
  { language: "en" as const, theme: "light" as const, viewport: "mobile" as const },
  { language: "en" as const, theme: "dark" as const, viewport: "mobile" as const },
];

async function openPage(
  page: Page,
  route: string,
  options: { language?: Language; theme?: Theme; width?: number; height?: number } = {},
) {
  const language = options.language ?? "pt";
  const theme = options.theme ?? "light";
  await page.setViewportSize({ width: options.width ?? 1440, height: options.height ?? 900 });
  await page.addInitScript(
    ({ selectedLanguage, selectedTheme }) => {
      window.localStorage.setItem("gf-lang", selectedLanguage);
      window.localStorage.setItem("gf-theme", selectedTheme);
      window.localStorage.removeItem("accweb");
    },
    { selectedLanguage: language, selectedTheme: theme },
  );
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await expect(page.locator("main#main")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", language === "pt" ? "pt-BR" : "en");
  await expect(page.locator("html")).toHaveClass(new RegExp(theme));
  await expect(page.locator("#acc-widget-host")).toBeAttached();
  if (route === "/sobre") {
    await page.locator("#sobre").scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
  }
  if (route === "/") {
    await expect(page.locator('[data-timeline-hydrated="true"]')).toBeAttached();
    await expect(page.locator('[data-projects-hydrated="true"]')).toBeAttached();
    await expect(page.locator("footer")).toBeAttached();
  }
}

async function runAxe(page: Page, testInfo: TestInfo, label: string, include?: string) {
  let builder = new AxeBuilder({ page }).withTags(WCAG_TAGS);
  if (include) builder = builder.include(include);
  const results = await builder.analyze();
  await testInfo.attach(`${label}-axe.json`, {
    body: JSON.stringify(
      { violations: results.violations, incomplete: results.incomplete },
      null,
      2,
    ),
    contentType: "application/json",
  });
  expect(results.violations, `${label}: violações axe`).toEqual([]);
  const unexpectedIncomplete = results.incomplete.filter(
    (result) => result.id !== "color-contrast",
  );
  expect(unexpectedIncomplete, `${label}: resultados axe incompletos não revisados`).toEqual([]);
}

async function installRecaptchaStub(page: Page, token = "playwright-recaptcha-token") {
  await page.addInitScript((stubToken) => {
    const target = window as typeof window & {
      grecaptcha?: {
        ready: (callback: () => void) => void;
        execute: () => Promise<string>;
      };
    };
    target.grecaptcha = {
      ready: (callback) => callback(),
      execute: async () => stubToken,
    };
  }, token);
}

async function fillValidContactForm(page: Page) {
  await page.locator("#contact-name").fill("Guilherme Teste");
  await page.locator("#contact-email").fill("guilherme@example.com");
  await page.locator("#contact-subject").fill("Contato pelo portfólio");
  await page
    .locator("#contact-message")
    .fill("Esta mensagem possui tamanho suficiente para validar o formulário.");
}

test.describe("WCAG 2.2 AA — matriz de rotas", () => {
  for (const route of ROUTES) {
    for (const mode of MODES) {
      test(`${route} | ${mode.language} | ${mode.theme} | ${mode.viewport}`, async ({
        page,
      }, testInfo) => {
        const mobile = mode.viewport === "mobile";
        await openPage(page, route, {
          language: mode.language,
          theme: mode.theme,
          width: mobile ? 375 : 1440,
          height: 900,
        });
        await runAxe(page, testInfo, "default");
      });
    }
  }
});

test.describe("WCAG 2.2 AA — estados interativos", () => {
  test("menu mobile aberto", async ({ page }, testInfo) => {
    await openPage(page, "/", { width: 375, height: 900 });
    const trigger = page.getByRole("button", { name: "Abrir menu", exact: true });
    await trigger.click();
    await expect(page.locator("#mobile-navigation")).toBeVisible();
    await runAxe(page, testInfo, "mobile-menu");
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  });

  test("modal de privacidade preserva foco, Escape e reflow", async ({ page }, testInfo) => {
    await openPage(page, "/", { width: 320, height: 900 });
    const trigger = page.getByRole("button", { name: "Privacidade", exact: true });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Como seus dados são usados" });
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box?.width ?? 0).toBeLessThanOrEqual(320);
    await expect(dialog.getByRole("checkbox")).toHaveCount(0);
    await runAxe(page, testInfo, "privacy-dialog", '[role="dialog"]');

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("widget aberto, foco e fechamento", async ({ page }, testInfo) => {
    await openPage(page, "/acessibilidade", { width: 375, height: 900 });
    const host = page.locator("#acc-widget-host");
    const trigger = host.locator("#accessibilityWidget");
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(host.locator(".acc-menu")).toBeVisible();
    await runAxe(page, testInfo, "widget-open");
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  });

  test("widget expõe nomes e alvos para todos os controles", async ({ page }) => {
    await openPage(page, "/acessibilidade", { width: 375, height: 900 });
    const host = page.locator("#acc-widget-host");
    await host.locator("#accessibilityWidget").click();

    const buttons = host.getByRole("button");
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(20);
    for (let index = 0; index < buttonCount; index += 1) {
      const button = buttons.nth(index);
      await expect(button).toHaveAccessibleName(/\S/);
      const box = await button.boundingBox();
      expect(box?.width ?? 0).toBeGreaterThanOrEqual(24);
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(24);
    }

    await expect(host.getByRole("slider")).toHaveAccessibleName(/\S/);
  });

  test("widget persiste preferências, idioma e restauração", async ({ page }) => {
    await openPage(page, "/acessibilidade", { width: 375, height: 900 });
    const host = page.locator("#acc-widget-host");
    await host.locator("#accessibilityWidget").click();

    const bold = host.locator('.acc-btn[data-key="bold-text"]');
    await bold.click();
    await expect(bold).toHaveClass(/acc-selected/);

    await host.locator(".acc-header-lang-toggle").click();
    await host.locator('.acc-lang-item[data-lang="en"]').click();
    await expect(host.locator("#acc-current-language")).toHaveText("EN");

    const restoredPage = await page.context().newPage();
    await restoredPage.goto("/acessibilidade", { waitUntil: "domcontentloaded" });
    const restoredHost = restoredPage.locator("#acc-widget-host");
    await expect(restoredHost).toBeAttached();
    await restoredHost.locator("#accessibilityWidget").click();
    await expect(restoredHost.locator('.acc-btn[data-key="bold-text"]')).toHaveClass(
      /acc-selected/,
    );
    await expect(restoredHost.locator("#acc-current-language")).toHaveText("EN");

    await restoredHost.locator(".acc-footer-reset").click();
    await expect(restoredHost.locator('.acc-btn[data-key="bold-text"]')).not.toHaveClass(
      /acc-selected/,
    );
    await restoredPage.close();
  });

  for (const profile of [
    "profile-seizure-safe",
    "profile-vision",
    "profile-adhd",
    "profile-dyslexia",
  ]) {
    test(`widget: ${profile}`, async ({ page }, testInfo) => {
      await openPage(page, "/", { width: 375, height: 900 });
      const host = page.locator("#acc-widget-host");
      await host.locator("#accessibilityWidget").click();
      const control = host.locator(`.acc-btn[data-key="${profile}"]`);
      await control.click();
      await expect(control).toHaveClass(/acc-selected/);
      await runAxe(page, testInfo, profile);
      await host.locator(".acc-footer-reset").click();
    });
  }

  test("erros do formulário são anunciados", async ({ page }, testInfo) => {
    await openPage(page, "/");
    await page.locator("#contact-name").fill("A");
    await page.locator("#contact-email").fill("email-invalido");
    await page.locator("#contact-message").fill("curta");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('[role="alert"]')).toHaveCount(3);
    await runAxe(page, testInfo, "contact-errors");
  });

  test("sucesso do formulário é anunciado e limpa os campos", async ({ page }, testInfo) => {
    await installRecaptchaStub(page);
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });
    await openPage(page, "/");
    await fillValidContactForm(page);
    await page.getByRole("button", { name: "enviar mensagem" }).click();
    await expect(page.getByRole("status")).toContainText("mensagem enviada");
    await expect(page.locator("#contact-name")).toHaveValue("");
    await expect(page.locator("#contact-email")).toHaveValue("");
    await expect(page.locator("#contact-message")).toHaveValue("");
    await runAxe(page, testInfo, "contact-success");
  });

  for (const status of [422, 429, 500]) {
    test(`erro ${status} do formulário é anunciado`, async ({ page }, testInfo) => {
      await installRecaptchaStub(page);
      await page.route("**/api/contact", async (route) => {
        const code =
          status === 422 ? "invalid_request" : status === 429 ? "rate_limited" : "server_error";
        await route.fulfill({
          status,
          contentType: "application/json",
          headers: status === 429 ? { "retry-after": "900" } : undefined,
          body: JSON.stringify({ ok: false, code }),
        });
      });
      await openPage(page, "/");
      await fillValidContactForm(page);
      await page.getByRole("button", { name: "enviar mensagem" }).click();
      await expect(page.getByRole("status")).toContainText("algo deu errado");
      await expect(page.getByRole("button", { name: "enviar mensagem" })).toBeEnabled();
      await runAxe(page, testInfo, `contact-${status}`);
    });
  }

  test("reCAPTCHA indisponível é anunciado", async ({ page }, testInfo) => {
    await page.route("https://www.google.com/recaptcha/**", async (route) => route.abort());
    await openPage(page, "/");
    await fillValidContactForm(page);
    await page.getByRole("button", { name: "enviar mensagem" }).click();
    await expect(page.getByRole("status")).toContainText("algo deu errado");
    await expect(page.getByRole("button", { name: "enviar mensagem" })).toBeEnabled();
    await runAxe(page, testInfo, "contact-recaptcha-unavailable");
  });

  test("timeline e carrossel após navegação", async ({ page }, testInfo) => {
    await openPage(page, "/", { width: 375, height: 900 });
    await page.getByRole("button", { name: "Próximo marco" }).click();
    await page.getByRole("button", { name: "Próxima página de projetos" }).click();
    await expect(
      page.locator("#projetos").getByRole("heading", { name: "Landing page para chaveiro 24h" }),
    ).toBeVisible();
    await runAxe(page, testInfo, "carousels-next");
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

    await expect(page.getByRole("button", { name: /Backend: operacional/ })).toBeVisible();
    const database = page.getByRole("button", { name: /Database: indisponível/ });
    await expect(database).toBeVisible();
    await expect(database.locator(".bg-red-500")).toBeVisible();
  });

  test("cada serviço de infraestrutura explica sua verificação em hover e foco", async ({
    page,
  }) => {
    await openPage(page, "/");

    const backend = page.getByRole("button", { name: /Backend:.*endpoint público de status/ });
    await backend.hover();
    await expect(page.getByRole("tooltip", { name: /endpoint público de status/ })).toBeVisible();

    const smtp = page.getByRole("button", { name: /SMTP service:.*TLS e autenticação/ });
    await smtp.focus();
    await expect(page.getByRole("tooltip", { name: /TLS e autenticação/ })).toBeVisible();
  });

  test("cada métrica vital expõe sua explicação em hover e foco", async ({ page }) => {
    await openPage(page, "/");
    const lcp = page.getByRole("button", { name: /LCP:.*Largest Contentful Paint/ });
    await lcp.hover();
    await expect(page.getByRole("tooltip", { name: /Largest Contentful Paint/ })).toBeVisible();

    const session = page.getByRole("button", { name: /sessão:.*Tempo decorrido/ });
    await session.focus();
    await expect(
      page.getByRole("tooltip", { name: /não representa disponibilidade/ }),
    ).toBeVisible();
  });
});

test.describe("WCAG 2.2 AA — reflow e preferências", () => {
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
