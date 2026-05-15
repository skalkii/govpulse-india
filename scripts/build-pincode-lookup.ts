#!/usr/bin/env tsx
/**
 * Pincode → district lookup builder.
 *
 * Two modes:
 *   1. API mode (default): fetches the India Post Pincode Directory directly
 *      from data.gov.in (resource 6176ee09-3d56-4a3b-8115-21841576b2f6).
 *      Requires DATAGOVIN_API_KEY in env. Pages through ~155k records.
 *   2. CSV mode: pass `--input <csv-path>` to ingest a local pincode CSV
 *      with `pincode` + `district` columns (e.g. India Post directory dump).
 *
 * Output: data/pincode-lookup.json — bucketed by 3-digit prefix, each
 * prefix maps to the most common district for pincodes starting with
 * those 3 digits.
 *
 * Usage:
 *   pnpm build-data:pincode                       # API mode
 *   pnpm build-data:pincode --input ./pin.csv     # CSV mode
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const RESOURCE_ID = "6176ee09-3d56-4a3b-8115-21841576b2f6";
const PAGE_SIZE = 5000;

function parseArgs(): { input: string | null; out: string } {
  const args = process.argv.slice(2);
  let input: string | null = null;
  let out = join(process.cwd(), "data", "pincode-lookup.json");
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" || args[i] === "-i") input = args[++i];
    else if (args[i] === "--out" || args[i] === "-o") out = args[++i];
  }
  return { input: input ? resolve(input) : null, out: resolve(out) };
}

interface PinRow {
  pincode?: string;
  districtname?: string;
  district?: string;
  statename?: string;
}

async function fetchAll(): Promise<PinRow[]> {
  const key = process.env.DATAGOVIN_API_KEY;
  if (!key) {
    console.error("DATAGOVIN_API_KEY missing. Set in .env.local or pass --input <csv>.");
    process.exit(1);
  }
  const all: PinRow[] = [];
  let offset = 0;
  let total = Infinity;
  while (offset < total) {
    const url = new URL(`https://api.data.gov.in/resource/${RESOURCE_ID}`);
    url.searchParams.set("api-key", key);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", String(PAGE_SIZE));
    url.searchParams.set("offset", String(offset));
    process.stdout.write(`\r  fetching ${offset.toLocaleString("en-IN")} / ${Number.isFinite(total) ? total.toLocaleString("en-IN") : "?"}    `);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`data.gov.in ${res.status} at offset ${offset}`);
    const json = (await res.json()) as { total: number; records: PinRow[] };
    if (json.total) total = json.total;
    if (!json.records || json.records.length === 0) break;
    all.push(...json.records);
    offset += json.records.length;
  }
  process.stdout.write("\n");
  return all;
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

function readCsv(path: string): PinRow[] {
  if (!existsSync(path)) {
    console.error(`Input not found: ${path}`);
    process.exit(1);
  }
  const lines = readFileSync(path, "utf8").split(/\r?\n/).filter(Boolean);
  const header = splitCsvLine(lines[0]).map((s) => s.trim().toLowerCase());
  const pIdx = header.findIndex((h) => h === "pincode" || h === "pin code" || h.startsWith("pin"));
  const dIdx = header.findIndex((h) => h.includes("district"));
  if (pIdx === -1 || dIdx === -1) {
    console.error(`Need pincode + district columns. Header: ${header.join(", ")}`);
    process.exit(1);
  }
  const out: PinRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const c = splitCsvLine(lines[i]);
    out.push({ pincode: c[pIdx]?.trim(), districtname: c[dIdx]?.trim() });
  }
  return out;
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function bucket(rows: PinRow[]): Record<string, string> {
  const tally = new Map<string, Map<string, number>>();
  for (const r of rows) {
    const pin = (r.pincode ?? "").trim();
    const districtRaw = (r.districtname ?? r.district ?? "").trim();
    if (!/^\d{6}$/.test(pin) || !districtRaw) continue;
    const d = titleCase(districtRaw);
    const prefix = pin.slice(0, 3);
    if (!tally.has(prefix)) tally.set(prefix, new Map());
    const counts = tally.get(prefix)!;
    counts.set(d, (counts.get(d) ?? 0) + 1);
  }
  const result: Record<string, string> = {};
  for (const [prefix, counts] of tally) {
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top) result[prefix] = top[0];
  }
  return result;
}

async function main() {
  const { input, out } = parseArgs();
  console.log(input ? `CSV mode: ${input}` : "API mode: data.gov.in pincode directory");
  const rows = input ? readCsv(input) : await fetchAll();
  console.log(`Read ${rows.length.toLocaleString("en-IN")} pincode rows.`);
  const prefixToDistrict = bucket(rows);
  const result = {
    _meta: {
      kind: "generated",
      source: input ? "India Post CSV" : "data.gov.in resource " + RESOURCE_ID,
      match_strategy: "first 3 digits of pincode → most common district",
      generated: new Date().toISOString().slice(0, 10),
      rows_in: rows.length,
      prefixes_out: Object.keys(prefixToDistrict).length,
    },
    prefix_to_district: prefixToDistrict,
  };
  writeFileSync(out, JSON.stringify(result, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(prefixToDistrict).length} prefixes → ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
