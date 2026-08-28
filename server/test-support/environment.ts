import { initializeServerEnvironment } from "../env";

export const validTestServerEnvironment = {
  API_ALLOWED_ORIGINS: "https://guifer.tech",
  CONTACT_ALLOWED_ORIGINS: "https://guifer.tech",
  CLIENT_IP_SOURCE: "direct",
  KEEP_ALIVE_SECRET: "keep-alive-test-secret".padEnd(32, "-"),
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: `sb_secret_${"s".repeat(32)}`,
  BREVO_SMTP_USER: "smtp-test-user",
  BREVO_SMTP_KEY: "brevo-test-key".padEnd(32, "-"),
  CONTACT_EMAIL_FROM: "Guilherme <contato@guifer.tech>",
  CONTACT_EMAIL_TO: "contato@guifer.tech",
  RECAPTCHA_SECRET_KEY: "recaptcha-test-secret".padEnd(32, "-"),
  RECAPTCHA_ALLOWED_HOSTNAMES: "guifer.tech",
  CONTACT_RATE_LIMIT_SECRET: "contact-test-secret".padEnd(32, "-"),
} satisfies Record<string, string>;

export function configureTestServerEnvironment(overrides: Record<string, string | undefined> = {}) {
  return initializeServerEnvironment({ ...validTestServerEnvironment, ...overrides });
}
