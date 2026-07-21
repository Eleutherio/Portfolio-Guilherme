const apiUrl = process.env.IP_SPOOF_TEST_API_URL?.trim();
const attempts = Number.parseInt(process.env.IP_SPOOF_TEST_ATTEMPTS ?? "6", 10);

if (!apiUrl || !apiUrl.startsWith("https://")) {
  throw new Error("IP_SPOOF_TEST_API_URL must be the HTTPS URL of the Render API");
}

if (!Number.isInteger(attempts) || attempts < 2 || attempts > 20) {
  throw new Error("IP_SPOOF_TEST_ATTEMPTS must be between 2 and 20");
}

const endpoint = new URL("/api/contact", apiUrl);
let rateLimitedAt = -1;

for (let index = 0; index < attempts; index += 1) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": `198.51.100.${index + 10}`,
    },
    body: "{}",
  });

  if (index === 0 && response.status === 429) {
    throw new Error(
      "The real client IP is already rate limited; retry after the configured window",
    );
  }

  if (response.status === 429) {
    rateLimitedAt = index + 1;
    break;
  }

  if (response.status !== 422) {
    throw new Error(`Unexpected status ${response.status} on attempt ${index + 1}`);
  }
}

if (rateLimitedAt < 0) {
  throw new Error(
    "Spoofing check failed: rotating X-Forwarded-For values bypassed the per-IP limit",
  );
}

console.info(`Render client-IP spoofing check passed; rate limited on attempt ${rateLimitedAt}`);
