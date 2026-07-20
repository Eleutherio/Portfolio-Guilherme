import { z } from "zod";
import { RECAPTCHA_ACTION } from "@/lib/contact-contract";

const VERIFY_ENDPOINT = "https://www.google.com/recaptcha/api/siteverify";
const VERIFY_TIMEOUT_MS = 7_000;
const TOKEN_MAX_AGE_MS = 2 * 60 * 1000;

const verifyResponseSchema = z.object({
  success: z.boolean(),
  score: z.number().min(0).max(1).optional(),
  action: z.string().optional(),
  challenge_ts: z.string().optional(),
  hostname: z.string().optional(),
});

export class RecaptchaRejectedError extends Error {
  constructor() {
    super("reCAPTCHA rejected");
    this.name = "RecaptchaRejectedError";
  }
}

export class RecaptchaUnavailableError extends Error {
  constructor() {
    super("reCAPTCHA unavailable");
    this.name = "RecaptchaUnavailableError";
  }
}

function readMinimumScore(): number {
  const parsed = Number.parseFloat(process.env.RECAPTCHA_MIN_SCORE ?? "0.5");
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : 0.5;
}

function getAllowedHostnames(request: Request): Set<string> {
  const allowed = new Set([new URL(request.url).hostname.toLowerCase()]);
  for (const configured of (process.env.RECAPTCHA_ALLOWED_HOSTNAMES ?? "").split(",")) {
    const hostname = configured.trim().toLowerCase();
    if (hostname) allowed.add(hostname);
  }
  return allowed;
}

function isRecentChallenge(timestamp: string | undefined): boolean {
  if (!timestamp) return false;
  const challengeTime = Date.parse(timestamp);
  if (!Number.isFinite(challengeTime)) return false;
  const age = Date.now() - challengeTime;
  return age >= -30_000 && age <= TOKEN_MAX_AGE_MS;
}

export async function verifyContactRecaptcha(token: string, request: Request): Promise<void> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) throw new RecaptchaUnavailableError();

  const body = new URLSearchParams({ secret, response: token });
  let response: Response;
  try {
    response = await fetch(VERIFY_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    });
  } catch {
    throw new RecaptchaUnavailableError();
  }

  if (!response.ok) throw new RecaptchaUnavailableError();

  const result = verifyResponseSchema.safeParse(await response.json().catch(() => null));
  if (!result.success) throw new RecaptchaUnavailableError();

  const hostname = result.data.hostname?.toLowerCase();
  const accepted =
    result.data.success &&
    result.data.action === RECAPTCHA_ACTION &&
    typeof result.data.score === "number" &&
    result.data.score >= readMinimumScore() &&
    typeof hostname === "string" &&
    getAllowedHostnames(request).has(hostname) &&
    isRecentChallenge(result.data.challenge_ts);

  if (!accepted) throw new RecaptchaRejectedError();
}
