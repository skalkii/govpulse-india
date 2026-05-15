#!/usr/bin/env tsx
/**
 * River station builder.
 *
 * Input: a CPCB water-quality CSV with at minimum (state, river, station,
 * do, bod, ph, fc) columns. CPCB publishes annual reports as XLSX/CSV;
 * convert and feed it here.
 *
 * Output: data/river-stations.json
 *
 * Usage:
 *   pnpm build-data:rivers --input ./cpcb_rivers.csv
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

function parseArgs(): { input: string; out: string } {
  const args = process.argv.slice(2);
  let input = "";
  let out = join(process.cwd(), "data", "river-stations.json");
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" || args[i] === "-i") input = args[++i];
    else if (args[i] === "--out" || args[i] === "-o") out = args[++i];
  }
  if (!input) {
    console.error("Usage: pnpm build-data:rivers --input <csv-path> [--out <json-path>]");
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

function num(s: string | undefined): number | null {
  if (!s) return null;
  const n = Number(s.trim());
  return Number.isFinite(n) ? n : null;
}

function slugify(parts: string[]): string {
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function main() {
  const { input, out } = parseArgs();
  if (!existsSync(input)) {
    console.error(`Input not found: ${input}`);
    process.exit(1);
  }
  const lines = readFileSync(input, "utf8").split(/\r?\n/).filter(Boolean);
  const header = splitCsvLine(lines[0]).map((s) => s.trim().toLowerCase());
  const idx = (...candidates: string[]) =>
    header.findIndex((h) => candidates.some((c) => h === c || h.includes(c)));
  const cols = {
    state: idx("state"),
    river: idx("river", "waterbody"),
    station: idx("station", "location"),
    do: idx("do", "dissolved_oxygen"),
    bod: idx("bod"),
    ph: idx("ph"),
    fc: idx("fc", "fecal", "faecal", "coliform"),
  };
  for (const [k, v] of Object.entries(cols)) {
    if (v === -1) {
      console.error(`Missing column: ${k}. Header: ${header.join(", ")}`);
      process.exit(1);
    }
  }

  const stations: Record<string, unknown>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const c = splitCsvLine(lines[i]);
    const state = c[cols.state]?.trim();
    const river = c[cols.river]?.trim();
    const station = c[cols.station]?.trim();
    const dox = num(c[cols.do]);
    const bod = num(c[cols.bod]);
    const ph = num(c[cols.ph]);
    const fc = num(c[cols.fc]);
    if (!state || !river || !station || dox === null || bod === null || ph === null || fc === null) continue;
    stations.push({
      id: slugify([river, station]),
      state,
      river,
      station,
      do: dox,
      bod,
      ph,
      fc: Math.round(fc),
    });
  }

  const result = {
    _meta: {
      kind: "generated",
      source: "CPCB river water quality CSV",
      units: { do: "mg/L", bod: "mg/L", fc: "MPN/100mL" },
      generated: new Date().toISOString().slice(0, 10),
    },
    stations,
  };
  writeFileSync(out, JSON.stringify(result, null, 2) + "\n");
  console.log(`Wrote ${stations.length} stations → ${out}`);
}

main();
