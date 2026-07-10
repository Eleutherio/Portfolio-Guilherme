import { motion } from "motion/react";
import { useApp } from "@/i18n/AppContext";
import profileImg from "@/assets/guilherme-profile.jpg";
import { ImageCover } from "@/components/ImageCover";
import { SectionShell } from "./SectionShell";

export function About() {
  const { t } = useApp();

  return (
    <SectionShell
      id="sobre"
      number="05"
      label={t.about.title}
      sublabel={t.about.subtitle}
    >
      {/* Wrapper to vertically center image and text on desktop */}
      <div className="contents md:col-span-12 md:grid md:grid-cols-12 md:items-center md:gap-8">
        {/* Portrait */}
        <div className="md:col-span-5">
          <motion.figure
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* gradient corner accent */}
            <span
              aria-hidden="true"
              className="absolute -left-2 -top-2 z-10 h-10 w-10 rounded-tl-lg border-l-2 border-t-2"
              style={{
                borderImage: "var(--gradient-brand) 1",
                borderImageSlice: 1,
              }}
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-2 -right-2 z-10 h-10 w-10 rounded-br-lg border-b-2 border-r-2"
              style={{
                borderImage: "var(--gradient-brand) 1",
                borderImageSlice: 1,
              }}
            />
            <div className="card-surface relative w-full overflow-hidden p-0 max-h-[380px] md:max-h-[440px] aspect-[4/5]">
              <ImageCover
                image={{
                  fallback: profileImg,
                  width: 800,
                  height: 1000,
                }}
                alt={t.about.photoAlt}
                sizes="(max-width: 768px) 100vw, 33vw"
                eager
                fetchPriority="high"
                className="block h-full w-full"
                imgClassName="h-full w-full object-cover object-top"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/30 via-transparent to-transparent"
              />
            </div>
            <figcaption className="mt-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-muted-foreground">
              {t.about.photoCaption}
            </figcaption>
          </motion.figure>
        </div>

        {/* Narrative */}
        <div className="mt-10 md:col-span-7 md:mt-0 md:pl-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="prose-measure space-y-5 text-[16px] leading-relaxed text-foreground md:text-[18px]"
          >
            <p className="first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-[3.25rem] first-letter:font-medium first-letter:leading-[0.85] first-letter:text-gradient">
              {t.about.p1}
            </p>
            <p className="text-muted-foreground">{t.about.p2}</p>
            <p>{t.about.p3}</p>
          </motion.div>

          {t.about.currentFocus && t.about.currentFocus.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-8 border-t border-hairline pt-5"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                {t.about.currentFocusLabel ?? "current focus"}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {t.about.currentFocus.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>


    </SectionShell>
  );
}
