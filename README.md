# GovPulse India

Public data, made useful. Free tools built on India's open government data.

## Modules

1. **AQI Now & Next 24h** — live air quality + simple forecast
2. **River Health Check** — CPCB station water quality
3. **Rainfall Anomaly** — district monsoon vs historical baseline
4. **Solar ROI Calculator** — rooftop payback by pincode

## Stack

Next.js (App Router) · TypeScript · Tailwind · shadcn/ui · in-memory LRU cache · Vercel free tier · data.gov.in API + bundled static JSON.

No database. No auth. Single API key.

## Local dev

```bash
pnpm install
cp .env.example .env.local   # add DATAGOVIN_API_KEY
pnpm dev
```

## Data build scripts (run once locally, commit JSON output)

```bash
pnpm build-data:rainfall --input <imd-csv>
pnpm build-data:solar    --input <mnre-csv>
pnpm build-data:pincode  --input <india-post-csv>
```

## Data sources

- CPCB (air, water): https://cpcb.nic.in/
- IMD (rainfall): https://www.imdpune.gov.in/
- MNRE (solar): https://mnre.gov.in/
- data.gov.in catalog: https://www.data.gov.in/

## License

MIT.
