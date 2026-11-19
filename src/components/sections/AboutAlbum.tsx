import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "@/lib/motion";
import { useApp } from "@/i18n/AppContext";
import { aboutAlbumPhotos, type AboutAlbumPhoto } from "@/content/about-album";
import { SectionShell } from "./SectionShell";

type PhotoAlbumProps = {
  chapterTitle: string;
  photos: AboutAlbumPhoto[];
  eager?: boolean;
};

type PhotoDirection = -1 | 1;

function PhotoAlbum({ chapterTitle, photos, eager = false }: PhotoAlbumProps) {
  const { t, lang } = useApp();
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<PhotoDirection>(1);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activePhoto = photos[activeIndex];

  const selectPhoto = (index: number, nextDirection?: PhotoDirection) => {
    if (index === activeIndex) return;
    setDirection(nextDirection ?? (index > activeIndex ? 1 : -1));
    setActiveIndex(index);
  };

  const selectAndFocus = (index: number, nextDirection: PhotoDirection) => {
    selectPhoto(index, nextDirection);
    thumbnailRefs.current[index]?.focus();
  };

  const handleThumbnailKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined;
    let nextDirection: PhotoDirection = 1;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % photos.length;
      nextDirection = 1;
    }
    if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + photos.length) % photos.length;
      nextDirection = -1;
    }
    if (event.key === "Home") {
      nextIndex = 0;
      nextDirection = -1;
    }
    if (event.key === "End") {
      nextIndex = photos.length - 1;
      nextDirection = 1;
    }

    if (nextIndex === undefined) return;
    event.preventDefault();
    selectAndFocus(nextIndex, nextDirection);
  };

  return (
    <div
      role="region"
      aria-label={`${t.about.story.albumLabel}: ${chapterTitle}`}
      className="mx-auto w-full max-w-[22rem] md:max-w-[25rem]"
      data-about-album={chapterTitle}
    >
      <div aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.figure
            key={activePhoto.id}
            custom={direction}
            variants={{
              enter: (moveDirection: PhotoDirection) =>
                reducedMotion ? { opacity: 1 } : { opacity: 0, x: moveDirection * 10 },
              active: { opacity: 1, x: 0 },
              exit: (moveDirection: PhotoDirection) =>
                reducedMotion ? { opacity: 0 } : { opacity: 0, x: moveDirection * -10 },
            }}
            initial="enter"
            animate="active"
            exit="exit"
            transition={{ duration: reducedMotion ? 0 : 0.28, ease: "easeOut" }}
          >
            <div className="aspect-[4/5] overflow-hidden rounded-md border border-border bg-black shadow-[var(--shadow-card)]">
              <img
                src={activePhoto.src}
                alt={activePhoto.alt[lang]}
                width={activePhoto.width}
                height={activePhoto.height}
                loading={eager && activeIndex === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={eager && activeIndex === 0 ? "high" : "auto"}
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="meta-text mt-3 grid text-muted-foreground">
              {photos.map((photo, index) => {
                const isActive = index === activeIndex;

                return (
                  <span
                    key={photo.id}
                    aria-hidden={isActive ? undefined : true}
                    className={`col-start-1 row-start-1 ${isActive ? "visible" : "invisible"}`}
                  >
                    {photo.caption[lang]}
                    {isActive && photos.length > 1 ? (
                      <span className="sr-only">
                        {" "}
                        {t.about.story.photoPosition
                          .replace("{current}", String(activeIndex + 1))
                          .replace("{total}", String(photos.length))}
                      </span>
                    ) : null}
                  </span>
                );
              })}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {photos.length > 1 ? (
        <div
          role="group"
          aria-label={`${t.about.story.selectorLabel}: ${chapterTitle}`}
          className="mt-4 flex min-h-16 items-center justify-center gap-3"
        >
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              ref={(element) => {
                thumbnailRefs.current[index] = element;
              }}
              type="button"
              onClick={() => selectPhoto(index)}
              onKeyDown={(event) => handleThumbnailKeyDown(event, index)}
              data-cursor-open={`${t.cursor.destinations.photo} ${index + 1}: ${photo.caption[lang]}`}
              aria-label={`${t.about.story.showPhotoLabel} ${index + 1}: ${photo.caption[lang]}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={`h-14 w-11 shrink-0 overflow-hidden rounded-sm border-2 bg-black transition-[border-color,opacity,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring ${
                index === activeIndex
                  ? "scale-105 border-accent opacity-100"
                  : "border-border opacity-65 hover:border-muted-foreground hover:opacity-100"
              }`}
            >
              <img
                src={photo.src}
                alt=""
                width={44}
                height={56}
                loading="lazy"
                decoding="async"
                aria-hidden="true"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function AboutAlbum() {
  const { t } = useApp();
  const reducedMotion = useReducedMotion();
  const story = t.about.story;
  const journeyStats = [
    { value: "+960h", label: t.timeline.stats.trainingHours },
    { value: "3", label: t.timeline.stats.trainingPrograms },
    { value: "2", label: t.timeline.stats.professionalExperiences },
    { value: "C1", label: t.timeline.stats.englishLevel },
  ];
  const chapters = [
    {
      title: story.chapterTitles[0],
      paragraphs: [story.paragraphs[0]],
    },
    {
      title: story.chapterTitles[1],
      paragraphs: [story.paragraphs[1]],
    },
    {
      title: story.chapterTitles[2],
      paragraphs: [story.paragraphs[2], story.quoteIntro],
      quote: story.quote,
    },
    {
      title: story.chapterTitles[3],
      paragraphs: [story.closing],
    },
    {
      title: t.about.statsLabel,
      stats: journeyStats,
    },
  ];

  return (
    <SectionShell id="sobre" label={`${t.about.title}:`} headingLevel={1} headerVariant="split">
      <div className="md:col-span-12">
        {chapters.map((chapter, index) => {
          const photos = aboutAlbumPhotos[index] ?? [];
          const hasPhotos = photos.length > 0;
          const photoOnLeft = hasPhotos && index % 2 === 1;
          const chapterId = `sobre-capitulo-${index + 1}`;

          return (
            <motion.article
              key={chapter.title}
              initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: reducedMotion ? 0 : 0.55, ease: "easeOut" }}
              aria-labelledby={chapterId}
              className={`border-t border-hairline py-12 md:py-16 ${
                hasPhotos ? "grid gap-10 md:grid-cols-12 md:items-center md:gap-8" : ""
              }`}
              data-about-chapter={index + 1}
            >
              <div
                className={
                  hasPhotos
                    ? `md:col-span-6 ${photoOnLeft ? "md:order-2 md:col-start-7" : "md:order-1"}`
                    : "mx-auto max-w-3xl text-center"
                }
              >
                <h2 id={chapterId} className="subsection-title text-foreground">
                  {chapter.title}
                </h2>
                <div
                  className={`body-copy mt-3 space-y-5 text-muted-foreground ${
                    hasPhotos ? "max-w-xl" : "mx-auto max-w-2xl"
                  }`}
                >
                  {chapter.paragraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}

                  {chapter.quote ? (
                    <blockquote className="body-copy border-l-2 border-accent pl-5 text-left text-foreground">
                      “{chapter.quote}”
                    </blockquote>
                  ) : null}

                  {chapter.stats ? (
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-10 pt-4 text-center md:grid-cols-4 md:gap-x-8">
                      {chapter.stats.map((stat) => (
                        <li key={stat.label} className="flex min-w-0 flex-col items-center gap-3">
                          <strong className="numeric-indicator text-[3rem] leading-none [letter-spacing:var(--type-tracking-numeric)] text-accent md:text-[4rem]">
                            {stat.value}
                          </strong>
                          <span className="meta-text max-w-40 text-muted-foreground">
                            {stat.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>

              {hasPhotos ? (
                <div
                  className={`mt-8 md:col-span-5 md:mt-0 ${
                    photoOnLeft ? "md:order-1 md:col-start-1" : "md:order-2 md:col-start-8"
                  }`}
                >
                  <PhotoAlbum chapterTitle={chapter.title} photos={photos} eager={index === 0} />
                </div>
              ) : null}
            </motion.article>
          );
        })}
      </div>
    </SectionShell>
  );
}
