# Data build scripts

One-shot scripts that download a public dataset, transform it, and write a JSON
snapshot under `/data`. Run **locally**, commit the JSON output. Vercel never
runs these.

| Script | Output | Lands with |
|---|---|---|
| `build-rainfall-baseline.ts` | `data/rainfall-baseline-by-district.json` | Rainfall module (Day 2) |
| `build-toll-rates.ts` | `data/toll-rates.json` | Tolls module (Day 3) |
| `build-blackspots.ts` | `data/accident-blackspots.json` | Black-spots module (Day 4) |
| `build-solar-ghi.ts` | `data/solar-ghi-by-district.json` | Solar module (Day 3) |
| `build-pincode-lookup.ts` | `data/pincode-lookup.json` | Solar module (Day 3) |

Each script is wired into `package.json` as `pnpm build-data:<name>`.
Implementations land alongside their respective module commits.
