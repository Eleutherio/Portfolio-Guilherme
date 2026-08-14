import { createApiServer } from "./node-server";

const port = Number.parseInt(process.env.PORT ?? "8787", 10);
const host = process.env.HOST ?? "0.0.0.0";

const server = createApiServer();

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
