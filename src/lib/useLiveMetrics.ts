import { useEffect, useState } from "react";

export type LiveMetric = {
  k: string;
  v: string;
  tag: string;
  pct: number;
};

export type LiveStatus = {
  status: string;
  uptime: string;
  fps: string;
  region: string;
};

function rate(value: number, good: number, poor: number) {
  if (value <= good) return { tag: "good", pct: 96 };
  if (value <= poor) return { tag: "fair", pct: 60 };
  return { tag: "poor", pct: 28 };
}

function fmtMs(ms: number) {
  if (ms < 1) return `${(ms * 1000).toFixed(0)} µs`;
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

const SESSION_START = typeof performance !== "undefined" ? performance.now() : 0;

export function useLiveMetrics() {
  const [lcp, setLcp] = useState<number | null>(null);
  const [inp, setInp] = useState<number | null>(null);
  const [cls, setCls] = useState<number>(0);
  const [fps, setFps] = useState<number | null>(null);
  const [uptime, setUptime] = useState<string>("0s");

  // LCP
  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") return;
    try {
      const po = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        if (last) setLcp(last.startTime);
      });
      po.observe({ type: "largest-contentful-paint", buffered: true });
      return () => po.disconnect();
    } catch {
      /* unsupported */
    }
  }, []);

  // INP / event timing
  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") return;
    let worst = 0;
    try {
      const po = new PerformanceObserver((list) => {
        for (const e of list.getEntries() as PerformanceEventTiming[]) {
          if (e.duration > worst) {
            worst = e.duration;
            setInp(worst);
          }
        }
      });
      po.observe({
        type: "event",
        buffered: true,
        durationThreshold: 16,
      } as PerformanceObserverInit);
      return () => po.disconnect();
    } catch {
      /* unsupported */
    }
  }, []);

  // CLS
  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") return;
    let total = 0;
    try {
      const po = new PerformanceObserver((list) => {
        for (const e of list.getEntries() as Array<
          PerformanceEntry & { value: number; hadRecentInput: boolean }
        >) {
          if (!e.hadRecentInput) total += e.value;
        }
        setCls(total);
      });
      po.observe({ type: "layout-shift", buffered: true } as PerformanceObserverInit);
      return () => po.disconnect();
    } catch {
      /* unsupported */
    }
  }, []);

  // FPS — paused when the tab is hidden to avoid unnecessary rAF work.
  useEffect(() => {
    let raf = 0;
    let frames = 0;
    let last = performance.now();
    let running = true;

    const loop = (now: number) => {
      frames += 1;
      if (now - last >= 1000) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!running) return;
      last = performance.now();
      frames = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => cancelAnimationFrame(raf);
    const onVisibility = () => {
      running = !document.hidden;
      if (running) start();
      else stop();
    };

    document.addEventListener("visibilitychange", onVisibility);
    start();
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Uptime
  useEffect(() => {
    const tick = () => {
      const s = Math.floor((performance.now() - SESSION_START) / 1000);
      const m = Math.floor(s / 60);
      const h = Math.floor(m / 60);
      setUptime(h > 0 ? `${h}h ${m % 60}m` : m > 0 ? `${m}m ${s % 60}s` : `${s}s`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const lcpRate = lcp != null ? rate(lcp, 2500, 4000) : { tag: "…", pct: 8 };
  const inpRate = inp != null ? rate(inp, 200, 500) : { tag: "…", pct: 8 };
  const clsRate = rate(cls, 0.1, 0.25);

  const metrics: LiveMetric[] = [
    { k: "LCP", v: lcp != null ? fmtMs(lcp) : "—", ...lcpRate },
    { k: "INP", v: inp != null ? fmtMs(inp) : "idle", ...inpRate },
    { k: "CLS", v: cls.toFixed(3), ...clsRate },
    {
      k: "FPS",
      v: fps != null ? String(fps) : "—",
      tag: fps == null ? "…" : fps >= 55 ? "good" : fps >= 30 ? "fair" : "poor",
      pct: fps != null ? Math.min(100, (fps / 60) * 100) : 8,
    },
  ];

  const status: LiveStatus = {
    status: "operational",
    uptime,
    fps: fps != null ? `${fps} fps` : "—",
    region:
      typeof navigator !== "undefined" && navigator.language
        ? navigator.language.toLowerCase()
        : "edge",
  };

  return { metrics, status };
}
