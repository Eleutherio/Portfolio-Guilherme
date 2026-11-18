import { useEffect } from "react";
import type Lenis from "lenis";
import "lenis/dist/lenis.css";

type ScrollTarget = number | string | HTMLElement;

let activeController: Lenis | null = null;

export function scrollWithMomentum(target: ScrollTarget, immediate = false) {
  if (!activeController) return false;

  activeController.resize();
  activeController.scrollTo(target, { immediate });
  return true;
}

export function MomentumScroll() {
  useEffect(() => {
    let controller: Lenis | null = null;
    let disposed = false;
    let loading = false;
    const activate = (event: Event) => {
      if (!event.isTrusted || loading || document.documentElement.dataset.pageLoading === "true")
        return;
      loading = true;
      void import("lenis")
        .then(({ default: LenisController }) => {
          if (disposed) return;
          controller = new LenisController({
            anchors: true,
            autoRaf: true,
            autoToggle: true,
            lerp: 0.09,
            respectReducedMotion: true,
            smoothWheel: true,
            stopInertiaOnNavigate: true,
            syncTouch: false,
          });
          activeController = controller;
        })
        .catch(() => {
          loading = false;
        });
    };
    window.addEventListener("wheel", activate, { passive: true });
    window.addEventListener("touchmove", activate, { passive: true });

    return () => {
      disposed = true;
      window.removeEventListener("wheel", activate);
      window.removeEventListener("touchmove", activate);
      if (activeController === controller) activeController = null;
      controller?.destroy();
    };
  }, []);

  return null;
}
