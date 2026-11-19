import { expect, openPage, test } from "./support/portfolio";

const TOUCH_ROUTES = [
  "/",
  "/sobre",
  "/projetos/grengame",
  "/acessibilidade",
  "/privacidade",
] as const;

test.describe("RESP-05 — entradas touch", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 375, height: 812 } });

  for (const route of TOUCH_ROUTES) {
    for (const viewport of [
      { name: "mobile", width: 375, height: 812 },
      { name: "tablet", width: 768, height: 1024 },
    ] as const) {
      test(`${route} preserva alvos estruturais de 44 × 44 px no ${viewport.name}`, async ({
        page,
      }) => {
        await openPage(page, route, { width: viewport.width, height: viewport.height });
        await page.locator("footer").scrollIntoViewIfNeeded();

        const undersized = await page.evaluate(() => {
          const candidates = document.querySelectorAll<HTMLElement>(
            "a[href], button, input:not([type='hidden']), textarea",
          );
          return [...candidates].flatMap((element, index) => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            const labelRect = element.closest("label")?.getBoundingClientRect();
            const inlineTextTarget = style.display === "inline" || Boolean(element.closest("p"));
            const compactLabeledControl =
              element.matches("input[type='checkbox'], input[type='radio']") &&
              Boolean(labelRect && labelRect.width >= 24 && labelRect.height >= 24);
            const rendered =
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              Number.parseFloat(style.opacity || "1") > 0.01 &&
              rect.width > 0 &&
              rect.height > 0 &&
              !element.closest("[hidden], [inert], [aria-hidden='true']");
            if (
              !rendered ||
              element.classList.contains("sr-only") ||
              inlineTextTarget ||
              compactLabeledControl ||
              (rect.width >= 43.5 && rect.height >= 43.5)
            )
              return [];
            return [
              {
                index,
                tag: element.tagName.toLowerCase(),
                label:
                  element.getAttribute("aria-label") ?? element.textContent?.trim().slice(0, 70),
                width: Math.round(rect.width * 10) / 10,
                height: Math.round(rect.height * 10) / 10,
              },
            ];
          });
        });

        expect(undersized).toEqual([]);
      });
    }
  }

  test("projetos e depoimentos permanecem operáveis sem hover", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "/", { width: 375, height: 812 });
    await expect(page.locator("#custom-cursor")).toHaveCount(0);

    const projects = page.locator("#projetos");
    await projects.scrollIntoViewIfNeeded();
    await expect(projects.locator("[data-project-card]")).toHaveCount(3);
    await expect(projects.locator("video[src]")).toHaveCount(0);
    for (const title of ["GrenGame", "Website Abriu Chaveiro ®", "Portfólio profissional"]) {
      await expect(projects.getByRole("heading", { name: title })).toBeVisible();
    }

    const testimonials = page.locator("#depoimentos");
    await testimonials.scrollIntoViewIfNeeded();
    await testimonials.getByRole("button", { name: "Exibir próximo depoimento" }).tap();
    await expect(testimonials.locator("figure:not([aria-hidden])")).toContainText(
      "Leonardo Alvarez",
    );
  });
});

test.describe("RESP-05 — conteúdo variável", () => {
  test("troca PT/EN preservando viewport e conteúdo localizado após recarga", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "/", {
      language: "pt",
      width: 640,
      height: 900,
      preservePreferences: true,
    });
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(
      page.getByText("Tecnologia para conectar pessoas, ideias e negócios.", { exact: true }),
    ).toBeVisible();
    await expect(page.locator("#projetos")).toContainText("GrenGame");

    await page.locator('header a:has([data-wordmark="guifer.tech"])').focus();
    await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
    await page.getByRole("button", { name: "Mudar idioma" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.locator("#site-preloader").waitFor({ state: "detached", timeout: 60_000 });
    expect(page.viewportSize()).toEqual({ width: 640, height: 900 });
    await expect(
      page.getByText("Innovation, strategy, and software development.", { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Download resume (PDF)" })).toBeVisible();
    await expect(page.locator("#projetos")).toContainText(
      "Selected case studies detailing the context, the choices made, and the final deliverables for each project.",
    );
    await expect(page.locator("#projetos")).toContainText("GrenGame");
    await expect(page.locator("#projetos")).toContainText("Abriu Chaveiro® website");
    await expect(page.locator("#projetos")).toContainText("Professional portfolio");
    await expect(page.locator("#depoimentos h2")).toHaveText(
      "A few testimonials from people who know my work.",
    );
    await expect(page.locator("#depoimentos")).toContainText(
      "We had the opportunity to work together",
    );
    await expect(page.locator("#contato")).toContainText(
      "Feel free to reach out to discuss a project or ask any questions. I’m open to new opportunities.",
    );
  });

  test("reflow equivalente a 200% de zoom não cria rolagem horizontal", async ({ page }) => {
    // Em 200% de zoom, um viewport físico de 1280 px oferece 640 CSS px ao layout.
    await openPage(page, "/", { language: "en", width: 640, height: 900 });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
  });
});
