import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function serverClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

async function readCount(sb: ReturnType<typeof serverClient>): Promise<number> {
  const { data, error } = await sb.rpc("get_coffee_count");
  if (error) throw error;
  return Number(data ?? 0);
}

export const getCoffeeCount = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return { count: await readCount(serverClient()) };
  } catch (err) {
    console.error("coffee count failed", err);
    return { count: 0 };
  }
});

export const tapCoffee = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ visitorId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const sb = serverClient();
    // Silently ignore unique-violation (already tapped)
    const { error } = await sb
      .from("coffee_taps")
      .insert({ visitor_id: data.visitorId });
    if (error && error.code !== "23505") {
      console.error("coffee tap failed", error);
    }
    try {
      return { count: await readCount(sb) };
    } catch {
      return { count: 0 };
    }
  });
