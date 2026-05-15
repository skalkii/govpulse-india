#!/usr/bin/env tsx
/**
 * Rainfall baseline builder.
 *
 * Two modes:
 *   1. API mode (default): streams the daily district-wise rainfall feed
 *      from data.gov.in (resource 6c05cd1b-ed59-40c2-bc31-e314f39c6971),
 *      aggregates daily readings into per-(district, year) annual and
 *      JJAS totals on the fly, then computes mean + SD across years.
 *   2. CSV mode: pass `--input <csv>` for a local IMD/district CSV with
 *      `District`, `Year`, monthly `Jan..Dec` columns OR pre-aggregated
 *      `Annual` + `JJAS` columns.
 *
 * Output: data/rainfall-baseline-by-district.json
 *   { "<district>": { mean_annual, sd_annual, mean_jjas, sd_jjas,
 *                     years_n, lat?, lng? } }
 *
 * Usage:
 *   pnpm build-data:rainfall                          # API mode (~6 min, 3.5M rows)
 *   pnpm build-data:rainfall --input ./rainfall.csv   # CSV mode
 *   pnpm build-data:rainfall --years 5                # API mode, last N years only (faster)
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const RESOURCE_ID = "6c05cd1b-ed59-40c2-bc31-e314f39c6971";
const PAGE_SIZE = 10000;
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"] as const;
const JJAS = ["jun", "jul", "aug", "sep"] as const;

interface DistrictBaseline {
  mean_annual: number;
  sd_annual: number;
  mean_jjas: number;
  sd_jjas: number;
  years_n: number;
  lat?: number;
  lng?: number;
  /** Per-year totals (mm). Keyed by year string. */
  years?: Record<string, { annual: number; jjas: number }>;
}

interface ApiRow {
  State?: string;
  District?: string;
  Date?: string;
  Year?: string | number;
  Month?: string | number;
  Avg_rainfall?: string | number;
}

function parseArgs(): { input: string | null; out: string; minYear: number | null } {
  const args = process.argv.slice(2);
  let input: string | null = null;
  let out = join(process.cwd(), "data", "rainfall-baseline-by-district.json");
  let minYear: number | null = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" || args[i] === "-i") input = args[++i];
    else if (args[i] === "--out" || args[i] === "-o") out = args[++i];
    else if (args[i] === "--years") {
      const n = Number(args[++i]);
      if (Number.isFinite(n) && n > 0) {
        minYear = new Date().getFullYear() - Math.floor(n);
      }
    }
  }
  return { input: input ? resolve(input) : null, out: resolve(out), minYear };
}

function num(v: string | number | undefined): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = typeof v === "number" ? v : Number(String(v).trim());
  return Number.isFinite(n) ? n : null;
}

function meanSd(xs: number[]): { mean: number; sd: number } {
  if (xs.length === 0) return { mean: 0, sd: 0 };
  const mean = xs.reduce((s, x) => s + x, 0) / xs.length;
  const variance = xs.reduce((s, x) => s + (x - mean) ** 2, 0) / xs.length;
  return { mean, sd: Math.sqrt(variance) };
}

// Streaming aggregation: per (district -> year -> { annual_sum, jjas_sum })
type DistrictAccum = Map<number, { annual: number; jjas: number }>;

function fold(rows: ApiRow[], acc: Map<string, DistrictAccum>, minYear: number | null) {
  for (const r of rows) {
    const district = r.District?.trim();
    const year = num(r.Year);
    const month = num(r.Month);
    const mm = num(r.Avg_rainfall);
    if (!district || year === null || month === null || mm === null) continue;
    if (minYear !== null && year < minYear) continue;
    let dAcc = acc.get(district);
    if (!dAcc) {
      dAcc = new Map();
      acc.set(district, dAcc);
    }
    let yAcc = dAcc.get(year);
    if (!yAcc) {
      yAcc = { annual: 0, jjas: 0 };
      dAcc.set(year, yAcc);
    }
    yAcc.annual += mm;
    if (month >= 6 && month <= 9) yAcc.jjas += mm;
  }
}

async function fetchPageWithRetry(
  key: string,
  offset: number,
  maxAttempts = 5
): Promise<{ total: number; records: ApiRow[] }> {
  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const url = new URL(`https://api.data.gov.in/resource/${RESOURCE_ID}`);
      url.searchParams.set("api-key", key);
      url.searchParams.set("format", "json");
      url.searchParams.set("limit", String(PAGE_SIZE));
      url.searchParams.set("offset", String(offset));
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), 60_000);
      try {
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as { total: number; records: ApiRow[] };
      } finally {
        clearTimeout(timer);
      }
    } catch (err) {
      lastErr = err;
      const wait = Math.min(30_000, 2 ** attempt * 1000);
      process.stdout.write(`\n  retry ${attempt}/${maxAttempts} after ${wait}ms (offset ${offset}): ${(err as Error).message}\n`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

async function streamApi(minYear: number | null): Promise<Map<string, DistrictAccum>> {
  const key = process.env.DATAGOVIN_API_KEY;
  if (!key) {
    console.error("DATAGOVIN_API_KEY missing.");
    process.exit(1);
  }
  const acc = new Map<string, DistrictAccum>();
  let offset = 0;
  let total = Infinity;
  let pages = 0;
  const t0 = Date.now();
  while (offset < total) {
    const json = await fetchPageWithRetry(key, offset);
    if (json.total) total = json.total;
    if (!json.records || json.records.length === 0) break;
    fold(json.records, acc, minYear);
    offset += json.records.length;
    pages++;
    const pct = ((offset / total) * 100).toFixed(1);
    const elapsedSec = ((Date.now() - t0) / 1000).toFixed(0);
    process.stdout.write(
      `\r  page ${pages} · ${offset.toLocaleString("en-IN")} / ${total.toLocaleString("en-IN")} (${pct}%) · ${acc.size} districts · ${elapsedSec}s    `
    );
  }
  process.stdout.write("\n");
  return acc;
}

function compute(acc: Map<string, DistrictAccum>): Record<string, DistrictBaseline> {
  const out: Record<string, DistrictBaseline> = {};
  for (const [district, byYear] of acc) {
    const annuals: number[] = [];
    const jjass: number[] = [];
    const years: Record<string, { annual: number; jjas: number }> = {};
    for (const [year, { annual, jjas }] of byYear) {
      annuals.push(annual);
      jjass.push(jjas);
      years[String(year)] = { annual: Math.round(annual), jjas: Math.round(jjas) };
    }
    if (annuals.length < 2) continue;
    const a = meanSd(annuals);
    const j = meanSd(jjass);
    out[district] = {
      mean_annual: Math.round(a.mean),
      sd_annual: Math.round(a.sd),
      mean_jjas: Math.round(j.mean),
      sd_jjas: Math.round(j.sd),
      years_n: annuals.length,
      years,
    };
  }
  return out;
}

function preserveCoords(prev: unknown, next: Record<string, DistrictBaseline>) {
  if (!prev || typeof prev !== "object") return;
  const p = prev as Record<string, { lat?: number; lng?: number }>;
  for (const k of Object.keys(next)) {
    const old = p[k];
    if (old?.lat !== undefined && old?.lng !== undefined) {
      next[k].lat = old.lat;
      next[k].lng = old.lng;
    }
  }
}

// CSV mode (legacy) ---------------------------------------------------------
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') inQuotes = !inQuotes;
    else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function fromCsv(input: string): Record<string, DistrictBaseline> {
  const lines = readFileSync(input, "utf8").split(/\r?\n/).filter((l) => l.trim());
  const header = splitCsvLine(lines[0]).map((s) => s.trim().toLowerCase());
  const findCol = (...candidates: string[]) =>
    header.find((h) => candidates.some((c) => h === c || h.includes(c))) ?? null;
  const districtCol = findCol("district", "district_name", "name");
  if (!districtCol) {
    console.error(`No district column. Header: ${header.join(", ")}`);
    process.exit(1);
  }
  const annualCol = findCol("annual", "annual_rainfall", "yearly");
  const jjasCol = findCol("jjas", "monsoon", "jjas_rainfall");
  const monthCols = MONTHS.map((m) => findCol(m));
  const hasMonths = monthCols.every((c) => c !== null);

  const acc = new Map<string, { annual: number[]; jjas: number[] }>();
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const obj: Record<string, string> = {};
    header.forEach((h, j) => (obj[h] = cols[j]));
    const d = obj[districtCol]?.trim();
    if (!d) continue;
    let annual = annualCol ? num(obj[annualCol]) : null;
    let jjas = jjasCol ? num(obj[jjasCol]) : null;
    if (hasMonths && (annual === null || jjas === null)) {
      const monthly = monthCols.map((c) => num(obj[c!]));
      if (monthly.every((v) => v !== null)) {
        if (annual === null) annual = monthly.reduce<number>((s, v) => s + (v ?? 0), 0);
        if (jjas === null) {
          const jIdx = JJAS.map((m) => MONTHS.indexOf(m));
          jjas = jIdx.reduce<number>((s, i) => s + (monthly[i] ?? 0), 0);
        }
      }
    }
    if (!acc.has(d)) acc.set(d, { annual: [], jjas: [] });
    if (annual !== null) acc.get(d)!.annual.push(annual);
    if (jjas !== null) acc.get(d)!.jjas.push(jjas);
  }
  const out: Record<string, DistrictBaseline> = {};
  for (const [d, { annual, jjas }] of acc) {
    if (annual.length < 5) continue;
    const a = meanSd(annual);
    const j = meanSd(jjas);
    out[d] = {
      mean_annual: Math.round(a.mean),
      sd_annual: Math.round(a.sd),
      mean_jjas: Math.round(j.mean),
      sd_jjas: Math.round(j.sd),
      years_n: annual.length,
    };
  }
  return out;
}

async function main() {
  const { input, out, minYear } = parseArgs();
  console.log(input ? `CSV mode: ${input}` : "API mode: data.gov.in daily district rainfall");
  if (minYear) console.log(`  Filter: years >= ${minYear}`);

  let baselines: Record<string, DistrictBaseline>;
  if (input) {
    if (!existsSync(input)) {
      console.error(`Input not found: ${input}`);
      process.exit(1);
    }
    baselines = fromCsv(input);
  } else {
    const acc = await streamApi(minYear);
    baselines = compute(acc);
  }

  // Preserve any lat/lng we'd hand-curated previously.
  if (existsSync(out)) {
    try {
      const prev = JSON.parse(readFileSync(out, "utf8"));
      preserveCoords(prev, baselines);
    } catch {
      // ignore
    }
  }

  const meta = {
    _meta: {
      kind: "generated",
      source: input
        ? `CSV: ${input}`
        : `data.gov.in resource ${RESOURCE_ID} (Daily District-wise Rainfall Data)`,
      generated: new Date().toISOString().slice(0, 10),
      districts: Object.keys(baselines).length,
      ...(minYear ? { min_year: minYear } : {}),
    },
  };
  const final: Record<string, unknown> = { ...meta, ...baselines };
  writeFileSync(out, JSON.stringify(final, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(baselines).length} districts → ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
