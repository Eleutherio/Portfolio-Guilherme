const FULL_GIT_SHA = /^[a-f0-9]{40}$/;

function expectedCommit(environment, name, fallback) {
  const commit = environment[name]?.trim().toLowerCase() || fallback;
  if (!commit || !FULL_GIT_SHA.test(commit)) {
    throw new Error(`${name} or RELEASE_COMMIT must be a full 40-character Git SHA`);
  }
  return commit;
}

function productionUrl(environment, name, fallback) {
  const url = new URL(environment[name]?.trim() || fallback);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(`${name} must be a credential-free HTTPS origin`);
  }
  return new URL(url.origin);
}

async function readJson(fetchImplementation, label, baseUrl, path) {
  const expectedUrl = new URL(path, baseUrl);
  const response = await fetchImplementation(expectedUrl, {
    headers: { accept: "application/json" },
    cache: "no-store",
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`${label} returned HTTP ${response.status}`);
  if (new URL(response.url).origin !== baseUrl.origin) {
    throw new Error(`${label} redirected to a different origin`);
  }
  const cacheDirectives = (response.headers.get("cache-control") ?? "")
    .split(",")
    .map((directive) => directive.trim().toLowerCase());
  if (!cacheDirectives.includes("no-store")) {
    throw new Error(`${label} must be served with Cache-Control: no-store`);
  }
  try {
    return await response.json();
  } catch (error) {
    throw new Error(`${label} did not return valid JSON`, { cause: error });
  }
}

export async function verifyRelease({
  environment = process.env,
  fetchImplementation = fetch,
  now = () => new Date(),
} = {}) {
  const sharedCommit = environment.RELEASE_COMMIT?.trim().toLowerCase();
  const expectedFrontendCommit = expectedCommit(
    environment,
    "RELEASE_FRONTEND_COMMIT",
    sharedCommit,
  );
  const expectedApiCommit = expectedCommit(environment, "RELEASE_API_COMMIT", sharedCommit);
  const frontendUrl = productionUrl(environment, "RELEASE_FRONTEND_URL", "https://guifer.tech");
  const apiUrl = productionUrl(environment, "RELEASE_API_URL", "https://guifer-api.onrender.com");

  const frontend = await readJson(
    fetchImplementation,
    "Cloudflare Pages release manifest",
    frontendUrl,
    "release.json",
  );
  const backend = await readJson(fetchImplementation, "Render live health", apiUrl, "health/live");

  if (frontend?.commit !== expectedFrontendCommit) {
    throw new Error(
      `Cloudflare Pages exposes ${frontend?.commit ?? "no commit"}, expected ${expectedFrontendCommit}`,
    );
  }
  if (backend?.ok !== true || backend?.service !== "guifer-api") {
    throw new Error("Render live health contract is invalid");
  }
  if (backend.release !== expectedApiCommit) {
    throw new Error(
      `Render exposes ${backend.release ?? "no commit"}, expected ${expectedApiCommit}`,
    );
  }

  return {
    frontendCommit: expectedFrontendCommit,
    apiCommit: expectedApiCommit,
    frontendOrigin: frontendUrl.origin,
    apiOrigin: apiUrl.origin,
    verifiedAt: now().toISOString(),
  };
}
