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

export function useInfrastructureStatus(enabled = true): InfrastructureSnapshot {
  const [snapshot, setSnapshot] = useState<InfrastructureSnapshot>({
    services: INITIAL_STATUS,
  });
  const [pageVisible, setPageVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (!enabled || !pageVisible) return;
    let active = true;
    let controller: AbortController | undefined;

    const check = async () => {
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

    void check();
    const interval = window.setInterval(() => void check(), 60_000);

    return () => {
      active = false;
      controller?.abort();
      window.clearInterval(interval);
    };
  }, [enabled, pageVisible]);

  return snapshot;
}
