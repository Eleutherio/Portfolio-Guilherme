import { motion } from "@/lib/motion";
import { useApp } from "@/i18n/AppContext";
import { SectionShell } from "./SectionShell";

export function WhyHire() {
  const { t } = useApp();

  return (
    <SectionShell id="contratar" label={t.whyHire.tag} lead={t.whyHire.titleA}>
      <div className="md:col-span-12">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {t.whyHire.reasons.map((r, i) => (
            <motion.article
              key={r.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-xl border border-hairline bg-surface p-7 md:p-8"
            >
              <p className="meta-text text-muted-foreground">{r.label}</p>
              <h4 className="content-title mt-3 text-foreground">{r.title}</h4>
              <p className="body-copy mt-3 text-muted-foreground">{r.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
