import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function exitCode(result) {
  if (result.error || result.status === null) return result.signal === "SIGINT" ? 130 : 1;
  return result.status === 0 ? 0 : result.status || 1;
}

async function availablePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const port = server.address().port;
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  return port;
}

export async function runPreCommitE2E({
  root = process.cwd(),
  run = spawnSync,
  log = console.log,
} = {}) {
  const git = (args) => {
    const result = run("git", args, { cwd: root, encoding: "utf8" });
    if (result.status !== 0) throw new Error(`Git falhou: ${args[0]}. ${result.stderr || ""}`);
    return result.stdout.trim();
  };
  root = path.resolve(git(["rev-parse", "--show-toplevel"]));
  const indexBefore = git(["write-tree"]);
  const temporaryRoot = path.resolve(root, "tmp");
  mkdirSync(temporaryRoot, { recursive: true });
  const snapshot = mkdtempSync(path.join(temporaryRoot, "commit-e2e-"));
  let status = 1;
  let dependenciesLinked = false;
  try {
    // checkout-index reads Git's actual index, including a temporary commit -a index.
    git(["checkout-index", "--all", "--force", `--prefix=${snapshot.replaceAll("\\", "/")}/`]);
    for (const required of ["package.json", "playwright.config.ts", "e2e"]) {
      if (!existsSync(path.join(snapshot, required))) {
        throw new Error(
          `O índice não contém ${required}; prepare os arquivos necessários antes de commitar.`,
        );
      }
    }
    for (const manifest of ["package.json", "package-lock.json"]) {
      const prepared = path.join(snapshot, manifest);
      if (existsSync(prepared)) {
        const current = path.join(root, manifest);
        if (!existsSync(current) || !readFileSync(prepared).equals(readFileSync(current))) {
          throw new Error(
            `${manifest} possui alterações fora do índice; alinhe as dependências antes do gate.`,
          );
        }
      }
    }
    const dependencies = path.join(root, "node_modules");
    const cli = path.join(dependencies, "@playwright", "test", "cli.js");
    if (!existsSync(cli))
      throw new Error("Dependências ausentes; execute npm ci e instale os browsers Playwright.");
    if (existsSync(path.join(snapshot, "node_modules"))) {
      throw new Error("node_modules não pode fazer parte do índice.");
    }
    symlinkSync(
      dependencies,
      path.join(snapshot, "node_modules"),
      process.platform === "win32" ? "junction" : "dir",
    );
    dependenciesLinked = true;
    const environment = Object.fromEntries(
      Object.entries(process.env).filter(([key]) => !key.startsWith("GIT_")),
    );
    log("Gate E2E: verificando exclusivamente o conteúdo preparado no índice Git.");
    const result = run(
      process.execPath,
      [
        cli,
        "test",
        "e2e",
        "--config=playwright.config.ts",
        "--update-snapshots=none",
        "--forbid-only",
      ],
      {
        cwd: snapshot,
        stdio: "inherit",
        env: {
          ...environment,
          CI: "1",
          E2E_COMMIT_GATE: "1",
          E2E_PORT: String(await availablePort()),
        },
      },
    );
    status = exitCode(result);
    if (git(["write-tree"]) !== indexBefore) {
      throw new Error(
        "O índice mudou durante o gate; execute o commit novamente após revisar o staging.",
      );
    }
    if (status !== 0) log(`Commit bloqueado pelo E2E (código ${status}). Diagnóstico: ${snapshot}`);
    return status;
  } catch (error) {
    status = 1;
    log(`Commit bloqueado: ${error.message}`);
    return status;
  } finally {
    // Cleanup is confined to the exact directory created above; never traverse node_modules.
    if (dependenciesLinked) rmSync(path.join(snapshot, "node_modules"), { force: true });
    if (status === 0) {
      if (
        path.dirname(snapshot) !== temporaryRoot ||
        !path.basename(snapshot).startsWith("commit-e2e-")
      ) {
        throw new Error("Limpeza interrompida: diretório temporário inválido.");
      }
      rmSync(snapshot, { recursive: true, force: true });
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await runPreCommitE2E();
}
