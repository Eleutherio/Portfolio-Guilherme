import { expect, test } from "@playwright/test";
import sharp from "sharp";

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

  const personScript = page.locator(
    'script[type="application/ld+json"][data-person-metadata="true"]',
  );
  await expect(personScript).toHaveCount(1);
  const person = JSON.parse((await personScript.textContent()) ?? "{}");

  expect(person?.url).toBe(`${SITE_ORIGIN}/`);
});

test("sincroniza metadados com idioma e tema sem duplicidades", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Guilherme Ferreira Eleutherio — Desenvolvedor full-stack");
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "pt_BR");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#f7f6f2");

  await page.getByRole("button", { name: "Mudar idioma" }).click();
  await expect(page).toHaveTitle("Guilherme Ferreira Eleutherio — Full-stack Developer");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /^Full-stack developer focused/,
  );
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "en_US");

  const person = page.locator('script[type="application/ld+json"][data-person-metadata="true"]');
  await expect(person).toHaveCount(1);
  await expect
    .poll(async () => JSON.parse((await person.textContent()) ?? "{}").inLanguage)
    .toBe("en");

  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#0e131b");

  for (const selector of [
    "title",
    'meta[name="description"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:locale"]',
    'meta[name="twitter:title"]',
    'meta[name="twitter:description"]',
    'meta[name="theme-color"]',
  ]) {
    await expect(page.locator(selector)).toHaveCount(1);
  }
});

test("localiza metadados de case com o idioma atual", async ({ page }) => {
  await page.goto("/projetos/martha-izabel");

  await expect(page).toHaveTitle("Portfólio de marca pessoal — Guilherme Ferreira");
  await page.getByRole("button", { name: "Mudar idioma" }).click();
  await expect(page).toHaveTitle("Personal brand portfolio — Guilherme Ferreira");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /^Institutional website and portfolio/,
  );
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

test("publica previews sociais consistentes em 1200 por 630", async ({ page, request }) => {
  const expectedImages = new Map([
    ["/", "/social/guifer-tech.jpg"],
    ["/sobre", "/social/guifer-tech.jpg"],
    ["/privacidade", "/social/guifer-tech.jpg"],
    ["/acessibilidade", "/social/guifer-tech.jpg"],
    ["/projetos/grengame", "/social/grengame.jpg"],
    ["/projetos/abriu-chaveiro", "/social/abriu-chaveiro.jpg"],
    ["/projetos/martha-izabel", "/social/martha-izabel.jpg"],
  ]);

  for (const [route, imagePath] of expectedImages) {
    await page.goto(route);

    const expectedUrl = `${SITE_ORIGIN}${imagePath}`;
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", expectedUrl);
    await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute(
      "content",
      "image/jpeg",
    );
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
      "content",
      "1200",
    );
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
      "content",
      "630",
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      "content",
      expectedUrl,
    );
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /\S+/);

    const response = await request.get(imagePath);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/jpeg");
    const metadata = await sharp(await response.body()).metadata();
    expect(metadata).toMatchObject({ format: "jpeg", width: 1200, height: 630 });
  }
});

test("publica favicon legado e webmanifest com ícones adequados", async ({ page, request }) => {
  await page.goto("/");

  await expect(page.locator('link[rel="icon"][href="/favicon.ico"]')).toHaveCount(1);
  await expect(page.locator('link[rel="icon"][href="/favicon.png"]')).toHaveAttribute(
    "sizes",
    "256x256",
  );
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    "href",
    "/apple-touch-icon.png",
  );
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/site.webmanifest");

  const favicon = await request.get("/favicon.ico");
  expect(favicon.status()).toBe(200);
  expect(favicon.headers()["content-type"]).toContain("image/");
  expect([...(await favicon.body()).subarray(0, 4)]).toEqual([0, 0, 1, 0]);

  const manifestResponse = await request.get("/site.webmanifest");
  expect(manifestResponse.status()).toBe(200);
  const manifest = (await manifestResponse.json()) as {
    icons?: Array<{ src: string; sizes: string; type: string }>;
  };
  expect(manifest.icons).toEqual(
    expect.arrayContaining([
      { src: "/favicon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/favicon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ]),
  );
});
