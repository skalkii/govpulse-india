#!/usr/bin/env tsx
/**
 * Toll plaza + rate builder.
 *
 * Input: an NHAI Fee Notification CSV. Each row should describe one plaza
 * with: plaza_id, name, state, highway, lat, lng, and rate columns for
 * each vehicle class (car, lcv, bus_truck, axle_3, axle_4plus).
 *
 * Output: data/toll-plazas.json (single-trip rates).
 *
 * Usage:
 *   pnpm build-data:tolls --input ./nhai_fee.csv
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

function parseArgs(): { input: string; out: string } {
  const args = process.argv.slice(2);
  let input = "";
  let out = join(process.cwd(), "data", "toll-plazas.json");
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" || args[i] === "-i") input = args[++i];
    else if (args[i] === "--out" || args[i] === "-o") out = args[++i];
  }
  if (!input) {
    console.error("Usage: pnpm build-data:tolls --input <csv-path> [--out <json-path>]");
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

const RATE_COLS = ["car", "lcv", "bus_truck", "axle_3", "axle_4plus"] as const;

function main() {
  const { input, out } = parseArgs();
  if (!existsSync(input)) {
    console.error(`Input not found: ${input}`);
    process.exit(1);
  }
  const lines = readFileSync(input, "utf8").split(/\r?\n/).filter(Boolean);
  const header = splitCsvLine(lines[0]).map((s) => s.trim().toLowerCase());
  const idx = (name: string) => header.findIndex((h) => h === name);

  const required = ["id", "name", "state", "highway", "lat", "lng", ...RATE_COLS];
  for (const r of required) {
    if (idx(r) === -1) {
      console.error(`Missing required column: ${r}. Header: ${header.join(", ")}`);
      process.exit(1);
    }
  }

  const plazas: Record<string, unknown>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const rates: Record<string, number> = {};
    for (const rc of RATE_COLS) rates[rc] = Number(cols[idx(rc)]);
    plazas.push({
      id: cols[idx("id")].trim(),
      name: cols[idx("name")].trim(),
      state: cols[idx("state")].trim(),
      highway: cols[idx("highway")].trim().toUpperCase(),
      lat: Number(cols[idx("lat")]),
      lng: Number(cols[idx("lng")]),
      rates,
    });
  }

  const result = {
    _meta: {
      kind: "generated",
      source: "NHAI Fee Notification CSV",
      currency: "INR",
      vehicle_classes: RATE_COLS,
      generated: new Date().toISOString().slice(0, 10),
    },
    plazas,
  };
  writeFileSync(out, JSON.stringify(result, null, 2) + "\n");
  console.log(`Wrote ${plazas.length} plazas → ${out}`);
}

main();
