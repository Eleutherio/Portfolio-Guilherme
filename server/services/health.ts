import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { isEmailTransportAvailable } from "@/lib/contact-email.server";
import { isRecaptchaServiceAvailable } from "@/lib/contact-recaptcha.server";
import { json } from "../http";

export type ServiceAvailability = "operational" | "unavailable";

export type InfrastructureStatus = {
  ok: boolean;
  checkedAt: string;
  services: {
    backend: ServiceAvailability;
    database: ServiceAvailability;
    smtp: ServiceAvailability;
    recaptcha: ServiceAvailability;
  };
};

type InfrastructureChecks = {
  database: () => Promise<boolean>;
  smtp: () => Promise<boolean>;
  recaptcha: () => Promise<boolean>;
};

const STATUS_CACHE_MS = 5 * 60 * 1000;
const FAILURE_CACHE_MS = 30 * 1000;
let infrastructureCache: { value: InfrastructureStatus; expiresAt: number } | undefined;
let infrastructureCheckPromise: Promise<InfrastructureStatus> | undefined;

const defaultInfrastructureChecks: InfrastructureChecks = {
  database: async () => {
    const { error } = await supabaseAdmin.rpc("app_healthcheck");
    return !error;
  },
  smtp: isEmailTransportAvailable,
  recaptcha: isRecaptchaServiceAvailable,
};

function availability(available: boolean): ServiceAvailability {
  return available ? "operational" : "unavailable";
}

export async function runInfrastructureChecks(
  checks: InfrastructureChecks,
): Promise<InfrastructureStatus> {
  const [database, smtp, recaptcha] = await Promise.allSettled([
    checks.database(),
    checks.smtp(),
    checks.recaptcha(),
  ]);
  const services = {
    backend: "operational" as const,
    database: availability(database.status === "fulfilled" && database.value),
    smtp: availability(smtp.status === "fulfilled" && smtp.value),
    recaptcha: availability(recaptcha.status === "fulfilled" && recaptcha.value),
  };

  return {
    ok: Object.values(services).every((status) => status === "operational"),
    checkedAt: new Date().toISOString(),
    services,
  };
}

export function live(): Response {
  return json({ ok: true, service: "guifer-api" }, 200, { "cache-control": "no-store" });
}

export async function infrastructureStatus(): Promise<Response> {
  const now = Date.now();
  if (!infrastructureCache || infrastructureCache.expiresAt <= now) {
    infrastructureCheckPromise ??= runInfrastructureChecks(defaultInfrastructureChecks);
    const value = await infrastructureCheckPromise.finally(() => {
      infrastructureCheckPromise = undefined;
    });
    infrastructureCache = {
      value,
      expiresAt: now + (value.ok ? STATUS_CACHE_MS : FAILURE_CACHE_MS),
    };
  }

  return json(infrastructureCache.value, 200, {
    "cache-control": "public, max-age=30, stale-while-revalidate=60",
  });
}

export async function dependencies(): Promise<Response> {
  const startedAt = performance.now();
  try {
    const database = await supabaseAdmin.rpc("app_healthcheck");
    if (database.error) throw database.error;

    const retention = await supabaseAdmin.rpc("get_privacy_retention_status");
    const retentionStatus = retention.data?.[0];
    if (retention.error || !retentionStatus?.is_current) {
      return json({ ok: false, database: "available", privacyRetention: "stale" }, 503, {
        "cache-control": "no-store",
        "server-timing": `database;dur=${(performance.now() - startedAt).toFixed(1)}`,
      });
    }

    return json(
      {
        ok: true,
        database: "available",
        privacyRetention: "current",
        privacyRetentionLastRunAt: retentionStatus.last_run_at,
      },
      200,
      {
        "cache-control": "no-store",
        "server-timing": `database;dur=${(performance.now() - startedAt).toFixed(1)}`,
      },
    );
  } catch {
    return json({ ok: false, database: "unavailable", privacyRetention: "unknown" }, 503, {
      "cache-control": "no-store",
      "server-timing": `database;dur=${(performance.now() - startedAt).toFixed(1)}`,
    });
  }
}
