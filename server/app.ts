import { handleContactRequest } from "@/lib/contact-handler.server";
import { createHash, timingSafeEqual } from "node:crypto";
import { json } from "./http";
import { dependencies, infrastructureStatus, live } from "./services/health";
import { getGithubYearStats } from "./services/github";
import { handleCoffeeRequest } from "./services/coffee";
import type { RequestContext } from "./request-context";

const API_PATHS = new Set([
  "/health/live",
  "/health/status",
  "/health/dependencies",
  "/api/contact",
  "/api/github",
  "/api/coffee",
]);

function configuredOrigins(): Set<string> {
  const origins = new Set<string>();
  for (const value of (
    process.env.API_ALLOWED_ORIGINS ??
    process.env.CONTACT_ALLOWED_ORIGINS ??
    ""
  ).split(",")) {
    const origin = value.trim();
    if (origin) origins.add(origin);
  }
  return origins;
}

function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("origin");
  if (!origin || !configuredOrigins().has(origin)) return {};
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "600",
    vary: "Origin",
  };
}

function isAllowedRequestOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || configuredOrigins().has(origin);
}

function isKeepAliveAuthorized(request: Request): boolean {
  const expected = process.env.KEEP_ALIVE_SECRET;
  const authorization = request.headers.get("authorization");
  if (!expected || expected.length < 32 || !authorization?.startsWith("Bearer ")) return false;

  const received = authorization.slice("Bearer ".length);
  const expectedDigest = createHash("sha256").update(expected).digest();
  const receivedDigest = createHash("sha256").update(received).digest();
  return timingSafeEqual(expectedDigest, receivedDigest);
}

function secure(response: Response, request: Request): Response {
  const headers = new Headers(response.headers);
  const cors = corsHeaders(request);
  new Headers(cors).forEach((value, key) => headers.set(key, value));
  headers.set(
    "content-security-policy",
    "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  );
  headers.set("cross-origin-opener-policy", "same-origin");
  headers.set("cross-origin-resource-policy", "same-origin");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  headers.set("referrer-policy", "no-referrer");
  headers.set("strict-transport-security", "max-age=31536000");
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "DENY");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function app(request: Request, context: RequestContext = {}): Promise<Response> {
  const { pathname } = new URL(request.url);
  if (!API_PATHS.has(pathname)) return secure(json({ ok: false }, 404), request);

  if (request.method === "OPTIONS") {
    if (!isAllowedRequestOrigin(request)) return secure(json({ ok: false }, 403), request);
    return secure(new Response(null, { status: 204 }), request);
  }

  if (!isAllowedRequestOrigin(request)) return secure(json({ ok: false }, 403), request);

  let response: Response;
  if (pathname === "/health/live") {
    response = request.method === "GET" ? live() : json({ ok: false }, 405, { allow: "GET" });
  } else if (pathname === "/health/status") {
    response =
      request.method === "GET"
        ? await infrastructureStatus()
        : json({ ok: false }, 405, { allow: "GET" });
  } else if (pathname === "/health/dependencies") {
    if (request.method !== "GET") {
      response = json({ ok: false }, 405, { allow: "GET" });
    } else if (!isKeepAliveAuthorized(request)) {
      response = json({ ok: false }, 401, { "www-authenticate": "Bearer" });
    } else {
      response = await dependencies();
    }
  } else if (pathname === "/api/contact") {
    response =
      request.method === "POST"
        ? await handleContactRequest(request, context)
        : json({ ok: false, code: "method_not_allowed" }, 405, { allow: "POST" });
  } else if (pathname === "/api/github") {
    response =
      request.method === "GET"
        ? json(await getGithubYearStats(), 200, { "cache-control": "public, max-age=300" })
        : json({ ok: false }, 405, { allow: "GET" });
  } else {
    response = await handleCoffeeRequest(request, context);
  }

  return secure(response, request);
}
