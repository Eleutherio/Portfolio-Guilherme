import { expect, openPage, screenshotPixel, test } from "./support/portfolio";

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

    await page.mouse.move(12, 12);
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
      probe.dataset.cursorTooltip = "button";
      probe.dataset.cursorOpen = "destino";
      Object.assign(probe.style, {
        position: "fixed",
        inset: "0",
        zIndex: "2147483640",
      });
      document.getElementById("root")?.append(probe);
    });

    const probe = page.locator("#cursor-edge-probe");
    const tooltip = page.locator("#custom-cursor-tooltip");
    await page.mouse.move(width / 2, height / 2);
    await expect(page.locator("html")).toHaveAttribute("data-custom-cursor", "active");
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

    await probe.evaluate((element) => {
      delete (element as HTMLElement).dataset.cursorOpen;
      element.setAttribute("aria-label", "documentação");
    });
    await page.mouse.move(width / 2, height / 2);
    await expect(tooltip).toHaveText("Abrir documentação");

    await probe.evaluate((element) => {
      element.removeAttribute("aria-label");
      element.setAttribute("href", "https://example.com/recurso");
    });
    await page.mouse.move(width / 2 + 1, height / 2 + 1);
    await expect(tooltip).toHaveText("Abrir example.com");
    await probe.evaluate((element) => element.remove());
  });

  test("preserva zonas nativas e remove animação com movimento reduzido", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openPage(page, "/", { width: 1440, height: 900, loadDeferredSections: false });

    const cursor = page.locator("#custom-cursor");
    const visual = cursor.locator(".custom-cursor__visual");
    const projects = page.locator("header nav button").nth(1);
    await projects.hover();
    await expect(page.locator("html")).toHaveAttribute("data-custom-cursor", "active");
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
    await expect(page.locator("#custom-cursor")).toHaveCount(0);
    await expect(page.locator("[data-header-switches] button").first()).not.toHaveCSS(
      "cursor",
      "none",
    );
  });

  test("mantém o cursor nativo na impressão", async ({ page }) => {
    await page.emulateMedia({ media: "print" });
    await openPage(page, "/", { width: 1440, height: 900, loadDeferredSections: false });

    await expect(page.locator("html")).toHaveAttribute("data-custom-cursor", "inactive");
    await expect(page.locator("#custom-cursor")).toHaveCount(0);
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
    await expect(page.locator("#custom-cursor")).toHaveCount(0);
  });
});
