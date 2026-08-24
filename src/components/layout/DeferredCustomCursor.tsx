import { useEffect, useRef, useState, type ComponentType } from "react";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
type InitialPointer = { x: number; y: number };
type CursorComponent = ComponentType<{ initialPointer?: InitialPointer }>;

export function DeferredCustomCursor() {
  const [Cursor, setCursor] = useState<CursorComponent | null>(null);
  const initialPointer = useRef<InitialPointer | undefined>(undefined);

  useEffect(() => {
    document.documentElement.dataset.customCursor = "inactive";
    const finePointer = window.matchMedia(FINE_POINTER_QUERY);
    let armed = false;
    let loading = false;

    const activate = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      initialPointer.current = { x: event.clientX, y: event.clientY };
      window.removeEventListener("pointermove", activate, true);
      armed = false;
      loading = true;
      void import("@/components/layout/CustomCursor").then((module) => {
        setCursor(() => module.CustomCursor);
      });
    };

    const syncPointerListener = () => {
      if (finePointer.matches && !armed && !loading) {
        window.addEventListener("pointermove", activate, { passive: true, capture: true });
        armed = true;
        return;
      }
      if (!finePointer.matches && armed) {
        window.removeEventListener("pointermove", activate, true);
        armed = false;
      }
    };

    syncPointerListener();
    finePointer.addEventListener("change", syncPointerListener);
    return () => {
      finePointer.removeEventListener("change", syncPointerListener);
      window.removeEventListener("pointermove", activate, true);
    };
  }, []);

  return Cursor ? <Cursor initialPointer={initialPointer.current} /> : null;
}
