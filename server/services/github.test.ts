import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { configureTestServerEnvironment } from "../test-support/environment";
import {
  getGithubYearStats,
  resetGithubYearStatsCache,
  type GithubYearStatsDependencies,
} from "./github";

const start = Date.parse("2026-08-28T12:00:00.000Z");

beforeEach(() => {
  configureTestServerEnvironment({ GITHUB_TOKEN: "github-test-token" });
  resetGithubYearStatsCache();
});

function dependencies(
  fetcher: typeof fetch,
  now: () => number = () => start,
  timeoutMs = 8_000,
): GithubYearStatsDependencies {
  return { fetcher, now, timeoutMs };
}

test("GitHub returns and caches a valid contribution total for ten minutes", async () => {
  let requests = 0;
  let currentTime = start;
  const deps = dependencies(
    async () => {
      requests += 1;
      return Response.json({
        data: {
          viewer: {
            contributionsCollection: {
              contributionCalendar: { totalContributions: 42 },
            },
          },
        },
      });
    },
    () => currentTime,
  );

  assert.deepEqual(await getGithubYearStats(deps), { total: 42, year: 2026 });
  currentTime += 9 * 60_000;
  assert.deepEqual(await getGithubYearStats(deps), { total: 42, year: 2026 });
  assert.equal(requests, 1);
  currentTime += 2 * 60_000;
  await getGithubYearStats(deps);
  assert.equal(requests, 2);
});

test("GitHub caches provider failures for only one minute", async () => {
  let requests = 0;
  let currentTime = start;
  const observedSignals: AbortSignal[] = [];
  const deps = dependencies(
    async (_input, init) => {
      requests += 1;
      const signal = init?.signal;
      if (signal) observedSignals.push(signal);
      return new Promise<Response>((_resolve, reject) => {
        signal?.addEventListener("abort", () => reject(signal.reason), {
          once: true,
        });
      });
    },
    () => currentTime,
    5,
  );

  assert.equal(await getGithubYearStats(deps), null);
  assert.equal(observedSignals[0]?.aborted, true);
  currentTime += 59_000;
  assert.equal(await getGithubYearStats(deps), null);
  assert.equal(requests, 1);
  currentTime += 2_000;
  assert.equal(await getGithubYearStats(deps), null);
  assert.equal(requests, 2);
});

test("GitHub distinguishes HTTP, GraphQL and malformed payload failures from zero", async () => {
  const fetchers: Array<typeof fetch> = [
    async () => new Response(null, { status: 503 }),
    async () => Response.json({ errors: [{ message: "denied" }] }),
    async () => Response.json({ data: { viewer: {} } }),
  ];

  for (const fetcher of fetchers) {
    resetGithubYearStatsCache();
    assert.equal(await getGithubYearStats(dependencies(fetcher)), null);
  }
});

test("GitHub does not call the provider without a configured token", async () => {
  configureTestServerEnvironment({ GITHUB_TOKEN: undefined });
  let requested = false;
  const result = await getGithubYearStats(
    dependencies(async () => {
      requested = true;
      return Response.json({});
    }),
  );

  assert.equal(result, null);
  assert.equal(requested, false);
});
