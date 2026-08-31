import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const INCIDENT_TITLE = "ops: keep-alive indisponível";
const VALIDATION_INCIDENT_TITLE = "ops: validar observabilidade do keep-alive";

function requireValue(name, value) {
  const normalized = value?.trim();
  if (!normalized) throw new Error(`${name} is required`);
  return normalized;
}

export function createGitHubIssuesClient({ token, repository, fetchImplementation = fetch }) {
  const resolvedToken = requireValue("GITHUB_TOKEN", token);
  const [owner, repo, extra] = requireValue("GITHUB_REPOSITORY", repository).split("/");
  if (!owner || !repo || extra) throw new Error("GITHUB_REPOSITORY must use owner/repo");

  async function request(path, options = {}) {
    const response = await fetchImplementation(
      `https://api.github.com/repos/${owner}/${repo}${path}`,
      {
        ...options,
        headers: {
          accept: "application/vnd.github+json",
          authorization: `Bearer ${resolvedToken}`,
          "x-github-api-version": "2022-11-28",
          ...options.headers,
        },
      },
    );
    if (!response.ok) throw new Error(`GitHub API ${response.status} for ${path}`);
    return response.status === 204 ? null : response.json();
  }

  async function findIssue(title, state = "open") {
    for (let page = 1; ; page += 1) {
      const issues = await request(
        `/issues?state=${state}&per_page=100&sort=created&direction=desc&page=${page}`,
      );
      const match = issues.find((issue) => !issue.pull_request && issue.title === title);
      if (match || issues.length < 100) return match;
    }
  }

  async function createIssue(title, body) {
    return request("/issues", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, body, assignees: [owner] }),
    });
  }

  return { owner, request, findIssue, createIssue };
}

export async function recordKeepAliveFailure(
  client,
  { runUrl, occurredAt },
  { incidentTitle = INCIDENT_TITLE, validation = false } = {},
) {
  const body = [
    validation
      ? `@${client.owner}, este é um ensaio controlado da observabilidade; os serviços não falharam.`
      : `@${client.owner}, o keep-alive não conseguiu validar Render e Supabase.`,
    "",
    `- Última falha: ${occurredAt}`,
    `- Execução: ${runUrl}`,
    "",
    "A issue será atualizada nas falhas seguintes e fechada automaticamente após a recuperação.",
  ].join("\n");
  const existing = await client.findIssue(incidentTitle);
  if (!existing) return client.createIssue(incidentTitle, body);
  return client.request(`/issues/${existing.number}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ body }),
  });
}

export async function recordKeepAliveRecovery(
  client,
  { runUrl, occurredAt },
  { incidentTitle = INCIDENT_TITLE } = {},
) {
  const existing = await client.findIssue(incidentTitle);
  if (!existing) return null;
  await client.request(`/issues/${existing.number}/comments`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ body: `Recuperado em ${occurredAt}: ${runUrl}` }),
  });
  return client.request(`/issues/${existing.number}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ state: "closed", state_reason: "completed" }),
  });
}

export async function ensureMonthlyUsageReview(client, { month }) {
  const title = `ops: revisar consumo de infraestrutura · ${month}`;
  const existing = await client.findIssue(title, "all");
  if (existing) return existing;
  const body = [
    `@${client.owner}, revise o consumo mensal do portfólio antes de fechar esta issue.`,
    "",
    "- [ ] GitHub Actions: conferir execuções, falhas, duração média e atrasos do keep-alive.",
    "- [ ] Render: conferir as horas do workspace; o Free inclui 750 h e um mês sempre ativo usa até 744 h.",
    "- [ ] Supabase: conferir banco (500 MB), egress (5 GB) e atividade suficiente para evitar pausa.",
    "- [ ] Confirmar `/health/dependencies` operacional e retenção atual.",
    "- [ ] Registrar aqui os valores observados e qualquer ação necessária.",
  ].join("\n");
  return client.createIssue(title, body);
}

async function main() {
  const event = requireValue("OBSERVABILITY_EVENT", process.env.OBSERVABILITY_EVENT);
  const client = createGitHubIssuesClient({
    token: process.env.GITHUB_TOKEN,
    repository: process.env.GITHUB_REPOSITORY,
  });
  const occurredAt = new Date().toISOString();
  const runUrl = `${requireValue("GITHUB_SERVER_URL", process.env.GITHUB_SERVER_URL)}/${client.owner}/${process.env.GITHUB_REPOSITORY?.split("/")[1]}/actions/runs/${requireValue("GITHUB_RUN_ID", process.env.GITHUB_RUN_ID)}`;

  if (event === "incident-failure") {
    await recordKeepAliveFailure(client, { runUrl, occurredAt });
  } else if (event === "incident-recovered") {
    await recordKeepAliveRecovery(client, { runUrl, occurredAt });
  } else if (event === "validation-incident-failure") {
    await recordKeepAliveFailure(
      client,
      { runUrl, occurredAt },
      { incidentTitle: VALIDATION_INCIDENT_TITLE, validation: true },
    );
  } else if (event === "validation-incident-recovered") {
    await recordKeepAliveRecovery(
      client,
      { runUrl, occurredAt },
      { incidentTitle: VALIDATION_INCIDENT_TITLE },
    );
  } else if (event === "monthly-review") {
    await ensureMonthlyUsageReview(client, { month: occurredAt.slice(0, 7) });
  } else {
    throw new Error(`Unsupported OBSERVABILITY_EVENT: ${event}`);
  }
  console.info(`[operations] ${event} recorded`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}

export { INCIDENT_TITLE, VALIDATION_INCIDENT_TITLE };
