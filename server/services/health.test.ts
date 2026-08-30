import assert from "node:assert/strict";
import { test } from "node:test";
import { dependencies, type DependencyHealthChecks } from "./health";

function checks(overrides: Partial<DependencyHealthChecks> = {}): DependencyHealthChecks {
  return {
    database: async () => ({ error: null }),
    retention: async () => ({
      data: [{ is_current: true, last_run_at: "2026-08-28T03:17:00.000Z" }],
      error: null,
    }),
    ...overrides,
  };
}

test("dependency health reports current privacy retention", async () => {
  const response = await dependencies(checks());

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    database: "available",
    privacyRetention: "current",
    privacyRetentionLastRunAt: "2026-08-28T03:17:00.000Z",
  });
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.match(response.headers.get("server-timing") ?? "", /^database;dur=/u);
});

test("dependency health distinguishes stale retention from unavailable database", async () => {
  const stale = await dependencies(
    checks({ retention: async () => ({ data: [{ is_current: false }], error: null }) }),
  );
  const retentionFailure = await dependencies(
    checks({ retention: async () => ({ data: null, error: new Error("retention") }) }),
  );
  const databaseFailure = await dependencies(
    checks({ database: async () => ({ error: new Error("database") }) }),
  );

  assert.equal(stale.status, 503);
  assert.deepEqual(await stale.json(), {
    ok: false,
    database: "available",
    privacyRetention: "stale",
  });
  assert.equal(retentionFailure.status, 503);
  assert.deepEqual(await retentionFailure.json(), {
    ok: false,
    database: "available",
    privacyRetention: "stale",
  });
  assert.equal(databaseFailure.status, 503);
  assert.deepEqual(await databaseFailure.json(), {
    ok: false,
    database: "unavailable",
    privacyRetention: "unknown",
  });
});

test("dependency health contains rejected Supabase operations", async () => {
  const response = await dependencies(
    checks({ database: async () => Promise.reject(new Error("timeout")) }),
  );

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    ok: false,
    database: "unavailable",
    privacyRetention: "unknown",
  });
});
