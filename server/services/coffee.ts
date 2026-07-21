import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { checkScopedRateLimit, RateLimitError } from "@/lib/contact-rate-limit.server";
import { json, readJsonBody } from "../http";
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

    const secret = process.env.COFFEE_RATE_LIMIT_SECRET ?? process.env.CONTACT_RATE_LIMIT_SECRET;
    if (!secret) throw new RateLimitError();
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
      return json({ ok: false }, 429, { "retry-after": String(rateLimit.retryAfterSeconds) });
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
