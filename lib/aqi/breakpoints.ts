// CPCB AQI sub-index breakpoints. Source: National Air Quality Index, CPCB 2014.
// Each entry: [conc_low, conc_high, aqi_low, aqi_high].
// AQI sub-index = linear interpolation within the matching band.

type Band = readonly [number, number, number, number];
type Pollutant = "PM2.5" | "PM10" | "NO2" | "SO2" | "CO" | "O3" | "NH3";

const BANDS: Record<Pollutant, readonly Band[]> = {
  "PM2.5": [
    [0, 30, 0, 50],
    [31, 60, 51, 100],
    [61, 90, 101, 200],
    [91, 120, 201, 300],
    [121, 250, 301, 400],
    [251, 500, 401, 500],
  ],
  PM10: [
    [0, 50, 0, 50],
    [51, 100, 51, 100],
    [101, 250, 101, 200],
    [251, 350, 201, 300],
    [351, 430, 301, 400],
    [431, 800, 401, 500],
  ],
  NO2: [
    [0, 40, 0, 50],
    [41, 80, 51, 100],
    [81, 180, 101, 200],
    [181, 280, 201, 300],
    [281, 400, 301, 400],
    [401, 800, 401, 500],
  ],
  SO2: [
    [0, 40, 0, 50],
    [41, 80, 51, 100],
    [81, 380, 101, 200],
    [381, 800, 201, 300],
    [801, 1600, 301, 400],
    [1601, 3200, 401, 500],
  ],
  CO: [
    [0, 1.0, 0, 50],
    [1.1, 2.0, 51, 100],
    [2.1, 10, 101, 200],
    [10.1, 17, 201, 300],
    [17.1, 34, 301, 400],
    [34.1, 50, 401, 500],
  ],
  O3: [
    [0, 50, 0, 50],
    [51, 100, 51, 100],
    [101, 168, 101, 200],
    [169, 208, 201, 300],
    [209, 748, 301, 400],
    [749, 1500, 401, 500],
  ],
  NH3: [
    [0, 200, 0, 50],
    [201, 400, 51, 100],
    [401, 800, 101, 200],
    [801, 1200, 201, 300],
    [1201, 1800, 301, 400],
    [1801, 3600, 401, 500],
  ],
};

const POLLUTANT_ALIASES: Record<string, Pollutant> = {
  pm2_5: "PM2.5",
  "pm2.5": "PM2.5",
  pm25: "PM2.5",
  pm10: "PM10",
  no2: "NO2",
  so2: "SO2",
  co: "CO",
  o3: "O3",
  ozone: "O3",
  nh3: "NH3",
};

export function normalizePollutant(raw: string): Pollutant | null {
  const k = raw.trim().toLowerCase();
  return POLLUTANT_ALIASES[k] ?? null;
}

export function subIndex(pollutant: Pollutant, conc: number): number | null {
  if (!Number.isFinite(conc) || conc < 0) return null;
  const bands = BANDS[pollutant];
  for (const [cLo, cHi, aLo, aHi] of bands) {
    if (conc >= cLo && conc <= cHi) {
      return Math.round(((aHi - aLo) / (cHi - cLo)) * (conc - cLo) + aLo);
    }
  }
  // Above the highest band: clamp to top of last band.
  return bands[bands.length - 1][3];
}

export type AqiCategory =
  | "Good"
  | "Satisfactory"
  | "Moderate"
  | "Poor"
  | "Very Poor"
  | "Severe";

export interface AqiBucket {
  category: AqiCategory;
  color: string;
  advice: string;
}

export function categorize(aqi: number): AqiBucket {
  if (aqi <= 50) return { category: "Good", color: "#10b981", advice: "Enjoy outdoor activity." };
  if (aqi <= 100) return { category: "Satisfactory", color: "#84cc16", advice: "Acceptable air; sensitive groups take it easy." };
  if (aqi <= 200) return { category: "Moderate", color: "#f59e0b", advice: "Sensitive groups limit prolonged exertion outdoors." };
  if (aqi <= 300) return { category: "Poor", color: "#ef4444", advice: "Reduce outdoor exertion; mask outdoors." };
  if (aqi <= 400) return { category: "Very Poor", color: "#a855f7", advice: "Avoid outdoor activity; mask required." };
  return { category: "Severe", color: "#7f1d1d", advice: "Stay indoors; air purifier recommended." };
}

export type { Pollutant };
