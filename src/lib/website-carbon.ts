export type CarbonGrade = "A+" | "A" | "B" | "C" | "D" | "E" | "F";

export type WebsiteCarbonResult = {
  grade: CarbonGrade;
  carbon?: number;
  cleanerThan?: number;
  updatedAt: string;
  source: "published" | "api";
};

export const WEBSITE_CARBON_SNAPSHOT: WebsiteCarbonResult = {
  grade: "A+",
  cleanerThan: 97,
  updatedAt: "2026-08-25T12:00:00.000Z",
  source: "published",
};

export function isCarbonGrade(value: unknown): value is CarbonGrade {
  return ["A+", "A", "B", "C", "D", "E", "F"].includes(String(value));
}

export function isWebsiteCarbonResult(value: unknown): value is WebsiteCarbonResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<WebsiteCarbonResult>;
  return (
    isCarbonGrade(result.grade) &&
    typeof result.updatedAt === "string" &&
    !Number.isNaN(Date.parse(result.updatedAt)) &&
    (result.source === "published" || result.source === "api") &&
    (result.carbon === undefined || Number.isFinite(result.carbon)) &&
    (result.cleanerThan === undefined || Number.isFinite(result.cleanerThan))
  );
}

const GRADE_THRESHOLDS: ReadonlyArray<readonly [CarbonGrade, number]> = [
  ["A+", 0.04],
  ["A", 0.079],
  ["B", 0.145],
  ["C", 0.209],
  ["D", 0.278],
  ["E", 0.359],
];

export function gradeFromCarbon(carbon: number): CarbonGrade {
  return GRADE_THRESHOLDS.find(([, limit]) => carbon <= limit)?.[0] ?? "F";
}
