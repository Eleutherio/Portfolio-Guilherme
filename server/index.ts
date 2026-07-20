import { createServer } from "node:http";
import { Readable } from "node:stream";
import { app } from "./app";

const port = Number.parseInt(process.env.PORT ?? "8787", 10);
const host = process.env.HOST ?? "0.0.0.0";

const server = createServer(async (incoming, outgoing) => {
  const startedAt = performance.now();
  const method = incoming.method ?? "GET";
  const protocol = incoming.headers["x-forwarded-proto"] ?? "http";
  const authority = incoming.headers.host ?? `${host}:${port}`;
  const requestUrl = new URL(incoming.url ?? "/", `${protocol}://${authority}`);

  try {
    const request = new Request(requestUrl, {
      method,
      headers: incoming.headers as HeadersInit,
      body:
        method === "GET" || method === "HEAD"
          ? undefined
          : (Readable.toWeb(incoming) as unknown as BodyInit),
      duplex: "half",
    } as RequestInit & { duplex: "half" });

    const response = await app(request);
    outgoing.statusCode = response.status;
    response.headers.forEach((value, key) => outgoing.setHeader(key, value));

    if (response.body) {
      Readable.fromWeb(response.body as never).pipe(outgoing);
    } else {
      outgoing.end();
    }

    console.info("[http] request", {
      method,
      path: requestUrl.pathname,
      status: response.status,
      durationMs: Math.round(performance.now() - startedAt),
      ray: incoming.headers["cf-ray"] ?? null,
    });
  } catch (error) {
    console.error("[http] unhandled request error", {
      path: requestUrl.pathname,
      category: error instanceof Error ? error.name : "unknown",
      ray: incoming.headers["cf-ray"] ?? null,
    });
    outgoing.statusCode = 500;
    outgoing.setHeader("content-type", "application/json; charset=utf-8");
    outgoing.setHeader("cache-control", "no-store");
    outgoing.end(JSON.stringify({ ok: false }));
  }
});

server.listen(port, host, () => {
  console.info(`[startup] guifer-api listening on http://${host}:${port}`);
});

function shutdown(signal: string) {
  console.info(`[shutdown] received ${signal}`);
  server.close((error) => {
    if (error) {
      console.error("[shutdown] failed", { category: error.name });
      process.exitCode = 1;
    }
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
