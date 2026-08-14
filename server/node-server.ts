import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { Readable } from "node:stream";
import { app } from "./app";
import type { RequestContext } from "./request-context";

type AppHandler = (request: Request, context: RequestContext) => Promise<Response>;

const INTERNAL_ORIGIN = "http://api.internal";
const ERROR_HEADERS = {
  "cache-control": "no-store",
  connection: "close",
  "content-security-policy":
    "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  "content-type": "application/json; charset=utf-8",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "referrer-policy": "no-referrer",
  "strict-transport-security": "max-age=31536000",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
} as const;

function requestUrl(requestTarget: string | undefined): URL {
  if (
    !requestTarget?.startsWith("/") ||
    requestTarget.startsWith("//") ||
    requestTarget.includes("\\")
  ) {
    throw new TypeError("Invalid request target");
  }
  const url = new URL(requestTarget, INTERNAL_ORIGIN);
  if (url.origin !== INTERNAL_ORIGIN || url.hash) throw new TypeError("Invalid request target");
  return url;
}

function writeJsonError(outgoing: ServerResponse, status: 400 | 500) {
  if (outgoing.headersSent || outgoing.destroyed) {
    outgoing.destroy();
    return;
  }
  outgoing.writeHead(status, ERROR_HEADERS);
  outgoing.end(JSON.stringify({ ok: false }));
}

function rawClientErrorResponse(): string {
  const body = JSON.stringify({ ok: false });
  const headers = Object.entries(ERROR_HEADERS)
    .map(([name, value]) => `${name}: ${value}`)
    .join("\r\n");
  return `HTTP/1.1 400 Bad Request\r\nContent-Length: ${Buffer.byteLength(body)}\r\n${headers}\r\n\r\n${body}`;
}

async function handleRequest(
  incoming: IncomingMessage,
  outgoing: ServerResponse,
  handler: AppHandler,
) {
  const startedAt = performance.now();
  const method = incoming.method ?? "GET";
  let pathname = "invalid-request-target";

  try {
    const url = requestUrl(incoming.url);
    pathname = url.pathname;
    const request = new Request(url, {
      method,
      headers: incoming.headers as HeadersInit,
      body:
        method === "GET" || method === "HEAD"
          ? undefined
          : (Readable.toWeb(incoming) as unknown as BodyInit),
      duplex: "half",
    } as RequestInit & { duplex: "half" });

    const response = await handler(request, { peerAddress: incoming.socket.remoteAddress });
    outgoing.statusCode = response.status;
    response.headers.forEach((value, key) => outgoing.setHeader(key, value));

    if (response.body) {
      Readable.fromWeb(response.body as never).pipe(outgoing);
    } else {
      outgoing.end();
    }

    console.info("[http] request", {
      method,
      path: pathname,
      status: response.status,
      durationMs: Math.round(performance.now() - startedAt),
      ray: incoming.headers["cf-ray"] ?? null,
    });
  } catch (error) {
    console.error("[http] unhandled request error", {
      path: pathname,
      category: error instanceof Error ? error.name : "unknown",
      ray: incoming.headers["cf-ray"] ?? null,
    });
    writeJsonError(outgoing, pathname === "invalid-request-target" ? 400 : 500);
  }
}

export function createApiServer(handler: AppHandler = app): Server {
  const server = createServer((incoming, outgoing) => {
    void handleRequest(incoming, outgoing, handler);
  });

  server.on("clientError", (_error, socket) => {
    if (!socket.writable) return;
    socket.end(rawClientErrorResponse());
  });

  return server;
}
