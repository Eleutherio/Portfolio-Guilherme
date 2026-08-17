import assert from "node:assert/strict";
import test from "node:test";
import { verifyRelease } from "./release-verifier.mjs";

const FRONTEND_COMMIT = "0123456789abcdef0123456789abcdef01234567";
const API_COMMIT = "89abcdef0123456789abcdef0123456789abcdef";

function response(url, body, cacheControl = "no-store") {
  return {
    ok: true,
    status: 200,
    url,
    headers: new Headers({ "cache-control": cacheControl }),
    json: async () => body,
  };
}

test("release verifier accepts independently recorded platform commits", async () => {
  const requested = [];
  const result = await verifyRelease({
    environment: {
      RELEASE_FRONTEND_COMMIT: FRONTEND_COMMIT.toUpperCase(),
      RELEASE_API_COMMIT: API_COMMIT,
    },
    fetchImplementation: async (url) => {
      requested.push(url.href);
      return url.hostname === "guifer.tech"
        ? response(url.href, { commit: FRONTEND_COMMIT })
        : response(url.href, { ok: true, service: "guifer-api", release: API_COMMIT });
    },
    now: () => new Date("2026-08-14T12:00:00.000Z"),
  });

  assert.deepEqual(requested, [
    "https://guifer.tech/release.json",
    "https://guifer-api.onrender.com/health/live",
  ]);
  assert.deepEqual(result, {
    frontendCommit: FRONTEND_COMMIT,
    apiCommit: API_COMMIT,
    frontendOrigin: "https://guifer.tech",
    apiOrigin: "https://guifer-api.onrender.com",
    verifiedAt: "2026-08-14T12:00:00.000Z",
  });
});

test("release verifier rejects a deployed commit different from the record", async () => {
  await assert.rejects(
    verifyRelease({
      environment: { RELEASE_COMMIT: FRONTEND_COMMIT },
      fetchImplementation: async (url) =>
        url.hostname === "guifer.tech"
          ? response(url.href, { commit: API_COMMIT })
          : response(url.href, { ok: true, service: "guifer-api", release: FRONTEND_COMMIT }),
    }),
    /Cloudflare Pages exposes/,
  );

  await assert.rejects(
    verifyRelease({
      environment: { RELEASE_COMMIT: FRONTEND_COMMIT },
      fetchImplementation: async (url) =>
        url.hostname === "guifer.tech"
          ? response(url.href, { commit: FRONTEND_COMMIT })
          : response(url.href, { ok: true, service: "guifer-api", release: API_COMMIT }),
    }),
    /Render exposes/,
  );
});

test("release verifier rejects unsafe origins and cacheable metadata", async () => {
  await assert.rejects(
    verifyRelease({
      environment: {
        RELEASE_COMMIT: FRONTEND_COMMIT,
        RELEASE_FRONTEND_URL: "https://user:secret@guifer.tech/",
      },
      fetchImplementation: async () => {
        throw new Error("must not fetch");
      },
    }),
    /credential-free HTTPS origin/,
  );

  await assert.rejects(
    verifyRelease({
      environment: { RELEASE_COMMIT: FRONTEND_COMMIT },
      fetchImplementation: async (url) =>
        response(
          url.href,
          url.hostname === "guifer.tech"
            ? { commit: FRONTEND_COMMIT }
            : { ok: true, service: "guifer-api", release: FRONTEND_COMMIT },
          "public, x-no-store",
        ),
    }),
    /Cache-Control: no-store/,
  );

  await assert.rejects(
    verifyRelease({
      environment: { RELEASE_COMMIT: FRONTEND_COMMIT },
      fetchImplementation: async (url) =>
        response("https://redirected.example/release.json", { commit: FRONTEND_COMMIT }),
    }),
    /redirected to a different origin/,
  );
});
