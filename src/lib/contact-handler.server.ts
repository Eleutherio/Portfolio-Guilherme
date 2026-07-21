import {
  CONTACT_BODY_MAX_BYTES,
  contactPayloadSchema,
  type ContactApiResponse,
} from "@/lib/contact-contract";
import { EmailDeliveryError, sendContactEmail } from "@/lib/contact-email.server";
import { checkContactRateLimit, RateLimitError } from "@/lib/contact-rate-limit.server";
import {
  RecaptchaRejectedError,
  RecaptchaUnavailableError,
  verifyContactRecaptcha,
} from "@/lib/contact-recaptcha.server";
import type { RequestContext } from "../../server/request-context";

class InvalidRequestError extends Error {
  constructor() {
    super("Invalid request");
    this.name = "InvalidRequestError";
  }
}

function jsonResponse(payload: ContactApiResponse, status: number, headers?: HeadersInit) {
  return Response.json(payload, {
    status,
    headers: {
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      ...headers,
    },
  });
}

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const allowed = new Set([new URL(request.url).origin]);
  for (const configured of (process.env.CONTACT_ALLOWED_ORIGINS ?? "").split(",")) {
    const value = configured.trim();
    if (value) allowed.add(value);
  }
  return allowed.has(origin);
}

async function readBodyWithLimit(request: Request): Promise<string> {
  const declaredLength = Number.parseInt(request.headers.get("content-length") ?? "", 10);
  if (Number.isFinite(declaredLength) && declaredLength > CONTACT_BODY_MAX_BYTES) {
    throw new InvalidRequestError();
  }

  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > CONTACT_BODY_MAX_BYTES) {
        await reader.cancel();
        throw new InvalidRequestError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

function logFailure(requestId: string, error: unknown) {
  const category =
    error instanceof RateLimitError
      ? "rate_limit_unavailable"
      : error instanceof EmailDeliveryError
        ? "email_delivery_failed"
        : error instanceof RecaptchaUnavailableError
          ? "recaptcha_unavailable"
          : "unexpected_error";

  console.error("[contact] request failed", { requestId, category });
}

export async function handleContactRequest(
  request: Request,
  context: RequestContext,
): Promise<Response> {
  const requestId = crypto.randomUUID();

  try {
    if (!isAllowedOrigin(request)) throw new InvalidRequestError();
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      throw new InvalidRequestError();
    }

    const rateLimit = await checkContactRateLimit(request, context);
    if (!rateLimit.allowed) {
      return jsonResponse({ ok: false, code: "rate_limited" }, 429, {
        "retry-after": String(rateLimit.retryAfterSeconds),
      });
    }

    const body = await readBodyWithLimit(request);
    let input: unknown;
    try {
      input = JSON.parse(body);
    } catch {
      throw new InvalidRequestError();
    }

    if (
      input != null &&
      typeof input === "object" &&
      "website" in input &&
      typeof input.website === "string" &&
      input.website.trim() !== ""
    ) {
      return jsonResponse({ ok: true }, 202);
    }

    const parsed = contactPayloadSchema.safeParse(input);
    if (!parsed.success || !parsed.data.antiBotToken) throw new InvalidRequestError();

    await verifyContactRecaptcha(parsed.data.antiBotToken, request);
    await sendContactEmail(parsed.data, requestId);
    return jsonResponse({ ok: true }, 202);
  } catch (error) {
    if (error instanceof InvalidRequestError || error instanceof RecaptchaRejectedError) {
      return jsonResponse({ ok: false, code: "invalid_request" }, 422);
    }
    logFailure(requestId, error);
    return jsonResponse({ ok: false, code: "server_error" }, 500);
  }
}
