import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail } from "lucide-react";
import { useApp } from "@/i18n/AppContext";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const content = {
  pt: {
    close: "Fechar aviso de privacidade",
    kicker: "// privacidade e dados",
    title: "Como seus dados são usados",
    description:
      "O guifer.tech não vende dados nem cria perfis publicitários. O tratamento é limitado ao contato, à segurança e às preferências da interface.",
    items: [
      {
        title: "Contato",
        body: "Nome, e-mail e mensagem são usados para responder você. O site não mantém uma cópia no banco; a mensagem recebida é eliminada em até 12 meses após a última interação relevante.",
      },
      {
        title: "Segurança",
        body: "O IP é transformado em HMAC para rate limit e o reCAPTCHA ajuda a impedir abuso. As chaves do rate limit são apagadas após 7 dias.",
      },
      {
        title: "Contador de cafés",
        body: "Um identificador aleatório evita cliques repetidos. Ele é anonimizado após 30 dias sem reduzir o total agregado.",
      },
      {
        title: "Preferências",
        body: "Tema, idioma e acessibilidade ficam apenas no seu navegador até você limpar ou restaurar os dados locais.",
      },
    ],
    providers:
      "Cloudflare, Render, Supabase, Brevo e Google reCAPTCHA participam somente das etapas necessárias para entregar e proteger o serviço.",
    rights:
      "Você pode solicitar acesso, correção, informação ou eliminação quando aplicável pelo canal contato@guifer.tech.",
    contact: "Solicitar atendimento",
    fullNotice: "Ler aviso completo",
    acknowledge: "Entendi",
  },
  en: {
    close: "Close privacy notice",
    kicker: "// privacy and data",
    title: "How your data is used",
    description:
      "guifer.tech does not sell data or build advertising profiles. Processing is limited to contact, security and interface preferences.",
    items: [
      {
        title: "Contact",
        body: "Your name, email and message are used to reply to you. The site does not keep a database copy; the received message is deleted within 12 months after the last relevant interaction.",
      },
      {
        title: "Security",
        body: "Your IP is transformed into an HMAC for rate limiting and reCAPTCHA helps prevent abuse. Rate-limit keys are deleted after 7 days.",
      },
      {
        title: "Coffee counter",
        body: "A random identifier prevents repeated clicks. It is anonymized after 30 days without reducing the aggregate total.",
      },
      {
        title: "Preferences",
        body: "Theme, language and accessibility settings remain only in your browser until you clear or reset local data.",
      },
    ],
    providers:
      "Cloudflare, Render, Supabase, Brevo and Google reCAPTCHA participate only in the steps required to deliver and protect the service.",
    rights:
      "You may request access, correction, information or deletion where applicable through contato@guifer.tech.",
    contact: "Submit a request",
    fullNotice: "Read full notice",
    acknowledge: "Got it",
  },
} as const;

type PrivacyNoticeDialogProps = {
  children: ReactNode;
  triggerClassName?: string;
};

export function PrivacyNoticeDialog({ children, triggerClassName }: PrivacyNoticeDialogProps) {
  const { lang } = useApp();
  const text = content[lang];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className={triggerClassName}>
          {children}
        </button>
      </DialogTrigger>
      <DialogContent
        closeLabel={text.close}
        className="max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-2xl overflow-y-auto rounded-xl border-hairline bg-background p-5 shadow-2xl sm:p-7"
      >
        <DialogHeader className="pr-8 text-left">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            {text.kicker}
          </p>
          <DialogTitle className="font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-foreground sm:text-3xl">
            {text.title}
          </DialogTitle>
          <DialogDescription className="pt-2 text-sm leading-relaxed text-foreground sm:text-base">
            {text.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 py-2 sm:grid-cols-2">
          {text.items.map((item) => (
            <section key={item.title} className="rounded-lg border border-hairline bg-surface p-4">
              <h3 className="font-display text-base font-medium text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{item.body}</p>
            </section>
          ))}
        </div>

        <div className="space-y-3 border-t border-hairline pt-4 text-sm leading-relaxed text-foreground">
          <p>{text.providers}</p>
          <p>{text.rights}</p>
        </div>

        <DialogFooter className="gap-3 border-t border-hairline pt-5 sm:items-center sm:justify-between sm:space-x-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="mailto:contato@guifer.tech?subject=Privacidade%20e%20LGPD%20no%20guifer.tech"
              className="link-ink inline-flex items-center gap-2 text-sm text-foreground"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>{text.contact}</span>
            </a>
            <Link
              to="/privacidade"
              className="link-ink inline-flex items-center gap-2 text-sm text-foreground"
            >
              <span>{text.fullNotice}</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <DialogClose asChild>
            <button type="button" className="btn-primary w-full sm:w-auto">
              {text.acknowledge}
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
