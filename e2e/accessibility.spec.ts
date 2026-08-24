import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import sharp from "sharp";

type Language = "pt" | "en";
type Theme = "light" | "dark";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];
const SIMPLE_TOOLTIP_FORBIDDEN = /Brevo|Supabase|Render|Google|[—–]|\p{Extended_Pictographic}/u;
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
  options: {
    language?: Language;
    theme?: Theme;
    width?: number;
    height?: number;
    loadDeferredSections?: boolean;
    loadMedia?: boolean;
  } = {},
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
  if (!options.loadMedia) {
    await page.route(/\.mp4(?:\?|$)/u, async (route) => {
      if (route.request().resourceType() === "media") {
        await route.abort();
        return;
      }
      await route.continue();
    });
  }
  await page.goto(route, { waitUntil: "domcontentloaded" });
  await expect(page.locator("main#main")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", language === "pt" ? "pt-BR" : "en");
  await expect(page.locator("html")).toHaveClass(new RegExp(theme));
  await expect(page.locator("#accessibility-widget-launcher")).toBeAttached();
  if (route === "/sobre") {
    await page.locator("#sobre").scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
  }
  if (route === "/") {
    if (options.loadDeferredSections !== false) {
      await page.evaluate(() => {
        for (const id of ["projetos", "depoimentos", "trajetoria", "sobre", "contato", "rodape"]) {
          window.dispatchEvent(new CustomEvent("portfolio:load-deferred-section", { detail: id }));
        }
      });
      await expect(page.locator('[data-projects-hydrated="true"]')).toBeAttached();
      await expect(page.locator("#depoimentos-heading")).toBeAttached();
      await expect(page.locator("#trajetoria-heading")).toBeAttached();
      await expect(page.locator("#sobre-heading")).toBeAttached();
      await expect(page.locator("footer")).toBeAttached();
    }
  }
}

async function openAccessibilityWidget(page: Page) {
  await page.locator("#accessibility-widget-launcher").click();
  const host = page.locator("#acc-widget-host");
  await expect(host).toBeAttached();
  await expect(host.locator(".acc-menu")).toBeVisible();
  return host;
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

async function screenshotPixel(page: Page, x: number, y: number) {
  const screenshot = await page.screenshot();
  const { data, info } = await sharp(screenshot)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const offset = (Math.floor(y) * info.width + Math.floor(x)) * info.channels;
  return {
    red: data[offset],
    green: data[offset + 1],
    blue: data[offset + 2],
  };
}

async function expectFocusedTooltip(button: Locator, description: string) {
  await button.focus();
  const tooltip = button.locator("xpath=following-sibling::span[1]");
  await expect(button).toHaveAccessibleName(
    new RegExp(description.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
  );
  await expect(tooltip).toBeVisible();
  const content = (await tooltip.textContent()) ?? "";
  expect(content).toContain(description);
  expect(content).not.toMatch(SIMPLE_TOOLTIP_FORBIDDEN);
}

test.describe("Identidade visual", () => {
  test("a assinatura da marca usa o nome completo com pesos bold e light", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900 });

    const wordmarks = page.locator('[data-wordmark="guifer.tech"]');
    await expect(wordmarks).toHaveCount(2);

    for (const wordmark of await wordmarks.all()) {
      await expect(wordmark.locator('[data-wordmark-part="gui"]')).toHaveText("gui");
      await expect(wordmark.locator('[data-wordmark-part="guifer"]')).toHaveCSS(
        "font-weight",
        "700",
      );
      await expect(wordmark.locator('[data-wordmark-part="tech"]')).toHaveCSS("font-weight", "300");
    }

    const headerWordmark = page.locator("header").locator('[data-wordmark="guifer.tech"]');
    await expect(headerWordmark).toHaveCSS("font-size", "11.5px");
    await expect(page.locator("footer").locator('[data-wordmark="guifer.tech"]')).toHaveCSS(
      "font-size",
      "11.5px",
    );
    await expect(page.locator("header").getByText("GF", { exact: true })).toHaveCount(0);
  });

  test("o MIV preserva a capitalização original sem forçar caixa alta", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900 });

    const forcedTextTransforms = await page.locator("body *").evaluateAll((elements) =>
      elements
        .filter((element) => window.getComputedStyle(element).textTransform !== "none")
        .map((element) => ({
          tag: element.tagName,
          className: element.getAttribute("class"),
          textTransform: window.getComputedStyle(element).textTransform,
        })),
    );

    expect(forcedTextTransforms).toEqual([]);
    await expect(page.locator("header").getByText("EN", { exact: true })).toBeVisible();
    await expect(
      page.locator("footer").getByRole("link", { name: "Acessibilidade" }),
    ).toBeVisible();
    await expect(page.locator("footer").getByRole("button", { name: "Privacidade" })).toBeVisible();
  });

  test("o header concentra navegação e controles na metade direita", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900, loadDeferredSections: false });

    const headerContainer = page.locator("header .header-container").first();
    const headerRight = page.locator("[data-header-right]");
    const navigationItems = headerRight.locator("nav > button");

    await expect(navigationItems).toHaveCount(3);
    await expect(navigationItems).toHaveText(["sobre", "projetos", "contato"]);

    const containerBox = await headerContainer.boundingBox();
    const rightBox = await headerRight.boundingBox();
    expect(rightBox?.x ?? 0).toBeGreaterThanOrEqual(
      (containerBox?.x ?? 0) + (containerBox?.width ?? 0) / 2 - 1,
    );
    await expect(page.locator("[data-header-switches]")).toHaveClass(/rounded-full/);
  });
});

test.describe("Cursor customizado", () => {
  test("usa a forma aprovada, inversão real e crescimento em elementos interativos", async ({
    page,
  }) => {
    await openPage(page, "/", { width: 1440, height: 900, loadDeferredSections: false });

    const html = page.locator("html");
    const cursor = page.locator("#custom-cursor");
    const visual = cursor.locator(".custom-cursor__visual");
    const chevron = cursor.locator(".custom-cursor__chevron");
    const tooltip = page.locator("#custom-cursor-tooltip");

    await expect(html).toHaveAttribute("data-custom-cursor", "active");
    await page.locator("#home h1").hover({ position: { x: 12, y: 12 } });
    await expect(cursor).toHaveAttribute("data-visible", "true");
    await expect(cursor).toHaveAttribute("data-interactive", "false");
    await expect(cursor).toHaveCSS("width", "16px");
    await expect(cursor).toHaveCSS("height", "16px");
    await expect(cursor).toHaveCSS("mix-blend-mode", "difference");
    await expect(visual).toHaveCSS("mix-blend-mode", "normal");
    await expect(visual).toHaveCSS("opacity", "1");
    await expect(chevron).toHaveCSS("stroke-width", "0.55px");
    const path = chevron.locator("path");
    await expect(path).toHaveCount(1);
    await expect(path).toHaveAttribute(
      "d",
      "M2.05 1.25c3.85.8 9.45 2.8 12.3 4.1 1.2.55 1.17 1.43.01 2-1.41.7-4.31.85-5.31 2.6l-2.7 4.6c-.63 1.07-1.62 1.03-2.17-.1L.95 2.7C.57 1.32 1 .98 2.05 1.25Z",
    );
    await expect(cursor.locator(".custom-cursor__dot")).toHaveCount(0);
    await expect(tooltip).toHaveAttribute("data-visible", "false");

    const projects = page.locator("header nav button").nth(1);
    await projects.hover();
    await expect(cursor).toHaveAttribute("data-interactive", "true");
    await expect(cursor).toHaveAttribute("data-visible", "true");
    await expect(visual).toHaveCSS("opacity", "1");
    await expect(visual).toHaveCSS("transform", /matrix\(1\.35/);
    await expect(tooltip).toHaveAttribute("data-visible", "false");

    const themeAction = page.locator("[data-header-switches] button").first();
    await themeAction.hover();
    await expect(cursor).toHaveAttribute("data-interactive", "true");
    await expect(tooltip).toHaveAttribute("data-visible", "false");
    await expect(themeAction).toHaveCSS("cursor", "none");

    await page.mouse.down();
    await expect(cursor).toHaveAttribute("data-pressed", "true");
    await expect(visual).toHaveCSS("opacity", "0.5");
    await expect(visual).toHaveCSS("transform", /matrix\(0\.92/);
    await page.mouse.up();
    await expect(cursor).toHaveAttribute("data-pressed", "false");

    const projectsButton = page.locator("#home a.btn-primary").first();
    await projectsButton.hover();
    await expect(cursor).toHaveAttribute("data-visible", "false");
    await expect(cursor).toHaveAttribute("data-label-visible", "true");
    await expect(tooltip).toHaveText("Abrir meus projetos");
    await expect(tooltip).toHaveAttribute("data-visible", "true");
    await expect(tooltip).toHaveCSS("mix-blend-mode", "normal");
  });

  test("limita a caixa a botões visuais e imagens clicáveis em PT e EN", async ({ page }) => {
    await openPage(page, "/", {
      language: "en",
      theme: "dark",
      width: 1440,
      height: 900,
    });

    const cursor = page.locator("#custom-cursor");
    const tooltip = page.locator("#custom-cursor-tooltip");
    await page.locator("header nav button").nth(1).hover();
    await expect(cursor).toHaveAttribute("data-visible", "true");
    await expect(tooltip).toHaveAttribute("data-visible", "false");

    await page.locator("#home a[download]").hover();
    await expect(cursor).toHaveAttribute("data-visible", "true");
    await expect(tooltip).toHaveAttribute("data-visible", "false");

    await page.locator("footer a").first().hover();
    await expect(cursor).toHaveAttribute("data-visible", "true");
    await expect(tooltip).toHaveAttribute("data-visible", "false");

    await page.locator("#home a.btn-primary").first().hover();
    await expect(cursor).toHaveAttribute("data-visible", "false");
    await expect(tooltip).toHaveText("Open my projects");

    const firstProjectLink = page.locator('#projetos a[aria-current="true"]');
    const projectTitle = await firstProjectLink.getAttribute("data-cursor-open");
    expect(projectTitle).toBeTruthy();
    await firstProjectLink.hover();
    await expect(cursor).toHaveAttribute("data-visible", "false");
    await expect(tooltip).toHaveText(`Open ${projectTitle}`);

    await openPage(page, "/sobre", { language: "en", width: 1440, height: 900 });
    const photoButton = page.locator("[data-about-album] button:has(img)").first();
    await photoButton.hover();
    await expect(cursor).toHaveAttribute("data-visible", "false");
    await expect(tooltip).toHaveText(/^Open photo 1:/);
  });

  test("inverte visualmente sobre fundos claros e escuros", async ({ page }) => {
    await openPage(page, "/", { width: 800, height: 500, loadDeferredSections: false });
    await page.evaluate(() => {
      const panel = document.createElement("div");
      panel.id = "cursor-inversion-probe";
      Object.assign(panel.style, {
        position: "fixed",
        inset: "0",
        zIndex: "2147483000",
        background: "#fff",
        pointerEvents: "none",
      });
      document.body.append(panel);
    });

    const cursor = page.locator("#custom-cursor");
    await page.mouse.move(100, 100);
    await expect(cursor).toHaveAttribute("data-visible", "true");
    await page.waitForTimeout(150);
    const onLight = await screenshotPixel(page, 103, 103);
    expect(Math.max(onLight.red, onLight.green, onLight.blue)).toBeLessThan(40);

    await page.locator("#cursor-inversion-probe").evaluate((panel) => {
      (panel as HTMLElement).style.background = "#000";
    });
    await page.mouse.move(101, 100);
    const onDark = await screenshotPixel(page, 104, 103);
    expect(Math.min(onDark.red, onDark.green, onDark.blue)).toBeGreaterThan(215);
    await page.locator("#cursor-inversion-probe").evaluate((panel) => panel.remove());
  });

  test("aumenta o cursor em campos e ações sem exibir caixa", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900 });
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      document.getElementById("contact-name")?.scrollIntoView({ block: "center" });
    });

    const cursor = page.locator("#custom-cursor");
    const visual = cursor.locator(".custom-cursor__visual");
    const tooltip = page.locator("#custom-cursor-tooltip");
    const input = page.locator("#contact-name");
    await input.hover();
    await expect(cursor).toHaveAttribute("data-interactive", "true");
    await expect(cursor.locator(".custom-cursor__dot")).toHaveCount(0);
    await expect(visual).toHaveCSS("transform", /matrix\(1\.35/);
    await expect(tooltip).toHaveAttribute("data-visible", "false");
    await expect(input).toHaveCSS("cursor", "none");

    const submit = page.locator('#contato button[type="submit"]');
    await submit.hover();
    await expect(cursor).toHaveAttribute("data-interactive", "true");
    await expect(visual).toHaveCSS("transform", /matrix\(1\.35/);
    await expect(tooltip).toHaveAttribute("data-visible", "false");

    const carouselAction = page.locator("#projetos button:not(:disabled)").first();
    await carouselAction.hover();
    await expect(cursor).toHaveAttribute("data-interactive", "true");
    await expect(tooltip).toHaveAttribute("data-visible", "false");

    await page.evaluate(() => {
      const disabledAction = document.createElement("button");
      disabledAction.id = "cursor-disabled-probe";
      disabledAction.disabled = true;
      disabledAction.textContent = "indisponível";
      document.body.append(disabledAction);
    });
    const disabledAction = page.locator("#cursor-disabled-probe");
    await disabledAction.hover({ force: true });
    await expect(cursor).toHaveAttribute("data-interactive", "false");
    await expect(tooltip).toHaveAttribute("data-visible", "false");
  });

  test("move botões magnéticos junto ao ponteiro e os devolve à posição original", async ({
    page,
  }) => {
    await openPage(page, "/", { width: 1440, height: 900, loadDeferredSections: false });

    const button = page.locator("#home .btn-primary").first();
    const buttonBox = await button.boundingBox();
    expect(buttonBox).not.toBeNull();
    if (!buttonBox) return;

    const originalAppearance = await button.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        borderRadius: style.borderRadius,
        height: style.height,
        width: style.width,
      };
    });

    await page.mouse.move(
      buttonBox.x + buttonBox.width * 0.82,
      buttonBox.y + buttonBox.height * 0.78,
    );
    await expect(button).toHaveAttribute("data-magnetic-active", "true");

    const magneticOffset = await button.evaluate((element) => ({
      x: Number.parseFloat(element.style.getPropertyValue("--magnetic-x")),
      y: Number.parseFloat(element.style.getPropertyValue("--magnetic-y")),
    }));
    expect(magneticOffset.x).toBeGreaterThan(2);
    expect(magneticOffset.y).toBeGreaterThan(1);
    expect(magneticOffset.x).toBeLessThanOrEqual(12);
    expect(magneticOffset.y).toBeLessThanOrEqual(8);

    await page.locator("#home h1").hover();
    await expect(button).toHaveAttribute("data-magnetic-active", "false");
    await expect(button).toHaveCSS("transform", /matrix\(1, 0, 0, 1, 0, 0\)|none/);
    await expect
      .poll(() =>
        button.evaluate((element) => {
          const style = getComputedStyle(element);
          return {
            borderRadius: style.borderRadius,
            height: style.height,
            width: style.width,
          };
        }),
      )
      .toEqual(originalAppearance);

    await page.evaluate(() => {
      const disabled = document.createElement("button");
      disabled.id = "magnetic-disabled-probe";
      disabled.className = "btn-primary";
      disabled.disabled = true;
      disabled.textContent = "indisponível";
      Object.assign(disabled.style, {
        position: "fixed",
        left: "20px",
        bottom: "20px",
        zIndex: "2147483600",
      });
      document.body.append(disabled);
    });
    const disabled = page.locator("#magnetic-disabled-probe");
    await disabled.hover({ force: true });
    await expect(disabled).not.toHaveAttribute("data-magnetic-active", "true");
    await expect(disabled).toHaveCSS("transform", /matrix\(1, 0, 0, 1, 0, 0\)|none/);
  });

  test("faz clamp e inverte a caixa nas quatro bordas", async ({ page }) => {
    const width = 900;
    const height = 700;
    await openPage(page, "/", { width, height, loadDeferredSections: false });
    await page.evaluate(() => {
      const probe = document.createElement("a");
      probe.id = "cursor-edge-probe";
      probe.href = "#cursor-test";
      probe.className = "btn-outline";
      probe.dataset.cursorOpen = "destino";
      Object.assign(probe.style, {
        position: "fixed",
        inset: "0",
        zIndex: "2147483640",
      });
      document.getElementById("root")?.append(probe);
    });

    const tooltip = page.locator("#custom-cursor-tooltip");
    const cases = [
      { x: 2, y: 2, horizontal: "right", vertical: "below" },
      { x: width - 2, y: 2, horizontal: "left", vertical: "below" },
      { x: 2, y: height - 2, horizontal: "right", vertical: "above" },
      { x: width - 2, y: height - 2, horizontal: "left", vertical: "above" },
    ];

    for (const position of cases) {
      await page.mouse.move(position.x, position.y);
      await expect(tooltip).toHaveText("Abrir destino");
      await expect(tooltip).toHaveAttribute("data-horizontal", position.horizontal);
      await expect(tooltip).toHaveAttribute("data-vertical", position.vertical);
      const box = await tooltip.boundingBox();
      expect(box).not.toBeNull();
      expect(box?.x ?? 0).toBeGreaterThanOrEqual(8);
      expect(box?.y ?? 0).toBeGreaterThanOrEqual(8);
      expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(width - 8);
      expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(height - 8);
    }

    await page.locator("#cursor-edge-probe").evaluate((element) => {
      delete (element as HTMLElement).dataset.cursorOpen;
      element.setAttribute("aria-label", "documentação");
    });
    await page.mouse.move(width / 2, height / 2);
    await expect(tooltip).toHaveText("Abrir documentação");

    await page.locator("#cursor-edge-probe").evaluate((element) => {
      element.removeAttribute("aria-label");
      element.setAttribute("href", "https://example.com/recurso");
    });
    await page.mouse.move(width / 2 + 1, height / 2 + 1);
    await expect(tooltip).toHaveText("Abrir example.com");
    await page.locator("#cursor-edge-probe").evaluate((element) => element.remove());
  });

  test("preserva zonas nativas e remove animação com movimento reduzido", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "/", { width: 1440, height: 900, loadDeferredSections: false });

    const cursor = page.locator("#custom-cursor");
    const visual = cursor.locator(".custom-cursor__visual");
    const projects = page.locator("header nav button").nth(1);
    await projects.hover();
    await page.mouse.down();
    await expect(cursor).toHaveAttribute("data-visible", "true");
    await expect(visual).toHaveCSS("transition-duration", "0s");
    await expect(visual).toHaveCSS("transform", "none");
    await page.mouse.up();

    const launcher = page.locator("#accessibility-widget-launcher");
    await launcher.hover();
    await expect(cursor).toHaveAttribute("data-visible", "false");
    await expect(launcher).toHaveCSS("cursor", "auto");

    await page.evaluate(() => {
      const iframe = document.createElement("iframe");
      iframe.id = "cursor-native-frame";
      Object.assign(iframe.style, {
        position: "fixed",
        left: "120px",
        top: "120px",
        width: "120px",
        height: "80px",
        zIndex: "100",
      });
      document.getElementById("root")?.append(iframe);
    });
    await page.locator("#cursor-native-frame").hover();
    await expect(cursor).toHaveAttribute("data-visible", "false");
    await expect(page.locator("#cursor-native-frame")).toHaveCSS("cursor", "auto");
    await page.locator("#cursor-native-frame").evaluate((element) => element.remove());
  });

  test("permanece global dentro de portais da aplicação", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900 });
    await page.locator("footer").getByRole("button", { name: "Privacidade" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const cursor = page.locator("#custom-cursor");
    const tooltip = page.locator("#custom-cursor-tooltip");

    const textLink = dialog.getByRole("link").first();
    await textLink.hover();
    await expect(cursor).toHaveAttribute("data-visible", "true");
    await expect(cursor).toHaveAttribute("data-interactive", "true");
    await expect(tooltip).toHaveAttribute("data-visible", "false");
    await expect(textLink).toHaveCSS("cursor", "none");

    const action = dialog.locator("button.btn-primary");
    await action.hover();
    await expect(cursor).toHaveAttribute("data-visible", "true");
    await expect(cursor.locator(".custom-cursor__visual")).toHaveCSS("transform", /matrix\(1\.35/);
    await expect(tooltip).toHaveAttribute("data-visible", "false");
  });

  test("mantém o cursor nativo em forced colors", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    await openPage(page, "/", { width: 1440, height: 900, loadDeferredSections: false });

    await expect(page.locator("html")).toHaveAttribute("data-custom-cursor", "inactive");
    await expect(page.locator("#custom-cursor")).toHaveCSS("display", "none");
    await expect(page.locator("[data-header-switches] button").first()).not.toHaveCSS(
      "cursor",
      "none",
    );
  });

  test("mantém o cursor nativo na impressão", async ({ page }) => {
    await page.emulateMedia({ media: "print" });
    await openPage(page, "/", { width: 1440, height: 900, loadDeferredSections: false });

    await expect(page.locator("html")).toHaveAttribute("data-custom-cursor", "inactive");
    await expect(page.locator("#custom-cursor")).toHaveCSS("display", "none");
    await expect(page.locator("#home a.btn-primary").first()).not.toHaveCSS("cursor", "none");
  });
});

test.describe("Cursor customizado em touch", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 375, height: 812 } });

  test("mantém o cursor nativo em ponteiro coarse", async ({ page }) => {
    await openPage(page, "/", {
      width: 375,
      height: 812,
      loadDeferredSections: false,
    });

    await expect(page.locator("html")).toHaveAttribute("data-custom-cursor", "inactive");
    await expect(page.locator("#custom-cursor")).toHaveAttribute("data-visible", "false");
  });
});

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
    const widgetRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("accessible-web-widget")) widgetRequests.push(request.url());
    });
    await openPage(page, "/acessibilidade", { width: 375, height: 900 });
    const launcher = page.locator("#accessibility-widget-launcher");
    await expect(launcher).toBeVisible();
    await expect(page.locator("#acc-widget-host")).toHaveCount(0);
    expect(widgetRequests).toHaveLength(0);

    await launcher.focus();
    await page.keyboard.press("Enter");
    const host = page.locator("#acc-widget-host");
    const trigger = host.locator("#accessibilityWidget");
    await expect(host.locator(".acc-menu")).toBeVisible();
    expect(widgetRequests.length).toBeGreaterThan(0);
    await runAxe(page, testInfo, "widget-open");
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  });

  test("widget expõe nomes e alvos para todos os controles", async ({ page }) => {
    await openPage(page, "/acessibilidade", { width: 375, height: 900 });
    const host = await openAccessibilityWidget(page);

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
    const host = await openAccessibilityWidget(page);

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
    await expect(restoredPage.locator("#accessibility-widget-launcher")).toHaveCount(0);
    await restoredHost.locator("#accessibilityWidget").click();
    await expect(restoredHost.locator(".acc-menu")).toBeVisible();
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

  test("widget restaura preferências do cookie sem Web Storage", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.addInitScript(
      (storedConfig) => {
        document.cookie = `accweb=${encodeURIComponent(storedConfig)};path=/;SameSite=Strict`;
        const unavailable = () => {
          throw new DOMException("Web Storage indisponível", "SecurityError");
        };
        Object.defineProperties(Storage.prototype, {
          getItem: { configurable: true, value: unavailable },
          setItem: { configurable: true, value: unavailable },
          removeItem: { configurable: true, value: unavailable },
        });
      },
      JSON.stringify({ states: { "bold-text": true } }),
    );

    await page.goto("/acessibilidade", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main#main")).toBeVisible();
    const host = page.locator("#acc-widget-host");
    await expect(host).toBeAttached();
    await expect(page.locator("#accessibility-widget-launcher")).toHaveCount(0);

    await host.locator("#accessibilityWidget").click();
    await expect(host.locator(".acc-menu")).toBeVisible();
    await expect(host.locator('.acc-btn[data-key="bold-text"]')).toHaveClass(/acc-selected/);
  });

  for (const profile of [
    "profile-seizure-safe",
    "profile-vision",
    "profile-adhd",
    "profile-dyslexia",
  ]) {
    test(`widget: ${profile}`, async ({ page }, testInfo) => {
      await openPage(page, "/", { width: 375, height: 900 });
      const host = await openAccessibilityWidget(page);
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

  test("contato prioriza WhatsApp e mantém foco discreto", async ({ page }, testInfo) => {
    await openPage(page, "/");
    const contact = page.locator("#contato");
    await contact.scrollIntoViewIfNeeded();
    await expect(contact.getByRole("heading", { name: "Vamos conversar?" })).toBeVisible();
    await expect(contact.locator("header")).toHaveCSS("opacity", "1");
    await expect(contact.getByText("Ou envie uma mensagem", { exact: true })).toHaveCount(0);
    await expect(
      contact.getByText(/Estou aberto a oportunidades de estágio e vagas júnior/),
    ).toHaveCount(0);

    const whatsapp = contact.getByRole("link", { name: "(51) 99405-5984", exact: true }).first();
    await expect(whatsapp).toHaveAttribute("href", "https://wa.me/5551994055984");
    await expect(whatsapp).toHaveAttribute("target", "_blank");
    await expect(
      contact.getByRole("link", { name: "linkedin.com/in/Eleutherio", exact: true }),
    ).toHaveAttribute("href", "https://www.linkedin.com/in/guifer-dev/");
    await expect(contact.getByRole("form", { name: "Formulário de contato" })).toBeVisible();

    const notice = contact.getByText(/^Protegido por reCAPTCHA/);
    await expect(notice).toHaveCSS("font-size", "11px");
    expect(
      await notice.evaluate((element) => {
        const button = element.closest("form")?.querySelector('button[type="submit"]');
        return Boolean(
          button && element.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING,
        );
      }),
    ).toBe(true);

    const name = page.locator("#contact-name");
    const borderBefore = await name.evaluate(
      (element) => getComputedStyle(element).borderBottomColor,
    );
    await name.focus();
    await expect
      .poll(() => name.evaluate((element) => getComputedStyle(element).borderBottomColor))
      .not.toBe(borderBefore);
    const focusStyle = await name.evaluate((element) => {
      const style = getComputedStyle(element);
      return { boxShadow: style.boxShadow, outlineStyle: style.outlineStyle };
    });
    expect(focusStyle.outlineStyle).toBe("none");
    expect(focusStyle.boxShadow).toBe("none");
    await runAxe(page, testInfo, "contact-whatsapp-focus", "#contato");
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
    await expect(
      page.locator("#contato").getByRole("link", { name: "(51) 99405-5984", exact: true }).last(),
    ).toHaveAttribute("href", "https://wa.me/5551994055984");
    await runAxe(page, testInfo, "contact-success");
  });

  test("formulário bloqueia envios concorrentes enquanto carrega a validação", async ({ page }) => {
    await installRecaptchaStub(page);
    let contactRequests = 0;
    await page.route("**/api/contact", async (route) => {
      contactRequests += 1;
      await new Promise((resolve) => setTimeout(resolve, 1_500));
      await route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });
    await openPage(page, "/");
    await fillValidContactForm(page);

    const form = page.locator("#contato form");
    await form.evaluate((element) => {
      if (!(element instanceof HTMLFormElement)) return;
      element.requestSubmit();
      element.requestSubmit();
    });

    await expect(form.locator('button[type="submit"]')).toBeDisabled();
    await expect(page.getByRole("status")).toContainText("mensagem enviada");
    expect(contactRequests).toBe(1);
  });

  test("falha ao carregar a validação do contato é anunciada", async ({ page }) => {
    await page.route(/\/src\/lib\/contact-contract\.ts(?:\?|$)/u, async (route) => route.abort());
    await openPage(page, "/");
    await fillValidContactForm(page);
    await page.getByRole("button", { name: "enviar mensagem" }).click();

    await expect(page.getByRole("status")).toContainText("algo deu errado");
    await expect(page.getByRole("button", { name: "enviar mensagem" })).toBeEnabled();
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
      await expect(page.locator("#contato form")).toHaveCSS("opacity", "1");
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

  test("roadmap e carrosséis permanecem acessíveis após navegação", async ({ page }, testInfo) => {
    await openPage(page, "/", { width: 375, height: 900 });
    const roadmap = page.locator("#trajetoria ol");
    await roadmap.evaluate((element) => {
      element.scrollLeft = element.scrollWidth;
    });
    await page.getByRole("button", { name: "Próxima página de projetos" }).click();
    await expect(
      page.locator("#projetos").getByRole("heading", { name: "Landing page para chaveiro 24h" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Exibir próximo depoimento" }).click();
    await expect(page.locator("#depoimentos figure")).toContainText("Martha Izabel");
    await runAxe(page, testInfo, "carousels-next");
  });

  test("carrossel de projetos responde a teclado, roda e mantém o ciclo infinito", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "/", { width: 1440, height: 900 });

    const section = page.locator("#projetos");
    const rail = section.getByRole("region", { name: "Carrossel vertical de projetos" });
    const previous = section.getByRole("button", { name: "Página anterior de projetos" });
    const next = section.getByRole("button", { name: "Próxima página de projetos" });
    const activePreview = section.locator('a[aria-current="true"]');
    const activeDestination = () => activePreview.getAttribute("data-cursor-open");

    await section.scrollIntoViewIfNeeded();
    await expect(rail).toHaveCSS("overflow-y", "auto");
    await expect(rail).toHaveCSS("touch-action", "pan-y");
    await expect(rail).toHaveAttribute("tabindex", "0");

    const initial = await activeDestination();
    expect(initial).toBeTruthy();
    await rail.focus();
    await rail.press("ArrowDown");
    await expect.poll(activeDestination).not.toBe(initial);
    const second = await activeDestination();

    await rail.press("ArrowUp");
    await expect.poll(activeDestination).toBe(initial);

    await rail.hover();
    await page.mouse.wheel(0, 520);
    await expect.poll(activeDestination).toBe(second);

    await previous.click();
    await expect.poll(activeDestination).toBe(initial);
    for (let step = 0; step < 3; step += 1) {
      await next.click();
      await page.waitForTimeout(180);
    }
    await expect.poll(activeDestination).toBe(initial);
    await expect(
      section.locator('.projects-carousel__slide:not([aria-hidden="true"])'),
    ).toHaveCount(1);
    await expect(section.locator('a[aria-current="true"]')).toHaveCount(1);
  });

  test("contadores e scrambles pausam fora da seção e executam somente uma vez", async ({
    page,
  }) => {
    await openPage(page, "/", { width: 1440, height: 900 });

    const section = page.locator("#trajetoria");
    const statValues = section.locator('header ul strong > span[aria-hidden="true"]');
    const yearValues = section.locator('ol time > span[aria-hidden="true"]');
    const visualLabels = section.locator(
      'header ul > li > span.grid > span:last-child span[aria-hidden="true"]',
    );

    await expect(section).toHaveAttribute("data-runtime-activity", "paused");
    await expect(statValues).toHaveText(["+0h", "0", "0", "A1"]);
    await expect(yearValues).toHaveText(["2000", "2000", "2000"]);
    await page.waitForTimeout(500);
    await expect(statValues).toHaveText(["+0h", "0", "0", "A1"]);

    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveAttribute("data-runtime-activity", "active");
    await expect
      .poll(async () => {
        const value = (await statValues.first().textContent()) ?? "";
        return Number.parseInt(value.replace(/\D/gu, ""), 10);
      })
      .toBeGreaterThan(0);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
    await expect(section).toHaveAttribute("data-runtime-activity", "paused");
    await page.waitForTimeout(100);
    const pausedValues = await statValues.allTextContents();
    await page.waitForTimeout(500);
    await expect(statValues).toHaveText(pausedValues);

    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveAttribute("data-runtime-activity", "active");
    await expect(statValues).toHaveText(["+960h", "3", "2", "C1"], { timeout: 3_000 });
    await expect(yearValues).toHaveText(["2023", "2025", "2026"]);
    await expect(visualLabels).toHaveText([
      "de formação complementar",
      "programas de formação e certificação",
      "experiências profissionais",
      "inglês técnico",
    ]);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
    await expect(section).toHaveAttribute("data-runtime-activity", "paused");
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveAttribute("data-runtime-activity", "active");
    await expect(statValues).toHaveText(["+960h", "3", "2", "C1"]);
    await expect(yearValues).toHaveText(["2023", "2025", "2026"]);
    await expect(visualLabels).toHaveText([
      "de formação complementar",
      "programas de formação e certificação",
      "experiências profissionais",
      "inglês técnico",
    ]);
  });

  test("header recolhe a faixa e revela os controles sem perder o wordmark", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900, loadDeferredSections: false });

    const header = page.getByRole("banner");
    const logo = header.locator('a:has([data-wordmark="guifer.tech"])');
    const right = header.locator("[data-header-right]");
    const tech = logo.locator('[data-wordmark-part="tech"]');

    await expect(right).toHaveCSS("opacity", "1");
    await expect(tech).toHaveText(".tech", { timeout: 2_000 });
    await page.evaluate(() => window.scrollTo({ top: 700, behavior: "auto" }));
    await expect(header).toHaveClass(/backdrop-blur-none/);
    await expect(header).toHaveClass(/bg-transparent/);
    await expect(right).toHaveCSS("opacity", "0");
    await expect(logo).toBeVisible();
    await expect(tech).toHaveText("", { timeout: 2_000 });

    await logo.hover();
    await expect(right).toHaveCSS("opacity", "1");
    await expect(header).toHaveClass(/backdrop-blur-md/);
    await expect(tech).toHaveText(".tech", { timeout: 2_000 });

    await page.mouse.move(720, 180);
    await expect(right).toHaveCSS("opacity", "0");
    await expect(header).toHaveClass(/backdrop-blur-none/);

    await page.mouse.move(720, 5);
    await expect(right).toHaveCSS("opacity", "1");
    await page.mouse.move(720, 180);
    await expect(right).toHaveCSS("opacity", "0");

    await logo.focus();
    await expect(logo).toBeFocused();
    await expect(right).toHaveCSS("opacity", "1");
    await expect(header).toHaveClass(/backdrop-blur-md/);
  });

  test("depoimentos preservam altura, seleção direta e ciclo infinito", async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "/", { width: 1440, height: 900 });

    const section = page.locator("#depoimentos");
    const figure = section.locator("figure");
    const dots = section.getByRole("button", { name: /Exibir depoimento \d/ });
    const next = section.getByRole("button", { name: "Exibir próximo depoimento" });

    await section.scrollIntoViewIfNeeded();
    await expect(dots).toHaveCount(4);
    await expect(figure).toContainText("Bruna Vizzotto");
    const initialSectionHeight = await section.evaluate(
      (element) => element.getBoundingClientRect().height,
    );
    const initialFigureHeight = await figure.evaluate(
      (element) => element.getBoundingClientRect().height,
    );

    await dots.nth(3).click();
    await expect(dots.nth(3)).toHaveAttribute("aria-current", "true");
    await expect(figure).toContainText("Tainara Conrad Bassani");
    await next.click();
    await expect(figure).toContainText("Bruna Vizzotto");
    await expect(dots.nth(0)).toHaveAttribute("aria-current", "true");

    expect(await section.evaluate((element) => element.getBoundingClientRect().height)).toBe(
      initialSectionHeight,
    );
    expect(await figure.evaluate((element) => element.getBoundingClientRect().height)).toBe(
      initialFigureHeight,
    );
    await runAxe(page, testInfo, "testimonials-carousel", "#depoimentos");
  });

  test("depoimentos avançam automaticamente e pausam durante interação", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900 });

    const section = page.locator("#depoimentos");
    const figure = section.locator("figure");
    await section.scrollIntoViewIfNeeded();
    await expect(figure).toContainText("Bruna Vizzotto");

    await expect(figure).toContainText("Martha Izabel", { timeout: 11_000 });

    await section.hover();
    await page.waitForTimeout(9_500);
    await expect(figure).toContainText("Martha Izabel");

    await page.getByRole("button", { name: "Acessibilidade", exact: true }).hover();
    await expect(figure).toContainText("Alecsandra Klatt Martins", { timeout: 11_000 });

    const next = section.getByRole("button", { name: "Exibir próximo depoimento" });
    await next.focus();
    await page.waitForTimeout(9_500);
    await expect(figure).toContainText("Alecsandra Klatt Martins");
  });

  test("preview em vídeo toca somente no projeto ativo e pausa fora da seção", async ({ page }) => {
    await page.addInitScript(() => {
      HTMLMediaElement.prototype.play = async function play() {
        this.dataset.testPlayback = "playing";
      };
      HTMLMediaElement.prototype.pause = function pause() {
        this.dataset.testPlayback = "paused";
      };
    });
    await openPage(page, "/", {
      width: 1440,
      height: 900,
      loadDeferredSections: false,
    });
    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent("portfolio:load-deferred-section", { detail: "projetos" }),
      );
    });

    const section = page.locator("#projetos");
    await expect(section.locator('[data-projects-hydrated="true"]')).toBeAttached();
    const videos = section.locator("video");
    await expect(videos).toHaveCount(9);
    for (const video of await videos.all()) {
      await expect(video).toHaveAttribute("loop", "");
      await expect(video).toHaveAttribute("playsinline", "");
      expect(await video.evaluate((element) => element.muted)).toBe(true);
    }

    await section.scrollIntoViewIfNeeded();
    await section.locator('a[aria-current="true"]').hover();
    await expect
      .poll(() =>
        videos.evaluateAll(
          (elements) => elements.filter((video) => video.dataset.testPlayback === "playing").length,
        ),
      )
      .toBe(1);
    const firstPlayingSource = await videos.evaluateAll((elements) =>
      elements.find((video) => video.dataset.testPlayback === "playing")?.getAttribute("src"),
    );

    await section.getByRole("button", { name: "Próxima página de projetos" }).click();
    await expect
      .poll(() =>
        videos.evaluateAll(
          (elements) => elements.filter((video) => video.dataset.testPlayback === "playing").length,
        ),
      )
      .toBe(1);
    await expect
      .poll(() =>
        videos.evaluateAll((elements) =>
          elements.find((video) => video.dataset.testPlayback === "playing")?.getAttribute("src"),
        ),
      )
      .not.toBe(firstPlayingSource);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(section).toHaveAttribute("data-runtime-activity", "paused");
    await expect
      .poll(() =>
        videos.evaluateAll(
          (elements) => elements.filter((video) => video.dataset.testPlayback === "playing").length,
        ),
      )
      .toBe(0);
  });

  test("preview H.264 real carrega, avança e pausa fora da seção", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "webkit",
      "O WebKit distribuído pelo Playwright no Windows não inclui backend H.264 funcional.",
    );
    await openPage(page, "/", {
      width: 1440,
      height: 900,
      loadDeferredSections: false,
      loadMedia: true,
    });
    await page.evaluate(() => {
      window.dispatchEvent(
        new CustomEvent("portfolio:load-deferred-section", { detail: "projetos" }),
      );
    });

    const section = page.locator("#projetos");
    await expect(section.locator('[data-projects-hydrated="true"]')).toBeAttached();
    await section.scrollIntoViewIfNeeded();
    const activeVideo = section.locator('a[aria-current="true"] video');
    await expect(activeVideo).toHaveCount(1);
    await expect(activeVideo).toBeVisible();
    await section.locator('a[aria-current="true"]').hover();
    await expect
      .poll(() => activeVideo.evaluate((video) => video.readyState), { timeout: 30_000 })
      .toBeGreaterThanOrEqual(2);
    await expect.poll(() => activeVideo.evaluate((video) => video.error?.code ?? null)).toBeNull();
    await expect.poll(() => activeVideo.evaluate((video) => video.paused)).toBe(false);

    const initialTime = await activeVideo.evaluate((video) => video.currentTime);
    await page.waitForTimeout(500);
    await expect
      .poll(() => activeVideo.evaluate((video) => video.currentTime))
      .toBeGreaterThan(initialTime);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
    await expect(section).toHaveAttribute("data-runtime-activity", "paused");
    await expect.poll(() => activeVideo.evaluate((video) => video.paused)).toBe(true);
  });

  test("álbum narrativo mantém capítulos, imagens e seletor acessíveis", async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "/sobre", { width: 1440, height: 900 });

    const about = page.locator("#sobre");
    await expect(
      about.getByRole("heading", { level: 1, name: "Quem sou, o que faço e porquê:" }),
    ).toBeVisible();
    await expect(about.locator("[data-about-chapter]")).toHaveCount(5);

    for (const title of [
      "Educação e formação",
      "Tecnologia desde cedo",
      "Responsabilidade profissional",
      "Objetivo profissional",
      "Curiosidades sobre mim",
    ]) {
      await expect(about.getByRole("heading", { level: 2, name: title })).toBeAttached();
    }

    await expect(about.locator("[data-about-album]")).toHaveCount(3);
    await expect(
      about.locator('[data-about-chapter="3"]').getByRole("region", { name: /Álbum de fotos/ }),
    ).toHaveCount(0);
    await expect(
      about.locator('[data-about-chapter="5"]').getByRole("region", { name: /Álbum de fotos/ }),
    ).toHaveCount(0);

    const educationSelector = about.getByRole("group", {
      name: "Selecionar foto: Educação e formação",
    });
    const educationAlbum = about.locator('[data-about-album="Educação e formação"]');
    await expect(educationSelector).toHaveCount(1);
    const educationThumbnails = educationSelector.getByRole("button");
    await expect(educationThumbnails).toHaveCount(5);
    await expect(educationThumbnails.first()).toHaveAttribute("aria-current", "true");
    const initialCaptionHeight = await educationAlbum
      .locator("figcaption")
      .evaluate((caption) => caption.getBoundingClientRect().height);

    const selector = about.getByRole("group", {
      name: "Selecionar foto: Tecnologia desde cedo",
    });
    await expect(selector).toHaveCount(1);
    await expect(selector.getByRole("button")).toHaveCount(3);
    const firstThumbnail = selector.getByRole("button", { name: /^Exibir foto 1:/ });
    const secondThumbnail = selector.getByRole("button", { name: /^Exibir foto 2:/ });
    const thirdThumbnail = selector.getByRole("button", { name: /^Exibir foto 3:/ });
    await expect(firstThumbnail).toHaveAttribute("aria-current", "true");
    await expect(secondThumbnail).not.toHaveAttribute("aria-current");
    await expect(thirdThumbnail).not.toHaveAttribute("aria-current");

    const firstImage = about.getByRole("img", {
      name: "Fachada iluminada do Espaço Unisinos durante a noite.",
    });
    await expect(firstImage).toHaveAttribute("width", "800");
    await expect(firstImage).toHaveAttribute("height", "1000");
    await expect(firstImage).toHaveAttribute("loading", "eager");
    await expect(firstImage).toHaveAttribute("decoding", "async");
    await expect(page.locator('link[rel="preload"][as="image"]')).toHaveAttribute(
      "href",
      /unisinos-campus/,
    );

    const fifthEducationThumbnail = educationThumbnails.nth(4);
    await fifthEducationThumbnail.click();
    await expect(fifthEducationThumbnail).toHaveAttribute("aria-current", "true");
    await expect(
      about.getByRole("img", {
        name: "Guilherme apresentando o projeto GrenGame com um microfone.",
      }),
    ).toBeVisible();
    const updatedCaptionHeight = await educationAlbum
      .locator("figcaption")
      .evaluate((caption) => caption.getBoundingClientRect().height);
    expect(Math.abs(updatedCaptionHeight - initialCaptionHeight)).toBeLessThan(1);

    await secondThumbnail.click();
    await expect(secondThumbnail).toHaveAttribute("aria-current", "true");
    await expect(
      about.getByRole("img", {
        name: "Placa-mãe de notebook com grande acúmulo de oxidação após permanecer submersa na enchente.",
      }),
    ).toBeVisible();

    await thirdThumbnail.click();
    await expect(thirdThumbnail).toHaveAttribute("aria-current", "true");
    await expect(
      about.getByRole("img", {
        name: "Notebook Acer inicializando o Windows após a manutenção.",
      }),
    ).toBeVisible();
    await page.waitForTimeout(500);
    await expect(thirdThumbnail).toHaveAttribute("aria-current", "true");

    await thirdThumbnail.press("ArrowLeft");
    await expect(secondThumbnail).toBeFocused();
    await expect(secondThumbnail).toHaveAttribute("aria-current", "true");
    const thumbnailBox = await secondThumbnail.boundingBox();
    expect(thumbnailBox?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(thumbnailBox?.height ?? 0).toBeGreaterThanOrEqual(44);
    await runAxe(page, testInfo, "about-album", "#sobre");

    for (const width of [320, 768, 1440]) {
      await openPage(page, "/sobre", { width, height: 900 });
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
    }

    await openPage(page, "/sobre", { language: "en", width: 320, height: 900 });
    await expect(
      page.locator("#sobre").getByRole("heading", {
        level: 2,
        name: "Professional responsibility",
      }),
    ).toBeAttached();
  });

  test("footer exibe selo sustentável e links legais padronizados", async ({ page }, testInfo) => {
    await openPage(page, "/", { width: 320, height: 900 });
    const footer = page.locator("footer");
    const accessibility = footer.getByRole("link", { name: "Acessibilidade", exact: true });
    const privacy = footer.getByRole("button", { name: "Privacidade", exact: true });
    const badge = footer.getByRole("img", {
      name: "This website runs on green hosting - verified by thegreenwebfoundation.org",
    });

    await expect(accessibility).toBeVisible();
    await expect(privacy).toBeVisible();
    await expect(badge).toBeVisible();
    await expect(badge).toHaveAttribute(
      "src",
      "https://app.greenweb.org/api/v3/greencheckimage/guifer.tech?nocache=true",
    );
    await expect(badge).toHaveAttribute("width", "200");
    await expect(badge).toHaveAttribute("height", "95");
    await expect(badge).toHaveAttribute("loading", "lazy");
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
    await expect(footer.getByText(/Porto Alegre .* Local time:/)).toBeVisible();
    await expect(footer.getByText("Thanks for stopping by", { exact: false })).toHaveCount(0);
  });

  test("badge Website Carbon preserva nota, escala oficial e privacidade", async ({ page }) => {
    let carbonApiRequests = 0;
    page.on("request", (request) => {
      if (request.url().startsWith("https://api.websitecarbon.com/")) carbonApiRequests += 1;
    });

    await openPage(page, "/", { width: 1440, height: 900 });
    const reportUrl = "https://www.websitecarbon.com/website/guifer-tech/";
    const badge = page.locator(`footer a[href="${reportUrl}"]`);
    await expect(badge).toBeVisible();
    await expect(badge).toHaveAccessibleName(
      /Nota C\. 0,20 g de CO₂\/visita\. Mais limpa que 54% das páginas testadas/,
    );

    const gradeColors = {
      "A+": "#00f5bd",
      A: "#54f56f",
      B: "#9bfb35",
      C: "#caff00",
      D: "#f5f000",
      E: "#ffb800",
      F: "#ff2028",
    } as const;
    const cacheKey = "website-carbon:grade:https://guifer.tech/";

    for (const [grade, color] of Object.entries(gradeColors)) {
      await page.evaluate(
        ({ key, nextGrade }) => {
          localStorage.setItem(
            key,
            JSON.stringify({
              grade: nextGrade,
              carbon: 0.02,
              cleanerThan: 98,
              measuredAt: Date.now(),
              lastAttemptAt: Date.now(),
              source: "api",
            }),
          );
        },
        { key: cacheKey, nextGrade: grade },
      );
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(page.locator("main#main")).toBeVisible();
      await page.evaluate(() => {
        window.dispatchEvent(
          new CustomEvent("portfolio:load-deferred-section", { detail: "rodape" }),
        );
      });
      await expect(badge).toBeAttached();
      await badge.scrollIntoViewIfNeeded();
      await expect(badge.locator(":scope > span > span").first()).toHaveText(grade);
      await expect
        .poll(() =>
          badge.evaluate((element) => getComputedStyle(element).getPropertyValue("--carbon-grade")),
        )
        .toBe(color);
    }

    expect(carbonApiRequests).toBe(0);

    await openPage(page, "/", { language: "en" });
    await badge.scrollIntoViewIfNeeded();
    await expect(badge).toHaveAccessibleName(
      /Grade F\. 0\.02 g of CO₂\/view\. Cleaner than 98% of pages tested/,
    );

    await openPage(page, "/privacidade", { language: "pt" });
    await expect(page.getByText(/Website Carbon \/ Wholegrain Digital/)).toBeVisible();
    await expect(page.getByText(/nota fica armazenada no navegador por até 7 dias/)).toBeVisible();
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

  test("home carrega seções e atividade do footer somente por proximidade", async ({ page }) => {
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
    await expect(footer).toHaveCount(0);
    expect(requestedModules.some((url) => url.includes("/sections/Contact.tsx"))).toBe(false);
    expect(healthRequests).toBe(0);

    await page.locator('[data-deferred-section="contato"]').scrollIntoViewIfNeeded();
    await expect(page.locator("#contact-name")).toBeAttached();
    expect(requestedModules.some((url) => url.includes("/sections/Contact.tsx"))).toBe(true);

    await page.locator('[data-deferred-section="rodape"]').scrollIntoViewIfNeeded();
    await expect(footer).toBeAttached();
    await expect(footer).toHaveAttribute("data-runtime-activity", "active");
    await expect.poll(() => healthRequests).toBeGreaterThan(0);

    await page.locator("#home").scrollIntoViewIfNeeded();
    await expect(footer).toHaveAttribute("data-runtime-activity", "paused");
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
      .toContain("-400w.avif");
    await expect(
      page.locator('picture source:not([srcset]), picture source[srcset=""]'),
    ).toHaveCount(0);
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
