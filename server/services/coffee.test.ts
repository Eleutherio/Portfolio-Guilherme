import assert from "node:assert/strict";
import { test } from "node:test";
import { handleCoffeeRequest, type CoffeeDependencies } from "./coffee";

const visitorId = "ee67967a-f691-43e6-8256-ddeb4575af16";

function dependencies(overrides: Partial<CoffeeDependencies> = {}): CoffeeDependencies {
  return {
    readCount: async () => 7,
    insertTap: async () => null,
    checkRateLimit: async () => ({ allowed: true, retryAfterSeconds: 86_400 }),
    ...overrides,
  };
}

function post(body: string, contentType = "application/json") {
  return new Request("https://api.example.com/api/coffee", {
    method: "POST",
    headers: { "content-type": contentType },
    body,
  });
}

test("coffee reads the aggregate and records a valid tap", async () => {
  const inserted: string[] = [];
  const deps = dependencies({
    readCount: async () => 8,
    insertTap: async (value) => {
      inserted.push(value);
      return null;
    },
  });

  const getResponse = await handleCoffeeRequest(
    new Request("https://api.example.com/api/coffee"),
    {},
    deps,
  );
  const postResponse = await handleCoffeeRequest(
    post(JSON.stringify({ visitorId })),
    { peerAddress: "127.0.0.1" },
    deps,
  );

  assert.equal(getResponse.status, 200);
  assert.deepEqual(await getResponse.json(), { count: 8 });
  assert.equal(postResponse.status, 200);
  assert.deepEqual(await postResponse.json(), { count: 8 });
  assert.deepEqual(inserted, [visitorId]);
});

test("coffee treats a duplicate visitor as an idempotent success", async () => {
  const response = await handleCoffeeRequest(
    post(JSON.stringify({ visitorId })),
    {},
    dependencies({ insertTap: async () => ({ code: "23505" }) }),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { count: 7 });
});

test("coffee rejects unsupported methods and malformed client input", async () => {
  const deps = dependencies();
  const responses = await Promise.all([
    handleCoffeeRequest(
      new Request("https://api.example.com/api/coffee", { method: "DELETE" }),
      {},
      deps,
    ),
    handleCoffeeRequest(post("{}", "text/plain"), {}, deps),
    handleCoffeeRequest(post("{}", "application/jsonp"), {}, deps),
    handleCoffeeRequest(post("not-json"), {}, deps),
    handleCoffeeRequest(post(JSON.stringify({ visitorId: "invalid" })), {}, deps),
    handleCoffeeRequest(post(JSON.stringify({ visitorId, extra: true })), {}, deps),
    handleCoffeeRequest(post(`${" ".repeat(1_025)}${JSON.stringify({ visitorId })}`), {}, deps),
  ]);

  assert.deepEqual(
    responses.map((response) => response.status),
    [405, 422, 422, 422, 422, 422, 422],
  );
  assert.equal(responses[0].headers.get("allow"), "GET, POST");
});

test("coffee exposes rate-limit metadata without inserting", async () => {
  let inserted = false;
  const response = await handleCoffeeRequest(
    post(JSON.stringify({ visitorId })),
    {},
    dependencies({
      checkRateLimit: async () => ({
        allowed: false,
        retryAfterSeconds: 86_400,
        blockedScope: "ip",
      }),
      insertTap: async () => {
        inserted = true;
        return null;
      },
    }),
  );

  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "86400");
  assert.equal(response.headers.get("x-rate-limit-scope"), "ip");
  assert.equal(inserted, false);
});

test("coffee contains Supabase and rate-limit failures as server errors", async () => {
  const failures = await Promise.all([
    handleCoffeeRequest(
      new Request("https://api.example.com/api/coffee"),
      {},
      dependencies({ readCount: async () => Promise.reject(new Error("database")) }),
    ),
    handleCoffeeRequest(
      post(JSON.stringify({ visitorId })),
      {},
      dependencies({ insertTap: async () => ({ code: "XX000" }) }),
    ),
    handleCoffeeRequest(
      post(JSON.stringify({ visitorId })),
      {},
      dependencies({ checkRateLimit: async () => Promise.reject(new Error("rate limit")) }),
    ),
  ]);

  assert.deepEqual(
    failures.map((response) => response.status),
    [500, 500, 500],
  );
  for (const response of failures) assert.deepEqual(await response.json(), { ok: false });
});
