import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { checkScopedRateLimit, rateLimitHeaders } from "@/lib/contact-rate-limit.server";
import { json, readJsonBody } from "../http";
import { getServerEnvironment } from "../env";
import type { RequestContext } from "../request-context";

const coffeePayloadSchema = z.object({ visitorId: z.string().uuid() }).strict();

async function readCount(): Promise<number> {
  const { data, error } = await supabaseAdmin.rpc("get_coffee_count");
  if (error) throw error;
  return Number(data ?? 0);
}

export async function handleCoffeeRequest(
  request: Request,
  context: RequestContext,
): Promise<Response> {
  try {
    if (request.method === "GET") return json({ count: await readCount() });
    if (request.method !== "POST") return json({ ok: false }, 405, { allow: "GET, POST" });
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      return json({ ok: false }, 422);
    }

    const parsed = coffeePayloadSchema.safeParse(await readJsonBody(request, 1024));
    if (!parsed.success) return json({ ok: false }, 422);

    const secret = getServerEnvironment().COFFEE_RATE_LIMIT_SECRET;
    const rateLimit = await checkScopedRateLimit(
      request,
      {
        scope: "coffee",
        secret,
        windowSeconds: 86_400,
        perIp: 20,
        global: 1_000,
      },
      context,
    );
    if (!rateLimit.allowed) {
      return json({ ok: false }, 429, rateLimitHeaders(rateLimit));
    }

    const { error } = await supabaseAdmin
      .from("coffee_taps")
      .insert({ visitor_id: parsed.data.visitorId });
    if (error && error.code !== "23505") throw error;
    return json({ count: await readCount() });
  } catch {
    return json({ ok: false }, 500);
  }
}
