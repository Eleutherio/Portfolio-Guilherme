import { createHash, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!supabaseUrl || new URL(supabaseUrl).protocol !== "https:") {
  throw new Error("SUPABASE_URL must be a valid HTTPS URL");
}
if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");

function scopedHash(seed, label) {
  return createHash("sha256").update(`${seed}:${label}`).digest("hex");
}

function serviceRoleFetch(input, init) {
  const headers = new Headers(input instanceof Request ? input.headers : undefined);
  new Headers(init?.headers).forEach((value, name) => headers.set(name, value));
  if (
    serviceKey.startsWith("sb_secret_") &&
    headers.get("authorization") === `Bearer ${serviceKey}`
  ) {
    headers.delete("authorization");
  }
  headers.set("apikey", serviceKey);
  return fetch(input, { ...init, headers, signal: AbortSignal.timeout(15_000) });
}

const client = createClient(supabaseUrl, serviceKey, {
  global: { fetch: serviceRoleFetch },
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

const seed = `sec-06-${randomUUID()}`;
const globalKey = scopedHash(seed, "global");
const ipKeys = Array.from({ length: 20 }, (_, index) => scopedHash(seed, `ip:${index}`));
const ipContentionGlobalKey = scopedHash(seed, "ip-contention:global");
const contendedIpKey = scopedHash(seed, "ip-contention:ip");
const followupIpKey = scopedHash(seed, "ip-contention:followup-ip");
const testKeys = [globalKey, ...ipKeys, ipContentionGlobalKey, contendedIpKey, followupIpKey];
let checkPassed = false;

async function consume({ globalKeyHash, ipKeyHash, globalLimit, ipLimit }) {
  const { data, error } = await client.rpc("consume_scoped_rate_limit", {
    p_global_key_hash: globalKeyHash,
    p_ip_key_hash: ipKeyHash,
    p_global_limit: globalLimit,
    p_ip_limit: ipLimit,
    p_window_seconds: 900,
  });
  if (error) throw new Error("Atomic rate-limit RPC failed", { cause: error });
  return data;
}

try {
  const results = await Promise.all(
    ipKeys.map((ipKey) =>
      consume({ globalKeyHash: globalKey, ipKeyHash: ipKey, globalLimit: 5, ipLimit: 1 }),
    ),
  );

  const allowed = results.filter((result) => result === "allowed").length;
  const globallyBlocked = results.filter((result) => result === "global").length;
  if (allowed !== 5 || globallyBlocked !== 15) {
    throw new Error(`Unexpected decisions: allowed=${allowed}, global=${globallyBlocked}`);
  }

  const { data: rows, error: selectError } = await client
    .from("contact_rate_limits")
    .select("key_hash")
    .in("key_hash", testKeys);
  if (selectError) throw new Error("Could not inspect test buckets", { cause: selectError });
  if (rows.length !== 6) {
    throw new Error(`Cardinality check failed: expected 6 scoped rows, received ${rows.length}`);
  }

  const contendedResults = await Promise.all(
    Array.from({ length: 20 }, () =>
      consume({
        globalKeyHash: ipContentionGlobalKey,
        ipKeyHash: contendedIpKey,
        globalLimit: 100,
        ipLimit: 5,
      }),
    ),
  );
  const ipAllowed = contendedResults.filter((result) => result === "allowed").length;
  const ipBlocked = contendedResults.filter((result) => result === "ip").length;
  if (ipAllowed !== 5 || ipBlocked !== 15) {
    throw new Error(`Unexpected IP decisions: allowed=${ipAllowed}, ip=${ipBlocked}`);
  }

  const followupDecision = await consume({
    globalKeyHash: ipContentionGlobalKey,
    ipKeyHash: followupIpKey,
    globalLimit: 100,
    ipLimit: 5,
  });
  if (followupDecision !== "allowed") {
    throw new Error(`Unexpected follow-up decision: ${followupDecision}`);
  }

  const { data: contentionRows, error: contentionError } = await client
    .from("contact_rate_limits")
    .select("key_hash, request_count")
    .in("key_hash", [ipContentionGlobalKey, contendedIpKey, followupIpKey]);
  if (contentionError) {
    throw new Error("Could not inspect IP-contention buckets", { cause: contentionError });
  }
  const counts = new Map(contentionRows.map((row) => [row.key_hash, row.request_count]));
  if (
    contentionRows.length !== 3 ||
    counts.get(ipContentionGlobalKey) !== 6 ||
    counts.get(contendedIpKey) !== 6 ||
    counts.get(followupIpKey) !== 1
  ) {
    throw new Error("IP-contention counters do not preserve global capacity");
  }

  console.info("Atomic rate-limit check passed: global and same-IP contention preserved capacity");
  checkPassed = true;
} finally {
  const { error } = await client.from("contact_rate_limits").delete().in("key_hash", testKeys);
  if (error) {
    const cleanupError = new Error("Could not remove isolated atomic rate-limit test rows", {
      cause: error,
    });
    if (checkPassed) throw cleanupError;
    console.error(cleanupError.message);
  }
}
