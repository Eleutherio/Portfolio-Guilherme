import { createApiServer } from "./node-server";
import { initializeServerEnvironment } from "./env";

const environment = initializeServerEnvironment();

const server = createApiServer();

server.listen(environment.PORT, environment.HOST, () => {
  console.info(`[startup] guifer-api listening on http://${environment.HOST}:${environment.PORT}`);
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
