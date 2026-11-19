import { useEffect, useState, type ComponentType } from "react";

export function DeferredBackToTop() {
  const [Button, setButton] = useState<ComponentType | null>(null);

  useEffect(() => {
    const activate = () => {
      if (window.scrollY <= 400) return;
      window.removeEventListener("scroll", activate);
      void import("@/components/layout/BackToTop").then((module) => {
        setButton(() => module.BackToTop);
      });
    };

    window.addEventListener("scroll", activate, { passive: true });
    return () => {
      window.removeEventListener("scroll", activate);
    };
  }, []);

  return Button ? <Button /> : null;
}
