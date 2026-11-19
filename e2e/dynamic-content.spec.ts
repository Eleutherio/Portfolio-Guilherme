import { expect, openPage, runAxe, test } from "./support/portfolio";

test.describe("WCAG 2.2 AA — estados interativos", () => {
  test("Sobre, grade de projetos e depoimentos permanecem acessíveis", async ({
    page,
  }, testInfo) => {
    await openPage(page, "/", { width: 375, height: 900 });
    await expect(page.locator("#trajetoria")).toHaveCount(0);
    await expect(page.locator("#sobre")).toBeAttached();
    await expect(page.locator("#habilidades-heading")).toBeAttached();
    const projects = page.locator("#projetos");
    await projects.scrollIntoViewIfNeeded();
    await expect(projects.locator("[data-project-card]")).toHaveCount(3);
    await expect(projects.getByRole("heading", { name: "GrenGame" })).toBeVisible();
    await expect(projects.getByRole("heading", { name: "Website Abriu Chaveiro ®" })).toBeVisible();
    await expect(projects.getByRole("heading", { name: "Portfólio profissional" })).toBeVisible();
    await page.getByRole("button", { name: "Exibir próximo depoimento" }).click();
    await expect(page.locator("#depoimentos figure:not([aria-hidden])")).toContainText(
      "Leonardo Alvarez",
    );
    await runAxe(page, testInfo, "dynamic-sections");
  });

  test("acordeão renderiza cada projeto uma vez e mantém navegação por teclado", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "/", { width: 1440, height: 900 });

    const section = page.locator("#projetos");
    await section.scrollIntoViewIfNeeded();
    const cards = section.locator("[data-project-card]");
    await expect(cards).toHaveCount(3);
    expect(
      await cards.evaluateAll((elements) => elements.map((card) => card.dataset.projectCard)),
    ).toEqual(["grengame", "abriu-chaveiro", "martha-izabel"]);
    await expect(section.locator('[data-project-variant="showcase"]')).toHaveCount(3);
    await expect(cards.first()).toHaveAttribute("data-project-active", "true");
    await expect(section.locator(".projects-carousel__rail")).toHaveCount(0);
    await expect(section.getByRole("button", { name: /página de projetos/i })).toHaveCount(0);

    const previews = section.locator("[data-project-preview]");
    await previews.first().focus();
    await expect(previews.first()).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(previews.nth(1)).toBeFocused();
    await expect(cards.nth(1)).toHaveAttribute("data-project-active", "true");
  });

  test("Sobre preserva apresentação, foto, ações e café sem bloquear seções seguintes", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "/", { width: 1440, height: 900 });
    const about = page.locator("#sobre");
    await expect(about.locator(".about-template__intro")).toContainText("Guilherme Eleuthério");
    await expect(about.locator(".about-template__portrait img")).toHaveAttribute(
      "alt",
      /Guilherme/,
    );
    await expect(about.getByRole("link", { name: "Conhecer minha trajetória" })).toHaveAttribute(
      "href",
      "/sobre",
    );
    await expect(about.locator("[data-resume-download]")).toHaveAttribute(
      "download",
      "Guilherme-Eleutherio-Curriculo.pdf",
    );
    await expect(about.locator("[data-about-coffee]")).toBeAttached();
    await expect(about.locator("[data-about-stats], [data-about-tech-stack]")).toHaveCount(0);
    for (const id of ["projetos", "habilidades", "depoimentos", "contato"]) {
      const section = page.locator("#" + id);
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
    }
    await expect(page.locator(".services-section__services > li")).toHaveCount(4);
    await expect(page.locator("#contato form")).toBeVisible();
  });

  test("Sobre centraliza conteúdo e mantém hierarquia MIV em PT/EN", async ({ page }) => {
    for (const language of ["pt", "en"] as const) {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await openPage(page, "/", {
        language,
        theme: language === "pt" ? "light" : "dark",
        width: 1440,
        height: 900,
      });
      const content = page.locator(".about-template__content");
      await content.scrollIntoViewIfNeeded();
      await expect(content.locator("h3")).toContainText(
        language === "pt"
          ? "Olá, eu me chamo Guilherme Eleuthério"
          : "Hello, my name is Guilherme Eleuthério",
      );
      await expect(content).toHaveCSS("text-align", "center");
      await expect(content.locator("h3")).toHaveCSS("font-family", /DM Sans Subset/);
      await expect(content.locator(".body-copy").first()).toHaveCSS("font-family", /Space Grotesk/);
      await expect(content.locator(".about-template__role")).toHaveCSS("font-weight", "400");
      await expect(content.locator(".about-template__social-links a")).toHaveCount(3);
    }
  });

  test("Sobre mantém retrato quadrado invertido e conteúdo contido no reflow", async ({ page }) => {
    for (const width of [320, 412, 1440])
      for (const theme of ["light", "dark"] as const) {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await openPage(page, "/", { width, height: 900, theme });
        const about = page.locator("#sobre");
        await about.scrollIntoViewIfNeeded();
        const layout = await about.evaluate((section) => {
          const portrait = section.querySelector(".about-template__portrait")!;
          const photo = portrait.getBoundingClientRect(),
            content = section.querySelector(".about-template__content")!.getBoundingClientRect();
          const outer = section.getBoundingClientRect();
          return {
            photo: {
              x: photo.x,
              y: photo.y,
              width: photo.width,
              height: photo.height,
              bottom: photo.bottom,
            },
            content: { x: content.x, y: content.y, right: content.right, bottom: content.bottom },
            outer: { left: outer.left, right: outer.right, bottom: outer.bottom },
            photoColor: getComputedStyle(portrait).backgroundColor,
            background: getComputedStyle(section).backgroundColor,
            texture: getComputedStyle(section, "::before").display,
          };
        });
        expect(Math.abs(layout.photo.width - layout.photo.height)).toBeLessThan(1);
        expect(layout.photoColor).toBe(
          theme === "light" ? "rgb(23, 32, 51)" : "rgb(242, 239, 232)",
        );
        expect(layout.background).toBe(
          theme === "light" ? "rgb(247, 246, 242)" : "rgb(14, 19, 27)",
        );
        expect(layout.texture).toBe("none");
        if (width < 768) expect(layout.photo.bottom).toBeLessThanOrEqual(layout.content.y);
        else expect(layout.photo.x).toBeGreaterThanOrEqual(layout.content.right);
        expect(layout.content.bottom).toBeLessThanOrEqual(layout.outer.bottom + 1);
        expect(layout.content.x).toBeGreaterThanOrEqual(layout.outer.left);
        expect(layout.content.right).toBeLessThanOrEqual(layout.outer.right);
      }
  });

  test("header recolhe controles e revela o sufixo sem perder a marca", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900 });
    const header = page.getByRole("banner"),
      logo = header.locator('a:has([data-wordmark="guifer.tech"])');
    const navigation = header.getByRole("navigation");
    await page.mouse.move(720, 180);
    await expect(header).toHaveAttribute("data-header-expanded", "false");
    await expect(navigation).toBeHidden();
    await expect(logo).toBeVisible();
    await logo.hover();
    await expect(header).toHaveAttribute("data-header-expanded", "true");
    await expect(navigation).toBeVisible();
    await expect(logo.locator('[data-wordmark-part="tech"]')).toHaveText(".tech");
    await page.mouse.move(720, 180);
    await expect(header).toHaveAttribute("data-header-expanded", "false");
    await logo.focus();
    await expect(header).toHaveAttribute("data-header-expanded", "true");
  });

  test("depoimentos preservam altura, seleção direta e ciclo infinito", async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "/", { width: 1440, height: 900 });

    const section = page.locator("#depoimentos");
    const figure = section.locator("figure:not([aria-hidden])");
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
    await expect(figure).toContainText("Especialista de tecnologia da informação");
    await expect(figure).toContainText("Sistema Ocergs");
    await expect(figure).toContainText("21/08/2026");
    await expect(figure).toContainText("Feedback fornecido pela plataforma Feedz.");
    await expect(figure).toContainText("Tens demonstrado comprometimento");
    const leonardoPhoto = figure.getByRole("img", {
      name: "Foto de Leonardo Alvarez Pereira Gomes",
    });
    await expect(leonardoPhoto).toBeVisible();
    expect(
      await leonardoPhoto.evaluate((image) => (image as HTMLImageElement).currentSrc),
    ).toContain("leonardo-alvarez-pereira-gomes-128w");
    const leonardoLinkedin = figure.getByRole("link", {
      name: "Abrir o perfil de Leonardo Alvarez Pereira Gomes no LinkedIn",
    });
    await expect(leonardoLinkedin).toHaveAttribute("href", "https://www.linkedin.com/in/lapgomes/");
    await expect(leonardoLinkedin).toHaveAttribute("target", "_blank");
    await expect(leonardoLinkedin).toHaveAttribute("rel", /noopener/u);

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

  test("depoimentos preservam a caixa fixa sem cortes no mobile", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const width of [320, 375]) {
      await openPage(page, "/", { width, height: width === 320 ? 568 : 812 });
      const section = page.locator("#depoimentos");
      const figure = section.locator("figure:not([aria-hidden])");
      const dots = section.getByRole("button", { name: /Exibir depoimento \d/ });
      await section.scrollIntoViewIfNeeded();
      const total = await dots.count();

      const initialSectionHeight = await section.evaluate(
        (element) => element.getBoundingClientRect().height,
      );
      const initialFigureHeight = await figure.evaluate(
        (element) => element.getBoundingClientRect().height,
      );

      for (let testimonialIndex = 0; testimonialIndex < total; testimonialIndex += 1) {
        await dots.nth(testimonialIndex).click();
        await expect(dots.nth(testimonialIndex)).toHaveAttribute("aria-current", "true");
        const boxes = await figure.evaluate((element) => {
          const figureBox = element.getBoundingClientRect();
          const quoteBox = element.querySelector("blockquote")!.getBoundingClientRect();
          const captionBox = element.querySelector("figcaption")!.getBoundingClientRect();
          return {
            figureTop: figureBox.top,
            figureBottom: figureBox.bottom,
            quoteTop: quoteBox.top,
            quoteBottom: quoteBox.bottom,
            captionTop: captionBox.top,
            captionBottom: captionBox.bottom,
            viewportWidth: document.documentElement.clientWidth,
            documentWidth: document.documentElement.scrollWidth,
          };
        });
        expect(boxes.quoteTop).toBeGreaterThanOrEqual(boxes.figureTop - 1);
        expect(boxes.quoteBottom).toBeLessThanOrEqual(boxes.captionTop + 1);
        expect(boxes.captionBottom).toBeLessThanOrEqual(boxes.figureBottom + 1);
        expect(boxes.documentWidth).toBeLessThanOrEqual(boxes.viewportWidth + 1);
        expect(await section.evaluate((element) => element.getBoundingClientRect().height)).toBe(
          initialSectionHeight,
        );
        expect(await figure.evaluate((element) => element.getBoundingClientRect().height)).toBe(
          initialFigureHeight,
        );
      }
    }
  });

  test("depoimentos localizam conteúdo, autoria e LinkedIn em PT/EN", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "/", { language: "en", width: 412, height: 915 });

    const section = page.locator("#depoimentos");
    await section.scrollIntoViewIfNeeded();
    await expect(
      section.getByRole("heading", {
        name: "A few testimonials from people who know my work.",
      }),
    ).toBeVisible();
    await expect(section.locator("figure:not([aria-hidden])")).toContainText(
      "We had the opportunity to work together",
    );
    await expect(section.locator("figure:not([aria-hidden])")).toContainText(
      "Software development intern",
    );
    await expect(
      section.getByRole("link", { name: "Open Bruna Vizzotto’s LinkedIn profile" }),
    ).toHaveAttribute("href", "https://www.linkedin.com/in/brunavizzotto/");

    await section.getByRole("button", { name: "Show testimonial 2" }).click();
    await expect(section.locator("figure:not([aria-hidden])")).toContainText("August 21, 2026");
    await expect(section.locator("figure:not([aria-hidden])")).toContainText(
      "Information technology specialist",
    );
    await expect(section.locator("figure:not([aria-hidden])")).toContainText(
      "Feedback provided via the Feedz platform.",
    );

    await section.getByRole("button", { name: "Show testimonial 5" }).click();
    await expect(section.locator("figure:not([aria-hidden])")).toContainText("BEM Promotora");
  });

  test("depoimentos avançam automaticamente e pausam durante interação", async ({ page }) => {
    await page.clock.install();
    await openPage(page, "/", { width: 1440, height: 900 });

    const section = page.locator("#depoimentos");
    const figure = section.locator("figure:not([aria-hidden])");
    await section.scrollIntoViewIfNeeded();
    await expect(figure).toContainText("Bruna Vizzotto");
    await page.mouse.move(0, 0);
    await expect(figure.locator("[data-line-reveal]")).toHaveAttribute(
      "data-line-reveal",
      "complete",
    );

    await page.clock.fastForward(Number(await figure.getAttribute("data-autoplay-duration")) + 100);
    await expect(figure).toContainText("21/08/2026");

    await section.hover();
    await page.clock.fastForward(Number(await figure.getAttribute("data-autoplay-duration")) + 100);
    await expect(figure).toContainText("21/08/2026");

    await page.locator(".footer-wordmark").hover();
    await section.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await expect(figure.locator("[data-line-reveal]")).toHaveAttribute(
      "data-line-reveal",
      "complete",
    );
    await page.clock.fastForward(Number(await figure.getAttribute("data-autoplay-duration")) + 100);
    await expect(figure).toContainText("17/07/2026");

    const next = section.getByRole("button", { name: "Exibir próximo depoimento" });
    await next.focus();
    await page.clock.fastForward(Number(await figure.getAttribute("data-autoplay-duration")) + 100);
    await expect(figure).toContainText("17/07/2026");
  });

  test("depoimentos oferecem pausa explícita e anunciam trocas manuais", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900 });

    const section = page.locator("#depoimentos");
    const stage = section.locator(".testimonial-editorial-stage");
    const figure = section.locator("figure:not([aria-hidden])");
    const autoplayToggle = section.locator(".testimonial-editorial-autoplay");

    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveAttribute("data-runtime-activity", "active");
    await expect(stage).toHaveAttribute("aria-live", "off");
    await expect(autoplayToggle).toHaveAccessibleName("Pausar rotação automática dos depoimentos");
    await expect(figure.locator("[data-line-reveal]")).toHaveAttribute(
      "data-line-reveal",
      "complete",
    );
    await page.clock.install();
    await autoplayToggle.click();
    await expect(autoplayToggle).toHaveAccessibleName("Retomar rotação automática dos depoimentos");
    await expect(stage).toHaveAttribute("aria-live", "polite");
    await page.clock.fastForward(Number(await figure.getAttribute("data-autoplay-duration")) + 100);
    await expect(figure).toContainText("Bruna Vizzotto");

    await autoplayToggle.click();
    await expect(autoplayToggle).toBeFocused();
    await expect(stage).toHaveAttribute("aria-live", "off");
    await page.clock.fastForward(Number(await figure.getAttribute("data-autoplay-duration")) + 100);
    await expect(figure).toContainText("21/08/2026");

    await section.getByRole("button", { name: "Exibir próximo depoimento" }).click();
    await expect(stage).toHaveAttribute("aria-live", "polite");
    await page.clock.fastForward(Number(await figure.getAttribute("data-autoplay-duration")) + 100);
    await expect(figure).toContainText("17/07/2026");
  });

  test("princípios permitem ler todos os cards com teclado e controles", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "/", { width: 375, height: 812 });
    const viewport = page.locator(".principles-marquee__viewport");
    const cards = viewport.locator("ul:not([aria-hidden]) > li");
    await expect(cards).toHaveCount(6);
    await viewport.scrollIntoViewIfNeeded();
    await viewport.focus();
    await viewport.press("Home");
    for (let index = 0; index < (await cards.count()); index += 1) {
      const bounds = await viewport.boundingBox();
      const card = await cards.nth(index).boundingBox();
      expect(card!.x).toBeGreaterThanOrEqual(bounds!.x - 1);
      expect(card!.x + card!.width).toBeLessThanOrEqual(bounds!.x + bounds!.width + 1);
      await viewport.press("ArrowRight");
    }
    await viewport.press("Home");
    await page.locator(".principles-marquee__controls button").last().click();
    const bounds = await viewport.boundingBox();
    const second = await cards.nth(1).boundingBox();
    expect(second!.x).toBeGreaterThanOrEqual(bounds!.x - 1);
    expect(second!.x + second!.width).toBeLessThanOrEqual(bounds!.x + bounds!.width + 1);
  });

  test("preview em vídeo inicia por hover desktop e pausa ao sair", async ({ page }) => {
    await page.addInitScript(() => {
      HTMLMediaElement.prototype.play = async function () {
        this.dataset.testPlayback = "playing";
      };
      HTMLMediaElement.prototype.pause = function () {
        this.dataset.testPlayback = "paused";
      };
    });
    await openPage(page, "/");
    const section = page.locator("#projetos");
    const videos = section.locator("video");
    const controls = section.locator("[data-project-video-control]");
    const playingCount = () =>
      videos.evaluateAll(
        (videos) => videos.filter((video) => video.dataset.testPlayback === "playing").length,
      );
    await expect(videos).toHaveCount(3);
    await expect(section.locator("video[src]")).toHaveCount(0);
    await section.scrollIntoViewIfNeeded();
    await section.locator("[data-project-preview]").first().focus();
    await expect(section.locator("video[src]")).toHaveCount(0);
    await section.locator("[data-project-preview]").first().hover();
    await expect.poll(playingCount).toBe(1);
    await expect(videos.first()).toHaveAttribute("src", /grengame-preview/);
    expect(await videos.first().evaluate((video: HTMLVideoElement) => video.muted)).toBe(true);
    await controls.first().click();
    await expect.poll(playingCount).toBe(0);
    await expect(videos.first()).not.toHaveAttribute("src");
    await section.locator("[data-project-preview]").nth(1).hover();
    await expect.poll(playingCount).toBe(1);
    await expect(videos.nth(1)).toHaveAttribute("src", /abriu-chaveiro-preview/);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
    await expect(section).toHaveAttribute("data-runtime-activity", "paused");
    await expect.poll(playingCount).toBe(0);
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
    const featuredPreview = section.locator(
      '[data-project-card="grengame"] [data-project-preview]',
    );
    const activeVideo = section.locator('[data-project-card="grengame"] video');
    await expect(activeVideo).toHaveCount(1);
    await expect(activeVideo).toBeVisible();
    await featuredPreview.hover();
    await expect(activeVideo).toHaveAttribute("src", /grengame-preview/);
    await expect
      .poll(() => activeVideo.evaluate((video: HTMLVideoElement) => video.readyState), {
        timeout: 30_000,
      })
      .toBeGreaterThanOrEqual(2);
    await expect
      .poll(() => activeVideo.evaluate((video: HTMLVideoElement) => video.error?.code ?? null))
      .toBeNull();
    await expect
      .poll(() => activeVideo.evaluate((video: HTMLVideoElement) => video.paused))
      .toBe(false);

    const initialTime = await activeVideo.evaluate((video: HTMLVideoElement) => video.currentTime);
    await page.waitForTimeout(500);
    await expect
      .poll(() => activeVideo.evaluate((video: HTMLVideoElement) => video.currentTime))
      .toBeGreaterThan(initialTime);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
    await expect(section).toHaveAttribute("data-runtime-activity", "paused");
    await expect
      .poll(() => activeVideo.evaluate((video: HTMLVideoElement) => video.paused))
      .toBe(true);
  });

  test("álbum narrativo mantém capítulos, imagens e seletor acessíveis", async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "/sobre", { width: 1440, height: 900 });

    const about = page.locator("#sobre");
    await expect(
      about.getByRole("heading", { level: 1, name: "Quem sou, o que faço e por quê:" }),
    ).toBeVisible();
    await expect(about.locator("[data-about-chapter]")).toHaveCount(5);

    for (const title of [
      "Educação e formação",
      "Tecnologia desde cedo",
      "Responsabilidade profissional",
      "Objetivo profissional",
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
