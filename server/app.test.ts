import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { app } from "./app";

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

test("dependency health check requires the keep-alive secret", async () => {
  const response = await app(new Request("https://api.example.com/health/dependencies"));
  assert.equal(response.status, 401);
  assert.equal(response.headers.get("www-authenticate"), "Bearer");
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
