import { useEffect, useState } from "react";
import { useApp } from "@/i18n/AppContext";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { scrollWithMomentum } from "@/components/layout/MomentumScroll";
import { DevelopmentPrinciplesMarquee } from "@/components/DevelopmentPrinciplesMarquee";

export function Skills() {
  const { t } = useApp();
  const { intro, services, title, knowledgeTitle, knowledgeIntro, knowledge } = t.skills;
  const reducedMotion = usePrefersReducedMotion();
  const [mobileLayout, setMobileLayout] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 47.999rem)");
    const update = () => setMobileLayout(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const closing = (
    <div className="services-section__closing">
      <div className="services-section__paragraphs">
        {intro.map((paragraph) => (
          <p key={paragraph} className="section-editorial-intro">
            {paragraph}
          </p>
        ))}
      </div>
      <a
        href="#contact-form"
        className="services-section__contact btn-primary w-fit"
        data-cursor-open={t.cursor.destinations.contact}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          const form = document.querySelector<HTMLFormElement>("#contato form");
          if (!form) return;
          event.preventDefault();
          if (!scrollWithMomentum(form, reducedMotion)) {
            form.scrollIntoView({
              behavior: reducedMotion ? "instant" : "smooth",
              block: "start",
            });
          }
          history.replaceState(null, "", "#contact-form");
          form.focus({ preventScroll: true });
        }}
      >
        {t.nav.talk}
      </a>
    </div>
  );

  return (
    <section id="habilidades" aria-labelledby="habilidades-heading" className="relative">
      <div className="section-container services-section">
        <div className="services-section__content">
          <div className="services-section__overview">
            <div className="services-section__intro">
              <h2
                id="habilidades-heading"
                tabIndex={-1}
                className="section-editorial-title services-section__title outline-none"
              >
                {title}
              </h2>
              <span
                className="section-editorial-rule services-section__accent"
                aria-hidden="true"
              />
              {!mobileLayout && closing}
            </div>
            <ul className="services-section__services">
              {services.map((service) => (
                <li key={service.title} className="services-section__item">
                  <h3 className="content-title text-foreground">{service.title}</h3>
                  <p className="body-copy text-muted-foreground">{service.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <section className="services-section__knowledge" aria-labelledby="knowledge-heading">
            <h2 id="knowledge-heading" className="section-editorial-title services-section__title">
              {knowledgeTitle}
            </h2>
            <span className="section-editorial-rule services-section__accent" aria-hidden="true" />
            <p className="section-editorial-intro services-section__knowledge-intro">
              {knowledgeIntro}
            </p>
            <DevelopmentPrinciplesMarquee
              items={knowledge}
              label={knowledgeTitle}
              controls={t.skills.marquee}
            />
            {mobileLayout && closing}
          </section>
        </div>
      </div>
    </section>
  );
}
