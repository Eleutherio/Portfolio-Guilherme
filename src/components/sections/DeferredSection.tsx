import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";

export const LOAD_DEFERRED_SECTION_EVENT = "portfolio:load-deferred-section";
export const DEFERRED_SECTION_LOADED_EVENT = "portfolio:deferred-section-loaded";

type DeferredSectionProps = {
  id: string;
  load: () => Promise<{ default: ComponentType }>;
  placeholderClassName?: string;
  rootMargin?: string;
};

export function DeferredSection({
  id,
  load,
  placeholderClassName = "min-h-[calc(100svh-var(--site-header-height,64px))]",
  rootMargin = "0px 0px -1px",
}: DeferredSectionProps) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const loadRef = useRef(load);
  const requestedRef = useRef(false);
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [loadError, setLoadError] = useState<unknown>();

  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  const requestLoad = useCallback(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;
    void loadRef.current().then(
      (module) => setComponent(() => module.default),
      (error: unknown) => setLoadError(error),
    );
  }, []);

  useEffect(() => {
    const loadFromHash = () => {
      if (window.location.hash === `#${id}`) requestLoad();
    };
    loadFromHash();

    const onRequested = (event: Event) => {
      if ((event as CustomEvent<string>).detail === id) requestLoad();
    };
    window.addEventListener(LOAD_DEFERRED_SECTION_EVENT, onRequested);
    window.addEventListener("hashchange", loadFromHash);
    return () => {
      window.removeEventListener(LOAD_DEFERRED_SECTION_EVENT, onRequested);
      window.removeEventListener("hashchange", loadFromHash);
    };
  }, [id, requestLoad]);

  useEffect(() => {
    if (Component) return;
    const placeholder = placeholderRef.current;
    if (!placeholder) return;
    if (typeof IntersectionObserver === "undefined") {
      requestLoad();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        requestLoad();
      },
      { rootMargin },
    );
    observer.observe(placeholder);
    return () => observer.disconnect();
  }, [Component, requestLoad, rootMargin]);

  useEffect(() => {
    if (!Component) return;
    window.dispatchEvent(new CustomEvent(DEFERRED_SECTION_LOADED_EVENT, { detail: id }));
    if (window.location.hash === `#${id}`) {
      window.requestAnimationFrame(() => {
        document.getElementById(`${id}-heading`)?.focus({ preventScroll: true });
      });
    }
  }, [Component, id]);

  if (loadError) throw loadError;
  if (Component) return <Component />;

  return (
    <section
      ref={placeholderRef}
      id={id}
      data-deferred-section={id}
      className={placeholderClassName}
      aria-hidden="true"
    />
  );
}
