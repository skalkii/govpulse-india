import "server-only";
import baselineJson from "@/data/rainfall-baseline-by-district.json";

export interface DistrictBaseline {
  mean_annual: number;
  sd_annual: number;
  mean_jjas: number;
  sd_jjas: number;
  years_n: number;
  lat?: number;
  lng?: number;
  years?: Record<string, { annual: number; jjas: number }>;
}

export interface DistrictWithCoords extends DistrictBaseline {
  district: string;
}

export function listDistrictsWithCoords(): DistrictWithCoords[] {
  const out: DistrictWithCoords[] = [];
  for (const k of Object.keys(raw)) {
    if (k === "_meta") continue;
    const b = raw[k];
    if (!b || typeof b !== "object" || !("mean_annual" in b)) continue;
    const baseline = b as DistrictBaseline;
    if (baseline.lat === undefined || baseline.lng === undefined) continue;
    out.push({ district: k, ...baseline });
  }
  return out;
}

export function rainfallColor(meanMm: number): string {
  if (meanMm >= 2000) return "#1e40af";
  if (meanMm >= 1500) return "#3b82f6";
  if (meanMm >= 1000) return "#60a5fa";
  if (meanMm >= 700) return "#fbbf24";
  return "#f59e0b";
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

// Common-name aliases — user types familiar name, we look up the IMD/NRSC name.
const ALIASES: Record<string, string> = {
  Mumbai: "Mumbai Suburban",
  Bombay: "Mumbai Suburban",
  Delhi: "New Delhi",
  Bengaluru: "Bangalore Urban",
  "Bengaluru Urban": "Bangalore Urban",
  Bangalore: "Bangalore Urban",
  Calcutta: "Kolkata",
  Madras: "Chennai",
  Mysuru: "Mysore",
  Gurugram: "Gurgaon",
};

export function getBaseline(district: string): DistrictBaseline | null {
  const lookup = (name: string): DistrictBaseline | null => {
    const b = raw[name];
    if (!b || typeof b !== "object" || !("mean_annual" in b)) return null;
    return b as DistrictBaseline;
  };
  return lookup(district) ?? (ALIASES[district] ? lookup(ALIASES[district]) : null);
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
