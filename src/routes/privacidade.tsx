import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Mail } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useApp } from "@/i18n/AppContext";

const LAST_UPDATED = "2026-07-22";

const content = {
  pt: {
    metaTitle: "Privacidade — Guilherme Ferreira Eleutherio",
    metaDescription:
      "Aviso de privacidade do guifer.tech: dados tratados, finalidades, bases legais, fornecedores, retenção e direitos.",
    kicker: "// privacidade",
    title: "Aviso de Privacidade",
    intro:
      "Este aviso explica, de forma objetiva, como o guifer.tech trata dados pessoais. O site não vende dados, não cria perfis publicitários e procura coletar somente o necessário para contato, segurança e funcionamento.",
    controllerTitle: "Controlador e canal",
    controllerBody:
      "O controlador é Guilherme Ferreira Eleutherio, profissional de tecnologia localizado em Porto Alegre/RS, Brasil. Solicitações sobre privacidade e exercício de direitos podem ser enviadas para contato@guifer.tech.",
    controllerCta: "Falar sobre privacidade",
    processingTitle: "Tratamentos realizados",
    processing: [
      {
        title: "Formulário de contato",
        data: "Nome, e-mail, assunto opcional, mensagem, idioma e dados técnicos necessários ao envio.",
        purpose: "Responder ao contato e conduzir conversas profissionais iniciadas por você.",
        basis:
          "Procedimentos preliminares relacionados a contrato, quando aplicável, e legítimo interesse para comunicação profissional (art. 7º, V e IX, da LGPD).",
        retention:
          "O banco do site não guarda uma cópia. A mensagem entregue à caixa do controlador é eliminada em até 12 meses após a última interação relevante, salvo obrigação legal ou exercício regular de direitos.",
      },
      {
        title: "Segurança e prevenção de abuso",
        data: "Endereço IP transformado em HMAC, sinais do reCAPTCHA e metadados mínimos da requisição.",
        purpose: "Impedir spam, automação abusiva, fraude e indisponibilidade dos serviços.",
        basis:
          "Legítimo interesse em proteger o site e seus usuários, com minimização e controles técnicos (art. 7º, IX, da LGPD).",
        retention:
          "Chaves HMAC do rate limit são apagadas após 7 dias. Logs de aplicação no Render ficam disponíveis por até 7 dias no plano atual; logs de plataforma do Supabase Free, por 1 dia.",
      },
      {
        title: "Contador de cafés",
        data: "Identificador aleatório criado no navegador e horário do clique.",
        purpose: "Evitar contagens repetidas pelo mesmo navegador e manter o total agregado.",
        basis: "Legítimo interesse em preservar a integridade do contador (art. 7º, IX, da LGPD).",
        retention:
          "O identificador é removido automaticamente após 30 dias. A linha anônima permanece apenas para preservar o total agregado.",
      },
      {
        title: "Preferências locais",
        data: "Idioma, tema, preferências de acessibilidade e estado local do contador.",
        purpose: "Lembrar escolhas feitas no próprio dispositivo.",
        basis:
          "Funcionamento solicitado pelo usuário e legítimo interesse em oferecer a interface escolhida.",
        retention:
          "Permanecem somente no navegador até você limpar os dados do site ou restaurar as preferências. Não são sincronizadas com o servidor.",
      },
    ],
    fieldLabels: {
      data: "Dados",
      purpose: "Finalidade",
      basis: "Base",
      retention: "Retenção",
    },
    providersTitle: "Fornecedores e compartilhamento",
    providersIntro:
      "Os dados são compartilhados somente quando necessário para prestar ou proteger o serviço. Conforme o contexto e seus contratos, estes fornecedores podem atuar como operadores ou controladores independentes:",
    providers: [
      "Cloudflare — entrega do frontend, DNS, proteção de rede e roteamento de e-mail.",
      "Render — execução da API e logs técnicos minimizados.",
      "Supabase — banco para rate limits, contador e evidências de retenção.",
      "Brevo — transporte SMTP e eventos transacionais; a janela operacional definida para esses logs é de 30 dias.",
      "Google reCAPTCHA — análise antifraude conforme os termos e o aviso de privacidade do Google.",
      "Green Web Foundation — carregamento do selo que verifica o uso de hospedagem sustentável; a requisição da imagem transmite dados técnicos de conexão.",
      "Provedor da caixa de e-mail do controlador — recebimento e armazenamento temporário das mensagens.",
      "GitHub — execução do keep-alive e consulta de dados públicos do perfil; o conteúdo do formulário não é enviado ao GitHub.",
    ],
    transfersTitle: "Transferência internacional",
    transfersBody:
      "Alguns fornecedores mantêm infraestrutura ou equipes fora do Brasil. Isso pode envolver transferência internacional de dados, limitada às finalidades descritas e sujeita às medidas e instrumentos contratuais oferecidos por cada fornecedor.",
    rightsTitle: "Seus direitos",
    rightsIntro:
      "Nos limites da LGPD, você pode solicitar gratuitamente confirmação e acesso, correção, informação sobre compartilhamento, oposição quando aplicável, portabilidade conforme regulamentação e anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade.",
    rightsBody:
      "Para proteger o titular, poderá ser solicitada confirmação de identidade proporcional ao pedido. Se uma informação precisar ser conservada por obrigação legal ou exercício regular de direitos, o motivo e o prazo serão informados. Você também pode peticionar à ANPD após buscar atendimento com o controlador.",
    securityTitle: "Segurança e minimização",
    securityBody:
      "O projeto usa HTTPS, validação no cliente e no servidor, limites de corpo, rate limit, reCAPTCHA, remetente verificado, escape de HTML, bloqueio de injeção em cabeçalhos, acesso restrito ao banco e logs sem nome, e-mail ou mensagem integral. Nenhum sistema é imune a riscos; incidentes relevantes serão tratados conforme a legislação aplicável.",
    cautionsTitle: "Conteúdo enviado e público",
    cautionsBody:
      "Não envie dados pessoais sensíveis, credenciais ou informações de terceiros pelo formulário. O site não é direcionado a crianças. Links externos, como GitHub e LinkedIn, possuem avisos próprios e passam a controlar o tratamento após a navegação para seus domínios.",
    retentionTitle: "Como a retenção é verificada",
    retentionBody:
      "Uma rotina diária no Supabase elimina chaves de rate limit vencidas e anonimiza identificadores do contador. Cada execução registra apenas data e quantidades por 90 dias. O health check autenticado considera a retenção atrasada quando não há execução válida nas últimas 36 horas.",
    changesTitle: "Alterações deste aviso",
    changesBody:
      "Este aviso será revisado quando o tratamento, os fornecedores ou os prazos mudarem. A data abaixo identifica a versão vigente.",
    referencesTitle: "Referências e avisos externos",
    references: [
      {
        label: "Lei Geral de Proteção de Dados Pessoais",
        href: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm",
      },
      {
        label: "Direitos dos titulares — ANPD",
        href: "https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados-1",
      },
      { label: "Privacidade do Google", href: "https://policies.google.com/privacy" },
      { label: "Privacidade da Brevo", href: "https://www.brevo.com/pt/legal/privacypolicy/" },
      { label: "Privacidade da Cloudflare", href: "https://www.cloudflare.com/privacypolicy/" },
      {
        label: "Privacidade da Green Web Foundation",
        href: "https://www.thegreenwebfoundation.org/privacy-statement/",
      },
    ],
    updatedLabel: "Última atualização",
  },
  en: {
    metaTitle: "Privacy — Guilherme Ferreira Eleutherio",
    metaDescription:
      "guifer.tech privacy notice: processed data, purposes, legal bases, providers, retention and rights.",
    kicker: "// privacy",
    title: "Privacy Notice",
    intro:
      "This notice explains how guifer.tech processes personal data. The site does not sell data, does not build advertising profiles and aims to collect only what is necessary for contact, security and operation.",
    controllerTitle: "Controller and contact channel",
    controllerBody:
      "The controller is Guilherme Ferreira Eleutherio, a technology professional based in Porto Alegre/RS, Brazil. Privacy requests and data subject rights can be sent to contato@guifer.tech.",
    controllerCta: "Contact about privacy",
    processingTitle: "Processing activities",
    processing: [
      {
        title: "Contact form",
        data: "Name, email, optional subject, message, language and technical data required for delivery.",
        purpose: "Reply to the contact and conduct professional conversations initiated by you.",
        basis:
          "Steps prior to entering into a contract, where applicable, and legitimate interest in professional communication (Brazilian LGPD, Article 7, V and IX).",
        retention:
          "The website database does not store a copy. The message delivered to the controller's mailbox is deleted within 12 months after the last relevant interaction, except where legal compliance or the establishment of legal claims requires retention.",
      },
      {
        title: "Security and abuse prevention",
        data: "IP address transformed into an HMAC, reCAPTCHA signals and minimal request metadata.",
        purpose: "Prevent spam, abusive automation, fraud and service disruption.",
        basis:
          "Legitimate interest in protecting the website and its users, with minimization and technical safeguards (Brazilian LGPD, Article 7, IX).",
        retention:
          "Rate-limit HMAC keys are deleted after 7 days. Application logs on Render are available for up to 7 days under the current plan; Supabase Free platform logs, for 1 day.",
      },
      {
        title: "Coffee counter",
        data: "Random identifier created in the browser and click timestamp.",
        purpose: "Prevent repeated counts from the same browser and maintain the aggregate total.",
        basis:
          "Legitimate interest in preserving counter integrity (Brazilian LGPD, Article 7, IX).",
        retention:
          "The identifier is automatically removed after 30 days. The anonymous row remains only to preserve the aggregate total.",
      },
      {
        title: "Local preferences",
        data: "Language, theme, accessibility preferences and the counter's local state.",
        purpose: "Remember choices made on the device.",
        basis:
          "User-requested operation and legitimate interest in providing the selected interface.",
        retention:
          "They remain only in the browser until you clear site data or reset preferences. They are not synchronized with the server.",
      },
    ],
    fieldLabels: {
      data: "Data",
      purpose: "Purpose",
      basis: "Legal basis",
      retention: "Retention",
    },
    providersTitle: "Providers and sharing",
    providersIntro:
      "Data is shared only when necessary to provide or protect the service. Depending on the context and contracts, these providers may act as processors or independent controllers:",
    providers: [
      "Cloudflare — frontend delivery, DNS, network protection and email routing.",
      "Render — API execution and minimized technical logs.",
      "Supabase — database for rate limits, the counter and retention evidence.",
      "Brevo — SMTP transport and transactional events; the operational window defined for these logs is 30 days.",
      "Google reCAPTCHA — anti-fraud analysis under Google's terms and privacy notice.",
      "Green Web Foundation — loading the badge that verifies the use of green hosting; the image request transmits technical connection data.",
      "The controller's mailbox provider — receipt and temporary storage of messages.",
      "GitHub — keep-alive execution and public profile data queries; form content is not sent to GitHub.",
    ],
    transfersTitle: "International transfers",
    transfersBody:
      "Some providers maintain infrastructure or teams outside Brazil. This may involve international data transfers limited to the purposes described and subject to the safeguards and contractual instruments offered by each provider.",
    rightsTitle: "Your rights",
    rightsIntro:
      "Within the limits of the Brazilian LGPD, you may request confirmation and access, correction, information about sharing, objection where applicable, portability subject to regulation, and anonymization, blocking or deletion of unnecessary or unlawfully processed data.",
    rightsBody:
      "To protect the data subject, identity verification proportionate to the request may be required. If information must be retained for legal compliance or the establishment of legal claims, the reason and period will be explained. You may also petition the Brazilian Data Protection Authority after contacting the controller.",
    securityTitle: "Security and minimization",
    securityBody:
      "The project uses HTTPS, client and server validation, body limits, rate limiting, reCAPTCHA, a verified sender, HTML escaping, header-injection protection, restricted database access and logs without full names, email addresses or messages. No system is immune to risk; relevant incidents will be handled under applicable law.",
    cautionsTitle: "Submitted and public content",
    cautionsBody:
      "Do not send sensitive personal data, credentials or third-party information through the form. The site is not directed at children. External links such as GitHub and LinkedIn have their own notices and control processing after you navigate to their domains.",
    retentionTitle: "How retention is verified",
    retentionBody:
      "A daily Supabase job deletes expired rate-limit keys and anonymizes counter identifiers. Each run stores only its date and row counts for 90 days. The authenticated health check treats retention as stale when no valid run exists within the previous 36 hours.",
    changesTitle: "Changes to this notice",
    changesBody:
      "This notice will be reviewed whenever processing, providers or retention periods change. The date below identifies the current version.",
    referencesTitle: "References and external notices",
    references: [
      {
        label: "Brazilian General Data Protection Law",
        href: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm",
      },
      {
        label: "Data subject rights — ANPD",
        href: "https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados-1",
      },
      { label: "Google Privacy Policy", href: "https://policies.google.com/privacy" },
      { label: "Brevo Privacy Policy", href: "https://www.brevo.com/legal/privacypolicy/" },
      { label: "Cloudflare Privacy Policy", href: "https://www.cloudflare.com/privacypolicy/" },
      {
        label: "Green Web Foundation Privacy Policy",
        href: "https://www.thegreenwebfoundation.org/privacy-statement/",
      },
    ],
    updatedLabel: "Last updated",
  },
} as const;

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: content.pt.metaTitle },
      { name: "description", content: content.pt.metaDescription },
      { property: "og:title", content: content.pt.metaTitle },
      { property: "og:description", content: content.pt.metaDescription },
    ],
    links: [{ rel: "canonical", href: "/privacidade" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { lang } = useApp();
  const page = content[lang];
  const formattedDate = new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${LAST_UPDATED}T00:00:00Z`));

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <div className="h-[64px] shrink-0" aria-hidden="true" />
      <main id="main" tabIndex={-1} className="flex-1 overflow-x-clip outline-none">
        <section aria-labelledby="privacy-heading" className="border-b border-hairline">
          <div className="section-container py-14 md:py-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
              {page.kicker}
            </p>
            <h1
              id="privacy-heading"
              className="mt-4 max-w-4xl font-display text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground md:text-5xl"
            >
              {page.title}
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {page.intro}
            </p>
          </div>
        </section>

        <div className="section-container space-y-14 py-14 md:space-y-20 md:py-20">
          <InfoSection title={page.controllerTitle}>
            <p>{page.controllerBody}</p>
            <a
              href="mailto:contato@guifer.tech?subject=Privacidade%20e%20LGPD%20no%20guifer.tech"
              className="btn-outline mt-6 w-full sm:w-auto"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>{page.controllerCta}</span>
            </a>
          </InfoSection>

          <section aria-labelledby="privacy-processing">
            <SectionHeading id="privacy-processing">{page.processingTitle}</SectionHeading>
            <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {page.processing.map((activity) => (
                <article key={activity.title} className="card-surface p-6 md:p-8">
                  <h3 className="font-display text-xl font-medium tracking-[-0.025em] text-foreground">
                    {activity.title}
                  </h3>
                  <dl className="mt-5 space-y-4">
                    <Definition term={page.fieldLabels.data}>{activity.data}</Definition>
                    <Definition term={page.fieldLabels.purpose}>{activity.purpose}</Definition>
                    <Definition term={page.fieldLabels.basis}>{activity.basis}</Definition>
                    <Definition term={page.fieldLabels.retention}>{activity.retention}</Definition>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
            <InfoSection title={page.providersTitle}>
              <p>{page.providersIntro}</p>
              <DashList items={page.providers} />
            </InfoSection>
            <div className="space-y-10 md:space-y-12">
              <InfoSection title={page.transfersTitle}>
                <p>{page.transfersBody}</p>
              </InfoSection>
              <InfoSection title={page.retentionTitle}>
                <p>{page.retentionBody}</p>
              </InfoSection>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
            <InfoSection title={page.rightsTitle}>
              <p>{page.rightsIntro}</p>
              <p className="mt-4">{page.rightsBody}</p>
            </InfoSection>
            <div className="space-y-10 md:space-y-12">
              <InfoSection title={page.securityTitle}>
                <p>{page.securityBody}</p>
              </InfoSection>
              <InfoSection title={page.cautionsTitle}>
                <p>{page.cautionsBody}</p>
              </InfoSection>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
            <InfoSection title={page.changesTitle}>
              <p>{page.changesBody}</p>
              <p className="mt-4 font-mono text-xs text-muted-foreground">
                {page.updatedLabel}: <time dateTime={LAST_UPDATED}>{formattedDate}</time>
              </p>
            </InfoSection>
            <InfoSection title={page.referencesTitle}>
              <ul className="space-y-3">
                {page.references.map((reference) => (
                  <li key={reference.href}>
                    <a
                      href={reference.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="link-ink inline-flex items-start gap-2 text-foreground"
                    >
                      <span>{reference.label}</span>
                      <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </InfoSection>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="font-display text-2xl font-medium tracking-[-0.025em] text-foreground md:text-3xl"
    >
      {children}
    </h2>
  );
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-hairline pt-6">
      <h2 className="font-display text-xl font-medium tracking-[-0.025em] text-foreground">
        {title}
      </h2>
      <div className="mt-4 leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function Definition({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">{term}</dt>
      <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground md:text-base">
        {children}
      </dd>
    </div>
  );
}

function DashList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
