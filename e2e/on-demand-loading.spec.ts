import { expect, openPage, test } from "./support/portfolio";

test("widget permanece adiado e abre pelo launcher com teclado", async ({ page }) => {
  await openPage(page, "/");
  await expect(page.locator("#acc-widget-host")).toHaveCount(0);
  const trigger = page.locator("#accessibility-widget-launcher");
  await trigger.focus();
  await trigger.press("Enter");
  await expect(page.locator("#acc-widget-host .acc-menu")).toBeVisible();
});

test("tooltip do café preserva foco, hover e dispensa por Escape", async ({ page }) => {
  await openPage(page, "/");
  const button = page.locator("[data-coffee-counter]");
  await button.focus();
  await button.hover();
  await page.mouse.move(0, 0);
  await expect(page.getByRole("tooltip")).toBeVisible();
  await button.press("Escape");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await button.blur();
  await button.hover();
  await expect(page.getByRole("tooltip")).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(page.getByRole("tooltip")).toHaveCount(0);
});

test("falha no chunk de privacidade preserva página e acesso ao aviso", async ({ page }) => {
  await page.route("**/src/components/privacy/PrivacyNoticeDialog.tsx*", (route) => route.abort());
  await openPage(page, "/");
  const footer = page.locator("footer");
  await footer.getByRole("button", { name: "Privacidade", exact: true }).click();
  await expect(footer.getByRole("alert")).toContainText("Não foi possível carregar");
  await expect(page.locator("#home-heading")).toBeAttached();
  await expect(
    footer.getByRole("link", { name: "Ver aviso de privacidade", exact: true }),
  ).toHaveAttribute("href", "/privacidade");
  await expect(footer.getByRole("button", { name: "Privacidade", exact: true })).toBeEnabled();
});
