import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page, type TestInfo } from "@playwright/test";
import sharp from "sharp";

export type Language = "pt" | "en";
export type Theme = "light" | "dark";
type Rgb = [number, number, number];

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];
const SIMPLE_TOOLTIP_FORBIDDEN = /Brevo|Supabase|Render|Google|[—–]|\p{Extended_Pictographic}/u;
export const ROUTES = [
  "/",
  "/sobre",
  "/projetos/grengame",
  "/projetos/abriu-chaveiro",
  "/projetos/martha-izabel",
  "/acessibilidade",
  "/privacidade",
  "/rota-inexistente",
] as const;
export const MODES = [
  { language: "pt" as const, theme: "light" as const, viewport: "desktop" as const },
  { language: "pt" as const, theme: "dark" as const, viewport: "desktop" as const },
  { language: "en" as const, theme: "light" as const, viewport: "desktop" as const },
  { language: "en" as const, theme: "dark" as const, viewport: "desktop" as const },
  { language: "pt" as const, theme: "light" as const, viewport: "mobile" as const },
  { language: "pt" as const, theme: "dark" as const, viewport: "mobile" as const },
  { language: "en" as const, theme: "light" as const, viewport: "mobile" as const },
  { language: "en" as const, theme: "dark" as const, viewport: "mobile" as const },
];
const IMAGE_STUB = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+Xn0X9QAAAABJRU5ErkJggg==",
  "base64",
);

test.beforeEach(async ({ page }) => {
  await page.route("https://app.greenweb.org/api/v3/greencheckimage/guifer.tech", async (route) => {
    await route.fulfill({ status: 200, contentType: "image/png", body: IMAGE_STUB });
  });
});

export function parseHexColor(value: string): Rgb {
  const normalized = value.trim().replace(/^#/u, "");
  expect(normalized).toMatch(/^[\da-f]{6}$/iu);
  return [0, 2, 4].map((offset) =>
    Number.parseInt(normalized.slice(offset, offset + 2), 16),
  ) as Rgb;
}

function relativeLuminance([red, green, blue]: Rgb) {
  const linearize = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
}

export function contrastRatio(foreground: Rgb, background: Rgb) {
  const values = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (left, right) => right - left,
  );
  return (values[0] + 0.05) / (values[1] + 0.05);
}

export function compositeColor(foreground: Rgb, background: Rgb, alpha: number): Rgb {
  return foreground.map((channel, index) =>
    Math.round(channel * alpha + background[index] * (1 - alpha)),
  ) as Rgb;
}

export function serializeRgb([red, green, blue]: Rgb) {
  return `rgb(${red}, ${green}, ${blue})`;
}

export async function openPage(
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

export async function openAccessibilityWidget(page: Page) {
  await page.locator("#accessibility-widget-launcher").click();
  const host = page.locator("#acc-widget-host");
  await expect(host).toBeAttached();
  await expect(host.locator(".acc-menu")).toBeVisible();
  return host;
}

export async function runAxe(page: Page, testInfo: TestInfo, label: string, include?: string) {
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

export async function installRecaptchaStub(page: Page, token = "playwright-recaptcha-token") {
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

export async function fillValidContactForm(page: Page) {
  await page.locator("#contact-name").fill("Guilherme Teste");
  await page.locator("#contact-email").fill("guilherme@example.com");
  await page.locator("#contact-subject").fill("Contato pelo portfólio");
  await page
    .locator("#contact-message")
    .fill("Esta mensagem possui tamanho suficiente para validar o formulário.");
}

export async function screenshotPixel(page: Page, x: number, y: number) {
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

export async function expectFocusedTooltip(button: Locator, description: string) {
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

export { expect, test };
