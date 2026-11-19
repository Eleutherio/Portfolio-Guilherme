import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { installGitHooks } from "./install-git-hooks.mjs";
import { exitCode, runPreCommitE2E } from "./pre-commit-e2e.mjs";

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fixture(t) {
  const parent = path.join(project, "tmp");
  mkdirSync(parent, { recursive: true });
  const root = mkdtempSync(path.join(parent, "gate-test-"));
  t.after(() => {
    assert.equal(path.dirname(root), parent);
    assert.ok(path.basename(root).startsWith("gate-test-"));
    rmSync(root, { recursive: true, force: true });
  });
  const git = (args) => {
    const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  git(["init", "--quiet"]);
  const files = {
    "package.json": '{"type":"module"}',
    "playwright.config.ts": "export default {};",
    "e2e/example.spec.ts": "// staged source",
  };
  for (const [name, contents] of Object.entries(files)) {
    const target = path.join(root, name);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, contents);
    git(["add", name]);
  }
  const cli = path.join(root, "node_modules", "@playwright", "test", "cli.js");
  mkdirSync(path.dirname(cli), { recursive: true });
  writeFileSync(cli, "process.exit(0);");
  return { root, git, cli };
}

test("E2E gate tests the staged source and preserves unstaged edits and index", async (t) => {
  const { root, git, cli } = fixture(t);
  const tree = git(["write-tree"]);
  writeFileSync(path.join(root, "e2e/example.spec.ts"), "// unstaged source");
  let snapshot;
  const run = (command, args, options) => {
    if (command !== process.execPath) return spawnSync(command, args, options);
    snapshot = options.cwd;
    assert.notEqual(snapshot, root);
    assert.equal(
      readFileSync(path.join(snapshot, "e2e/example.spec.ts"), "utf8"),
      "// staged source",
    );
    assert.equal(options.env.E2E_COMMIT_GATE, "1");
    assert.ok(Number(options.env.E2E_PORT) > 0);
    assert.equal(options.env.GIT_INDEX_FILE, undefined);
    assert.ok(args.includes("--update-snapshots=none"));
    assert.ok(args.includes("--forbid-only"));
    return { status: 0 };
  };
  assert.equal(await runPreCommitE2E({ root, run, log() {} }), 0);
  assert.equal(git(["write-tree"]), tree);
  assert.equal(readFileSync(path.join(root, "e2e/example.spec.ts"), "utf8"), "// unstaged source");
  assert.ok(existsSync(cli));
  assert.equal(existsSync(snapshot), false);
});

test("E2E failure blocks and retains diagnostics without the dependency junction", async (t) => {
  const { root } = fixture(t);
  let snapshot;
  const run = (command, args, options) => {
    if (command !== process.execPath) return spawnSync(command, args, options);
    snapshot = options.cwd;
    writeFileSync(path.join(snapshot, "failure.txt"), "diagnostic");
    return { status: 7 };
  };
  assert.equal(await runPreCommitE2E({ root, run, log() {} }), 7);
  assert.ok(existsSync(path.join(snapshot, "failure.txt")));
  assert.equal(existsSync(path.join(snapshot, "node_modules")), false);
});

test("spawn errors and signals never pass the gate", () => {
  assert.equal(exitCode({ status: null, signal: "SIGINT" }), 130);
  assert.equal(exitCode({ status: null, signal: "SIGTERM" }), 1);
  assert.equal(exitCode({ status: 0, error: new Error("spawn failed") }), 1);
});

test("unstaged dependency manifests block shared dependency use", async (t) => {
  const { root } = fixture(t);
  writeFileSync(
    path.join(root, "package.json"),
    '{"type":"module","dependencies":{"changed":"1"}}',
  );
  let started = false;
  const run = (command, args, options) => {
    if (command === process.execPath) started = true;
    return spawnSync(command, args, options);
  };
  assert.equal(await runPreCommitE2E({ root, run, log() {} }), 1);
  assert.equal(started, false);
});

test("index change during a passing E2E still blocks and preserves its snapshot", async (t) => {
  const { root, git } = fixture(t);
  let snapshot;
  const run = (command, args, options) => {
    if (command !== process.execPath) return spawnSync(command, args, options);
    snapshot = options.cwd;
    writeFileSync(path.join(root, "e2e/example.spec.ts"), "// changed while testing");
    git(["add", "e2e/example.spec.ts"]);
    return { status: 0 };
  };
  assert.equal(await runPreCommitE2E({ root, run, log() {} }), 1);
  assert.ok(existsSync(snapshot));
  assert.equal(existsSync(path.join(snapshot, "node_modules")), false);
});

test("missing staged configuration blocks before Playwright starts", async (t) => {
  const { root, git } = fixture(t);
  git(["rm", "--cached", "playwright.config.ts"]);
  let started = false;
  const run = (command, args, options) => {
    if (command === process.execPath) started = true;
    return spawnSync(command, args, options);
  };
  assert.equal(await runPreCommitE2E({ root, run, log() {} }), 1);
  assert.equal(started, false);
});

test("installer preserves pre-existing custom hooks configuration", (t) => {
  const { root, git } = fixture(t);
  git(["config", "--local", "core.hooksPath", "custom-hooks"]);
  assert.throws(() => installGitHooks(root), /preservados/u);
  assert.equal(git(["config", "--get", "core.hooksPath"]), "custom-hooks");
});

test("installer preserves a legacy pre-commit hook", (t) => {
  const { root } = fixture(t);
  const hook = path.join(root, ".git", "hooks", "pre-commit");
  writeFileSync(hook, "#!/bin/sh\nexit 0\n");
  assert.throws(() => installGitHooks(root), /existentes preservados/u);
  assert.equal(readFileSync(hook, "utf8"), "#!/bin/sh\nexit 0\n");
});

for (const name of ["pre-push", "commit-msg", "prepare-commit-msg"]) {
  test(`installer preserves legacy ${name} without redirecting hooksPath`, (t) => {
    const { root } = fixture(t);
    const hook = path.join(root, ".git", "hooks", name);
    const contents = "#!/bin/sh\nexit 0\n";
    writeFileSync(hook, contents);
    assert.throws(() => installGitHooks(root), new RegExp(name, "u"));
    assert.equal(readFileSync(hook, "utf8"), contents);
    const configured = spawnSync("git", ["config", "--local", "--get", "core.hooksPath"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(configured.status, 1);
  });
}

test("installed native Git hook runs and propagates E2E failure without making commits", (t) => {
  const { root, git, cli } = fixture(t);
  for (const name of [".githooks/pre-commit", "scripts/pre-commit-e2e.mjs"]) {
    mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    copyFileSync(path.join(project, name), path.join(root, name));
  }
  assert.equal(installGitHooks(root), ".githooks");
  assert.equal(installGitHooks(root), ".githooks");
  assert.equal(git(["config", "--local", "--get", "core.hooksPath"]), ".githooks");
  writeFileSync(cli, "process.exit(7);");
  const result = spawnSync("git", ["hook", "run", "pre-commit"], { cwd: root, encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(result.stdout + result.stderr, /Commit bloqueado pelo E2E/u);
  writeFileSync(cli, "process.exit(0);");
  const passed = spawnSync("git", ["hook", "run", "pre-commit"], { cwd: root, encoding: "utf8" });
  assert.equal(passed.status, 0, passed.stderr);
  const head = spawnSync("git", ["rev-parse", "--verify", "HEAD"], { cwd: root, encoding: "utf8" });
  assert.notEqual(head.status, 0);
});
