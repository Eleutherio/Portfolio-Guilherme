import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Loader2, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/Brand";
import { useApp } from "@/i18n/AppContext";
import {
  CONTACT_LIMITS,
  contactPayloadSchema,
  createContactPayloadSchema,
  type ContactApiResponse,
} from "@/lib/contact-contract";
import { executeContactRecaptcha } from "@/lib/recaptcha";
import { apiUrl } from "@/lib/api-client";
import { PrivacyNoticeDialog } from "@/components/privacy/PrivacyNoticeDialog";
import { SectionShell } from "./SectionShell";

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

const buildSchema = (lang: "pt" | "en") => {
  const msg = (pt: string, en: string) => (lang === "pt" ? pt : en);
  return createContactPayloadSchema({
    nameRequired: msg(
      "Informe seu nome (mín. 2 caracteres).",
      "Please enter your name (min. 2 chars).",
    ),
    nameTooLong: msg("Nome muito longo.", "Name is too long."),
    nameInvalid: msg("Nome inválido.", "Invalid name."),
    emailInvalid: msg("E-mail inválido.", "Invalid email."),
    emailTooLong: msg("E-mail muito longo.", "Email is too long."),
    subjectTooLong: msg("Assunto muito longo.", "Subject is too long."),
    subjectInvalid: msg("Assunto inválido.", "Invalid subject."),
    messageTooShort: msg(
      "Mensagem muito curta (mín. 10 caracteres).",
      "Message too short (min. 10 chars).",
    ),
    messageTooLong: msg(
      "Mensagem muito longa (máx. 1000 caracteres).",
      "Message too long (max 1000 chars).",
    ),
    messageInvalid: msg("Mensagem inválida.", "Invalid message."),
  });
};

export function Contact() {
  const { t, lang } = useApp();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const data = new FormData(form);

    const schema = buildSchema(lang);
    const result = schema.safeParse({
      name: data.get("name"),
      email: data.get("email"),
      subject: data.get("subject"),
      message: data.get("message"),
      website: data.get("website"),
      locale: lang,
    });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (
          (key === "name" || key === "email" || key === "subject" || key === "message") &&
          !fieldErrors[key]
        ) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const antiBotToken = await executeContactRecaptcha();
      const payload = contactPayloadSchema.safeParse({ ...result.data, antiBotToken });
      if (!payload.success) {
        setStatus("error");
        return;
      }

      const response = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload.data),
        signal: AbortSignal.timeout(30_000),
      });
      const apiResult = (await response.json().catch(() => null)) as ContactApiResponse | null;

      if (!response.ok || !apiResult?.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  const inputCls =
    "w-full border-0 border-b border-[var(--control-border)] bg-transparent px-0 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-accent focus:outline-none focus-visible:border-accent focus-visible:outline-none aria-[invalid=true]:border-destructive md:text-base";
  const labelCls = "block font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground";
  const errorCls = "mt-1.5 font-mono text-[11px] text-destructive";

  const primaryLinks = [
    {
      href: "https://wa.me/5551994055984",
      label: "(51) 99405-5984",
      Icon: Phone,
      external: true,
    },
    {
      href: "https://www.linkedin.com/in/guifer-dev/",
      label: "linkedin.com/in/Eleutherio",
      Icon: LinkedinIcon,
      external: true,
    },
    {
      href: "https://github.com/Eleutherio",
      label: "github.com/Eleutherio",
      Icon: GithubIcon,
      external: true,
    },
  ];

  const primaryLabel = lang === "pt" ? "Contato principal" : "Primary contact";
  const formLabel = t.contact.formAriaLabel;
  const fallbackLabel = lang === "pt" ? "Prefere pelo WhatsApp? " : "Prefer WhatsApp? ";

  return (
    <SectionShell
      id="contato"
      label={t.contact.title}
      sublabel={t.contact.subtitle}
      lead={t.contact.lead}
      compact
    >
      {/* Left column — primary conversion path */}
      <div className="md:col-span-5">
        <div>
          <p className={labelCls}>{primaryLabel}</p>
          <ul className="mt-3 space-y-2">
            {primaryLinks.map(({ href, label, Icon, external }) => (
              <li key={href}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  className="group inline-flex max-w-full min-w-0 items-center gap-2.5 text-foreground"
                  aria-label={label}
                >
                  <span
                    aria-hidden="true"
                    className="grid h-8 w-8 place-items-center rounded-md border border-hairline text-accent transition-colors group-hover:border-accent group-hover:bg-surface"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="link-ink min-w-0 break-all font-mono text-xs md:text-sm">
                    {label}
                  </span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right column — secondary path: form */}
      <motion.form
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        onSubmit={onSubmit}
        className="mt-10 space-y-4 md:col-span-7 md:mt-0"
        noValidate
        aria-label={formLabel}
        aria-busy={status === "submitting"}
      >
        {/* Honeypot — visually and a11y hidden */}
        <div aria-hidden="true" className="absolute -left-[10000px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div>
          <label htmlFor="contact-name" className={labelCls}>
            {t.contact.form.name}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            maxLength={CONTACT_LIMITS.name}
            autoComplete="name"
            placeholder={t.contact.form.namePh}
            aria-label={t.contact.form.name.replace(/^\/\/\s*/, "")}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "err-name" : undefined}
            className={inputCls}
          />
          {errors.name && (
            <p id="err-name" role="alert" className={errorCls}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className={labelCls}>
            {t.contact.form.email}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={CONTACT_LIMITS.email}
            autoComplete="email"
            placeholder={t.contact.form.emailPh}
            aria-label={t.contact.form.email.replace(/^\/\/\s*/, "")}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "err-email" : undefined}
            className={inputCls}
          />
          {errors.email && (
            <p id="err-email" role="alert" className={errorCls}>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-subject" className={labelCls}>
            {t.contact.form.subject}
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            maxLength={CONTACT_LIMITS.subject}
            autoComplete="off"
            placeholder={t.contact.form.subjectPh}
            aria-label={t.contact.form.subject.replace(/^\/\/\s*/, "")}
            aria-invalid={errors.subject ? true : undefined}
            aria-describedby={errors.subject ? "err-subject" : undefined}
            className={inputCls}
          />
          {errors.subject && (
            <p id="err-subject" role="alert" className={errorCls}>
              {errors.subject}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-message" className={labelCls}>
            {t.contact.form.message}
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            maxLength={CONTACT_LIMITS.message}
            rows={4}
            placeholder={t.contact.form.messagePh}
            aria-label={t.contact.form.message.replace(/^\/\/\s*/, "")}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "err-message" : undefined}
            className={`${inputCls} resize-y`}
          />
          {errors.message && (
            <p id="err-message" role="alert" className={errorCls}>
              {errors.message}
            </p>
          )}
        </div>

        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
          {t.contact.form.recaptchaNotice}{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer noopener"
            className="link-ink text-foreground"
          >
            {t.contact.form.recaptchaPrivacy}
          </a>{" "}
          {t.contact.form.recaptchaJoin}{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noreferrer noopener"
            className="link-ink text-foreground"
          >
            {t.contact.form.recaptchaTerms}
          </a>
          . {t.contact.form.sitePrivacyPrefix}{" "}
          <PrivacyNoticeDialog triggerClassName="link-ink text-left text-foreground">
            {t.contact.form.sitePrivacy}
          </PrivacyNoticeDialog>
          .
        </p>

        <div className="flex flex-col items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn-primary group w-full disabled:opacity-60 sm:w-auto"
          >
            {status === "submitting" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : null}
            <span>
              {status === "submitting" ? t.contact.form.submitting : t.contact.form.submit}
            </span>
            {status !== "submitting" && (
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            )}
          </button>
          <p
            aria-live="polite"
            role="status"
            className="text-center font-mono text-xs text-muted-foreground"
          >
            {status === "success" && (
              <span className="font-semibold text-success">{t.contact.form.success}</span>
            )}
            {status === "error" && Object.keys(errors).length === 0 && (
              <span className="font-semibold text-destructive">{t.contact.form.error}</span>
            )}
          </p>
        </div>

        {status === "success" && (
          <p className="text-center font-mono text-xs text-muted-foreground">
            {fallbackLabel}
            <a
              href="https://wa.me/5551994055984"
              target="_blank"
              rel="noreferrer noopener"
              className="link-ink text-foreground"
            >
              (51) 99405-5984
            </a>
          </p>
        )}
      </motion.form>
    </SectionShell>
  );
}
