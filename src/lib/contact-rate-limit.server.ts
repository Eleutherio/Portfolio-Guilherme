import "@tanstack/react-start/server-only";

import { supabaseAdmin } from "@/integrations/supabase/client.server";

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

function getClientAddress(request: Request): string {
  const address =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  return address.slice(0, 128);
}

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

export async function checkContactRateLimit(request: Request): Promise<RateLimitResult> {
  const config = getRateLimitConfig();
  const ipKey = await hmac(`ip:${getClientAddress(request)}`, config.secret);
  const ipAllowed = await consume(ipKey, config.perIp, config.windowSeconds);

  if (!ipAllowed) {
    return { allowed: false, retryAfterSeconds: config.windowSeconds };
  }

  const globalKey = await hmac("global:v1", config.secret);
  const globalAllowed = await consume(globalKey, config.global, config.windowSeconds);
  return { allowed: globalAllowed, retryAfterSeconds: config.windowSeconds };
}
