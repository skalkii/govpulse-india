# GovPulse India

Public data, made useful. Six free tools built on India's open government data.

## Modules (v1)

1. **AQI Now & Next 24h** — live air quality + simple forecast
2. **River Health Check** — CPCB station water quality
3. **Rainfall Anomaly** — district monsoon vs historical baseline
4. **Highway Toll Calculator** — route toll cost estimate
5. **Accident Black-Spots** — dangerous NH stretches
6. **Solar ROI Calculator** — rooftop payback by pincode

External (linked from landing): [Mandi Prices](https://mandibazar-jade.vercel.app/), [Spray Window](https://spraypredict.vercel.app/).

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind · shadcn/ui · in-memory LRU cache · Vercel free tier · data.gov.in API + bundled static JSON.

No database. No auth. Single API key.

## Local dev

```bash
pnpm install
cp .env.example .env.local   # add DATAGOVIN_API_KEY
pnpm dev
```

## Data build scripts (run once locally, commit JSON output)

```bash
pnpm build-data:rainfall
pnpm build-data:tolls
pnpm build-data:blackspots
pnpm build-data:solar
```

## Data sources

- CPCB (air, water): https://cpcb.nic.in/
- IMD (rainfall): https://www.imdpune.gov.in/
- NHAI (tolls): https://tis.nhai.gov.in/
- MoRTH (black-spots): https://morth.nic.in/
- MNRE (solar): https://mnre.gov.in/
- data.gov.in catalog: https://www.data.gov.in/

## License

MIT.
