import "server-only";
import { fetchDataGovIn } from "@/lib/datagovin";
import { RESOURCES } from "@/lib/resources";
import { TTL, cached } from "@/lib/cache";
import {
  categorize,
  normalizePollutant,
  subIndex,
  type Pollutant,
} from "./breakpoints";
import { forecast24h } from "./forecast";
import type { AqiResult, StationReading } from "./types";

interface CpcbRow {
  country?: string;
  state?: string;
  city?: string;
  station?: string;
  last_update?: string;
  pollutant_id?: string;
  pollutant_avg?: string | number;
  avg_value?: string | number;
  latitude?: string | number;
  longitude?: string | number;
}

function parseConc(v: string | number | undefined): number | null {
  if (v === undefined || v === null || v === "" || v === "NA") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

// data.gov.in's CPCB feed doesn't ship a `pollutant_unit` field, and CO + NH3
// values vary wildly by station (some appear to report mg/m³, others ppm-derived
// scales) — mixing them into the headline AQI causes implausible "CO dominant,
// AQI 500" readings. PM2.5/PM10/NO2/SO2/O3 are reported consistently in µg/m³
// and produce stable sub-indices, so we restrict the headline calculation to
// those five. CO and NH3 still appear in the per-station pollutant breakdown
// for transparency but don't drive the displayed AQI.
const HEADLINE_POLLUTANTS: ReadonlySet<Pollutant> = new Set([
  "PM2.5",
  "PM10",
  "NO2",
  "SO2",
  "O3",
]);

function aggregateStations(rows: CpcbRow[]): StationReading[] {
  const byStation = new Map<string, CpcbRow[]>();
  for (const row of rows) {
    if (!row.station) continue;
    const arr = byStation.get(row.station) ?? [];
    arr.push(row);
    byStation.set(row.station, arr);
  }

  const out: StationReading[] = [];
  for (const [station, readings] of byStation) {
    const pollutants: StationReading["pollutants"] = [];
    for (const r of readings) {
      const pol = r.pollutant_id ? normalizePollutant(r.pollutant_id) : null;
      if (!pol) continue;
      const conc = parseConc(r.pollutant_avg ?? r.avg_value);
      if (conc === null) continue;
      const si = subIndex(pol, conc);
      if (si === null) continue;
      pollutants.push({ pollutant: pol, concentration: conc, subIndex: si });
    }
    if (pollutants.length === 0) continue;
    const headline = pollutants.filter((p) => HEADLINE_POLLUTANTS.has(p.pollutant));
    const ranked = (headline.length > 0 ? headline : pollutants).sort(
      (a, b) => b.subIndex - a.subIndex
    );
    const top = ranked[0];
    const lat = parseConc(readings[0].latitude);
    const lng = parseConc(readings[0].longitude);
    out.push({
      station,
      state: readings[0].state ?? "",
      aqi: top.subIndex,
      dominantPollutant: top.pollutant,
      pollutants: pollutants.sort((a, b) => b.subIndex - a.subIndex),
      lastUpdate: readings[0].last_update ?? "",
      lat: lat !== null ? lat : undefined,
      lng: lng !== null ? lng : undefined,
    });
  }
  return out;
}

async function loadCity(city: string): Promise<AqiResult> {
  const data = await fetchDataGovIn<CpcbRow>({
    resourceId: RESOURCES.AQI_REALTIME,
    filters: { city },
    limit: 5000,
  });
  const stations = aggregateStations(data.records);
  if (stations.length === 0) {
    throw new Error(`No CPCB monitoring stations report for "${city}" right now.`);
  }
  const cityAqi = Math.round(stations.reduce((s, x) => s + x.aqi, 0) / stations.length);
  const dominantCounts = new Map<Pollutant, number>();
  for (const s of stations) {
    dominantCounts.set(s.dominantPollutant, (dominantCounts.get(s.dominantPollutant) ?? 0) + 1);
  }
  const dominant = [...dominantCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    city,
    aqi: cityAqi,
    bucket: categorize(cityAqi),
    dominantPollutant: dominant,
    stations: stations.sort((a, b) => b.aqi - a.aqi),
    forecast: forecast24h(cityAqi),
    source: "CPCB via data.gov.in",
    updatedAt: new Date().toISOString(),
  };
}

export function getCityAqi(city: string): Promise<AqiResult> {
  return cached("aqi", city.toLowerCase(), TTL.AQI_MS, () => loadCity(city));
}
