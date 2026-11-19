import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  PAGE_PREPARED_EVENT,
  PAGE_PREPARATION_ERROR_EVENT,
  waitForInitialTasks,
} from "@/lib/page-readiness";

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

function waitForAsset(
  element: HTMLImageElement | HTMLVideoElement,
  eventName: "load" | "canplay",
  ready: () => boolean,
) {
  if (ready()) return Promise.resolve(true);
  return new Promise<boolean>((resolve) => {
    const finish = (success: boolean) => {
      clearTimeout(timeout);
      element.removeEventListener(eventName, onReady);
      element.removeEventListener("error", onError);
      resolve(success);
    };
    const onReady = () => finish(ready());
    const onError = () => finish(false);
    const timeout = window.setTimeout(onError, 15_000);
    element.addEventListener(eventName, onReady);
    element.addEventListener("error", onError);
    if (ready()) finish(true);
    else if (element instanceof HTMLImageElement && element.complete) finish(false);
    else if (element instanceof HTMLVideoElement && element.error) finish(false);
  });
}

async function prepareImage(image: HTMLImageElement) {
  image.loading = "eager";
  const loaded = await waitForAsset(image, "load", () => image.complete && image.naturalWidth > 0);
  try {
    if (!loaded) throw new Error("Image unavailable");
    await image.decode();
    image.dataset.prepared = "ready";
  } catch {
    for (const source of image.closest("picture")?.querySelectorAll("source") ?? []) {
      source.removeAttribute("srcset");
    }
    image.removeAttribute("srcset");
    image.src = "/images/media-unavailable.svg";
    const fallback = await waitForAsset(
      image,
      "load",
      () => image.complete && image.naturalWidth > 0,
    );
    if (!fallback) throw new Error("Image fallback unavailable");
    await image.decode();
    image.dataset.prepared = "fallback";
  }
}

export function PagePreparation() {
  const loading = useRouterState({
    select: (state) => state.isLoading || state.status === "pending",
  });
  useEffect(() => {
    if (loading || !document.getElementById("site-preloader")) return;
    let cancelled = false;
    const deadline = window.setTimeout(() => {
      cancelled = true;
      window.dispatchEvent(new Event(PAGE_PREPARATION_ERROR_EVENT));
    }, 45_000);
    const prepare = async () => {
      // Let effects register initial data work and commit all route content first.
      await nextFrame();
      if (cancelled) return;
      await nextFrame();
      if (cancelled) return;
      const inViewport = (element: Element) => {
        const rect = element.getBoundingClientRect();
        if (getComputedStyle(element).visibility === "hidden") return false;
        if (
          element instanceof HTMLImageElement &&
          (!element.getAttribute("src") || element.closest('[aria-hidden="true"], [hidden]'))
        )
          return false;
        return (
          rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight
        );
      };
      const images = [...document.querySelectorAll<HTMLImageElement>("#root img")].filter(
        inViewport,
      );
      const posters = [
        ...document.querySelectorAll<HTMLVideoElement>("#root video[poster]"),
      ].filter(inViewport);
      await Promise.all([
        waitForInitialTasks(),
        document.fonts.ready,
        ...images.map(prepareImage),
        ...posters.map(async (video) => {
          const poster = new Image();
          poster.src = video.poster;
          await prepareImage(poster);
          video.poster = poster.src;
        }),
      ]);
      await waitForInitialTasks();
      await nextFrame();
      await document.fonts.ready;
      if (cancelled) return;
      window.clearTimeout(deadline);
      document.documentElement.dataset.pagePrepared = "true";
      window.dispatchEvent(new Event(PAGE_PREPARED_EVENT));
    };
    void prepare().catch(() => {
      if (!cancelled) {
        cancelled = true;
        window.clearTimeout(deadline);
        window.dispatchEvent(new Event(PAGE_PREPARATION_ERROR_EVENT));
      }
    });
    return () => {
      cancelled = true;
      window.clearTimeout(deadline);
    };
  }, [loading]);
  return null;
}
