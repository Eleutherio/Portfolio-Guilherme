type YearStats = { total: number; year: number } | null;

let cache: { value: YearStats; expires: number } | null = null;

export async function getGithubYearStats(): Promise<YearStats> {
  const now = Date.now();
  if (cache && cache.expires > now) return cache.value;

  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  const year = new Date().getUTCFullYear();
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
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "user-agent": "guifer.tech",
      },
      body: JSON.stringify({
        query,
        variables: { from: `${year}-01-01T00:00:00Z`, to: new Date().toISOString() },
      }),
      signal: AbortSignal.timeout(8_000),
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

    const value = {
      total:
        payload.data?.viewer?.contributionsCollection?.contributionCalendar?.totalContributions ??
        0,
      year,
    };
    cache = { value, expires: now + 10 * 60_000 };
    return value;
  } catch {
    cache = { value: null, expires: now + 60_000 };
    return null;
  }
}
