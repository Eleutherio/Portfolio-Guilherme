const baseUrlValue = process.env.KEEP_ALIVE_API_URL?.trim();
const secret = process.env.KEEP_ALIVE_SECRET?.trim();

if (!baseUrlValue) throw new Error("KEEP_ALIVE_API_URL is required");
if (!secret || secret.length < 32)
  throw new Error("KEEP_ALIVE_SECRET must have at least 32 characters");

const baseUrl = new URL(baseUrlValue);
if (baseUrl.username || baseUrl.password)
  throw new Error("KEEP_ALIVE_API_URL cannot contain credentials");
if (
  baseUrl.protocol !== "https:" &&
  baseUrl.hostname !== "localhost" &&
  baseUrl.hostname !== "127.0.0.1"
) {
  throw new Error("KEEP_ALIVE_API_URL must use HTTPS");
}

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function probe(path, { authenticated = false, attempts = 4 } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(new URL(path, baseUrl), {
        headers: authenticated ? { authorization: `Bearer ${secret}` } : undefined,
        redirect: "error",
        signal: AbortSignal.timeout(30_000),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      if (payload?.ok !== true) throw new Error("unexpected response");

      console.info(`[keep-alive] ${path} available on attempt ${attempt}`);
      return;
    } catch (error) {
      lastError = error;
      console.warn(
        `[keep-alive] ${path} failed on attempt ${attempt}/${attempts}: ${error instanceof Error ? error.message : "unknown error"}`,
      );
      if (attempt < attempts) await sleep(attempt * 15_000);
    }
  }

  throw new Error(`${path} remained unavailable`, { cause: lastError });
}

await probe("/health/live", { attempts: 5 });
await probe("/health/dependencies", { authenticated: true, attempts: 3 });
console.info("[keep-alive] Render and Supabase checks completed");
