import "server-only";
import baselineJson from "@/data/rainfall-baseline-by-district.json";

export interface DistrictBaseline {
  mean_annual: number;
  sd_annual: number;
  mean_jjas: number;
  sd_jjas: number;
  years_n: number;
}

interface RawBaseline {
  _meta?: Record<string, unknown>;
  [district: string]: DistrictBaseline | Record<string, unknown> | undefined;
}

const raw = baselineJson as unknown as RawBaseline;

export function listDistricts(): string[] {
  return Object.keys(raw)
    .filter((k) => k !== "_meta")
    .sort((a, b) => a.localeCompare(b));
}

export function getBaseline(district: string): DistrictBaseline | null {
  const b = raw[district];
  if (!b || "kind" in b) return null;
  return b as DistrictBaseline;
}

export function getMeta(): Record<string, unknown> | undefined {
  return raw._meta;
}

export type Period = "annual" | "jjas";

export interface Anomaly {
  period: Period;
  current: number;
  mean: number;
  sd: number;
  pct: number;       // (current - mean) / mean * 100
  z: number;         // (current - mean) / sd
  verdict: "much below" | "below normal" | "normal" | "above normal" | "much above";
  color: string;
}

export function computeAnomaly(
  baseline: DistrictBaseline,
  current: number,
  period: Period
): Anomaly {
  const mean = period === "annual" ? baseline.mean_annual : baseline.mean_jjas;
  const sd = period === "annual" ? baseline.sd_annual : baseline.sd_jjas;
  const pct = mean > 0 ? ((current - mean) / mean) * 100 : 0;
  const z = sd > 0 ? (current - mean) / sd : 0;
  const verdict = verdictFor(z);
  const color = colorFor(z);
  return { period, current, mean, sd, pct, z, verdict, color };
}

function verdictFor(z: number): Anomaly["verdict"] {
  if (z <= -1.5) return "much below";
  if (z <= -0.5) return "below normal";
  if (z < 0.5) return "normal";
  if (z < 1.5) return "above normal";
  return "much above";
}

function colorFor(z: number): string {
  if (z <= -1.5) return "#dc2626";   // dry stress
  if (z <= -0.5) return "#f59e0b";   // below
  if (z < 0.5) return "#10b981";     // normal
  if (z < 1.5) return "#3b82f6";     // above
  return "#7c3aed";                  // flood risk
}
