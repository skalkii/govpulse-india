// Transparent rules-based 24h AQI forecast.
// Premise: across Indian cities, AQI follows a diurnal curve — early-morning
// (5-9am) and late-evening (7-11pm) peaks driven by traffic + temperature
// inversion; midday dip from boundary-layer mixing. We multiply the current
// observation by a per-bucket factor calibrated against typical CPCB hourly
// patterns. Not ML — auditable, predictable, no black box.

import { categorize, type AqiBucket } from "./breakpoints";

export interface ForecastBucket {
  label: string;
  hoursAhead: string;
  aqi: number;
  bucket: AqiBucket;
}

// Hour-of-day multiplier (0-23). Peaks ~7am and ~9pm, trough ~3pm.
const DIURNAL: readonly number[] = [
  1.05, 1.08, 1.10, 1.12, 1.15, 1.18, 1.22, 1.25, 1.20, 1.10,
  1.00, 0.92, 0.85, 0.80, 0.78, 0.80, 0.85, 0.92, 1.00, 1.10,
  1.18, 1.22, 1.18, 1.10,
];

function bucketAvg(now: Date, startH: number, endH: number): number {
  let sum = 0;
  let n = 0;
  for (let i = startH; i < endH; i++) {
    const h = (now.getHours() + i) % 24;
    sum += DIURNAL[h];
    n++;
  }
  return sum / n;
}

const BASELINE = 1.05; // Sample average of DIURNAL.

export function forecast24h(currentAqi: number, now: Date = new Date()): ForecastBucket[] {
  const buckets: Array<{ label: string; range: [number, number] }> = [
    { label: "Next 6h", range: [0, 6] },
    { label: "6-12h", range: [6, 12] },
    { label: "12-18h", range: [12, 18] },
    { label: "18-24h", range: [18, 24] },
  ];
  return buckets.map(({ label, range }) => {
    const factor = bucketAvg(now, range[0], range[1]) / BASELINE;
    const projected = Math.round(currentAqi * factor);
    return {
      label,
      hoursAhead: `${range[0]}-${range[1]}h`,
      aqi: projected,
      bucket: categorize(projected),
    };
  });
}
