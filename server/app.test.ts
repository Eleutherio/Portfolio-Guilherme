import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { type AddressInfo } from "node:net";
import { createConnection } from "node:net";
import { once } from "node:events";
import { after, before, test } from "node:test";
import type { ContactPayload } from "@/lib/contact-contract";
import { buildContactEmail, EmailDeliveryError } from "@/lib/contact-email.server";
import { verifyContactRecaptchaWithSecrets } from "@/lib/contact-recaptcha.server";
import { checkScopedRateLimit, rateLimitHeaders } from "@/lib/contact-rate-limit.server";
import { app } from "./app";
import { readJsonBody } from "./http";
import { createApiServer } from "./node-server";
import { ClientAddressError, resolveClientAddress } from "./request-context";
import { runInfrastructureChecks } from "./services/health";

const originalAllowedOrigins = process.env.API_ALLOWED_ORIGINS;
const originalKeepAliveSecret = process.env.KEEP_ALIVE_SECRET;

async function withHttpServer(
  handler: Parameters<typeof createApiServer>[0],
  run: (port: number) => Promise<void>,
) {
  const server = createApiServer(handler);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    await run((server.address() as AddressInfo).port);
  } finally {
    server.close();
    await once(server, "close");
  }
}

async function sendRawHttp(port: number, payload: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const socket = createConnection({ host: "127.0.0.1", port });
    let response = "";
    socket.setEncoding("utf8");
    socket.setTimeout(5_000, () => socket.destroy(new Error("HTTP test timeout")));
    socket.on("connect", () => socket.end(payload));
    socket.on("data", (chunk) => {
      response += chunk;
    });
    socket.on("end", () => resolve(response));
    socket.on("error", reject);
  });
}

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

test("HTTP adapter ignores untrusted authority and forwarded protocol", async () => {
  await withHttpServer(
    async (request) => Response.json({ url: request.url }),
    async (port) => {
      const response = await sendRawHttp(
        port,
        "GET /health/live HTTP/1.1\r\nHost: [invalid\r\nX-Forwarded-Proto: javascript\r\nConnection: close\r\n\r\n",
      );

      assert.match(response, /^HTTP\/1\.1 200 OK/m);
      assert.match(response, /"url":"http:\/\/api\.internal\/health\/live"/);
    },
  );
});

test("HTTP adapter rejects absolute and parser-invalid request targets", async () => {
  await withHttpServer(
    async () => Response.json({ ok: true }),
    async (port) => {
      const absolute = await sendRawHttp(
        port,
        "GET https://attacker.example/health/live HTTP/1.1\r\nHost: guifer-api.onrender.com\r\nConnection: close\r\n\r\n",
      );
      const parserInvalid = await sendRawHttp(
        port,
        "GET /bad path HTTP/1.1\r\nHost: guifer-api.onrender.com\r\nConnection: close\r\n\r\n",
      );
      const backslashAuthority = await sendRawHttp(
        port,
        "GET /\\attacker.example/health/live HTTP/1.1\r\nHost: guifer-api.onrender.com\r\nConnection: close\r\n\r\n",
      );

      assert.match(absolute, /^HTTP\/1\.1 400 Bad Request/m);
      assert.match(absolute, /connection: close/i);
      assert.match(absolute, /\{"ok":false\}/);
      assert.match(parserInvalid, /^HTTP\/1\.1 400 Bad Request/m);
      assert.match(parserInvalid, /\{"ok":false\}/);
      assert.match(backslashAuthority, /^HTTP\/1\.1 400 Bad Request/m);
      assert.match(backslashAuthority, /\{"ok":false\}/);
    },
  );
});

test("HTTP adapter returns defensive headers when the handler fails", async () => {
  const originalConsoleError = console.error;
  console.error = () => undefined;
  try {
    await withHttpServer(
      async () => {
        throw new Error("controlled test failure");
      },
      async (port) => {
        const response = await sendRawHttp(
          port,
          "GET /health/live HTTP/1.1\r\nHost: guifer-api.onrender.com\r\nConnection: close\r\n\r\n",
        );

        assert.match(response, /^HTTP\/1\.1 500 Internal Server Error/m);
        assert.match(response, /content-security-policy:.*frame-ancestors 'none'/i);
        assert.match(response, /strict-transport-security: max-age=31536000/i);
        assert.match(response, /\{"ok":false\}/);
      },
    );
  } finally {
    console.error = originalConsoleError;
  }
});

test("JSON body reader accepts a streamed body at the byte limit", async () => {
  const encoder = new TextEncoder();
  const chunks = [encoder.encode('{"ok"'), encoder.encode(":true}")];
  const maximumBytes = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
  const request = new Request("https://api.example.com/api/coffee", {
    method: "POST",
    body: new ReadableStream<Uint8Array>({
      pull(controller) {
        const chunk = chunks.shift();
        if (chunk) controller.enqueue(chunk);
        else controller.close();
      },
    }),
    duplex: "half",
  } as RequestInit & { duplex: "half" });

  assert.deepEqual(await readJsonBody(request, maximumBytes), { ok: true });
});

test("JSON body reader rejects a declared oversized body before reading the stream", async () => {
  let readerRequested = false;
  let canceled = false;
  const request = {
    headers: new Headers({ "content-length": "1025" }),
    body: {
      cancel() {
        canceled = true;
        return Promise.resolve();
      },
      getReader() {
        readerRequested = true;
        throw new Error("reader_must_not_be_requested");
      },
    },
  } as unknown as Request;

  await assert.rejects(readJsonBody(request, 1_024), /body_too_large/);
  assert.equal(readerRequested, false);
  assert.equal(canceled, true);
});

test("JSON body reader cancels a stream without Content-Length when it exceeds the limit", async () => {
  const encoder = new TextEncoder();
  const chunks = [encoder.encode('{"visitorId":"'), encoder.encode("a".repeat(1_024))];
  let canceled = false;
  const request = new Request("https://api.example.com/api/coffee", {
    method: "POST",
    body: new ReadableStream<Uint8Array>({
      pull(controller) {
        const chunk = chunks.shift();
        if (chunk) controller.enqueue(chunk);
        else controller.close();
      },
      cancel() {
        canceled = true;
      },
    }),
    duplex: "half",
  } as RequestInit & { duplex: "half" });

  assert.equal(request.headers.has("content-length"), false);
  await assert.rejects(readJsonBody(request, 1_024), /body_too_large/);
  assert.equal(canceled, true);
});

test("JSON body reader measures multibyte input in bytes", async () => {
  const request = new Request("https://api.example.com/api/coffee", {
    method: "POST",
    body: '"é"',
  });

  await assert.rejects(readJsonBody(request, 3), /body_too_large/);
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

test("Render client address uses the edge-controlled Cloudflare IP", () => {
  const request = new Request("https://api.example.com/api/contact", {
    headers: {
      "cf-connecting-ip": "2001:db8::10",
      "x-forwarded-for": "198.51.100.20, 198.51.100.30",
    },
  });

  assert.equal(
    resolveClientAddress(request, { peerAddress: "10.0.0.4" }, "render"),
    "2001:db8::10",
  );
});

test("Render client address ignores spoofed forwarding chains", () => {
  const request = new Request("https://api.example.com/api/contact", {
    headers: {
      "cf-connecting-ip": "198.51.100.99",
      "x-forwarded-for": "198.51.100.20, 198.51.100.30",
    },
  });

  assert.equal(
    resolveClientAddress(request, { peerAddress: "10.0.0.4" }, "render"),
    "198.51.100.99",
  );
});

test("Render client address fails closed without a valid edge-controlled header", () => {
  const request = new Request("https://api.example.com/api/contact", {
    headers: {
      "cf-connecting-ip": "spoofed",
      "x-forwarded-for": "198.51.100.20, 198.51.100.30",
    },
  });

  assert.throws(
    () => resolveClientAddress(request, { peerAddress: "10.0.0.4" }, "render"),
    ClientAddressError,
  );
});

test("rate limit distinguishes IP and global blocks for operational verification", async () => {
  const request = new Request("https://api.example.com/api/contact", {
    headers: { "cf-connecting-ip": "198.51.100.99" },
  });
  const options = {
    scope: "contact-test",
    secret: "test-rate-limit-secret-with-32-characters",
    windowSeconds: 900,
    perIp: 5,
    global: 100,
  };

  const ipBlocked = await checkScopedRateLimit(
    request,
    options,
    { peerAddress: "198.51.100.99" },
    async () => "ip",
  );
  const globalBlocked = await checkScopedRateLimit(
    request,
    options,
    { peerAddress: "198.51.100.99" },
    async () => "global",
  );

  assert.equal(ipBlocked.blockedScope, "ip");
  assert.equal(globalBlocked.blockedScope, "global");
  assert.deepEqual(rateLimitHeaders(ipBlocked), {
    "retry-after": "900",
    "x-rate-limit-scope": "ip",
  });
  assert.deepEqual(rateLimitHeaders(globalBlocked), {
    "retry-after": "900",
    "x-rate-limit-scope": "global",
  });
});

test("rate limit uses one atomic scoped decision with distinct HMAC keys", async () => {
  const request = new Request("https://api.example.com/api/contact");
  let received:
    | {
        globalKeyHash: string;
        ipKeyHash: string;
        globalLimit: number;
        ipLimit: number;
        windowSeconds: number;
      }
    | undefined;

  const result = await checkScopedRateLimit(
    request,
    {
      scope: "atomic-test",
      secret: "test-rate-limit-secret-with-32-characters",
      windowSeconds: 900,
      perIp: 5,
      global: 100,
    },
    { peerAddress: "198.51.100.99" },
    async (input) => {
      received = input;
      return "allowed";
    },
  );

  assert.equal(result.allowed, true);
  assert.equal(received?.globalLimit, 100);
  assert.equal(received?.ipLimit, 5);
  assert.equal(received?.windowSeconds, 900);
  assert.match(received?.globalKeyHash ?? "", /^[a-f0-9]{64}$/);
  assert.match(received?.ipKeyHash ?? "", /^[a-f0-9]{64}$/);
  assert.notEqual(received?.globalKeyHash, received?.ipKeyHash);
});

test("atomic rate-limit migration locks global state before creating an IP bucket", async () => {
  const migration = await readFile(
    new URL("../supabase/migrations/20260813150000_atomic_scoped_rate_limits.sql", import.meta.url),
    "utf8",
  );
  const globalLock = migration.indexOf("SET updated_at = global_limits.updated_at");
  const globalState = migration.indexOf(
    "RETURNING window_started_at, request_count\n  INTO v_global_window_started_at, v_global_count",
  );
  const globalGuard = migration.indexOf("IF v_global_count >= p_global_limit");
  const ipInsert = migration.indexOf("VALUES (p_ip_key_hash, v_now, 1, v_now)");

  assert.ok(globalLock >= 0 && globalLock < globalState && globalState < globalGuard);
  assert.ok(globalGuard < ipInsert);
  assert.doesNotMatch(migration, /ON CONFLICT \(key_hash\) DO NOTHING/);
  assert.match(
    migration,
    /IF NOT v_ip_allowed THEN\s+RETURN 'ip';\s+END IF;\s+UPDATE public\.contact_rate_limits/s,
  );
  assert.match(migration, /FOR UPDATE SKIP LOCKED/);
  assert.doesNotMatch(migration, /DROP FUNCTION public\.consume_contact_rate_limit/);
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
  assert.match(headersFile, /img-src[^;]+app\.greenweb\.org/);
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
