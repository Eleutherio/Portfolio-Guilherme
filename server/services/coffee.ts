import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { checkScopedRateLimit, rateLimitHeaders } from "@/lib/contact-rate-limit.server";
import { json, readJsonBody } from "../http";
import { getServerEnvironment } from "../env";
import type { RequestContext } from "../request-context";
import type { RateLimitResult } from "@/lib/contact-rate-limit.server";

const coffeePayloadSchema = z.object({ visitorId: z.string().uuid() }).strict();

export type CoffeeDependencies = {
  readCount: () => Promise<number>;
  insertTap: (visitorId: string) => Promise<{ code?: string } | null>;
  checkRateLimit: (request: Request, context: RequestContext) => Promise<RateLimitResult>;
};

async function readCount(): Promise<number> {
  const { data, error } = await supabaseAdmin.rpc("get_coffee_count");
  if (error) throw error;
  return Number(data ?? 0);
}

const defaultCoffeeDependencies: CoffeeDependencies = {
  readCount,
  insertTap: async (visitorId) => {
    const { error } = await supabaseAdmin.from("coffee_taps").insert({ visitor_id: visitorId });
    return error;
  },
  checkRateLimit: (request, context) => {
    const secret = getServerEnvironment().COFFEE_RATE_LIMIT_SECRET;
    return checkScopedRateLimit(
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
  },
};

export async function handleCoffeeRequest(
  request: Request,
  context: RequestContext,
  dependencies: CoffeeDependencies = defaultCoffeeDependencies,
): Promise<Response> {
  try {
    if (request.method === "GET") return json({ count: await dependencies.readCount() });
    if (request.method !== "POST") return json({ ok: false }, 405, { allow: "GET, POST" });
    const mediaType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
    if (mediaType !== "application/json") {
      return json({ ok: false }, 422);
    }

    let input: unknown;
    try {
      input = await readJsonBody(request, 1024);
    } catch {
      return json({ ok: false }, 422);
    }
    const parsed = coffeePayloadSchema.safeParse(input);
    if (!parsed.success) return json({ ok: false }, 422);

    const rateLimit = await dependencies.checkRateLimit(request, context);
    if (!rateLimit.allowed) {
      return json({ ok: false }, 429, rateLimitHeaders(rateLimit));
    }

    const error = await dependencies.insertTap(parsed.data.visitorId);
    if (error && error.code !== "23505") throw error;
    return json({ count: await dependencies.readCount() });
  } catch {
    return json({ ok: false }, 500);
  }
}
