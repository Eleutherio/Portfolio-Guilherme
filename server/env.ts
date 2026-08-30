import { z } from "zod";
import { EnvironmentValidationError } from "../config/environment-error";

const trimmedString = z.string().trim().min(1);
const secret = trimmedString.min(32);
const httpUrl = trimmedString.url().refine((value) => /^https?:\/\//u.test(value));
const httpsUrl = trimmedString.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === "https:" && !url.username && !url.password;
});
const positiveInteger = (fallback: number, maximum: number) =>
  z.coerce.number().int().positive().max(maximum).default(fallback);

function parseCommaSeparated(value: string) {
  return [
    ...new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

const origins = trimmedString
  .transform(parseCommaSeparated)
  .pipe(z.array(httpUrl.refine((value) => new URL(value).origin === value)).min(1));
const hostnames = trimmedString
  .transform(parseCommaSeparated)
  .pipe(
    z
      .array(
        trimmedString.refine(
          (value) => !value.includes("://") && !value.includes("/") && !value.includes(":"),
        ),
      )
      .min(1),
  );

const mailbox = trimmedString.refine((value) => {
  const friendlyAddress = value.match(/^[^<>]{1,100}\s<([^<>]+)>$/u)?.[1] ?? value;
  return z.string().email().max(255).safeParse(friendlyAddress).success;
});

const serverEnvironmentSchema = z
  .object({
    HOST: trimmedString.default("0.0.0.0"),
    PORT: positiveInteger(8787, 65_535),
    API_ALLOWED_ORIGINS: origins,
    CONTACT_ALLOWED_ORIGINS: origins,
    CLIENT_IP_SOURCE: z.enum(["direct", "render"]),
    KEEP_ALIVE_SECRET: secret,
    SUPABASE_URL: httpsUrl,
    SUPABASE_SERVICE_ROLE_KEY: trimmedString.min(20),
    BREVO_SMTP_HOST: trimmedString.default("smtp-relay.brevo.com"),
    BREVO_SMTP_PORT: positiveInteger(2525, 65_535),
    BREVO_SMTP_USER: trimmedString,
    BREVO_SMTP_KEY: trimmedString.min(10),
    CONTACT_EMAIL_FROM: mailbox,
    CONTACT_EMAIL_TO: z.string().trim().email().max(255),
    RECAPTCHA_SECRET_KEY: trimmedString.min(10),
    RECAPTCHA_SECRET_KEY_PREVIOUS: trimmedString.min(10).optional().or(z.literal("")),
    RECAPTCHA_MIN_SCORE: z.coerce.number().min(0).max(1).default(0.5),
    RECAPTCHA_ALLOWED_HOSTNAMES: hostnames,
    CONTACT_RATE_LIMIT_SECRET: secret,
    CONTACT_RATE_LIMIT_WINDOW_SECONDS: positiveInteger(900, 86_400),
    CONTACT_RATE_LIMIT_IP_MAX: positiveInteger(5, 1_000),
    CONTACT_RATE_LIMIT_GLOBAL_MAX: positiveInteger(100, 100_000),
    COFFEE_RATE_LIMIT_SECRET: secret.optional(),
    GITHUB_TOKEN: trimmedString.min(10).optional(),
    RENDER_GIT_COMMIT: trimmedString.optional(),
  })
  .transform((environment) => ({
    ...environment,
    COFFEE_RATE_LIMIT_SECRET:
      environment.COFFEE_RATE_LIMIT_SECRET ?? environment.CONTACT_RATE_LIMIT_SECRET,
  }));

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

let activeEnvironment: ServerEnvironment | undefined;

export function parseServerEnvironment(
  environment: Record<string, string | undefined>,
): ServerEnvironment {
  const result = serverEnvironmentSchema.safeParse(environment);
  if (!result.success) {
    throw new EnvironmentValidationError(
      "server",
      result.error.issues.map((issue) => String(issue.path[0] ?? "unknown")),
    );
  }
  return result.data;
}

export function initializeServerEnvironment(
  environment: Record<string, string | undefined> = process.env,
): ServerEnvironment {
  activeEnvironment = Object.freeze(parseServerEnvironment(environment));
  return activeEnvironment;
}

export function getServerEnvironment(): ServerEnvironment {
  if (!activeEnvironment) {
    throw new EnvironmentValidationError("server", ["startup_not_initialized"]);
  }
  return activeEnvironment;
}
