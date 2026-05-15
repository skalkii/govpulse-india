import { ToolHeader } from "@/components/ToolHeader";
import { EmptyState } from "@/components/EmptyState";
import { ResultCard } from "@/components/ResultCard";
import { WhatsAppShare } from "@/components/WhatsAppShare";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categorize } from "@/lib/aqi/breakpoints";
import { forecast24h } from "@/lib/aqi/forecast";
import { getCityAqi } from "@/lib/aqi/service";
import type { AqiResult } from "@/lib/aqi/types";
import citiesJson from "@/data/aqi-cities.json";

export const metadata = { title: "AQI Now & Next 24h — GovPulse India" };

const POPULAR = ["Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad"];
const ALL_CITIES = (citiesJson as { cities: string[] }).cities;

async function loadAqi(city: string): Promise<AqiResult | { error: string }> {
  try {
    return await getCityAqi(city);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to load AQI." };
  }
}

interface PageProps {
  searchParams: Promise<{ city?: string }>;
}

export default async function AqiPage({ searchParams }: PageProps) {
  const { city } = await searchParams;
  const result = city ? await loadAqi(city) : null;

  return (
    <>
      <ToolHeader
        icon="🌬️"
        title="AQI Now & Next 24h"
        tagline="Live air quality + a transparent rules-based 24h forecast for any Indian city."
      />

      <form action="/aqi" method="get" className="mb-6 flex flex-col gap-2 sm:flex-row">
        <Input
          name="city"
          list="aqi-cities"
          defaultValue={city ?? ""}
          placeholder={`Type a city (${ALL_CITIES.length} CPCB-monitored)`}
          className="flex-1"
          required
          autoComplete="off"
        />
        <datalist id="aqi-cities">
          {ALL_CITIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <Button type="submit">Check AQI</Button>
      </form>

      {!city && (
        <>
          <EmptyState
            icon="🌬️"
            title="Pick a city to see live AQI"
            hint="CPCB monitoring stations refresh hourly."
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {POPULAR.map((c) => (
              <a key={c} href={`/aqi?city=${encodeURIComponent(c)}`}>
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                  {c}
                </Badge>
              </a>
            ))}
          </div>
        </>
      )}

      {result && "error" in result && (
        <EmptyState icon="⚠️" title="Couldn't load AQI" hint={result.error} />
      )}

      {result && !("error" in result) && <AqiView result={result} />}
    </>
  );
}

function AqiView({ result }: { result: AqiResult }) {
  const cat = categorize(result.aqi);
  const fc = result.forecast.length ? result.forecast : forecast24h(result.aqi);
  const shareText = `${result.city} AQI is ${result.aqi} (${cat.category}) — check yours: govpulse.in/aqi`;

  return (
    <div className="space-y-6">
      <ResultCard
        title={`${result.city} — right now`}
        source={result.source}
        updatedAt={new Date(result.updatedAt).toLocaleString("en-IN")}
      >
        <div className="flex items-center gap-6">
          <div
            className="flex size-28 flex-col items-center justify-center rounded-2xl text-white shadow-md"
            style={{ backgroundColor: cat.color }}
          >
            <div className="text-4xl font-bold leading-none">{result.aqi}</div>
            <div className="mt-1 text-xs font-medium tracking-wide uppercase">AQI</div>
          </div>
          <div>
            <div className="text-xl font-semibold">{cat.category}</div>
            <p className="mt-1 text-sm text-muted-foreground">{cat.advice}</p>
            {result.dominantPollutant && (
              <p className="mt-2 text-xs text-muted-foreground">
                Dominant pollutant: <span className="font-medium text-foreground">{result.dominantPollutant}</span>
                {" · "}
                Averaged across {result.stations.length} station{result.stations.length === 1 ? "" : "s"}
              </p>
            )}
          </div>
        </div>
        <div className="flex">
          <WhatsAppShare text={shareText} />
        </div>
      </ResultCard>

      <ResultCard title="Next 24 hours">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {fc.map((b) => (
            <div
              key={b.label}
              className="rounded-lg p-3 text-white shadow-sm"
              style={{ backgroundColor: b.bucket.color }}
            >
              <div className="text-xs font-medium opacity-90">{b.label}</div>
              <div className="mt-1 text-2xl font-bold leading-none">{b.aqi}</div>
              <div className="mt-1 text-xs">{b.bucket.category}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Forecast applies a fixed diurnal multiplier (peaks ~7am and ~9pm) to the
          current observation. Not a model — auditable rules. Use it as a rough
          guide, not a prediction.
        </p>
      </ResultCard>

      <ResultCard title={`Stations (${result.stations.length})`}>
        <ul className="divide-y text-sm">
          {result.stations.map((s) => {
            const sCat = categorize(s.aqi);
            return (
              <li key={s.station} className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium">{s.station}</div>
                  <div className="text-xs text-muted-foreground">
                    Worst: {s.dominantPollutant}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block min-w-[3rem] rounded px-2 py-1 text-center text-sm font-semibold text-white"
                    style={{ backgroundColor: sCat.color }}
                  >
                    {s.aqi}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </ResultCard>
    </div>
  );
}
