const apiUrl = process.env.IP_SPOOF_TEST_API_URL?.trim();
const attempts = Number.parseInt(process.env.IP_SPOOF_TEST_ATTEMPTS ?? "6", 10);
const timeoutMs = Number.parseInt(process.env.IP_SPOOF_TEST_TIMEOUT_MS ?? "15000", 10);

if (!apiUrl || !apiUrl.startsWith("https://")) {
  throw new Error("IP_SPOOF_TEST_API_URL must be the HTTPS URL of the Render API");
}

if (!Number.isInteger(attempts) || attempts < 2 || attempts > 20) {
  throw new Error("IP_SPOOF_TEST_ATTEMPTS must be between 2 and 20");
}
if (!Number.isInteger(timeoutMs) || timeoutMs < 1_000 || timeoutMs > 60_000) {
  throw new Error("IP_SPOOF_TEST_TIMEOUT_MS must be between 1000 and 60000");
}

const endpoint = new URL("/api/contact", apiUrl);

async function sendAttempt(forwardedFor) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cf-connecting-ip": forwardedFor,
      "x-forwarded-for": forwardedFor,
    },
    body: "{}",
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (response.status !== 422 && response.status !== 429) {
    throw new Error(`Unexpected status ${response.status}`);
  }
  return {
    status: response.status,
    scope: response.headers.get("x-rate-limit-scope"),
  };
}

async function firstRateLimitedAttempt(values, label) {
  for (let index = 0; index < values.length; index += 1) {
    const result = await sendAttempt(values[index]);
    if (index === 0 && result.status === 429) {
      throw new Error(
        `${label}: the client bucket is already rate limited; retry after the configured window`,
      );
    }
    if (result.status === 429) {
      if (result.scope !== "ip") {
        throw new Error(`${label}: expected an IP limit, received scope ${result.scope ?? "none"}`);
      }
      return index + 1;
    }
  }
  return -1;
}

const stableHeader = Array.from({ length: attempts }, () => "198.51.100.2");
const stableRateLimitedAt = await firstRateLimitedAttempt(stableHeader, "Stable-header control");

if (stableRateLimitedAt < 0) {
  throw new Error(
    "Spoofing check inconclusive: a stable client bucket could not be established; run from a stable egress",
  );
}

const rotatingHeaders = Array.from({ length: attempts }, (_, index) => `198.51.100.${index + 10}`);
let rotatingRateLimitedAt = -1;

for (let index = 0; index < rotatingHeaders.length; index += 1) {
  const result = await sendAttempt(rotatingHeaders[index]);
  if (result.status === 429) {
    if (result.scope !== "ip") {
      throw new Error(
        `Rotating-header check: expected an IP limit, received scope ${result.scope ?? "none"}`,
      );
    }
    rotatingRateLimitedAt = index + 1;
    break;
  }
}

if (rotatingRateLimitedAt < 0) {
  throw new Error(
    "Spoofing check failed: rotating X-Forwarded-For values bypassed the verified client bucket",
  );
}

console.info(
  `Render client-IP spoofing check passed; stable control limited on attempt ${stableRateLimitedAt} and rotated input on attempt ${rotatingRateLimitedAt}`,
);
