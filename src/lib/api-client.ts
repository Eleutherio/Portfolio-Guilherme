import type { WebsiteCarbonResult } from "@/lib/website-carbon";

const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "") ?? "";

export function apiUrl(path: `/${string}`): string {
  return `${configuredBaseUrl}${path}`;
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
  return (await response.json()) as T;
}

export type GithubYearStats =
  { status: "ready"; total: number; year: number } | { status: "unavailable" };
export type CoffeeCount = { count: number };
export type { WebsiteCarbonResult } from "@/lib/website-carbon";

export async function fetchGithubYearStats(): Promise<GithubYearStats> {
  const response = await fetch(apiUrl("/api/github"), {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  const payload = await readJson<{
    status?: unknown;
    total?: unknown;
    year?: unknown;
  } | null>(response);
  if (
    Number.isInteger(payload?.total) &&
    Number(payload?.total) >= 0 &&
    Number.isInteger(payload?.year)
  ) {
    return { status: "ready", total: Number(payload?.total), year: Number(payload?.year) };
  }
  return { status: "unavailable" };
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

export async function fetchWebsiteCarbonResult(signal?: AbortSignal): Promise<WebsiteCarbonResult> {
  const response = await fetch(apiUrl("/api/website-carbon"), {
    headers: { accept: "application/json" },
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(10_000)])
      : AbortSignal.timeout(10_000),
  });
  return readJson<WebsiteCarbonResult>(response);
}
