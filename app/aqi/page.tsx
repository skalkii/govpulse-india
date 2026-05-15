import { Suspense } from "react";
import Link from "next/link";
import { ToolHeader } from "@/components/ToolHeader";
import { EmptyState } from "@/components/EmptyState";
import { ResultCard } from "@/components/ResultCard";
import { WhatsAppShare } from "@/components/WhatsAppShare";
import { StationMapClient } from "@/components/StationMapClient";
import { Skeleton } from "@/components/Skeleton";
import { Combobox } from "@/components/Combobox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categorize } from "@/lib/aqi/breakpoints";
import { forecast24h } from "@/lib/aqi/forecast";
import { getCityAqi } from "@/lib/aqi/service";
import type { AqiResult } from "@/lib/aqi/types";
import citiesJson from "@/data/aqi-cities.json";
import { getDict } from "@/lib/i18n/server";
import type { Dict } from "@/lib/i18n/dict";

export const metadata = { title: "AQI Now & Next 24h" };

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
  searchParams: Promise<{ city?: string; view?: string }>;
}

export default async function AqiPage({ searchParams }: PageProps) {
  const { city, view } = await searchParams;
  const v: "list" | "map" = view === "list" ? "list" : "map";
  const t = await getDict();
  const ui = t.modules.aqi.ui;

  return (
    <>
      <ToolHeader
        icon="🌬️"
        title={t.modules.aqi.title}
        tagline={t.modules.aqi.tagline}
      />

      <form action="/aqi" method="get" className="mb-6 flex flex-col gap-2 sm:flex-row">
        <Combobox
          name="city"
          options={ALL_CITIES}
          defaultValue={city ?? ""}
          placeholder={`${ui.cityPlaceholder} (${ALL_CITIES.length})`}
          required
          className="flex-1"
        />
        <Button type="submit">{ui.check}</Button>
      </form>

      {!city ? (
        <>
          <EmptyState
            icon="🌬️"
            title={ui.pickCity}
            hint={ui.pickHint}
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
      ) : (
        <Suspense key={city + v} fallback={<AqiSkeleton city={city} />}>
          <AqiResultBlock city={city} t={t} view={v} />
        </Suspense>
      )}
    </>
  );
}

async function AqiResultBlock({ city, t, view }: { city: string; t: Dict; view: "list" | "map" }) {
  const result = await loadAqi(city);
  const ui = t.modules.aqi.ui;
  if ("error" in result) {
    return <EmptyState icon="⚠️" title={ui.couldNotLoad} hint={result.error} />;
  }
  return <AqiView result={result} t={t} view={view} />;
}

function ViewSwitch({
  city,
  active,
  listLabel,
  mapLabel,
}: {
  city: string;
  active: "list" | "map";
  listLabel: string;
  mapLabel: string;
}) {
  const base = `/aqi?city=${encodeURIComponent(city)}`;
  const cls = (on: boolean) =>
    `rounded-full px-3 py-1 text-xs font-medium transition-colors ${
      on ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
    }`;
  return (
    <div className="mb-3 inline-flex items-center rounded-full border border-border bg-background p-0.5">
      <Link href={`${base}&view=list`} className={cls(active === "list")}>{listLabel}</Link>
      <Link href={`${base}&view=map`} className={cls(active === "map")}>{mapLabel}</Link>
    </div>
  );
}

function AqiSkeleton({ city }: { city: string }) {
  return (
    <div className="space-y-6">
      <ResultCard title={`${city}`}>
        <div className="flex items-center gap-6">
          <Skeleton className="size-28 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </ResultCard>
      <ResultCard>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </ResultCard>
      <ResultCard>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      </ResultCard>
    </div>
  );
}

function AqiView({ result, t, view }: { result: AqiResult; t: Dict; view: "list" | "map" }) {
  const cat = categorize(result.aqi);
  const fc = result.forecast.length ? result.forecast : forecast24h(result.aqi);
  const ui = t.modules.aqi.ui;
  const shareText = `${result.city} AQI ${result.aqi} (${cat.category}) — govpulse.in/aqi`;

  return (
    <div className="space-y-6">
      <ResultCard
        title={`${result.city} — ${ui.rightNow}`}
        source={result.source}
        updatedAt={new Date(result.updatedAt).toLocaleString("en-IN")}
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div
            className="flex size-24 shrink-0 flex-col items-center justify-center rounded-2xl text-white shadow-md sm:size-28"
            style={{ backgroundColor: cat.color }}
          >
            <div className="text-3xl font-bold leading-none sm:text-4xl">{result.aqi}</div>
            <div className="mt-1 text-xs font-medium tracking-wide uppercase">AQI</div>
          </div>
          <div className="min-w-0">
            <div className="text-xl font-semibold">{cat.category}</div>
            <p className="mt-1 text-sm text-muted-foreground">{cat.advice}</p>
            {result.dominantPollutant && (
              <p className="mt-2 text-xs text-muted-foreground">
                {ui.dominant}: <span className="font-medium text-foreground">{result.dominantPollutant}</span>
                {" · "}
                {ui.averagedAcross} {result.stations.length}
              </p>
            )}
          </div>
        </div>
        <div className="flex">
          <WhatsAppShare text={shareText} label={t.actions.share} />
        </div>
      </ResultCard>

      <ResultCard title={ui.next24h}>
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
        <p className="text-xs text-muted-foreground">{ui.forecastNote}</p>
      </ResultCard>

      <ResultCard title={`${ui.stations} (${result.stations.length})`}>
        <ViewSwitch
          city={result.city}
          active={view}
          listLabel={ui.listView}
          mapLabel={ui.mapView}
        />
        {view === "map" ? (
          (() => {
            const markers = result.stations
              .filter((s) => s.lat !== undefined && s.lng !== undefined)
              .map((s) => {
                const sCat = categorize(s.aqi);
                return {
                  id: s.station,
                  lat: s.lat!,
                  lng: s.lng!,
                  label: s.station,
                  sub: `${ui.worst}: ${s.dominantPollutant}`,
                  value: String(s.aqi),
                  color: sCat.color,
                };
              });
            if (markers.length === 0) {
              return (
                <p className="text-sm text-muted-foreground">
                  No station coordinates returned for this city.
                </p>
              );
            }
            return <StationMapClient markers={markers} cluster />;
          })()
        ) : (
          <ul className="divide-y text-sm">
            {result.stations.map((s) => {
              const sCat = categorize(s.aqi);
              return (
                <li key={s.station} className="flex items-center justify-between gap-3 py-2">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{s.station}</div>
                    <div className="text-xs text-muted-foreground">
                      {ui.worst}: {s.dominantPollutant}
                    </div>
                  </div>
                  <span
                    className="inline-block shrink-0 min-w-[3rem] rounded px-2 py-1 text-center text-sm font-semibold text-white"
                    style={{ backgroundColor: sCat.color }}
                  >
                    {s.aqi}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </ResultCard>
    </div>
  );
}
