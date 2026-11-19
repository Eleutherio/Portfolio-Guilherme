import { Link } from "@tanstack/react-router";

import aboutCutout480Avif from "@/assets/about/about-speaking-cutout-480w.avif";
import aboutCutout480Webp from "@/assets/about/about-speaking-cutout-480w.webp";
import aboutCutout512Avif from "@/assets/about/about-speaking-cutout-512w.avif";
import aboutCutout512Webp from "@/assets/about/about-speaking-cutout-512w.webp";
import aboutCutout720Avif from "@/assets/about/about-speaking-cutout-720w.avif";
import aboutCutout720Webp from "@/assets/about/about-speaking-cutout-720w.webp";
import aboutCutout960Avif from "@/assets/about/about-speaking-cutout-960w.avif";
import aboutCutout960Webp from "@/assets/about/about-speaking-cutout-960w.webp";
import { ScrambleText } from "@/components/ScrambleText";
import { CoffeeCounter } from "@/components/hero/HeroStats";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/components/icons/Brand";
import { useApp } from "@/i18n/AppContext";
import { SectionShell } from "./SectionShell";

export function About() {
  const { t } = useApp();

  return (
    <SectionShell id="sobre" label={t.nav.sobre} compact hideHeading>
      <div className="about-template md:col-span-12">
        <div className="about-template__content">
          <div className="about-template__intro">
            <h3 className="section-editorial-title text-foreground">
              <ScrambleText text={`${t.about.greeting} ${t.about.introductionName}`} />
            </h3>
            <p className="section-editorial-intro about-template__role">
              <ScrambleText text={t.about.profileRole} />
            </p>
          </div>

          <div className="about-template__details">
            <p className="body-copy text-pretty text-muted-foreground">{t.about.teaserBody}</p>
            <p className="body-copy text-pretty text-muted-foreground">{t.about.resumeSummary}</p>
          </div>

          <div className="about-template__actions">
            <Link
              to="/sobre"
              data-cursor-open={t.cursor.destinations.about}
              className="btn-primary w-fit"
            >
              <span>{t.about.learnMore}</span>
            </Link>
            <a
              href={t.hero.resumeUrl}
              data-cursor-open={t.cursor.destinations.resume}
              data-resume-download
              download="Guilherme-Eleutherio-Curriculo.pdf"
              type="application/pdf"
              aria-label={t.hero.cta2}
              className="ui-control-text link-ink touch-target w-fit text-foreground"
            >
              <span>{t.hero.cta2}</span>
            </a>
          </div>

          <div className="about-template__social">
            <div className="about-template__social-links">
              <a
                href="https://www.linkedin.com/in/eleutherio/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                data-cursor-open={t.cursor.destinations.linkedin}
              >
                <LinkedinIcon />
              </a>
              <a
                href="https://github.com/Eleutherio"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                data-cursor-open={t.cursor.destinations.github}
              >
                <GithubIcon />
              </a>
              <a
                href="https://wa.me/5551994055984"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="WhatsApp"
                data-cursor-open={t.cursor.destinations.whatsapp}
              >
                <WhatsappIcon />
              </a>
            </div>
          </div>

          <div className="about-template__coffee" data-about-coffee>
            <span className="ui-control-text text-foreground">{t.about.coffeeInvite}</span>
            <CoffeeCounter />
          </div>
        </div>

        <figure className="about-template__portrait">
          <picture>
            <source
              type="image/avif"
              srcSet={`${aboutCutout480Avif} 480w, ${aboutCutout512Avif} 512w, ${aboutCutout720Avif} 720w, ${aboutCutout960Avif} 960w`}
              sizes="(max-width: 47.999rem) calc(100vw - 6rem), (max-width: 63.999rem) 40vw, min(32rem, 36vw)"
            />
            <source
              type="image/webp"
              srcSet={`${aboutCutout480Webp} 480w, ${aboutCutout512Webp} 512w, ${aboutCutout720Webp} 720w, ${aboutCutout960Webp} 960w`}
              sizes="(max-width: 47.999rem) calc(100vw - 6rem), (max-width: 63.999rem) 40vw, min(32rem, 36vw)"
            />
            <img
              src={aboutCutout720Webp}
              alt={t.about.photos.featuredAlt}
              width={1067}
              height={1600}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </figure>
      </div>
    </SectionShell>
  );
}
