import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  ClientAddressError,
  resolveClientAddress,
  type RequestContext,
} from "../../server/request-context";

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export class RateLimitError extends Error {
  constructor() {
    super("Rate limit unavailable");
    this.name = "RateLimitError";
  }
}

function readInteger(name: string, fallback: number, maximum: number): number {
  const parsed = Number.parseInt(process.env[name] ?? "", 10);
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, maximum);
}

function getRateLimitConfig() {
  const secret = process.env.CONTACT_RATE_LIMIT_SECRET;
  if (!secret || secret.length < 32) throw new RateLimitError();

  return {
    secret,
    windowSeconds: readInteger("CONTACT_RATE_LIMIT_WINDOW_SECONDS", 900, 86_400),
    perIp: readInteger("CONTACT_RATE_LIMIT_IP_MAX", 5, 1_000),
    global: readInteger("CONTACT_RATE_LIMIT_GLOBAL_MAX", 100, 100_000),
  };
}

type ScopedRateLimitOptions = {
  scope: string;
  secret: string;
  windowSeconds: number;
  perIp: number;
  global: number;
};

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

async function consume(keyHash: string, limit: number, windowSeconds: number): Promise<boolean> {
  const { data, error } = await supabaseAdmin.rpc("consume_contact_rate_limit", {
    p_key_hash: keyHash,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });

  if (error || typeof data !== "boolean") throw new RateLimitError();
  return data;
}

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
  const ipAllowed = await consume(ipKey, options.perIp, options.windowSeconds);

  if (!ipAllowed) {
    return { allowed: false, retryAfterSeconds: options.windowSeconds };
  }

  const globalKey = await hmac(`${options.scope}:global:v1`, options.secret);
  const globalAllowed = await consume(globalKey, options.global, options.windowSeconds);
  return { allowed: globalAllowed, retryAfterSeconds: options.windowSeconds };
}
