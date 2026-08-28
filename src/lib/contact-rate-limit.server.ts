import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  ClientAddressError,
  resolveClientAddress,
  type RequestContext,
} from "../../server/request-context";
import { getServerEnvironment } from "../../server/env";

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
  blockedScope?: "ip" | "global";
};

export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    "retry-after": String(result.retryAfterSeconds),
    "x-rate-limit-scope": result.blockedScope ?? "unknown",
  };
}

export class RateLimitError extends Error {
  constructor() {
    super("Rate limit unavailable");
    this.name = "RateLimitError";
  }
}

function getRateLimitConfig() {
  const environment = getServerEnvironment();

  return {
    secret: environment.CONTACT_RATE_LIMIT_SECRET,
    windowSeconds: environment.CONTACT_RATE_LIMIT_WINDOW_SECONDS,
    perIp: environment.CONTACT_RATE_LIMIT_IP_MAX,
    global: environment.CONTACT_RATE_LIMIT_GLOBAL_MAX,
  };
}

type ScopedRateLimitOptions = {
  scope: string;
  secret: string;
  windowSeconds: number;
  perIp: number;
  global: number;
};

type RateLimitDecision = "allowed" | "ip" | "global";

type ConsumeScopedLimit = (input: {
  globalKeyHash: string;
  ipKeyHash: string;
  globalLimit: number;
  ipLimit: number;
  windowSeconds: number;
}) => Promise<RateLimitDecision>;

async function hmac(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

const consumeScopedLimit: ConsumeScopedLimit = async (input) => {
  const { data, error } = await supabaseAdmin.rpc("consume_scoped_rate_limit", {
    p_global_key_hash: input.globalKeyHash,
    p_ip_key_hash: input.ipKeyHash,
    p_global_limit: input.globalLimit,
    p_ip_limit: input.ipLimit,
    p_window_seconds: input.windowSeconds,
  });

  if (error || (data !== "allowed" && data !== "ip" && data !== "global")) {
    throw new RateLimitError();
  }
  return data;
};

export async function checkContactRateLimit(
  request: Request,
  context: RequestContext,
): Promise<RateLimitResult> {
  const config = getRateLimitConfig();
  return checkScopedRateLimit(request, { scope: "contact", ...config }, context);
}

export async function checkScopedRateLimit(
  request: Request,
  options: ScopedRateLimitOptions,
  context: RequestContext,
  consumeLimit: ConsumeScopedLimit = consumeScopedLimit,
): Promise<RateLimitResult> {
  if (!options.secret || options.secret.length < 32) throw new RateLimitError();

  let clientAddress: string;
  try {
    clientAddress = resolveClientAddress(request, context);
  } catch (error) {
    if (error instanceof ClientAddressError) throw new RateLimitError();
    throw error;
  }

  const ipKey = await hmac(`${options.scope}:ip:${clientAddress}`, options.secret);
  const globalKey = await hmac(`${options.scope}:global:v1`, options.secret);
  const decision = await consumeLimit({
    globalKeyHash: globalKey,
    ipKeyHash: ipKey,
    globalLimit: options.global,
    ipLimit: options.perIp,
    windowSeconds: options.windowSeconds,
  });

  return {
    allowed: decision === "allowed",
    retryAfterSeconds: options.windowSeconds,
    blockedScope: decision === "allowed" ? undefined : decision,
  };
}
