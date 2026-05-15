#!/usr/bin/env tsx
/**
 * Solar GHI builder.
 *
 * Input: a CSV with at minimum (district, ghi) where ghi is annual mean
 * Global Horizontal Irradiance in kWh/m²/day. MNRE publishes district-level
 * raster from the Solar Atlas; export to CSV via QGIS or use one of the
 * derived district tables on data.gov.in.
 *
 * Output: data/solar-ghi-by-district.json
 *
 * Usage:
 *   pnpm build-data:solar --input ./solar_ghi.csv
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

function parseArgs(): { input: string; out: string } {
  const args = process.argv.slice(2);
  let input = "";
  let out = join(process.cwd(), "data", "solar-ghi-by-district.json");
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" || args[i] === "-i") input = args[++i];
    else if (args[i] === "--out" || args[i] === "-o") out = args[++i];
  }
  if (!input) {
    console.error("Usage: pnpm build-data:solar --input <csv-path> [--out <json-path>]");
    console.error("Expected columns: District, GHI (kWh/m²/day annual mean).");
    process.exit(1);
  }
  return { input: resolve(input), out: resolve(out) };
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

function main() {
  const { input, out } = parseArgs();
  if (!existsSync(input)) {
    console.error(`Input not found: ${input}`);
    process.exit(1);
  }
  const lines = readFileSync(input, "utf8").split(/\r?\n/).filter(Boolean);
  const header = splitCsvLine(lines[0]).map((s) => s.trim().toLowerCase());
  const dCol = header.findIndex((h) => h.includes("district") || h === "name");
  const gCol = header.findIndex((h) => h === "ghi" || h.includes("irradiance"));
  if (dCol === -1 || gCol === -1) {
    console.error(`Need district + ghi columns. Header: ${header.join(", ")}`);
    process.exit(1);
  }
  const result: Record<string, number | Record<string, unknown>> = {
    _meta: {
      kind: "generated",
      source: "MNRE GHI CSV",
      unit: "kWh/m²/day annual mean",
      generated: new Date().toISOString().slice(0, 10),
    },
  };
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const d = cols[dCol]?.trim();
    const g = Number(cols[gCol]?.trim());
    if (d && Number.isFinite(g)) result[d] = Math.round(g * 100) / 100;
  }
  writeFileSync(out, JSON.stringify(result, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(result).length - 1} districts → ${out}`);
}

main();
