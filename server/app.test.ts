import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { after, before, test } from "node:test";
import type { ContactPayload } from "@/lib/contact-contract";
import { buildContactEmail, EmailDeliveryError } from "@/lib/contact-email.server";
import { verifyContactRecaptchaWithSecrets } from "@/lib/contact-recaptcha.server";
import { app } from "./app";
import { ClientAddressError, resolveClientAddress } from "./request-context";
import { runInfrastructureChecks } from "./services/health";

const originalAllowedOrigins = process.env.API_ALLOWED_ORIGINS;
const originalKeepAliveSecret = process.env.KEEP_ALIVE_SECRET;

before(() => {
  process.env.API_ALLOWED_ORIGINS = "https://guifer.tech";
});

after(() => {
  if (originalAllowedOrigins === undefined) delete process.env.API_ALLOWED_ORIGINS;
  else process.env.API_ALLOWED_ORIGINS = originalAllowedOrigins;
  if (originalKeepAliveSecret === undefined) delete process.env.KEEP_ALIVE_SECRET;
  else process.env.KEEP_ALIVE_SECRET = originalKeepAliveSecret;
});

test("live health check is public and independent from dependencies", async () => {
  const response = await app(new Request("https://api.example.com/health/live"));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, service: "guifer-api" });
});

test("infrastructure status normalizes operational and unavailable services", async () => {
  const status = await runInfrastructureChecks({
    database: async () => true,
    smtp: async () => false,
    recaptcha: async () => true,
  });

  assert.equal(status.ok, false);
  assert.deepEqual(status.services, {
    backend: "operational",
    database: "operational",
    smtp: "unavailable",
    recaptcha: "operational",
  });
  assert.equal(Number.isNaN(Date.parse(status.checkedAt)), false);
});

test("infrastructure status contains rejected checks", async () => {
  const status = await runInfrastructureChecks({
    database: async () => {
      throw new Error("database unavailable");
    },
    smtp: async () => true,
    recaptcha: async () => true,
  });

  assert.equal(status.ok, false);
  assert.equal(status.services.database, "unavailable");
});

test("dependency health check requires the keep-alive secret", async () => {
  const response = await app(new Request("https://api.example.com/health/dependencies"));
  assert.equal(response.status, 401);
  assert.equal(response.headers.get("www-authenticate"), "Bearer");
});

test("infrastructure status only accepts GET", async () => {
  const response = await app(
    new Request("https://api.example.com/health/status", { method: "POST" }),
  );
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET");
});

test("dependency health check rejects an invalid bearer token", async () => {
  process.env.KEEP_ALIVE_SECRET = "correct-test-secret-with-at-least-32-characters";
  const response = await app(
    new Request("https://api.example.com/health/dependencies", {
      headers: { authorization: "Bearer invalid-test-secret-with-at-least-32-characters" },
    }),
  );
  delete process.env.KEEP_ALIVE_SECRET;
  assert.equal(response.status, 401);
});

test("allowed browser origin receives CORS headers", async () => {
  const response = await app(
    new Request("https://api.example.com/api/contact", {
      method: "OPTIONS",
      headers: { origin: "https://guifer.tech" },
    }),
  );
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("access-control-allow-origin"), "https://guifer.tech");
  assert.equal(response.headers.get("vary"), "Origin");
});

test("unknown browser origins are rejected", async () => {
  const response = await app(
    new Request("https://api.example.com/api/contact", {
      method: "OPTIONS",
      headers: { origin: "https://malicious.example" },
    }),
  );
  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), { ok: false });
});

test("unknown routes return a hardened JSON 404", async () => {
  const response = await app(new Request("https://api.example.com/unknown"));
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
});

test("direct client address uses the trusted socket peer", () => {
  const request = new Request("http://localhost/api/contact", {
    headers: {
      "cf-connecting-ip": "198.51.100.10",
      "x-forwarded-for": "198.51.100.20",
    },
  });

  assert.equal(resolveClientAddress(request, { peerAddress: "::1" }, "direct"), "::1");
});

test("Render client address uses only the first forwarded IP", () => {
  const request = new Request("https://api.example.com/api/contact", {
    headers: {
      "cf-connecting-ip": "198.51.100.99",
      "x-forwarded-for": "2001:db8::10, 198.51.100.20, 198.51.100.30",
    },
  });

  assert.equal(
    resolveClientAddress(request, { peerAddress: "10.0.0.4" }, "render"),
    "2001:db8::10",
  );
});

test("Render client address fails closed when its trusted header is invalid", () => {
  const request = new Request("https://api.example.com/api/contact", {
    headers: { "x-forwarded-for": "spoofed, 198.51.100.30" },
  });

  assert.throws(
    () => resolveClientAddress(request, { peerAddress: "10.0.0.4" }, "render"),
    ClientAddressError,
  );
});

test("API responses include the defensive header baseline", async () => {
  const response = await app(new Request("https://api.example.com/unknown"));

  assert.equal(
    response.headers.get("content-security-policy"),
    "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  );
  assert.equal(response.headers.get("cross-origin-opener-policy"), "same-origin");
  assert.equal(response.headers.get("cross-origin-resource-policy"), "same-origin");
  assert.equal(response.headers.get("strict-transport-security"), "max-age=31536000");
});

test("Pages headers enforce the CSP and isolation policy required by the frontend", async () => {
  const headersFile = await readFile(new URL("../public/_headers", import.meta.url), "utf8");

  assert.match(headersFile, /Content-Security-Policy: default-src 'self'/);
  assert.match(headersFile, /frame-ancestors 'none'/);
  assert.match(headersFile, /script-src[^;]+www\.google\.com\/recaptcha\//);
  assert.match(headersFile, /frame-src[^;]+recaptcha\.google\.com\/recaptcha\//);
  assert.match(headersFile, /connect-src[^;]+guifer-api\.onrender\.com/);
  assert.match(headersFile, /Strict-Transport-Security: max-age=31536000; includeSubDomains/);
  assert.match(headersFile, /Cross-Origin-Opener-Policy: same-origin/);
  assert.match(headersFile, /Cross-Origin-Resource-Policy: same-origin/);
  assert.doesNotMatch(headersFile, /Cross-Origin-Embedder-Policy/);
});

test("defensive headers cover success, preflight, client error and server error", async () => {
  const originalClientIpSource = process.env.CLIENT_IP_SOURCE;
  const originalRateLimitSecret = process.env.CONTACT_RATE_LIMIT_SECRET;
  const originalConsoleError = console.error;

  process.env.CLIENT_IP_SOURCE = "render";
  process.env.CONTACT_RATE_LIMIT_SECRET = "test-rate-limit-secret-with-32-characters";
  console.error = () => undefined;

  try {
    const responses = [
      await app(new Request("https://api.example.com/health/live")),
      await app(
        new Request("https://api.example.com/api/contact", {
          method: "OPTIONS",
          headers: { origin: "https://guifer.tech" },
        }),
      ),
      await app(new Request("https://api.example.com/unknown")),
      await app(
        new Request("https://api.example.com/api/contact", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "{}",
        }),
      ),
    ];

    assert.deepEqual(
      responses.map((response) => response.status),
      [200, 204, 404, 500],
    );

    for (const response of responses) {
      assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
      assert.equal(response.headers.get("cross-origin-opener-policy"), "same-origin");
      assert.equal(response.headers.get("strict-transport-security"), "max-age=31536000");
    }
  } finally {
    console.error = originalConsoleError;
    if (originalClientIpSource === undefined) delete process.env.CLIENT_IP_SOURCE;
    else process.env.CLIENT_IP_SOURCE = originalClientIpSource;
    if (originalRateLimitSecret === undefined) delete process.env.CONTACT_RATE_LIMIT_SECRET;
    else process.env.CONTACT_RATE_LIMIT_SECRET = originalRateLimitSecret;
  }
});

const validContactPayload: ContactPayload = {
  name: "Security Test",
  email: "visitor@example.com",
  subject: "Safe subject",
  message: "Message with <script>alert('x')</script> content.",
  website: "",
  locale: "en",
  antiBotToken: "test-token",
};

test("contact email keeps the sender fixed and visitor only in Reply-To", () => {
  const mail = buildContactEmail(validContactPayload, "ee67967a-f691-43e6-8256-ddeb4575af16", {
    from: "Portfolio <contact@guifer.tech>",
    to: "inbox@guifer.tech",
  });

  assert.equal(mail.from, "Portfolio <contact@guifer.tech>");
  assert.equal(mail.to, "inbox@guifer.tech");
  assert.deepEqual(mail.replyTo, { address: "visitor@example.com", name: "Security Test" });
  assert.deepEqual(mail.headers, {
    "X-Contact-Request-ID": "ee67967a-f691-43e6-8256-ddeb4575af16",
  });
  assert.match(String(mail.html), /&lt;script&gt;alert\(&#39;x&#39;\)&lt;\/script&gt;/);
  assert.doesNotMatch(String(mail.html), /<script>/);
});

test("contact email rejects control-character header injection", () => {
  assert.throws(
    () =>
      buildContactEmail(
        { ...validContactPayload, subject: "Safe\r\nBcc: attacker@example.com" },
        "ee67967a-f691-43e6-8256-ddeb4575af16",
        { from: "Portfolio <contact@guifer.tech>", to: "inbox@guifer.tech" },
      ),
    EmailDeliveryError,
  );
});

test("reCAPTCHA accepts the previous secret during a controlled rotation", async () => {
  const usedSecrets: string[] = [];
  const fetcher: typeof fetch = async (_input, init) => {
    const body = init?.body as URLSearchParams;
    const secret = body.get("secret") ?? "";
    usedSecrets.push(secret);

    if (secret === "new-secret") {
      return Response.json({ success: false, "error-codes": ["invalid-input-response"] });
    }

    return Response.json({
      success: true,
      action: "contact_submit",
      score: 0.9,
      hostname: "api.example.com",
      challenge_ts: new Date().toISOString(),
    });
  };

  await verifyContactRecaptchaWithSecrets(
    "valid-token",
    new Request("https://api.example.com/api/contact"),
    ["new-secret", "previous-secret"],
    fetcher,
  );

  assert.deepEqual(usedSecrets, ["new-secret", "previous-secret"]);
});
