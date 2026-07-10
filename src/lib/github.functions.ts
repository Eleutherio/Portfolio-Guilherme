import { createServerFn } from "@tanstack/react-start";

type YearStats = { total: number; year: number } | null;

let cache: { value: YearStats; expires: number } | null = null;

export const getGithubYearStats = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  if (cache && cache.expires > now) return cache.value;

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    cache = { value: null, expires: now + 60_000 };
    return null;
  }

  const year = new Date().getUTCFullYear();
  const from = `${year}-01-01T00:00:00Z`;
  const to = new Date().toISOString();

  const query = `
    query($from: DateTime!, $to: DateTime!) {
      viewer {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar { totalContributions }
          totalCommitContributions
          restrictedContributionsCount
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "guifer.tech",
      },
      body: JSON.stringify({ query, variables: { from, to } }),
    });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const json = (await res.json()) as {
      data?: {
        viewer?: {
          contributionsCollection?: {
            contributionCalendar?: { totalContributions?: number };
          };
        };
      };
    };
    const total =
      json.data?.viewer?.contributionsCollection?.contributionCalendar?.totalContributions ?? 0;
    const value: YearStats = { total, year };
    cache = { value, expires: now + 10 * 60_000 };
    return value;
  } catch (err) {
    console.error("github stats failed", err);
    cache = { value: null, expires: now + 60_000 };
    return null;
  }
});
