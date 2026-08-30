import { expect, test } from "@playwright/test";

const SITE_ORIGIN = "https://guifer.tech";

const routes = [
  "/",
  "/sobre",
  "/privacidade",
  "/acessibilidade",
  "/projetos/grengame",
  "/projetos/abriu-chaveiro",
  "/projetos/martha-izabel",
];

for (const path of routes) {
  test(`${path} publica canonical e Open Graph absolutos`, async ({ page }) => {
    await page.goto(path);

    const expectedUrl = new URL(path, `${SITE_ORIGIN}/`).href;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", expectedUrl);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", expectedUrl);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /\S+/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", /\S+/);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", /\S+/);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
      "content",
      /\S+/,
    );
  });
}

test("JSON-LD aponta a pessoa para a origem canônica", async ({ page }) => {
  await page.goto("/");

  const person = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts
        .map((script) => JSON.parse(script.textContent ?? "{}"))
        .find((value) => value["@type"] === "Person"),
    );

  expect(person?.url).toBe(`${SITE_ORIGIN}/`);
});

test("cases publicam imagens sociais absolutas", async ({ page }) => {
  await page.goto("/projetos/grengame");

  const openGraphImage = page.locator('meta[property="og:image"]');
  const twitterImage = page.locator('meta[name="twitter:image"]');
  await expect(openGraphImage).toHaveAttribute("content", new RegExp(`^${SITE_ORIGIN}/`));
  await expect(twitterImage).toHaveAttribute("content", new RegExp(`^${SITE_ORIGIN}/`));
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", /^\d+$/);
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
    "content",
    /^\d+$/,
  );
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /\S+/);
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute("content", /\S+/);
});
