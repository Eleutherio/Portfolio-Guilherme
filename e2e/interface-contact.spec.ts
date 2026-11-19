import {
  expect,
  fillValidContactForm,
  installRecaptchaStub,
  openAccessibilityWidget,
  openPage,
  runAxe,
  test,
} from "./support/portfolio";

test.describe("WCAG 2.2 AA — estados interativos", () => {
  for (const language of ["pt", "en"] as const) {
    test(`aviso de consentimento mantém pontuação junto ao botão em ${language}`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await openPage(page, "/#contato", { width: 768, height: 900, language });
      const notice = page.locator("#contact-consent-copy");
      await expect(notice).toBeVisible();
      for (const width of [320, 412, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const geometry = await notice.evaluate((element) => {
          const button = element.querySelector("button")!;
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          let lastText: Text | null = null;
          while (walker.nextNode()) {
            if (walker.currentNode.textContent?.trim()) lastText = walker.currentNode as Text;
          }
          const range = document.createRange();
          const offset = lastText!.textContent!.lastIndexOf(".");
          range.setStart(lastText!, offset);
          range.setEnd(lastText!, offset + 1);
          const period = range.getBoundingClientRect();
          const trigger = button.getBoundingClientRect();
          return {
            periodTop: period.top,
            periodBottom: period.bottom,
            triggerTop: trigger.top,
            triggerBottom: trigger.bottom,
            viewport: document.documentElement.clientWidth,
            content: document.documentElement.scrollWidth,
          };
        });
        expect(geometry.periodTop).toBeLessThan(geometry.triggerBottom);
        expect(geometry.periodBottom).toBeGreaterThan(geometry.triggerTop);
        expect(geometry.content).toBeLessThanOrEqual(geometry.viewport + 1);
      }
      await notice.screenshot({ path: `tmp/contact-consent-${language}.png` });
    });
  }

  test("preserva destinos sociais fora do Hero", async ({ page }) => {
    await openPage(page, "/", { width: 1440, height: 900 });
    const hero = page.locator("#home");
    const about = page.locator("#sobre");
    const contact = page.locator("#contato");

    await expect(
      hero.locator('a[href*="github"], a[href*="linkedin"], a[href*="wa.me"], a[href^="mailto:"]'),
    ).toHaveCount(0);
    await expect(about.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/Eleutherio",
    );
    await expect(about.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/eleutherio/",
    );
    await expect(
      contact.getByRole("link", { name: "contato@guifer.tech", exact: true }),
    ).toHaveAttribute("href", "mailto:contato@guifer.tech");
    expect(await contact.locator('a[href="https://wa.me/5551994055984"]').count()).toBeGreaterThan(
      0,
    );
  });

  test("menu mobile aberto", async ({ page }, testInfo) => {
    await openPage(page, "/", { width: 375, height: 900 });
    await page.locator('header a:has([data-wordmark="guifer.tech"])').focus();
    const trigger = page.locator('button[aria-controls="primary-navigation-panel"]');
    await expect(trigger).toHaveAccessibleName("Abrir menu");
    await trigger.click();
    await expect(page.locator("#primary-navigation-panel")).toBeVisible();
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
    expect(widgetRequests).toEqual([]);
    await expect(page.locator("#acc-widget-host")).toHaveCount(0);
    await page.locator("#accessibility-widget-launcher").focus();
    await page.keyboard.press("Enter");
    const host = page.locator("#acc-widget-host");
    const trigger = host.locator("#accessibilityWidget");
    await expect(host).toBeAttached();
    await expect(page.locator("#accessibility-widget-launcher")).toHaveCount(0);
    expect(widgetRequests.length).toBeGreaterThan(0);

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
    await page.locator("#contact-privacy-consent").check();
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
    await expect(contact.getByRole("link", { name: "LinkedIn", exact: true })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/eleutherio/",
    );
    await expect(contact.getByRole("form", { name: "Formulário de contato" })).toBeVisible();

    const notice = contact.getByText(/^Protegido por reCAPTCHA/);
    await expect(notice).toHaveCSS("font-size", "12px");
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
    expect(focusStyle.boxShadow).toContain("0px 1px 0px");
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
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page.getByRole("status")).toContainText("Mensagem enviada");
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
    await expect(page.getByRole("status")).toContainText("Mensagem enviada");
    expect(contactRequests).toBe(1);
  });

  test("falha ao carregar a validação do contato é anunciada", async ({ page }) => {
    await page.route(/\/src\/lib\/contact-contract\.ts(?:\?|$)/u, async (route) => route.abort());
    await openPage(page, "/");
    await fillValidContactForm(page);
    await page.getByRole("button", { name: "Enviar mensagem" }).click();

    await expect(page.getByRole("status")).toContainText("Algo deu errado");
    await expect(page.getByRole("button", { name: "Enviar mensagem" })).toBeEnabled();
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
      await page.getByRole("button", { name: "Enviar mensagem" }).click();
      await expect(page.getByRole("status")).toContainText("Algo deu errado");
      await expect(page.getByRole("button", { name: "Enviar mensagem" })).toBeEnabled();
      await expect(page.locator("#contato form")).toHaveCSS("opacity", "1");
      await runAxe(page, testInfo, `contact-${status}`);
    });
  }

  test("reCAPTCHA indisponível é anunciado", async ({ page }, testInfo) => {
    await page.route("https://www.google.com/recaptcha/**", async (route) => route.abort());
    await openPage(page, "/");
    await fillValidContactForm(page);
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page.getByRole("status")).toContainText("Algo deu errado");
    await expect(page.getByRole("button", { name: "Enviar mensagem" })).toBeEnabled();
    await runAxe(page, testInfo, "contact-recaptcha-unavailable");
  });

  test("nova tentativa substitui o script expirado do reCAPTCHA e envia sem recarregar", async ({
    page,
  }) => {
    let scriptRequests = 0;
    let contactRequests = 0;
    await page.route("https://www.google.com/recaptcha/**", async (route) => {
      scriptRequests += 1;
      if (scriptRequests === 1) {
        await route.fulfill({
          status: 200,
          contentType: "application/javascript",
          body: `window.grecaptcha = {
            ready: () => {},
            execute: async () => "token-that-must-not-be-used"
          };`,
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: `window.grecaptcha = {
          ready: (callback) => callback(),
          execute: async () => "playwright-retry-token"
        };`,
      });
    });
    await page.route("**/api/contact", async (route) => {
      contactRequests += 1;
      await route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await openPage(page, "/");
    await fillValidContactForm(page);
    await page.clock.install();
    const submit = page.getByRole("button", { name: "Enviar mensagem" });

    await submit.click();
    await expect(page.locator("#google-recaptcha-v3")).toHaveCount(1);
    await page.clock.fastForward(10_100);
    await expect(page.getByRole("status")).toContainText("Algo deu errado");
    await expect(page.locator("#google-recaptcha-v3")).toHaveCount(0);

    await submit.click();
    await expect(page.getByRole("status")).toContainText("Mensagem enviada");
    expect(scriptRequests).toBe(2);
    expect(contactRequests).toBe(1);
  });
});
