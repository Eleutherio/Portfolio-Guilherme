import { chmodSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export function installGitHooks(root, { run = spawnSync } = {}) {
  const git = (args) => run("git", args, { cwd: root, encoding: "utf8" });
  const current = git(["config", "--get", "core.hooksPath"]);
  if (current.status !== 0 && current.status !== 1) {
    throw new Error("Não foi possível consultar core.hooksPath.");
  }
  const configured = current.stdout.trim();
  if (configured && configured !== ".githooks") {
    throw new Error(`Hooks existentes preservados: core.hooksPath=${configured}.`);
  }
  if (!configured) {
    const existing = git(["rev-parse", "--git-path", "hooks"]);
    if (existing.status !== 0) throw new Error("Diretório Git não encontrado.");
    const legacyDirectory = path.resolve(root, existing.stdout.trim());
    const legacyHooks = existsSync(legacyDirectory)
      ? readdirSync(legacyDirectory, { withFileTypes: true })
          .filter(
            (entry) =>
              (entry.isFile() || entry.isSymbolicLink()) && !entry.name.endsWith(".sample"),
          )
          .map((entry) => entry.name)
      : [];
    if (legacyHooks.length) {
      throw new Error(
        `Hooks existentes preservados: ${legacyHooks.join(", ")}; integração manual necessária.`,
      );
    }
  }
  const hook = path.join(root, ".githooks", "pre-commit");
  if (!existsSync(hook)) throw new Error("Arquivo .githooks/pre-commit não encontrado.");
  chmodSync(hook, 0o755);
  const result = git(["config", "--local", "core.hooksPath", ".githooks"]);
  if (result.status !== 0) throw new Error("Não foi possível ativar os hooks locais.");
  return ".githooks";
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    installGitHooks(process.cwd());
    console.log("Gate E2E pre-commit ativado via core.hooksPath=.githooks.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
