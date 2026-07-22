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

const healthResponseSchema = z.object({
  success: z.boolean(),
  "error-codes": z.array(z.string()).optional(),
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

function configuredSecrets(): string[] {
  const primary = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!primary) return [];

  const previous = process.env.RECAPTCHA_SECRET_KEY_PREVIOUS?.trim();
  return previous && previous !== primary ? [primary, previous] : [primary];
}

function isAcceptedAssessment(
  data: z.infer<typeof verifyResponseSchema>,
  request: Request,
): boolean {
  const hostname = data.hostname?.toLowerCase();
  return (
    data.success &&
    data.action === RECAPTCHA_ACTION &&
    typeof data.score === "number" &&
    data.score >= readMinimumScore() &&
    typeof hostname === "string" &&
    getAllowedHostnames(request).has(hostname) &&
    isRecentChallenge(data.challenge_ts)
  );
}

export async function verifyContactRecaptchaWithSecrets(
  token: string,
  request: Request,
  secrets: string[],
  fetcher: typeof fetch = fetch,
): Promise<void> {
  if (secrets.length === 0) throw new RecaptchaUnavailableError();

  let receivedValidAssessment = false;
  for (const secret of [...new Set(secrets.map((value) => value.trim()).filter(Boolean))]) {
    let response: Response;
    try {
      response = await fetcher(VERIFY_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
        signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
      });
    } catch {
      continue;
    }

    if (!response.ok) continue;

    const result = verifyResponseSchema.safeParse(await response.json().catch(() => null));
    if (!result.success) continue;
    receivedValidAssessment = true;

    if (isAcceptedAssessment(result.data, request)) return;
  }

  if (receivedValidAssessment) throw new RecaptchaRejectedError();
  throw new RecaptchaUnavailableError();
}

export async function verifyContactRecaptcha(token: string, request: Request): Promise<void> {
  return verifyContactRecaptchaWithSecrets(token, request, configuredSecrets());
}

export async function isRecaptchaServiceAvailable(): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return false;

  try {
    const response = await fetch(VERIFY_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: "guifer-health-check" }),
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    });
    if (!response.ok) return false;

    const result = healthResponseSchema.safeParse(await response.json().catch(() => null));
    if (!result.success) return false;

    const errorCodes = result.data["error-codes"] ?? [];
    return (
      result.data.success ||
      (errorCodes.length > 0 &&
        !errorCodes.includes("missing-input-secret") &&
        !errorCodes.includes("invalid-input-secret"))
    );
  } catch {
    return false;
  }
}
