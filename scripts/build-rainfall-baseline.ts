#!/usr/bin/env tsx
/**
 * Rainfall baseline builder.
 *
 * Input: a CSV of historical district-level rainfall (e.g. IMD's district
 * rainfall archive on data.gov.in). Auto-detects columns by name: looks for
 * a district column, a year column, and either monthly columns (Jan-Dec) or
 * pre-aggregated annual + jjas columns.
 *
 * Output: data/rainfall-baseline-by-district.json
 *   { "<district>": { mean_annual, sd_annual, mean_jjas, sd_jjas, years_n } }
 *
 * Usage:
 *   pnpm build-data:rainfall --input ./district_rainfall.csv
 *   pnpm build-data:rainfall --input ./district_rainfall.csv --out custom.json
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

interface DistrictBaseline {
  mean_annual: number;
  sd_annual: number;
  mean_jjas: number;
  sd_jjas: number;
  years_n: number;
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"] as const;
const JJAS = ["jun", "jul", "aug", "sep"] as const;

function parseArgs(): { input: string; out: string } {
  const args = process.argv.slice(2);
  let input = "";
  let out = join(process.cwd(), "data", "rainfall-baseline-by-district.json");
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" || args[i] === "-i") input = args[++i];
    else if (args[i] === "--out" || args[i] === "-o") out = args[++i];
  }
  if (!input) {
    console.error("Usage: pnpm build-data:rainfall --input <csv-path> [--out <json-path>]");
    console.error("");
    console.error("Get the source CSV from data.gov.in: search 'district rainfall'.");
    console.error("Expected columns: District, Year, Jan..Dec (or Annual+JJAS).");
    process.exit(1);
  }
  return { input: resolve(input), out: resolve(out) };
}

function parseCsv(raw: string): Array<Record<string, string>> {
  const lines = raw.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) throw new Error("CSV has no data rows.");
  const header = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const rows: Array<Record<string, string>> = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    if (cols.length !== header.length) continue;
    const row: Record<string, string> = {};
    for (let j = 0; j < header.length; j++) row[header[j]] = cols[j];
    rows.push(row);
  }
  return rows;
}

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

function findCol(header: string[], candidates: string[]): string | null {
  for (const c of candidates) {
    const m = header.find((h) => h === c || h.includes(c));
    if (m) return m;
  }
  return null;
}

function meanSd(xs: number[]): { mean: number; sd: number } {
  if (xs.length === 0) return { mean: 0, sd: 0 };
  const mean = xs.reduce((s, x) => s + x, 0) / xs.length;
  const variance = xs.reduce((s, x) => s + (x - mean) ** 2, 0) / xs.length;
  return { mean, sd: Math.sqrt(variance) };
}

function num(s: string | undefined): number | null {
  if (s === undefined) return null;
  const n = Number(s.trim());
  return Number.isFinite(n) ? n : null;
}

function main() {
  const { input, out } = parseArgs();
  if (!existsSync(input)) {
    console.error(`Input not found: ${input}`);
    process.exit(1);
  }
  console.log(`Reading ${input}`);
  const rows = parseCsv(readFileSync(input, "utf8"));
  const header = Object.keys(rows[0]);
  const districtCol = findCol(header, ["district", "district_name", "name"]);
  if (!districtCol) {
    console.error(`No district column found. Header: ${header.join(", ")}`);
    process.exit(1);
  }

  const annualCol = findCol(header, ["annual", "annual_rainfall", "yearly"]);
  const jjasCol = findCol(header, ["jjas", "monsoon", "jun-sep", "jjas_rainfall"]);
  const monthCols = MONTHS.map((m) => findCol(header, [m]));
  const hasMonths = monthCols.every((c) => c !== null);

  const byDistrict = new Map<string, { annual: number[]; jjas: number[] }>();

  for (const row of rows) {
    const dRaw = row[districtCol];
    if (!dRaw) continue;
    const d = dRaw.trim();
    if (!byDistrict.has(d)) byDistrict.set(d, { annual: [], jjas: [] });

    let annual: number | null = null;
    let jjas: number | null = null;
    if (annualCol) annual = num(row[annualCol]);
    if (jjasCol) jjas = num(row[jjasCol]);
    if (hasMonths && (annual === null || jjas === null)) {
      const monthly = monthCols.map((c) => num(row[c!]));
      if (monthly.every((v) => v !== null)) {
        if (annual === null) annual = monthly.reduce<number>((s, v) => s + (v ?? 0), 0);
        if (jjas === null) {
          const jjasIdx = JJAS.map((m) => MONTHS.indexOf(m));
          jjas = jjasIdx.reduce<number>((s, i) => s + (monthly[i] ?? 0), 0);
        }
      }
    }
    if (annual !== null && Number.isFinite(annual)) byDistrict.get(d)!.annual.push(annual);
    if (jjas !== null && Number.isFinite(jjas)) byDistrict.get(d)!.jjas.push(jjas);
  }

  const baselines: Record<string, DistrictBaseline> = {};
  for (const [d, { annual, jjas }] of byDistrict) {
    if (annual.length < 5) continue;
    const { mean: ma, sd: sa } = meanSd(annual);
    const { mean: mj, sd: sj } = meanSd(jjas);
    baselines[d] = {
      mean_annual: Math.round(ma),
      sd_annual: Math.round(sa),
      mean_jjas: Math.round(mj),
      sd_jjas: Math.round(sj),
      years_n: annual.length,
    };
  }

  writeFileSync(out, JSON.stringify(baselines, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(baselines).length} districts → ${out}`);
}

main();
