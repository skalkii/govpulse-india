# Data build scripts

One-shot scripts that ingest a public dataset, transform it, and write a JSON
snapshot under `/data`. Run **locally**, commit the JSON output. Vercel never
runs these.

| Script | Output | Module |
|---|---|---|
| `build-rainfall-baseline.ts` | `data/rainfall-baseline-by-district.json` | Rainfall |
| `build-solar-ghi.ts` | `data/solar-ghi-by-district.json` | Solar |
| `build-pincode-lookup.ts` | `data/pincode-lookup.json` | Solar |

Each script is wired into `package.json` as `pnpm build-data:<name>`.
