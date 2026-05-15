import { NextResponse } from "next/server";
import { fetchDataGovIn } from "@/lib/datagovin";
import { RESOURCES } from "@/lib/resources";
import { TTL, cached } from "@/lib/cache";
import {
  categorize,
  normalizePollutant,
  subIndex,
  type Pollutant,
} from "@/lib/aqi/breakpoints";
import { forecast24h } from "@/lib/aqi/forecast";
import type { AqiResult, StationReading } from "@/lib/aqi/types";

interface CpcbRow {
  country?: string;
  state?: string;
  city?: string;
  station?: string;
  last_update?: string;
  pollutant_id?: string;
  pollutant_avg?: string | number;
  avg_value?: string | number;
}

function parseConc(v: string | number | undefined): number | null {
  if (v === undefined || v === null || v === "" || v === "NA") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function aggregateStations(rows: CpcbRow[]): StationReading[] {
  const byStation = new Map<string, CpcbRow[]>();
  for (const row of rows) {
    if (!row.station) continue;
    const key = row.station;
    const arr = byStation.get(key) ?? [];
    arr.push(row);
    byStation.set(key, arr);
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
    pollutants.sort((a, b) => b.subIndex - a.subIndex);
    const top = pollutants[0];
    out.push({
      station,
      state: readings[0].state ?? "",
      aqi: top.subIndex,
      dominantPollutant: top.pollutant,
      pollutants,
      lastUpdate: readings[0].last_update ?? "",
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city")?.trim();
  if (!city) {
    return NextResponse.json({ error: "Missing 'city' query param." }, { status: 400 });
  }
  try {
    const result = await cached("aqi", city.toLowerCase(), TTL.AQI_MS, () => loadCity(city));
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
