import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseClientEnvironment } from "../config/client-env";
import { EnvironmentValidationError } from "../config/environment-error";
import { getServerEnvironment, initializeServerEnvironment, parseServerEnvironment } from "./env";
import { validTestServerEnvironment } from "./test-support/environment";

test("client environment accepts an optional API origin and requires reCAPTCHA", () => {
  assert.deepEqual(
    parseClientEnvironment({
      VITE_API_URL: "https://guifer-api.onrender.com",
      VITE_RECAPTCHA_SITE_KEY: "public-site-key",
    }),
    {
      VITE_API_URL: "https://guifer-api.onrender.com",
      VITE_RECAPTCHA_SITE_KEY: "public-site-key",
    },
  );

  assert.throws(
    () =>
      parseClientEnvironment({
        VITE_API_URL: "https://user:password@invalid.example",
      }),
    (error: unknown) =>
      error instanceof EnvironmentValidationError &&
      error.message.includes("VITE_API_URL") &&
      error.message.includes("VITE_RECAPTCHA_SITE_KEY"),
  );
});

test("server environment normalizes defaults and the coffee secret fallback", () => {
  const environment = initializeServerEnvironment({
    ...validTestServerEnvironment,
    API_ALLOWED_ORIGINS: "https://guifer.tech,https://www.guifer.tech",
    BREVO_SMTP_PORT: "1e3",
    CONTACT_RATE_LIMIT_IP_MAX: "1e2",
  });

  assert.equal(environment.HOST, "0.0.0.0");
  assert.equal(environment.PORT, 8787);
  assert.equal(environment.BREVO_SMTP_PORT, 1000);
  assert.equal(environment.RECAPTCHA_MIN_SCORE, 0.5);
  assert.equal(environment.CONTACT_RATE_LIMIT_WINDOW_SECONDS, 900);
  assert.equal(
    environment.COFFEE_RATE_LIMIT_SECRET,
    validTestServerEnvironment.CONTACT_RATE_LIMIT_SECRET,
  );
  assert.equal(getServerEnvironment().BREVO_SMTP_PORT, 1000);
  assert.equal(getServerEnvironment().CONTACT_RATE_LIMIT_IP_MAX, 100);
  assert.deepEqual(environment.API_ALLOWED_ORIGINS, [
    "https://guifer.tech",
    "https://www.guifer.tech",
  ]);
});

test("server environment rejects invalid startup configuration without exposing values", () => {
  const invalidSecret = "short-private-value";

  assert.throws(
    () =>
      parseServerEnvironment({
        ...validTestServerEnvironment,
        CONTACT_RATE_LIMIT_SECRET: invalidSecret,
        SUPABASE_URL: "https://user:password@insecure.example",
      }),
    (error: unknown) =>
      error instanceof EnvironmentValidationError &&
      error.message.includes("CONTACT_RATE_LIMIT_SECRET") &&
      error.message.includes("SUPABASE_URL") &&
      !error.message.includes(invalidSecret),
  );
});

test("API process rejects invalid configuration before opening a port", () => {
  const result = spawnSync(process.execPath, ["--import", "tsx", "server/index.ts"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, ...validTestServerEnvironment, PORT: "invalid-port" },
    timeout: 5_000,
  });

  assert.notEqual(result.status, 0);
  assert.doesNotMatch(result.stdout, /listening/u);
  assert.match(result.stderr, /Invalid server environment variable\(s\): PORT/u);
});

test("runtime modules do not read process.env outside the environment boundary", () => {
  const runtimeFiles = [
    "server/app.ts",
    "server/release.ts",
    "server/request-context.ts",
    "server/services/coffee.ts",
    "server/services/github.ts",
    "src/integrations/supabase/client.server.ts",
    "src/lib/contact-email.server.ts",
    "src/lib/contact-handler.server.ts",
    "src/lib/contact-rate-limit.server.ts",
    "src/lib/contact-recaptcha.server.ts",
  ];

  for (const file of runtimeFiles) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /process\.env/u, file);
  }
});
