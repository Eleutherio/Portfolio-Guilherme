import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { json } from "../http";

export function live(): Response {
  return json({ ok: true, service: "guifer-api" }, 200, { "cache-control": "no-store" });
}

export async function dependencies(): Promise<Response> {
  const startedAt = performance.now();
  try {
    const { error } = await supabaseAdmin.rpc("app_healthcheck");
    if (error) throw error;

    return json({ ok: true, database: "available" }, 200, {
      "cache-control": "no-store",
      "server-timing": `database;dur=${(performance.now() - startedAt).toFixed(1)}`,
    });
  } catch {
    return json({ ok: false, database: "unavailable" }, 503, {
      "cache-control": "no-store",
      "server-timing": `database;dur=${(performance.now() - startedAt).toFixed(1)}`,
    });
  }
}
