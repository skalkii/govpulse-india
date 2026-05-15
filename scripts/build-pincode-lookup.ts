#!/usr/bin/env tsx
/**
 * Pincode → district lookup builder.
 *
 * Input: India Post Pincode Directory CSV (data.gov.in resource
 * "All India Pincode Directory"). ~150k rows.
 *
 * Output: data/pincode-lookup.json — bucketed by 3-digit prefix to keep
 * the runtime payload small. Each prefix maps to the most common district
 * for pincodes starting with those 3 digits.
 *
 * Usage:
 *   pnpm build-data:pincode --input ./pincodes.csv
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

function parseArgs(): { input: string; out: string } {
  const args = process.argv.slice(2);
  let input = "";
  let out = join(process.cwd(), "data", "pincode-lookup.json");
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--input" || args[i] === "-i") input = args[++i];
    else if (args[i] === "--out" || args[i] === "-o") out = args[++i];
  }
  if (!input) {
    console.error("Usage: pnpm build-data:pincode --input <csv-path> [--out <json-path>]");
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
  const pCol = header.findIndex((h) => h === "pincode" || h === "pin code" || h.startsWith("pin"));
  const dCol = header.findIndex((h) => h.includes("district"));
  if (pCol === -1 || dCol === -1) {
    console.error(`Need pincode + district columns. Header: ${header.join(", ")}`);
    process.exit(1);
  }

  // Tally district occurrences per 3-digit prefix.
  const tally = new Map<string, Map<string, number>>();
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const pin = cols[pCol]?.trim();
    const d = cols[dCol]?.trim();
    if (!pin || !d || !/^\d{6}$/.test(pin)) continue;
    const prefix = pin.slice(0, 3);
    if (!tally.has(prefix)) tally.set(prefix, new Map());
    const counts = tally.get(prefix)!;
    counts.set(d, (counts.get(d) ?? 0) + 1);
  }

  const prefixToDistrict: Record<string, string> = {};
  for (const [prefix, counts] of tally) {
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top) prefixToDistrict[prefix] = top[0];
  }

  const result = {
    _meta: {
      kind: "generated",
      source: "India Post Pincode Directory",
      match_strategy: "first 3 digits of pincode",
      generated: new Date().toISOString().slice(0, 10),
    },
    prefix_to_district: prefixToDistrict,
  };
  writeFileSync(out, JSON.stringify(result, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(prefixToDistrict).length} prefixes → ${out}`);
}

main();
