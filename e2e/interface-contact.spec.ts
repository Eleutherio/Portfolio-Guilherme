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
});
