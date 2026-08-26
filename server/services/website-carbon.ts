import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  WEBSITE_CARBON_SNAPSHOT,
  gradeFromCarbon,
  isCarbonGrade,
  type WebsiteCarbonResult,
} from "@/lib/website-carbon";

const WEBSITE_CARBON_BADGE_API = "https://api.websitecarbon.com/b?url=https%3A%2F%2Fguifer.tech%2F";
const REFRESH_INTERVAL_SECONDS = 24 * 60 * 60;

type CacheRow = {
  grade: string;
  carbon: number | string | null;
  cleaner_than: number | null;
  measured_at: string;
  source: string;
};

export type WebsiteCarbonDependencies = {
  claimRefresh: () => Promise<boolean>;
  readCache: () => Promise<CacheRow | null>;
  writeCache: (result: WebsiteCarbonResult) => Promise<CacheRow | null>;
  fetchBadge: () => Promise<{ c?: number | string; p?: number | string }>;
};

function normalizeRow(row: CacheRow | null): WebsiteCarbonResult | null {
  if (!row || !isCarbonGrade(row.grade) || Number.isNaN(Date.parse(row.measured_at))) return null;

  const carbon = row.carbon === null ? undefined : Number(row.carbon);
  const cleanerThan = row.cleaner_than === null ? undefined : Number(row.cleaner_than);
  return {
    grade: row.grade,
    carbon: Number.isFinite(carbon) ? carbon : undefined,
    cleanerThan: Number.isFinite(cleanerThan) ? cleanerThan : undefined,
    updatedAt: row.measured_at,
    source: row.source === "api" ? "api" : "published",
  };
}

const productionDependencies: WebsiteCarbonDependencies = {
  async claimRefresh() {
    const { data, error } = await supabaseAdmin.rpc("claim_website_carbon_refresh", {
      p_minimum_age_seconds: REFRESH_INTERVAL_SECONDS,
    });
    if (error) throw error;
    return data;
  },
  async readCache() {
    const { data, error } = await supabaseAdmin
      .from("website_carbon_cache")
      .select("grade, carbon, cleaner_than, measured_at, source")
      .eq("id", true)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
  async writeCache(result) {
    const { data, error } = await supabaseAdmin
      .from("website_carbon_cache")
      .update({
        grade: result.grade,
        carbon: result.carbon ?? null,
        cleaner_than: result.cleanerThan ?? null,
        measured_at: result.updatedAt,
        source: result.source,
      })
      .eq("id", true)
      .select("grade, carbon, cleaner_than, measured_at, source")
      .maybeSingle();
    if (error) throw error;
    return data;
  },
  async fetchBadge() {
    const response = await fetch(WEBSITE_CARBON_BADGE_API, {
      headers: { accept: "application/json", "user-agent": "guifer.tech" },
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`website_carbon_${response.status}`);
    return (await response.json()) as { c?: number | string; p?: number | string };
  },
};

export async function getWebsiteCarbonResult(
  dependencies: WebsiteCarbonDependencies = productionDependencies,
): Promise<WebsiteCarbonResult> {
  let cachedResult: WebsiteCarbonResult | null = null;
  try {
    cachedResult = normalizeRow(await dependencies.readCache());
    if (!(await dependencies.claimRefresh())) return cachedResult ?? WEBSITE_CARBON_SNAPSHOT;
  } catch {
    return cachedResult ?? WEBSITE_CARBON_SNAPSHOT;
  }

  try {
    const payload = await dependencies.fetchBadge();
    const carbon = Number(payload.c);
    const cleanerThan = Number(payload.p);
    if (!Number.isFinite(carbon) || !Number.isFinite(cleanerThan)) {
      throw new Error("invalid_website_carbon_response");
    }

    const refreshed: WebsiteCarbonResult = {
      grade: gradeFromCarbon(carbon),
      carbon,
      cleanerThan: Math.round(cleanerThan),
      updatedAt: new Date().toISOString(),
      source: "api",
    };
    return normalizeRow(await dependencies.writeCache(refreshed)) ?? refreshed;
  } catch {
    return cachedResult ?? WEBSITE_CARBON_SNAPSHOT;
  }
}
