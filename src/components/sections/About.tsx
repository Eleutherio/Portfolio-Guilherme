import { motion, useReducedMotion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useApp } from "@/i18n/AppContext";
import { ImageCover } from "@/components/ImageCover";
import { aboutCampusImage, aboutFeaturedImage, aboutWorkbenchImage } from "@/content/about-images";
import { SectionShell } from "./SectionShell";

export function About() {
  const { t } = useApp();
  const reducedMotion = useReducedMotion();

  return (
    <SectionShell
      id="sobre"
      label={t.about.title}
      sublabel={t.about.subtitle}
      headerVariant="editorial"
      compact
    >
      <div className="contents md:col-span-12 md:grid md:grid-cols-12 md:items-center md:gap-8">
        <div className="md:col-span-7">
          <motion.div
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: reducedMotion ? 0 : 0.6 }}
            className="relative mx-auto grid w-full max-w-[220px] grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-2 sm:max-w-[450px] sm:gap-3 md:mx-0 md:max-w-[570px]"
            role="group"
            aria-label={t.about.photos.label}
          >
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

            <div className="relative aspect-[4/5] min-w-0 overflow-hidden rounded-lg border border-hairline bg-surface shadow-sm">
              <ImageCover
                image={aboutFeaturedImage}
                alt={t.about.photos.featuredAlt}
                sizes="(max-width: 639px) 142px, (max-width: 767px) 292px, (max-width: 1023px) 35vw, 372px"
                className="block h-full w-full"
                imgClassName="h-full w-full object-cover object-top"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/30 via-transparent to-transparent"
              />
            </div>

            <div className="grid min-w-0 grid-rows-2 gap-2 sm:gap-3">
              <div className="relative min-h-0 overflow-hidden rounded-lg border border-hairline bg-surface shadow-sm">
                <ImageCover
                  image={aboutWorkbenchImage}
                  alt={t.about.photos.workbenchAlt}
                  sizes="(max-width: 639px) 68px, (max-width: 767px) 146px, (max-width: 1023px) 17.5vw, 186px"
                  className="block h-full w-full"
                  imgClassName="h-full w-full scale-[1.67] object-cover object-center"
                />
              </div>

              <div className="relative min-h-0 overflow-hidden rounded-lg border border-hairline bg-surface shadow-sm">
                <ImageCover
                  image={aboutCampusImage}
                  alt={t.about.photos.campusAlt}
                  sizes="(max-width: 639px) 68px, (max-width: 767px) 146px, (max-width: 1023px) 17.5vw, 186px"
                  className="block h-full w-full"
                  imgClassName="h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-5 sm:mt-8 md:col-span-5 md:mt-0 md:pl-2">
          <motion.div
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 0.05 }}
            className="prose-measure space-y-3 text-[14px] leading-[1.55] text-foreground sm:space-y-4 sm:text-[16px] sm:leading-relaxed md:text-[17px]"
          >
            <p className="first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-[2.75rem] first-letter:font-medium first-letter:leading-[0.85] first-letter:text-gradient sm:first-letter:text-[3.25rem]">
              {t.about.p1}
            </p>
            <p className="text-muted-foreground">{t.about.p2}</p>
          </motion.div>

          <motion.div
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : 0.15 }}
            className="mt-4 sm:mt-6"
          >
            <Link
              to="/sobre"
              className="btn-outline group w-fit max-w-full px-3 text-[10px] tracking-[0.18em] sm:px-[1.2rem] sm:text-[11px] sm:tracking-[0.25em] md:px-3 md:tracking-[0.16em] lg:px-[1.2rem] lg:tracking-[0.25em]"
            >
              <span>{t.about.learnMore}</span>
              <ArrowUpRight
                className="hidden h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </SectionShell>
  );
}
