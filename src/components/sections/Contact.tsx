import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { GithubIcon, LinkedinIcon, MailIcon, WhatsappIcon } from "@/components/icons/Brand";
import { useApp } from "@/i18n/AppContext";
import { CONTACT_LIMITS, type ContactApiResponse } from "@/lib/contact-shared";
import { executeContactRecaptcha } from "@/lib/recaptcha";
import { apiUrl } from "@/lib/api-client";
import { DeferredPrivacyNoticeDialog } from "@/components/privacy/DeferredPrivacyNoticeDialog";
import { SectionShell } from "./SectionShell";

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

const validationMessages = (lang: "pt" | "en") => {
  const msg = (pt: string, en: string) => (lang === "pt" ? pt : en);
  return {
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
  };
};

export function Contact() {
  const { t, lang } = useApp();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [hasConsent, setHasConsent] = useState(false);
  const submissionLockRef = useRef(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!hasConsent) {
      const consentControl = form.elements.namedItem("privacyConsent");
      if (consentControl instanceof HTMLElement) consentControl.focus();
      return;
    }
    if (submissionLockRef.current) return;
    submissionLockRef.current = true;
    setStatus("submitting");

    const data = new FormData(form);

    try {
      const { contactPayloadSchema, createContactPayloadSchema } =
        await import("@/lib/contact-contract");
      const schema = createContactPayloadSchema(validationMessages(lang));
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
      setHasConsent(false);
    } catch {
      setStatus("error");
    } finally {
      submissionLockRef.current = false;
    }
  };

  const inputCls = "contact-form__control touch-target";
  const labelCls = "contact-label";
  const errorCls = "contact-form__error";

  const primaryContactRows = [
    {
      href: "mailto:contato@guifer.tech",
      label: "contato@guifer.tech",
      cursorLabel: t.cursor.destinations.email,
      Icon: MailIcon,
      external: false,
    },
    {
      href: "https://wa.me/5551994055984",
      label: "(51) 99405-5984",
      cursorLabel: t.cursor.destinations.whatsapp,
      Icon: WhatsappIcon,
      external: true,
    },
  ];

  const socialContactRows = [
    {
      href: "https://www.linkedin.com/in/eleutherio/",
      label: "LinkedIn",
      cursorLabel: t.cursor.destinations.linkedin,
      Icon: LinkedinIcon,
      external: true,
    },
    {
      href: "https://github.com/Eleutherio",
      label: "GitHub",
      cursorLabel: t.cursor.destinations.github,
      Icon: GithubIcon,
      external: true,
    },
  ];

  const contactRows = [...primaryContactRows, ...socialContactRows];

  const primaryLabel = t.contact.primaryLabel;
  const formLabel = t.contact.formAriaLabel;
  const fallbackLabel = lang === "pt" ? "Prefere pelo WhatsApp? " : "Prefer WhatsApp? ";

  const renderPrimaryContact = () => (
    <div className="contact-primary__body">
      <ul className="contact-primary__rows">
        {contactRows.map(({ href, label, cursorLabel, Icon, external }) => (
          <li key={href}>
            <a
              href={href}
              aria-label={label}
              data-cursor-open={cursorLabel}
              {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              className="contact-primary__row touch-target"
            >
              <Icon aria-hidden="true" className="contact-primary__row-icon" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <SectionShell
      id="contato"
      label={t.contact.title}
      lead={t.contact.lead}
      headerAside={
        <div data-contact-primary className="contact-primary">
          <p className={labelCls}>{primaryLabel}</p>
          <div className="contact-primary__layout">{renderPrimaryContact()}</div>
        </div>
      }
      headerVariant="showcase"
      compact
    >
      <>
        <form
          id="contact-form"
          tabIndex={-1}
          onSubmit={onSubmit}
          className="contact-form section-content-reveal section-content-reveal-delay w-full md:col-span-12"
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

          <div className="contact-form__field">
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

          <div className="contact-form__field">
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

          <div className="contact-form__field">
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

          <div className="contact-form__field">
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

          <div className="contact-form__consent">
            <label className="contact-form__consent-control">
              <input
                id="contact-privacy-consent"
                name="privacyConsent"
                type="checkbox"
                required
                checked={hasConsent}
                onChange={(event) => setHasConsent(event.currentTarget.checked)}
                aria-labelledby="contact-consent-copy"
                className="contact-form__consent-checkbox"
              />
            </label>
            <p id="contact-consent-copy" className="contact-form__notice">
              {t.contact.form.recaptchaNotice}{" "}
              <a
                href="https://policies.google.com/privacy"
                data-cursor-open={t.cursor.destinations.googlePrivacy}
                target="_blank"
                rel="noreferrer noopener"
                className="link-ink text-foreground"
              >
                {t.contact.form.recaptchaPrivacy}
              </a>{" "}
              {t.contact.form.recaptchaJoin}{" "}
              <a
                href="https://policies.google.com/terms"
                data-cursor-open={t.cursor.destinations.googleTerms}
                target="_blank"
                rel="noreferrer noopener"
                className="link-ink text-foreground"
              >
                {t.contact.form.recaptchaTerms}
              </a>
              . {t.contact.form.sitePrivacyPrefix}{" "}
              <span className="whitespace-nowrap">
                <DeferredPrivacyNoticeDialog triggerClassName="link-ink text-left text-foreground">
                  {t.contact.form.sitePrivacy}
                </DeferredPrivacyNoticeDialog>
                .
              </span>
            </p>
          </div>

          <div className="contact-form__actions">
            <button
              type="submit"
              disabled={status === "submitting" || !hasConsent}
              className="contact-form__submit btn-primary group w-full sm:w-auto"
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
            <p aria-live="polite" role="status" className="contact-form__status">
              {status === "success" && (
                <span className="inline-emphasis text-success">{t.contact.form.success}</span>
              )}
              {status === "error" && Object.keys(errors).length === 0 && (
                <span className="inline-emphasis text-destructive">{t.contact.form.error}</span>
              )}
            </p>
          </div>

          {status === "success" && (
            <p className="contact-form__fallback">
              {fallbackLabel}
              <a
                href="https://wa.me/5551994055984"
                data-cursor-open={t.cursor.destinations.whatsapp}
                target="_blank"
                rel="noreferrer noopener"
                className="link-ink text-foreground"
              >
                (51) 99405-5984
              </a>
            </p>
          )}
        </form>

        <nav className="contact-form-social" aria-label={primaryLabel}>
          <p className="contact-label contact-form-social__label">{primaryLabel}</p>
          <div className="contact-form-social__links">
            {contactRows.map(({ href, label, cursorLabel, Icon, external }) => (
              <a
                key={href}
                href={href}
                aria-label={label}
                data-cursor-open={cursorLabel}
                {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                className="contact-form-social__link touch-target"
              >
                <Icon aria-hidden="true" className="contact-form-social__icon" />
              </a>
            ))}
          </div>
        </nav>
      </>
    </SectionShell>
  );
}
