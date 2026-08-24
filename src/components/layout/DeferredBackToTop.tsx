import { useEffect, useState, type ComponentType } from "react";

export function DeferredBackToTop() {
  const [Button, setButton] = useState<ComponentType | null>(null);

  useEffect(() => {
    let userInitiated = false;

    const activate = () => {
      if (!userInitiated || window.scrollY <= 400) return;
      window.removeEventListener("scroll", activate);
      window.removeEventListener("wheel", markUserIntent);
      window.removeEventListener("touchmove", markUserIntent);
      window.removeEventListener("pointerdown", markPointerIntent, true);
      window.removeEventListener("keydown", markKeyboardIntent);
      void import("@/components/layout/BackToTop").then((module) => {
        setButton(() => module.BackToTop);
      });
    };

    const markUserIntent = () => {
      userInitiated = true;
      activate();
    };

    const markPointerIntent = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      markUserIntent();
    };

    const markKeyboardIntent = (event: KeyboardEvent) => {
      if (!["ArrowDown", "ArrowUp", "End", "Home", "PageDown", "PageUp", " "].includes(event.key))
        return;
      markUserIntent();
    };

    window.addEventListener("scroll", activate, { passive: true });
    window.addEventListener("wheel", markUserIntent, { passive: true });
    window.addEventListener("touchmove", markUserIntent, { passive: true });
    window.addEventListener("pointerdown", markPointerIntent, { passive: true, capture: true });
    window.addEventListener("keydown", markKeyboardIntent);
    return () => {
      window.removeEventListener("scroll", activate);
      window.removeEventListener("wheel", markUserIntent);
      window.removeEventListener("touchmove", markUserIntent);
      window.removeEventListener("pointerdown", markPointerIntent, true);
      window.removeEventListener("keydown", markKeyboardIntent);
    };
  }, []);

  return Button ? <Button /> : null;
}
