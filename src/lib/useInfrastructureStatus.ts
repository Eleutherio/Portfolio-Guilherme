import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api-client";

export type InfrastructureAvailability = "checking" | "operational" | "unavailable";

export type InfrastructureStatuses = {
  backend: InfrastructureAvailability;
  database: InfrastructureAvailability;
  smtp: InfrastructureAvailability;
  recaptcha: InfrastructureAvailability;
};

export type InfrastructureSnapshot = {
  services: InfrastructureStatuses;
};

type StatusResponse = {
  services: {
    backend: "operational" | "unavailable";
    database: "operational" | "unavailable";
    smtp: "operational" | "unavailable";
    recaptcha: "operational" | "unavailable";
  };
};

const INITIAL_STATUS: InfrastructureStatuses = {
  backend: "checking",
  database: "checking",
  smtp: "checking",
  recaptcha: "checking",
};

function isAvailability(value: unknown): value is "operational" | "unavailable" {
  return value === "operational" || value === "unavailable";
}

function isStatusResponse(value: unknown): value is StatusResponse {
  if (!value || typeof value !== "object" || !("services" in value)) return false;
  const services = (value as { services?: Record<string, unknown> }).services;
  return Boolean(
    services &&
    isAvailability(services.backend) &&
    isAvailability(services.database) &&
    isAvailability(services.smtp) &&
    isAvailability(services.recaptcha),
  );
}

export function useInfrastructureStatus(): InfrastructureSnapshot {
  const [snapshot, setSnapshot] = useState<InfrastructureSnapshot>({
    services: INITIAL_STATUS,
  });

  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;

    const check = async () => {
      if (document.hidden) return;
      controller?.abort();
      controller = new AbortController();
      const timeout = window.setTimeout(() => controller?.abort(), 20_000);
      try {
        const response = await fetch(apiUrl("/health/status"), {
          headers: { accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        });
        const result: unknown = await response.json().catch(() => null);
        if (!response.ok || !isStatusResponse(result)) throw new Error();

        if (active) {
          setSnapshot({
            services: result.services,
          });
        }
      } catch {
        if (active) {
          setSnapshot({
            services: {
              backend: "unavailable",
              database: "unavailable",
              smtp: "unavailable",
              recaptcha: "unavailable",
            },
          });
        }
      } finally {
        window.clearTimeout(timeout);
      }
    };

    const onVisibility = () => {
      if (!document.hidden) void check();
    };

    void check();
    const interval = window.setInterval(() => void check(), 60_000);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      active = false;
      controller?.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return snapshot;
}
