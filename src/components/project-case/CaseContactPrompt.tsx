import { ArrowUpRight } from "lucide-react";
import type { Dict } from "@/i18n/dictionary";

export function CaseContactPrompt({ t }: { t: Dict }) {
  const { text, cta } = t.caseStudy.contactPrompt;
  return (
    <section className="border-t border-hairline">
      <div className="section-container py-14 md:py-16">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="prose-measure text-sm text-muted-foreground md:text-base">
            {text}
          </p>
          <a href="/#contato" className="btn-primary group !py-2.5 !text-[13px]">
            <span>{cta}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
