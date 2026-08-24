export const CONTACT_BODY_MAX_BYTES = 12 * 1024;
export const RECAPTCHA_ACTION = "contact_submit";

export const CONTACT_LIMITS = {
  name: 100,
  email: 255,
  subject: 120,
  message: 1000,
  honeypot: 200,
  antiBotToken: 4096,
} as const;

export type ContactValidationMessages = {
  nameRequired: string;
  nameTooLong: string;
  nameInvalid: string;
  emailInvalid: string;
  emailTooLong: string;
  subjectTooLong: string;
  subjectInvalid: string;
  messageTooShort: string;
  messageTooLong: string;
  messageInvalid: string;
};

export type ContactApiErrorCode = "invalid_request" | "rate_limited" | "server_error";

export type ContactApiResponse =
  | { ok: true }
  | {
      ok: false;
      code: ContactApiErrorCode;
    };
