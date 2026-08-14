import { chromium } from "@playwright/test";

function httpsUrl(name, fallback) {
  const value = process.env[name]?.trim() || fallback;
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password) {
    throw new Error(`${name} must be a public HTTPS URL without credentials`);
  }
  return url;
}

const siteUrl = httpsUrl("PRODUCTION_SITE_URL", "https://guifer.tech");
const apiUrl = httpsUrl("PRODUCTION_API_URL", "https://guifer-api.onrender.com");
const fetchTimeoutMs = Number.parseInt(process.env.PRODUCTION_SECURITY_TIMEOUT_MS ?? "15000", 10);
if (!Number.isInteger(fetchTimeoutMs) || fetchTimeoutMs < 1_000 || fetchTimeoutMs > 60_000) {
  throw new Error("PRODUCTION_SECURITY_TIMEOUT_MS must be between 1000 and 60000");
}

async function timedFetch(label, input, init = {}) {
  try {
    return await fetch(input, {
      ...init,
      signal: AbortSignal.timeout(fetchTimeoutMs),
    });
  } catch (error) {
    throw new Error(`${label}: request failed`, { cause: error });
  }
}

const commonHeaders = {
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
};

const frontendHeaders = {
  ...commonHeaders,
  "content-security-policy":
    "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://app.greenweb.org https://s3.nl-ams.scw.cloud/tgwf-web-app-live/greenweb_badges/v3/; font-src 'self'; connect-src 'self' https://guifer-api.onrender.com https://www.google.com/recaptcha/; frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/; worker-src 'self' blob:; manifest-src 'self'; upgrade-insecure-requests",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000; includeSubDomains",
};

const apiHeaders = {
  ...commonHeaders,
  "content-security-policy":
    "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  "referrer-policy": "no-referrer",
  "strict-transport-security": "max-age=31536000",
};

function assertHeaders(label, response, expectedHeaders) {
  for (const [name, expected] of Object.entries(expectedHeaders)) {
    const actual = response.headers.get(name);
    if (actual !== expected) {
      throw new Error(`${label}: invalid or missing ${name}`);
    }
  }
}

async function checkResponse(label, path, expectedStatus, init) {
  const response = await timedFetch(label, new URL(path, apiUrl), init);
  if (response.status !== expectedStatus) {
    throw new Error(`${label}: expected ${expectedStatus}, received ${response.status}`);
  }
  assertHeaders(label, response, apiHeaders);
  return response;
}

const frontend = await timedFetch("frontend", siteUrl);
if (frontend.status !== 200) {
  throw new Error(`frontend: expected 200, received ${frontend.status}`);
}
assertHeaders("frontend", frontend, frontendHeaders);

await checkResponse("API 2xx", "/health/live", 200);
await checkResponse("API 404", "/security-check-not-found", 404);
await checkResponse("API 403", "/health/live", 403, {
  headers: { origin: "https://example.invalid" },
});
const preflight = await checkResponse("API OPTIONS", "/api/contact", 204, {
  method: "OPTIONS",
  headers: {
    origin: siteUrl.origin,
    "access-control-request-method": "POST",
    "access-control-request-headers": "content-type",
  },
});
if (preflight.headers.get("access-control-allow-origin") !== siteUrl.origin) {
  throw new Error("API OPTIONS: invalid access-control-allow-origin");
}
if (!(preflight.headers.get("access-control-allow-methods") ?? "").split(/,\s*/).includes("POST")) {
  throw new Error("API OPTIONS: POST is not allowed");
}
if (
  !(preflight.headers.get("access-control-allow-headers") ?? "")
    .toLowerCase()
    .split(/,\s*/)
    .includes("content-type")
) {
  throw new Error("API OPTIONS: content-type is not allowed");
}
if (!(preflight.headers.get("vary") ?? "").split(/,\s*/).includes("Origin")) {
  throw new Error("API OPTIONS: Vary must include Origin");
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ locale: "pt-BR" });
const cspBlocks = [];
let recaptchaRequested = false;

page.on("console", (message) => {
  const value = message.text();
  if (/content security policy|refused to .*because it violates/i.test(value)) {
    cspBlocks.push(value);
  }
});
page.on("request", (request) => {
  if (/google\.com\/recaptcha|gstatic\.com\/recaptcha/.test(request.url())) {
    recaptchaRequested = true;
  }
});

await page.route("**/api/contact", async (route) => {
  const method = route.request().method();
  if (method === "OPTIONS") {
    await route.fulfill({
      status: 204,
      headers: {
        "access-control-allow-origin": siteUrl.origin,
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type",
      },
    });
    return;
  }
  if (method === "POST") {
    await route.fulfill({
      status: 202,
      contentType: "application/json",
      headers: { "access-control-allow-origin": siteUrl.origin },
      body: JSON.stringify({ ok: true }),
    });
    return;
  }
  await route.abort();
});

try {
  await page.goto(new URL("/", siteUrl).href, { waitUntil: "domcontentloaded" });
  await page.locator("#contato").scrollIntoViewIfNeeded();
  await page.locator("#contact-name").waitFor({ state: "visible" });
  await page.locator("#contact-name").fill("Security smoke test");
  await page.locator("#contact-email").fill("security-smoke@example.com");
  await page
    .locator("#contact-message")
    .fill("This request is intercepted locally and is never sent to the contact API.");
  const interceptedPost = page.waitForRequest(
    (request) => request.url().endsWith("/api/contact") && request.method() === "POST",
  );
  await page.locator('#contato button[type="submit"]').click();
  await interceptedPost;
  if (!recaptchaRequested || !(await page.evaluate(() => Boolean(window.grecaptcha)))) {
    throw new Error("reCAPTCHA did not load and execute before the intercepted contact POST");
  }

  await page.goto(new URL("/acessibilidade", siteUrl).href, {
    waitUntil: "domcontentloaded",
  });
  const launcher = page.locator("#accessibility-widget-launcher");
  if (await launcher.isVisible()) {
    await launcher.click();
  } else {
    await page.locator("#acc-widget-host #accessibilityWidget").click();
  }
  await page.locator("#acc-widget-host .acc-menu").waitFor({ state: "visible" });
  await page.waitForTimeout(1_500);
} finally {
  await browser.close();
}

if (cspBlocks.length > 0) {
  throw new Error(`CSP blocked ${cspBlocks.length} browser resource(s): ${cspBlocks.join(" | ")}`);
}

console.info(
  "Production security check passed: frontend, API 2xx/4xx/OPTIONS, reCAPTCHA, contact and widget",
);
