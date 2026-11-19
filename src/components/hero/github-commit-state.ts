const DEV_GITHUB_COMMIT_FALLBACK = 128;

export type GithubCommitValue = {
  total: number;
  source: "api" | "fallback";
};

export type GithubCommitState =
  { status: "loading" } | { status: "ready"; value: GithubCommitValue } | { status: "unavailable" };

export function resolveUnavailableGithubStats(isDevelopment: boolean): GithubCommitState {
  return isDevelopment
    ? { status: "ready", value: { total: DEV_GITHUB_COMMIT_FALLBACK, source: "fallback" } }
    : { status: "unavailable" };
}
