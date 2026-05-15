# GovPulse India

Public data, made useful. Free civic-tech tools built on India's open government data.

Live at: _<add Vercel URL when deployed>_

---

## What this is

Four single-page tools, one URL, no database, no login, no tracking. All data flows from `data.gov.in` (CPCB / IMD / India Post) plus bundled static snapshots derived from public ministry sources.

Designed for an Indian citizen who wants a fast, mobile-friendly answer to one of: _"Is the air bad today? Is this monsoon dry? Will rooftop solar pay back? How polluted is my river?"_ — without filling out a form, signing up, or comparing five government PDFs.

---

## Modules

### 🌬️ AQI Now & Next 24h — `/aqi`
- **Source:** CPCB realtime AQI feed via data.gov.in (resource `3b01bcb8…`)
- **Coverage:** 264 cities, ~2,000 monitoring stations, refreshed hourly upstream
- **Output:** city-level AQI averaged across stations + dominant pollutant + 4-bucket 24-hour forecast + per-station map
- **Caveat:** the headline AQI uses PM2.5/PM10/NO2/SO2/O3 only — CO/NH3 are excluded because the upstream feed reports them in inconsistent units. The 24h forecast is a transparent diurnal multiplier (peaks ~7am and ~9pm), **not a chemical transport model**. Treat it as a rough "morning rush vs midday lull" hint.

### 🌊 River Health Check — `/rivers`
- **Source:** hand-curated subset of CPCB monitoring stations from recent annual reports
- **Coverage:** **34 famous stations** across 14 states (Ganga, Yamuna, Kaveri, Krishna, Godavari, Narmada, Brahmaputra, Hooghly, Periyar, Sabarmati, Musi, Vrishabhavathi etc.)
- **Output:** CPCB designated best-use class (A → Below E) per station, headline pollutant, India-wide map, per-state drilldown
- **⚠️ Caveat:** station readings are **frozen at recent annual report values**, not live. Rivers shown as "Class B" today may be worse in reality. CPCB has no consolidated national real-time water quality API yet, only per-river-per-year CSVs going back to 2008 (most recent from 2014 — too stale to display as "current"). Use as **educational baseline**, not for swimming decisions.

### 🌧️ Rainfall Anomaly — `/rainfall`
- **Source:** Daily District-wise Rainfall Data via data.gov.in (resource `6c05cd1b…`, NRSC VIC model)
- **Coverage:** **732 districts** covering all of India, ~8 years of daily readings (2017-2024 ish) aggregated to per-district annual + JJAS (monsoon) means + standard deviations
- **Output:** anomaly z-score given user-supplied current-season rainfall total
- **⚠️ Caveat:** baseline is **8-year mean from the NRSC VIC land-surface model**, not IMD raingauge data. Values run ~20-30% lower than IMD's 50-year long-period averages. Use the **anomaly percentage** (relative comparison) — not the absolute mm — as the takeaway. User must source this season's actual rainfall from IMD's portal (linked on page).

### ☀️ Solar ROI Calculator — `/solar`
- **Source:** MNRE Solar Atlas (annual mean GHI per district) + India Post Pincode Directory via data.gov.in
- **Coverage:** **43 districts** with explicit GHI values + **403 pincode prefixes** auto-fetched from India Post (155k records collapsed to PIN3 → district mapping). Fuzzy alias matching handles renames (Gurgaon ↔ Gurugram, Bombay ↔ Mumbai, Bengaluru ↔ Bangalore Urban, etc).
- **Output:** capacity (kW), payback period (years), 25-year net savings, % monthly bill offset, per-component breakdown
- **Caveat:** payback math uses **2026 industry-standard assumptions** (100 sq ft/kW, 75% system efficiency, ₹60k/kW post-30%-MNRE-subsidy install cost, ₹7/kWh tariff, 0.5%/yr panel degradation, 25-year horizon). Tariff and install costs vary by state and installer — get a professional quote before committing.

---

## Stack

- **Next.js** App Router + TypeScript
- **Tailwind v4** + shadcn/ui (Base UI flavor)
- **next-themes** — Light/Dark/System toggle
- **Leaflet** + react-leaflet — interactive maps with OpenStreetMap tiles (no map API key needed)
- **lru-cache** — in-memory 10-min TTL on AQI fetches
- **Hand-built i18n** — cookie-based locale, server-side dict lookup, no library

5 locales, all native scripts: English · हिन्दी · ಕನ್ನಡ · मराठी · नेपाली.

No database. No auth. Single API key (`DATAGOVIN_API_KEY`).

---

## Local dev

```bash
pnpm install
cp .env.example .env.local   # add DATAGOVIN_API_KEY (free at data.gov.in)
pnpm dev
```

Get an API key: [data.gov.in registration](https://www.data.gov.in/user/register). Free, no quota for these endpoints in practice.

---

## Data build scripts

Run **locally**, commit the regenerated JSON. Vercel never runs these.

```bash
# Fetch directly from data.gov.in (default, recommended)
pnpm build-data:rainfall          # 3.45M rows, ~10 min, 732 districts
pnpm build-data:pincode           # 155k rows, ~30 sec, 403 PIN3 prefixes

# Fall back to a local CSV (legacy)
pnpm build-data:rainfall --input ./district_rainfall.csv
pnpm build-data:solar    --input ./solar_ghi.csv
pnpm build-data:rivers   --input ./cpcb_rivers.csv
pnpm build-data:pincode  --input ./pincodes.csv
```

API mode requires `DATAGOVIN_API_KEY` in env. Both modes write to `/data/*.json`.

---

## Disclaimer

**Estimates and informational summaries only.** Don't use these tools for:
- Emergency or evacuation decisions
- Regulatory filings or compliance reporting
- Medical / health decisions for vulnerable groups (asthma, pregnancy, elderly)
- Professional financial advice

Always cross-check against the original government source linked on each result page. Numbers shown are derived from open data with the assumptions noted above; methodology can change.

---

## Data sources

- **CPCB** (air, water): https://cpcb.nic.in/
- **IMD** (rainfall): https://www.imdpune.gov.in/
- **MNRE** (solar): https://mnre.gov.in/
- **India Post** (pincode): https://www.indiapost.gov.in/
- **data.gov.in** catalog: https://www.data.gov.in/

---

## License

MIT.
