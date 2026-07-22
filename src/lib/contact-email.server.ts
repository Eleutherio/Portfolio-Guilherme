import nodemailer, { type SendMailOptions, type Transporter } from "nodemailer";
import { z } from "zod";
import { contactPayloadSchema, type ContactPayload } from "@/lib/contact-contract";

function hasControlCharacters(value: string): boolean {
  return Array.from(value).some((character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });
}

function isMailbox(value: string): boolean {
  if (hasControlCharacters(value)) return false;
  const friendlyMatch = value.match(/^[^<>]{1,100}\s<([^<>]+)>$/);
  const address = friendlyMatch?.[1] ?? value;
  return z.string().email().max(255).safeParse(address).success;
}

const emailConfigSchema = z.object({
  host: z.string().min(1).max(255),
  port: z.number().int().min(1).max(65_535),
  user: z.string().min(1).max(255),
  key: z.string().min(1).max(1024),
  from: z.string().min(3).max(320).refine(isMailbox),
  to: z.string().email().max(255),
});

type EmailConfig = z.infer<typeof emailConfigSchema>;

let transporter: Transporter | undefined;
let transporterConfigKey = "";

export class EmailDeliveryError extends Error {
  constructor() {
    super("Email delivery failed");
    this.name = "EmailDeliveryError";
  }
}

function getEmailConfig() {
  const result = emailConfigSchema.safeParse({
    host: process.env.BREVO_SMTP_HOST ?? "smtp-relay.brevo.com",
    port: Number.parseInt(process.env.BREVO_SMTP_PORT ?? "2525", 10),
    user: process.env.BREVO_SMTP_USER,
    key: process.env.BREVO_SMTP_KEY,
    from: process.env.CONTACT_EMAIL_FROM,
    to: process.env.CONTACT_EMAIL_TO,
  });

  if (!result.success) {
    throw new EmailDeliveryError();
  }

  return result.data;
}

function getTransporter(config: EmailConfig): Transporter {
  const configKey = `${config.host}:${config.port}:${config.user}:${config.key}`;
  if (!transporter || transporterConfigKey !== configKey) {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      requireTLS: config.port !== 465,
      auth: {
        user: config.user,
        pass: config.key,
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    transporterConfigKey = configKey;
  }
  return transporter;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character] ?? character;
  });
}

function buildSubject(payload: ContactPayload): string {
  const fallback =
    payload.locale === "en" ? "New portfolio contact" : "Novo contato pelo portfólio";
  return `[guifer.tech] ${payload.subject ?? fallback}`;
}

function buildText(payload: ContactPayload): string {
  return [
    "Novo contato recebido pelo portfólio",
    "",
    `Nome: ${payload.name}`,
    `E-mail: ${payload.email}`,
    `Assunto: ${payload.subject ?? "Não informado"}`,
    `Idioma: ${payload.locale}`,
    "",
    "Mensagem:",
    payload.message,
  ].join("\n");
}

function buildHtml(payload: ContactPayload): string {
  const name = escapeHtml(payload.name);
  const email = escapeHtml(payload.email);
  const subject = escapeHtml(payload.subject ?? "Não informado");
  const locale = escapeHtml(payload.locale);
  const message = escapeHtml(payload.message);

  return `
    <h2>Novo contato recebido pelo portfólio</h2>
    <dl>
      <dt><strong>Nome</strong></dt><dd>${name}</dd>
      <dt><strong>E-mail</strong></dt><dd>${email}</dd>
      <dt><strong>Assunto</strong></dt><dd>${subject}</dd>
      <dt><strong>Idioma</strong></dt><dd>${locale}</dd>
    </dl>
    <h3>Mensagem</h3>
    <div style="white-space: pre-wrap">${message}</div>
  `.trim();
}

export function buildContactEmail(
  payload: ContactPayload,
  requestId: string,
  sender: Pick<EmailConfig, "from" | "to">,
): SendMailOptions {
  const parsedPayload = contactPayloadSchema.safeParse(payload);
  const parsedSender = emailConfigSchema.pick({ from: true, to: true }).safeParse(sender);
  const parsedRequestId = z.string().uuid().safeParse(requestId);

  if (!parsedPayload.success || !parsedSender.success || !parsedRequestId.success) {
    throw new EmailDeliveryError();
  }

  return {
    from: parsedSender.data.from,
    to: parsedSender.data.to,
    replyTo: {
      address: parsedPayload.data.email,
      name: parsedPayload.data.name,
    },
    subject: buildSubject(parsedPayload.data),
    text: buildText(parsedPayload.data),
    html: buildHtml(parsedPayload.data),
    headers: {
      "X-Contact-Request-ID": parsedRequestId.data,
    },
  };
}

export async function sendContactEmail(payload: ContactPayload, requestId: string): Promise<void> {
  const config = getEmailConfig();

  try {
    await getTransporter(config).sendMail(buildContactEmail(payload, requestId, config));
  } catch {
    throw new EmailDeliveryError();
  }
}

export async function isEmailTransportAvailable(): Promise<boolean> {
  try {
    const config = getEmailConfig();
    return await getTransporter(config).verify();
  } catch {
    return false;
  }
}
