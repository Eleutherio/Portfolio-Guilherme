const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "") ?? "";

export function apiUrl(path: `/${string}`): string {
  return `${configuredBaseUrl}${path}`;
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
  return (await response.json()) as T;
}

export type GithubYearStats = { total: number; year: number } | null;
export type CoffeeCount = { count: number };

export async function fetchGithubYearStats(): Promise<GithubYearStats> {
  const response = await fetch(apiUrl("/api/github"), {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  return readJson<GithubYearStats>(response);
}

export async function fetchCoffeeCount(): Promise<CoffeeCount> {
  const response = await fetch(apiUrl("/api/coffee"), {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  return readJson<CoffeeCount>(response);
}

export async function submitCoffeeTap(visitorId: string): Promise<CoffeeCount> {
  const response = await fetch(apiUrl("/api/coffee"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ visitorId }),
    signal: AbortSignal.timeout(15_000),
  });
  return readJson<CoffeeCount>(response);
}
