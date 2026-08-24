import { z } from "zod";
import { CONTACT_LIMITS, type ContactValidationMessages } from "@/lib/contact-shared";

export { CONTACT_BODY_MAX_BYTES, CONTACT_LIMITS, RECAPTCHA_ACTION } from "@/lib/contact-shared";
export type {
  ContactApiErrorCode,
  ContactApiResponse,
  ContactValidationMessages,
} from "@/lib/contact-shared";

const defaultMessages: ContactValidationMessages = {
  nameRequired: "Invalid name.",
  nameTooLong: "Invalid name.",
  nameInvalid: "Invalid name.",
  emailInvalid: "Invalid email.",
  emailTooLong: "Invalid email.",
  subjectTooLong: "Invalid subject.",
  subjectInvalid: "Invalid subject.",
  messageTooShort: "Invalid message.",
  messageTooLong: "Invalid message.",
  messageInvalid: "Invalid message.",
};

function hasControlCharacters(value: string): boolean {
  return Array.from(value).some((character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });
}

function optionalTrimmedString<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    schema.optional(),
  );
}

export function createContactPayloadSchema(
  messages: Partial<ContactValidationMessages> = {},
  options: { requireAntiBotToken?: boolean } = {},
) {
  const text = { ...defaultMessages, ...messages };
  const antiBotTokenSchema = z
    .string()
    .trim()
    .min(1, "Invalid anti-bot token.")
    .max(CONTACT_LIMITS.antiBotToken, "Invalid anti-bot token.");

  return z
    .object({
      name: z
        .string()
        .trim()
        .min(2, text.nameRequired)
        .max(CONTACT_LIMITS.name, text.nameTooLong)
        .refine((value) => !hasControlCharacters(value), text.nameInvalid),
      email: z
        .string()
        .trim()
        .email(text.emailInvalid)
        .max(CONTACT_LIMITS.email, text.emailTooLong),
      subject: optionalTrimmedString(
        z
          .string()
          .trim()
          .max(CONTACT_LIMITS.subject, text.subjectTooLong)
          .refine((value) => !hasControlCharacters(value), text.subjectInvalid),
      ),
      message: z
        .string()
        .trim()
        .min(10, text.messageTooShort)
        .max(CONTACT_LIMITS.message, text.messageTooLong)
        .refine((value) => !value.includes("\u0000"), text.messageInvalid),
      website: z.string().max(CONTACT_LIMITS.honeypot).optional().default(""),
      locale: z.enum(["pt", "en"]).default("pt"),
      antiBotToken: options.requireAntiBotToken
        ? antiBotTokenSchema
        : optionalTrimmedString(antiBotTokenSchema),
    })
    .strict();
}

export const contactPayloadSchema = createContactPayloadSchema({}, { requireAntiBotToken: true });

export type ContactPayload = z.infer<typeof contactPayloadSchema>;
