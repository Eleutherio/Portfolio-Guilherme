import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import type { ContactPayload } from "./contact-contract";
import {
  createEmailTransportOptions,
  EmailDeliveryError,
  isEmailTransportAvailable,
  sendContactEmail,
} from "./contact-email.server";
import {
  RecaptchaRejectedError,
  RecaptchaUnavailableError,
  verifyContactRecaptchaWithSecrets,
} from "./contact-recaptcha.server";
import { checkScopedRateLimit, RateLimitError } from "./contact-rate-limit.server";
import { configureTestServerEnvironment } from "../../server/test-support/environment";

const request = new Request("https://api.example.com/api/contact");
const requestId = "ee67967a-f691-43e6-8256-ddeb4575af16";
const payload: ContactPayload = {
  name: "Contract Test",
  email: "visitor@example.com",
  subject: "Test subject",
  message: "Test message",
  website: "",
  locale: "en",
  antiBotToken: "test-token",
};

beforeEach(() => configureTestServerEnvironment());

function assessment(overrides: Record<string, unknown> = {}) {
  return {
    success: true,
    action: "contact_submit",
    score: 0.9,
    hostname: "api.example.com",
    challenge_ts: new Date().toISOString(),
    ...overrides,
  };
}

test("reCAPTCHA accepts a complete assessment", async () => {
  await verifyContactRecaptchaWithSecrets("token", request, ["secret"], async () =>
    Response.json(assessment()),
  );
});

test("reCAPTCHA rejects low score, action, hostname and challenge age", async () => {
  const rejectedAssessments = [
    assessment({ score: 0.49 }),
    assessment({ action: "different_action" }),
    assessment({ hostname: "attacker.example" }),
    assessment({ challenge_ts: new Date(Date.now() - 121_000).toISOString() }),
  ];

  for (const result of rejectedAssessments) {
    await assert.rejects(
      verifyContactRecaptchaWithSecrets("token", request, ["secret"], async () =>
        Response.json(result),
      ),
      RecaptchaRejectedError,
    );
  }
});

test("reCAPTCHA distinguishes provider timeout and malformed responses", async () => {
  const timeoutSignals: AbortSignal[] = [];
  const unavailableFetchers: Array<typeof fetch> = [
    async (_input, init) => {
      const signal = init?.signal;
      if (signal) timeoutSignals.push(signal);
      return new Promise<Response>((_resolve, reject) => {
        signal?.addEventListener("abort", () => reject(signal.reason), {
          once: true,
        });
      });
    },
    async () => new Response(null, { status: 503 }),
    async () => Response.json({ success: "invalid" }),
  ];

  for (const [index, fetcher] of unavailableFetchers.entries()) {
    await assert.rejects(
      verifyContactRecaptchaWithSecrets(
        "token",
        request,
        ["secret"],
        fetcher,
        index === 0 ? 5 : 7_000,
      ),
      RecaptchaUnavailableError,
    );
  }
  assert.equal(timeoutSignals[0]?.aborted, true);
});

test("reCAPTCHA retries unique secrets and accepts the previous one", async () => {
  const usedSecrets: string[] = [];
  await verifyContactRecaptchaWithSecrets(
    "token",
    request,
    ["new-secret", "new-secret", "previous-secret"],
    async (_input, init) => {
      const secret = (init?.body as URLSearchParams).get("secret") ?? "";
      usedSecrets.push(secret);
      return Response.json(
        secret === "previous-secret"
          ? assessment()
          : { success: false, "error-codes": ["invalid-input-response"] },
      );
    },
  );

  assert.deepEqual(usedSecrets, ["new-secret", "previous-secret"]);
});

test("Brevo transport covers send and health success", async () => {
  let sentSubject = "";
  const transport = {
    sendMail: async (mail: { subject?: string }) => {
      sentSubject = mail.subject ?? "";
      return { messageId: "test" };
    },
    verify: async () => true,
  };

  await sendContactEmail(payload, requestId, transport);
  assert.match(sentSubject, /^\[guifer\.tech\]/u);
  assert.equal(await isEmailTransportAvailable(transport), true);
});

test("Brevo transporter keeps bounded network timeouts and remote content disabled", () => {
  const options = createEmailTransportOptions({
    host: "smtp-relay.brevo.com",
    port: 2525,
    user: "smtp-user",
    key: "smtp-key",
    from: "Portfolio <contact@guifer.tech>",
    to: "inbox@guifer.tech",
  });

  assert.equal(options.connectionTimeout, 10_000);
  assert.equal(options.greetingTimeout, 10_000);
  assert.equal(options.socketTimeout, 15_000);
  assert.equal(options.disableFileAccess, true);
  assert.equal(options.disableUrlAccess, true);
});

test("Brevo transport normalizes delivery failure and timeout", async () => {
  for (const error of [new Error("delivery rejected"), new Error("ETIMEDOUT")]) {
    const transport = {
      sendMail: async () => Promise.reject(error),
      verify: async () => Promise.reject(error),
    };

    await assert.rejects(sendContactEmail(payload, requestId, transport), EmailDeliveryError);
    assert.equal(await isEmailTransportAvailable(transport), false);
  }
});

test("rate limit contains consumer failure and rejects invalid secrets", async () => {
  const options = {
    scope: "contract-test",
    secret: "test-rate-limit-secret-with-32-characters",
    windowSeconds: 900,
    perIp: 5,
    global: 100,
  };

  await assert.rejects(
    checkScopedRateLimit(request, options, { peerAddress: "127.0.0.1" }, async () => {
      throw new RateLimitError();
    }),
    RateLimitError,
  );
  await assert.rejects(
    checkScopedRateLimit(
      request,
      { ...options, secret: "short" },
      { peerAddress: "127.0.0.1" },
      async () => "allowed",
    ),
    RateLimitError,
  );
});
