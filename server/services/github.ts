import { getServerEnvironment } from "../env";

export type GithubYearStats = { total: number; year: number } | null;

export type GithubYearStatsDependencies = {
  fetcher: typeof fetch;
  now: () => number;
  timeoutMs: number;
};

let cache: { value: GithubYearStats; expires: number } | null = null;

const defaultDependencies: GithubYearStatsDependencies = {
  fetcher: fetch,
  now: Date.now,
  timeoutMs: 8_000,
};

export function resetGithubYearStatsCache(): void {
  cache = null;
}

export async function getGithubYearStats(
  dependencies: GithubYearStatsDependencies = defaultDependencies,
): Promise<GithubYearStats> {
  const now = dependencies.now();
  if (cache && cache.expires > now) return cache.value;

  const token = getServerEnvironment().GITHUB_TOKEN;
  if (!token) return null;

  const year = new Date(now).getUTCFullYear();
  const query = `
    query($from: DateTime!, $to: DateTime!) {
      viewer {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar { totalContributions }
        }
      }
    }
  `;

  try {
    const response = await dependencies.fetcher("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "user-agent": "guifer.tech",
      },
      body: JSON.stringify({
        query,
        variables: { from: `${year}-01-01T00:00:00Z`, to: new Date(now).toISOString() },
      }),
      signal: AbortSignal.timeout(dependencies.timeoutMs),
    });
    if (!response.ok) throw new Error(`github_${response.status}`);

    const payload = (await response.json()) as {
      data?: {
        viewer?: {
          contributionsCollection?: { contributionCalendar?: { totalContributions?: number } };
        };
      };
      errors?: unknown[];
    };
    if (payload.errors?.length) throw new Error("github_graphql_error");

    const total =
      payload.data?.viewer?.contributionsCollection?.contributionCalendar?.totalContributions;
    if (!Number.isInteger(total) || (total ?? -1) < 0) throw new Error("github_invalid_payload");

    const value = { total: total as number, year };
    cache = { value, expires: now + 10 * 60_000 };
    return value;
  } catch {
    cache = { value: null, expires: now + 60_000 };
    return null;
  }
}
