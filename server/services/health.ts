import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { json } from "../http";

export function live(): Response {
  return json({ ok: true, service: "guifer-api" }, 200, { "cache-control": "no-store" });
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
