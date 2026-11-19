import { expect, test, type Page } from "@playwright/test";
import { openPage } from "./support/portfolio";
import { fileURLToPath } from "node:url";
import { statSync } from "node:fs";

declare global {
  interface Window {
    __heroMediaState?: { paused: boolean; pauses: number; plays: number };
    __heroPlayAttempts?: number;
    __allowHeroRetry?: boolean;
  }
}

for (const density of [1, 2, 3]) {
  test.describe("mídia responsiva em DPR " + density, () => {
    test.use({ deviceScaleFactor: density, contextOptions: { reducedMotion: "reduce" } });
    for (const width of [375, 768, 1440]) {
      test("seleciona fontes adequadas em " + width + "px", async ({ page }) => {
        await openPage(page, "/", { width, height: 900 });
        const cards = page.locator("[data-project-card]");
        await expect(cards).toHaveCount(3);
        for (const card of await cards.all()) {
          const image = card.locator("img");
          const avif = card.locator('picture source[type="image/avif"]');
          await expect(avif).toHaveCount(2);
          for (const candidate of await avif.all()) {
            await expect(candidate).toHaveAttribute("sizes", "100vw");
          }
          await expect(avif.first()).toHaveAttribute("media", "(min-width: 64rem)");
          await expect(avif.first()).toHaveAttribute("srcset", /400w.*800w.*1600w/);
          await expect(avif.last()).toHaveAttribute(
            "srcset",
            (await card.getAttribute("data-project-card")) === "grengame"
              ? /400w.*800w.*1000w.*1600w/
              : /400w.*600w.*800w.*1200w/,
          );
          await image.scrollIntoViewIfNeeded();
          await expect
            .poll(() => image.evaluate((image) => (image as HTMLImageElement).naturalWidth))
            .toBeGreaterThan(0);
          const selected = await image.evaluate((element) => {
            const image = element as HTMLImageElement;
            return {
              source: image.currentSrc,
              naturalWidth: image.naturalWidth,
              prepared: image.dataset.prepared,
            };
          });
          expect(selected.source).toMatch(/\.avif(?:\?.*)?$/);
          expect(selected.naturalWidth).toBeGreaterThan(0);

          if (width >= 1024) expect(selected.source).not.toContain("cover-grid");
          else expect(selected.source).toContain("cover-grid");
        }
        const portrait = page.locator(
          "#depoimentos figure:not([aria-hidden]) .testimonial-editorial-portrait img",
        );
        const sources = portrait.locator("xpath=..").locator("source");
        await expect(sources).toHaveCount(2);
        for (const candidate of await sources.all()) {
          await expect(candidate).toHaveAttribute("srcset", /96w.*128w.*192w/);
          await expect(candidate).toHaveAttribute(
            "sizes",
            "(max-width: 767px) 96px, (max-width: 1100px) 88px, (max-width: 1600px) 8vw, 128px",
          );
        }
        await portrait.scrollIntoViewIfNeeded();
        await expect
          .poll(() => portrait.evaluate((image) => (image as HTMLImageElement).naturalWidth))
          .toBeGreaterThan(0);
        const selected = await portrait.evaluate((image) => (image as HTMLImageElement).currentSrc);
        expect(selected).toMatch(
          density === 1 ? /-(?:96|128)w(?:-[^/?]+)?\.avif/ : /-192w(?:-[^/?]+)?\.avif/,
        );
        const about = page.locator(".about-template__portrait img");
        const aboutSource = await about.evaluate((image) => (image as HTMLImageElement).currentSrc);
        expect(aboutSource).toMatch(/about-speaking-cutout-(?:480|512|720|960)w.*\.avif/);
        const videos = page.locator("#projetos video");
        await expect(videos).toHaveCount(3);
        await expect(page.locator("#projetos video[src]")).toHaveCount(0);
        for (const video of await videos.all()) {
          expect(await video.evaluate((element) => (element as HTMLVideoElement).muted)).toBe(true);
          expect(await video.evaluate((element) => (element as HTMLVideoElement).paused)).toBe(
            true,
          );
        }
      });
    }
  });
}

async function installPlaybackStub(page: Page, rejectInitially = false) {
  // Reprodução é controlada pelo stub; mídia local válida evita onError nativo
  // causado por abort de rede depois de o play simulado já ter concluído.
  await page.route(/\.mp4(?:\?|$)/u, async (route) => {
    if (route.request().resourceType() !== "media") return route.continue();
    await route.fulfill({
      path: fileURLToPath(new URL("../src/assets/projects/grengame-preview.mp4", import.meta.url)),
      contentType: "video/mp4",
    });
  });
  await page.addInitScript((reject) => {
    const state = { paused: true, pauses: 0, plays: 0 };
    const paused = new WeakMap<HTMLMediaElement, boolean>();
    window.__heroMediaState = state;
    window.__allowHeroRetry = !reject;
    window.__heroPlayAttempts = 0;
    HTMLMediaElement.prototype.load = () => undefined;
    Object.defineProperty(HTMLMediaElement.prototype, "readyState", {
      configurable: true,
      get: () => 3,
    });
    HTMLMediaElement.prototype.play = function () {
      if (this.closest("#home")) {
        window.__heroPlayAttempts = (window.__heroPlayAttempts ?? 0) + 1;
        if (!window.__allowHeroRetry)
          return Promise.reject(new DOMException("Unavailable", "NotAllowedError"));
        state.plays++;
        state.paused = false;
      }
      paused.set(this, false);
      this.dispatchEvent(new Event("playing"));
      return Promise.resolve();
    };
    HTMLMediaElement.prototype.pause = function () {
      paused.set(this, true);
      if (this.closest("#home")) {
        state.pauses++;
        state.paused = true;
      }
      this.dispatchEvent(new Event("pause"));
    };
    Object.defineProperty(HTMLMediaElement.prototype, "paused", {
      configurable: true,
      get() {
        return paused.get(this) ?? true;
      },
    });
  }, rejectInitially);
}

test.describe("vídeo do Hero sob intenção explícita", () => {
  for (const width of [320, 375, 768, 1024, 1440]) {
    test("carrega somente após play em " + width + "px", async ({ page }) => {
      await installPlaybackStub(page);
      await openPage(page, "/", { width, height: 900, loadMedia: true });
      const video = page.locator("#home video");
      await expect(video).not.toHaveAttribute("src");
      await expect(video).toHaveAttribute("preload", "none");
      expect(await page.evaluate(() => window.__heroPlayAttempts)).toBe(0);
      await page.locator("[data-hero-video-control]").click();
      await expect(video).toHaveAttribute("src", /hero-background.*\.mp4/);
      await expect(video).toHaveAttribute("data-media-intent", "media-opt-in");
      await expect(video).toHaveAttribute("data-media-status", "playing");
      expect(
        await video.evaluate((video: HTMLVideoElement) => video.muted && video.playsInline),
      ).toBe(true);
      await page.locator("[data-hero-video-control]").click();
      await expect(video).toHaveAttribute("data-media-status", "paused");
      const plays = await page.evaluate(() => window.__heroMediaState?.plays);
      await page.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
      expect(await page.evaluate(() => window.__heroMediaState?.plays)).toBe(plays);
    });
  }
  test("scroll, foco e eventos sintéticos não carregam mídia ou widget", async ({ page }) => {
    const media: string[] = [];
    page.on("request", (request) => {
      if (request.resourceType() === "media") media.push(request.url());
    });
    await openPage(page, "/", { loadMedia: true });
    await page.locator("[data-project-preview]").first().focus();
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      document
        .querySelector("[data-project-card]")
        ?.dispatchEvent(new PointerEvent("pointerover", { bubbles: true, pointerType: "mouse" }));
      window.dispatchEvent(new Event("pointermove"));
      window.dispatchEvent(new Event("keydown"));
    });
    await expect(page.locator("video[src]")).toHaveCount(0);
    expect(media).toEqual([]);
    await expect(page.locator("#acc-widget-host")).toHaveCount(0);
    await expect(page.locator("#accessibility-widget-launcher")).toBeVisible();
  });
  test("movimento reduzido permite opt-in e falha permite retry explícito", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await installPlaybackStub(page, true);
    await openPage(page, "/", { width: 375, height: 812, loadMedia: true });
    const video = page.locator("#home video");
    await expect(video).not.toHaveAttribute("src");
    await page.locator("[data-hero-video-control]").click();
    await expect(video).toHaveAttribute("data-media-status", "unavailable");
    const attempts = await page.evaluate(() => window.__heroPlayAttempts);
    await page.waitForTimeout(100);
    expect(await page.evaluate(() => window.__heroPlayAttempts)).toBe(attempts);
    await page.evaluate(() => {
      window.__allowHeroRetry = true;
    });
    await page.getByRole("button", { name: "Tentar reproduzir o vídeo novamente" }).click();
    await expect(video).toHaveAttribute("data-media-status", "playing");
  });
  test("pausa fora do Hero e ao ocultar aba após opt-in", async ({ page }) => {
    await installPlaybackStub(page);
    await openPage(page, "/", { loadMedia: true });
    const video = page.locator("#home video");
    await page.locator("[data-hero-video-control]").click();
    await expect(video).toHaveAttribute("data-media-status", "playing");
    await page.locator("#habilidades").scrollIntoViewIfNeeded();
    await expect(page.locator("#home")).toHaveAttribute("data-runtime-activity", "paused");
    await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
    await page.locator("#home").scrollIntoViewIfNeeded();
    await expect(video).toHaveAttribute("data-media-status", "playing");
    await page.evaluate(() => {
      Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await expect.poll(() => video.evaluate((video: HTMLVideoElement) => video.paused)).toBe(true);
  });
});
test("vídeo real do Hero respeita limite de publicação e decodifica após play", async ({
  page,
}) => {
  const asset = new URL("../src/assets/hero/hero-background.mp4", import.meta.url);
  expect(statSync(asset).size).toBeLessThan(25 * 1024 * 1024);
  await openPage(page, "/", {
    width: 1440,
    height: 900,
    loadMedia: true,
    loadDeferredSections: false,
  });
  const video = page.locator("#home video");
  await expect(video).not.toHaveAttribute("src");
  await page.locator("[data-hero-video-control]").click();
  await expect(video).toHaveAttribute("data-media-status", "playing");
  await expect
    .poll(() =>
      video.evaluate(
        (element: HTMLVideoElement) =>
          element.readyState >= 2 &&
          element.videoWidth > 0 &&
          element.currentTime > 0 &&
          !element.paused,
      ),
    )
    .toBe(true);
  await video.evaluate((element: HTMLVideoElement) => {
    element.currentTime = element.duration / 2;
  });
  await expect
    .poll(() =>
      video.evaluate(
        (element: HTMLVideoElement) =>
          !element.seeking &&
          element.readyState >= 2 &&
          element.currentTime >= element.duration / 2,
      ),
    )
    .toBe(true);
  await page.locator("[data-hero-video-control]").click();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
});

test.describe("vídeo sob intenção em touch", () => {
  test.use({ hasTouch: true, isMobile: true });
  test("mantém poster até gesto no controle de play", async ({ page }) => {
    await installPlaybackStub(page);
    await openPage(page, "/", { width: 375, height: 812, loadMedia: true });
    await expect(page.locator("#home video")).not.toHaveAttribute("src");
    await page.locator("[data-hero-video-control]").tap();
    await expect(page.locator("#home video")).toHaveAttribute("data-media-status", "playing");
  });
});
