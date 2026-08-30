import { z } from "zod";
import { EnvironmentValidationError } from "./environment-error";

const httpUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((value) => {
    const url = new URL(value);
    return !url.username && !url.password;
  })
  .refine((value) => {
    const url = new URL(value);
    return (
      url.protocol === "https:" ||
      (url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
    );
  });

const clientEnvironmentSchema = z.object({
  VITE_API_URL: z.union([z.literal(""), httpUrlSchema]).default(""),
  VITE_RECAPTCHA_SITE_KEY: z.string().trim().min(1),
});

export type ClientEnvironment = z.infer<typeof clientEnvironmentSchema>;

export function parseClientEnvironment(
  environment: Record<string, string | undefined>,
): ClientEnvironment {
  const result = clientEnvironmentSchema.safeParse(environment);
  if (!result.success) {
    throw new EnvironmentValidationError(
      "client",
      result.error.issues.map((issue) => String(issue.path[0] ?? "unknown")),
    );
  }
  return result.data;
}
