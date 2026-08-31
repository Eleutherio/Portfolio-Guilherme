import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createGitHubIssuesClient,
  ensureMonthlyUsageReview,
  recordKeepAliveFailure,
  recordKeepAliveRecovery,
} from "./github-operations-issues.mjs";

const workflow = readFileSync(
  new URL("../.github/workflows/keep-alive.yml", import.meta.url),
  "utf8",
);

function createFetchMock(responses) {
  const calls = [];
  return {
    calls,
    fetch: async (url, options = {}) => {
      calls.push({ url, method: options.method ?? "GET", body: options.body });
      const response = responses.shift();
      assert.ok(response, `unexpected request: ${url}`);
      return {
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
        json: async () => response.body,
      };
    },
  };
}

function createClient(responses) {
  const mock = createFetchMock(responses);
  return {
    mock,
    client: createGitHubIssuesClient({
      token: "test-token",
      repository: "Eleutherio/Portfolio-Guilherme",
      fetchImplementation: mock.fetch,
    }),
  };
}

test("abre um único incidente e atribui ao proprietário", async () => {
  const { client, mock } = createClient([
    { status: 200, body: [] },
    { status: 201, body: { number: 12 } },
  ]);
  await recordKeepAliveFailure(client, {
    runUrl: "https://github.com/example/actions/runs/1",
    occurredAt: "2026-08-30T12:00:00.000Z",
  });
  const payload = JSON.parse(mock.calls[1].body);
  assert.deepEqual(payload.assignees, ["Eleutherio"]);
  assert.match(payload.body, /actions\/runs\/1/u);
});

test("atualiza o incidente existente sem criar spam", async () => {
  const { client, mock } = createClient([
    { status: 200, body: [{ number: 12, title: "ops: keep-alive indisponível" }] },
    { status: 200, body: { number: 12 } },
  ]);
  await recordKeepAliveFailure(client, {
    runUrl: "https://github.com/example/actions/runs/2",
    occurredAt: "2026-08-30T12:10:00.000Z",
  });
  assert.equal(mock.calls[1].method, "PATCH");
  assert.match(mock.calls[1].url, /\/issues\/12$/u);
});

test("registra a recuperação e fecha o incidente", async () => {
  const { client, mock } = createClient([
    { status: 200, body: [{ number: 12, title: "ops: keep-alive indisponível" }] },
    { status: 201, body: { id: 1 } },
    { status: 200, body: { number: 12, state: "closed" } },
  ]);
  await recordKeepAliveRecovery(client, {
    runUrl: "https://github.com/example/actions/runs/3",
    occurredAt: "2026-08-30T12:20:00.000Z",
  });
  assert.match(mock.calls[1].url, /\/comments$/u);
  assert.deepEqual(JSON.parse(mock.calls[2].body), {
    state: "closed",
    state_reason: "completed",
  });
});

test("cria somente uma revisão de consumo por mês", async () => {
  const existing = { number: 20, title: "ops: revisar consumo de infraestrutura · 2026-08" };
  const { client, mock } = createClient([{ status: 200, body: [existing] }]);
  const result = await ensureMonthlyUsageReview(client, { month: "2026-08" });
  assert.equal(result, existing);
  assert.equal(mock.calls.length, 1);
  assert.match(mock.calls[0].url, /state=all/u);
});

test("pagina a busca antes de criar um incidente duplicado", async () => {
  const firstPage = Array.from({ length: 100 }, (_, index) => ({
    number: index + 1,
    title: `issue ${index + 1}`,
  }));
  const existing = { number: 101, title: "ops: keep-alive indisponível" };
  const { client, mock } = createClient([
    { status: 200, body: firstPage },
    { status: 200, body: [existing] },
    { status: 200, body: existing },
  ]);
  await recordKeepAliveFailure(client, {
    runUrl: "https://github.com/example/actions/runs/4",
    occurredAt: "2026-08-30T12:30:00.000Z",
  });
  assert.match(mock.calls[1].url, /page=2/u);
  assert.equal(mock.calls[2].method, "PATCH");
  assert.match(mock.calls[2].url, /\/issues\/101$/u);
});

test("workflow atribui incidentes somente a falhas do probe", () => {
  assert.match(workflow, /issues: write/u);
  assert.match(workflow, /id: probe/u);
  assert.match(workflow, /failure\(\) && steps\.probe\.conclusion == 'failure'/u);
  assert.match(workflow, /success\(\) && steps\.probe\.conclusion == 'success'/u);
});
