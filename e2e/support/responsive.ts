import { expect, type Locator, type Page, type TestInfo } from "@playwright/test";

export type ResponsiveViewport = {
  name: string;
  width: number;
  height: number;
  kind: "portrait" | "landscape" | "low-height" | "wide";
};

export const MOBILE_VISUAL_REFERENCE = { width: 412, height: 915 } as const;

export const HOME_TARGET_VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 900 },
  { name: "mobile-360", width: 360, height: 900 },
  { name: "mobile-390", width: 390, height: 900 },
  { name: "mobile-reference", width: 412, height: 915 },
  { name: "small-tablet", width: 640, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "before-desktop", width: 1023, height: 900 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", width: 1920, height: 1080 },
] as const;

export const EXTREME_SCENARIOS = [
  { name: "mobile-pt-light", width: 320, height: 568, language: "pt", theme: "light" },
  { name: "mobile-en-dark", width: 320, height: 568, language: "en", theme: "dark" },
  { name: "wide-pt-dark", width: 1920, height: 1080, language: "pt", theme: "dark" },
  { name: "wide-en-light", width: 1920, height: 1080, language: "en", theme: "light" },
] as const;

export const STRUCTURAL_VIEWPORTS = [
  { name: "mobile-landscape", width: 667, height: 375, kind: "landscape" },
  { name: "before-md", width: 767, height: 600, kind: "low-height" },
  { name: "at-md", width: 768, height: 1024, kind: "portrait" },
  { name: "before-lg", width: 1023, height: 600, kind: "low-height" },
  { name: "at-lg", width: 1024, height: 768, kind: "landscape" },
  { name: "mobile-reference", ...MOBILE_VISUAL_REFERENCE, kind: "portrait" },
] as const satisfies readonly ResponsiveViewport[];

const CONTENT_SELECTOR = [
  "main",
  "main section",
  "main article",
  "main h1",
  "main h2",
  "main h3",
  "main p",
  "main li",
  "main blockquote",
  "main figcaption",
  "main form",
  "footer",
].join(",");
const CONTROL_SELECTOR = [
  "a[href]",
  "button",
  "input:not([type='hidden'])",
  "select",
  "textarea",
  "[tabindex]",
].join(",");
const LAYOUT_ROUNDING_TOLERANCE_PX = 1;

export async function stabilizeResponsiveLayout(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const animation of document.getAnimations()) {
      if (animation.effect?.getComputedTiming().iterations !== Infinity) {
        animation.finish();
      }
    }
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
}

export async function primeResponsiveVisual(page: Page, target: Locator) {
  const box = await target.boundingBox();
  const viewport = page.viewportSize();
  if (!box || !viewport) return;

  const targetTop = await target.evaluate(
    (element) => element.getBoundingClientRect().top + window.scrollY,
  );
  const start = Math.max(0, Math.floor(targetTop));
  const end = Math.ceil(targetTop + box.height);
  const step = Math.max(240, Math.floor(viewport.height * 0.75));
  for (let position = start; position < end; position += step) {
    await page.evaluate((top) => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, top);
    }, position);
    await stabilizeResponsiveLayout(page);
  }

  await target.locator("img").evaluateAll(async (images: HTMLImageElement[]) => {
    await Promise.all(
      images.map(async (image) => {
        if (!image.complete) {
          await Promise.race([
            new Promise<void>((resolve) => {
              image.addEventListener("load", () => resolve(), { once: true });
              image.addEventListener("error", () => resolve(), { once: true });
            }),
            new Promise<void>((resolve) => window.setTimeout(resolve, 1500)),
          ]);
        }
        if (image.complete) await image.decode().catch(() => undefined);
      }),
    );
  });

  await page.evaluate((top) => window.scrollTo(0, top), start);
  await stabilizeResponsiveLayout(page);
}

export async function collectResponsiveInventory(page: Page) {
  await stabilizeResponsiveLayout(page);
  return page.evaluate(
    ({ contentSelector, controlSelector }) => {
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;
      const round = (value: number) => Math.round(value * 10) / 10;
      const rectOf = (element: Element) => {
        const rect = element.getBoundingClientRect();
        return {
          left: round(rect.left),
          right: round(rect.right),
          top: round(rect.top + window.scrollY),
          width: round(rect.width),
          height: round(rect.height),
        };
      };
      const identity = (element: Element) => {
        if (element.id) return `${element.tagName.toLowerCase()}#${element.id}`;
        const segments: string[] = [];
        let current: Element | null = element;
        while (current && current !== document.documentElement && segments.length < 5) {
          const siblings = current.parentElement
            ? [...current.parentElement.children].filter(
                (candidate) => candidate.tagName === current?.tagName,
              )
            : [];
          const index = Math.max(0, siblings.indexOf(current)) + 1;
          segments.unshift(`${current.tagName.toLowerCase()}:nth-of-type(${index})`);
          current = current.parentElement;
        }
        return segments.join(" > ");
      };
      const label = (element: Element) =>
        element.getAttribute("aria-label") ??
        element.getAttribute("title") ??
        element.textContent?.replace(/\s+/gu, " ").trim().slice(0, 80) ??
        "";
      const isRendered = (element: Element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const visuallyHidden =
          style.clip !== "auto" ||
          style.clipPath !== "none" ||
          (style.position === "absolute" &&
            rect.width <= 1 &&
            rect.height <= 1 &&
            style.overflow === "hidden");
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number.parseFloat(style.opacity || "1") > 0.01 &&
          !visuallyHidden &&
          rect.width > 0 &&
          rect.height > 0 &&
          !element.closest(".sr-only") &&
          !element.closest("[hidden], [inert], [aria-hidden='true']")
        );
      };
      const horizontalExposure = (element: Element) => {
        const rect = element.getBoundingClientRect();
        const ownStyle = getComputedStyle(element);
        const ownOverflow =
          ownStyle.overflowX === "visible" ? ownStyle.overflow : ownStyle.overflowX;
        const checksOwnContent = element.matches(
          "h1, h2, h3, p, blockquote, figcaption, a, button, input, select, textarea",
        );
        const ownContentClipped =
          checksOwnContent &&
          !/auto|scroll/u.test(ownOverflow) &&
          element.scrollWidth > element.clientWidth + 1;
        let visibleLeft = Math.max(0, rect.left);
        let visibleRight = Math.min(viewportWidth, rect.right);
        let intentionalScroller = false;
        let ancestor = element.parentElement;
        while (ancestor) {
          const style = getComputedStyle(ancestor);
          const overflow = style.overflowX === "visible" ? style.overflow : style.overflowX;
          if (/auto|scroll/u.test(overflow) && ancestor.scrollWidth > ancestor.clientWidth + 1) {
            intentionalScroller = true;
          }
          // Carrossel por transform: recorte intencional somente com viewport nomeada,
          // foco por teclado e controles externos que apontam para ela.
          if (
            ancestor.matches('[role="region"][aria-roledescription][aria-label][tabindex="0"]') &&
            ancestor.id &&
            document.querySelector(`button[aria-controls="${CSS.escape(ancestor.id)}"]`)
          ) {
            intentionalScroller = true;
          }
          if (/auto|clip|hidden|scroll/u.test(overflow)) {
            const ancestorRect = ancestor.getBoundingClientRect();
            visibleLeft = Math.max(visibleLeft, ancestorRect.left);
            visibleRight = Math.min(visibleRight, ancestorRect.right);
          }
          ancestor = ancestor.parentElement;
        }
        const visibleWidth = Math.max(0, visibleRight - visibleLeft);
        return {
          visibleWidth: round(visibleWidth),
          clipped: ownContentClipped || (!intentionalScroller && visibleWidth + 1 < rect.width),
          fullyHidden: !intentionalScroller && visibleWidth <= 1,
          intentionalScroller,
          ownContentClipped,
        };
      };
      const mapElement = (element: Element) => ({
        id: identity(element),
        label: label(element),
        rect: rectOf(element),
        exposure: horizontalExposure(element),
      });
      const content = [...document.querySelectorAll(contentSelector)]
        .filter(isRendered)
        .map(mapElement);
      const controls = [...document.querySelectorAll(controlSelector)]
        .filter(isRendered)
        .map((element) => ({
          ...mapElement(element),
          tabindex: element.getAttribute("tabindex"),
        }));
      const overflowSources = [...document.body.querySelectorAll("*")]
        .filter(isRendered)
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return (
            (rect.left < -1 || rect.right > viewportWidth + 1) &&
            !horizontalExposure(element).intentionalScroller
          );
        })
        .map((element) => {
          const style = getComputedStyle(element);
          return {
            ...mapElement(element),
            position: style.position,
            className: element.getAttribute("class")?.slice(0, 160) ?? "",
          };
        });
      const overflowContainers = [
        document.documentElement,
        document.body,
        ...document.body.querySelectorAll("*"),
      ]
        .filter((element) => element.scrollWidth > element.clientWidth + 1)
        .filter((element) => !element.classList.contains("sr-only"))
        .map((element) => ({
          id: identity(element),
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          rect: rectOf(element),
          overflowX: getComputedStyle(element).overflowX,
          className: element.getAttribute("class")?.slice(0, 160) ?? "",
        }))
        .slice(0, 50);
      return {
        route: location.pathname,
        language: document.documentElement.lang,
        theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
        viewport: { width: viewportWidth, height: viewportHeight },
        document: {
          width: document.documentElement.scrollWidth,
          height: document.documentElement.scrollHeight,
        },
        sectionHeights: content
          .filter(({ id }) => /section|article|main|footer/u.test(id))
          .map(({ id, label: elementLabel, rect }) => ({
            id,
            label: elementLabel,
            height: rect.height,
          })),
        clippingFindings: [...content, ...controls]
          .filter(({ exposure }) => exposure.clipped || exposure.fullyHidden)
          .map(({ id, label: elementLabel, rect, exposure }) => ({
            id,
            label: elementLabel,
            rect,
            exposure,
          })),
        scrollers: [...content, ...controls]
          .filter(({ exposure }) => exposure.intentionalScroller)
          .map(({ id }) => id),
        positiveTabindex: controls
          .filter(({ tabindex }) => Number.parseInt(tabindex ?? "0", 10) > 0)
          .map(({ id }) => id),
        overflowSources,
        overflowContainers,
      };
    },
    { contentSelector: CONTENT_SELECTOR, controlSelector: CONTROL_SELECTOR },
  );
}

export async function assertResponsiveInventory(page: Page, testInfo: TestInfo, label: string) {
  const inventory = await collectResponsiveInventory(page);
  await testInfo.attach(`${label}.json`, {
    body: JSON.stringify(inventory, null, 2),
    contentType: "application/json",
  });
  expect(
    inventory.document.width,
    `${label}: regressão no overflow horizontal\n${JSON.stringify(
      {
        sources: inventory.overflowSources.slice(0, 8),
        containers: inventory.overflowContainers,
      },
      null,
      2,
    )}`,
  ).toBeLessThanOrEqual(inventory.viewport.width + LAYOUT_ROUNDING_TOLERANCE_PX);
  expect(inventory.sectionHeights.length, `${label}: estrutura não mapeada`).toBeGreaterThan(0);
  expect(
    inventory.clippingFindings,
    `${label}: conteúdo ou controle cortado horizontalmente`,
  ).toEqual([]);
  expect(inventory.positiveTabindex, `${label}: tabindex positivo`).toEqual([]);
  return inventory;
}

export async function assertOverlayWithinViewport(
  page: Page,
  testInfo: TestInfo,
  label: string,
  overlays: Locator[],
) {
  await stabilizeResponsiveLayout(page);
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  const boxes = [];
  for (const overlay of overlays) {
    await expect(overlay).toBeVisible();
    const box = await overlay.boundingBox();
    expect(box, `${label}: overlay sem dimensões`).not.toBeNull();
    boxes.push(box!);
    expect(box!.x, `${label}: overlay fora da borda esquerda`).toBeGreaterThanOrEqual(-1);
    expect(box!.y, `${label}: overlay fora da borda superior`).toBeGreaterThanOrEqual(-1);
    expect(box!.x + box!.width, `${label}: overlay fora da borda direita`).toBeLessThanOrEqual(
      viewport!.width + 1,
    );
    expect(box!.y + box!.height, `${label}: overlay fora da borda inferior`).toBeLessThanOrEqual(
      viewport!.height + 1,
    );
  }
  await testInfo.attach(`${label}-overlays.json`, {
    body: JSON.stringify(boxes, null, 2),
    contentType: "application/json",
  });
  return boxes;
}

export async function mapKeyboardFocus(page: Page, testInfo: TestInfo, label: string) {
  await stabilizeResponsiveLayout(page);
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
  });
  const sequence: Array<{ id: string; label: string; visible: boolean }> = [];
  let firstId: string | null = null;
  let returnedToStart = false;
  for (let index = 0; index < 180; index += 1) {
    await page.keyboard.press("Tab");
    const entry = await page.evaluate(() => {
      let element = document.activeElement as HTMLElement | null;
      while (element?.shadowRoot?.activeElement) {
        element = element.shadowRoot.activeElement as HTMLElement;
      }
      if (!element || element === document.body) return null;
      const segments: string[] = [];
      let current: Element | null = element;
      while (current && current !== document.documentElement && segments.length < 7) {
        if (current.id) {
          segments.unshift(`${current.tagName.toLowerCase()}#${current.id}`);
          break;
        }
        const siblings = current.parentElement
          ? [...current.parentElement.children].filter(
              (candidate) => candidate.tagName === current?.tagName,
            )
          : [];
        segments.unshift(
          `${current.tagName.toLowerCase()}:nth-of-type(${Math.max(0, siblings.indexOf(current)) + 1})`,
        );
        current = current.parentElement;
      }
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        id: segments.join(" > "),
        label:
          element.getAttribute("aria-label") ??
          element.textContent?.replace(/\s+/gu, " ").trim().slice(0, 80) ??
          "",
        visible:
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number.parseFloat(style.opacity || "1") > 0.01 &&
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > 0 &&
          rect.top < document.documentElement.clientHeight &&
          rect.right > 0 &&
          rect.left < document.documentElement.clientWidth,
      };
    });
    if (!entry) continue;
    firstId ??= entry.id;
    if (entry.id === firstId && sequence.length > 0) {
      returnedToStart = true;
      break;
    }
    sequence.push(entry);
  }
  await testInfo.attach(`${label}-focus.json`, {
    body: JSON.stringify({ returnedToStart, sequence }, null, 2),
    contentType: "application/json",
  });
  expect(sequence.length, `${label}: sequência de foco insuficiente`).toBeGreaterThan(10);
  expect(
    sequence.filter(({ visible }) => !visible),
    `${label}: foco invisível`,
  ).toEqual([]);
  expect(returnedToStart, `${label}: ciclo de foco incompleto`).toBe(true);
  return sequence;
}
