const FULL_GIT_SHA = /^[a-f0-9]{40}$/;

export function normalizeReleaseCommit(value: string | undefined): string {
  const commit = value?.trim().toLowerCase();
  return commit && FULL_GIT_SHA.test(commit) ? commit : "local";
}

export function releaseManifestSource(value: string | undefined): string {
  return `${JSON.stringify({ commit: normalizeReleaseCommit(value) })}\n`;
}

export function apiReleaseCommit(): string {
  return normalizeReleaseCommit(process.env.RENDER_GIT_COMMIT);
}
