import { expect, openPage, runAxe, test } from "./support/portfolio";

test.describe("WCAG 2.2 AA — estados interativos", () => {
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
    await expect(page.locator("#depoimentos figure")).toContainText("Leonardo Alvarez");
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
    await expect(dots).toHaveCount(6);
    await expect(figure).toContainText("Bruna Vizzotto");
    const initialSectionHeight = await section.evaluate(
      (element) => element.getBoundingClientRect().height,
    );
    const initialFigureHeight = await figure.evaluate(
      (element) => element.getBoundingClientRect().height,
    );

    await dots.nth(1).click();
    await expect(figure).toContainText("Leonardo Alvarez Pereira Gomes");
    await expect(figure).toContainText("Sistema Ocergs · Especialista de Tecnologia da Informação");
    await expect(figure).toContainText("21/08/2026");
    await expect(figure).toContainText("Tens demonstrado comprometimento");
    const leonardoPhoto = figure.getByRole("img", {
      name: "Foto de Leonardo Alvarez Pereira Gomes",
    });
    await expect(leonardoPhoto).toBeVisible();
    expect(
      await leonardoPhoto.evaluate((image) => (image as HTMLImageElement).currentSrc),
    ).toContain("leonardo-alvarez-pereira-gomes-96w");

    await dots.nth(2).click();
    await expect(figure).toContainText("17/07/2026");
    await expect(figure).toContainText("Gostaria de registrar meu reconhecimento");

    await dots.nth(5).click();
    await expect(dots.nth(5)).toHaveAttribute("aria-current", "true");
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
    await page.clock.install();
    await openPage(page, "/", { width: 1440, height: 900 });

    const section = page.locator("#depoimentos");
    const figure = section.locator("figure");
    await section.scrollIntoViewIfNeeded();
    await expect(figure).toContainText("Bruna Vizzotto");

    await page.clock.runFor(9_500);
    await expect(figure).toContainText("21/08/2026");

    await section.hover();
    await page.clock.runFor(9_500);
    await expect(figure).toContainText("21/08/2026");

    await page.getByRole("button", { name: "Acessibilidade", exact: true }).hover();
    await page.clock.runFor(9_500);
    await expect(figure).toContainText("17/07/2026");

    const next = section.getByRole("button", { name: "Exibir próximo depoimento" });
    await next.focus();
    await page.clock.runFor(9_500);
    await expect(figure).toContainText("17/07/2026");
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
});
