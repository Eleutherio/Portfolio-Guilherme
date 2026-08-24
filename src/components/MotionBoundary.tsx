import type { ReactNode } from "react";
import { domAnimation, LazyMotion } from "@/lib/motion";

export function MotionBoundary({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
