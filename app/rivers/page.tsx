import Link from "next/link";
import { ToolHeader } from "@/components/ToolHeader";
import { EmptyState } from "@/components/EmptyState";
import { ResultCard } from "@/components/ResultCard";
import { WhatsAppShare } from "@/components/WhatsAppShare";
import { StationMapClient } from "@/components/StationMapClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  allStations,
  classify,
  getMeta,
  listStates,
  stationsByState,
  worstParameter,
  type RiverStation,
} from "@/lib/rivers/service";
import { getDict } from "@/lib/i18n/server";
import type { Dict } from "@/lib/i18n/dict";

export const metadata = { title: "River Health Check" };

interface PageProps {
  searchParams: Promise<{ state?: string; view?: string }>;
}

export default async function RiversPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const state = sp.state?.trim();
  const view: "list" | "map" = sp.view === "list" ? "list" : "map";
  const states = listStates();
  const stations = state ? stationsByState(state) : [];
  const t = await getDict();
  const ui = t.modules.rivers.ui;
  const meta = getMeta();

  return (
    <>
      <ToolHeader
        icon="🌊"
        title={t.modules.rivers.title}
        tagline={t.modules.rivers.tagline}
      />

      <form action="/rivers" method="get" className="mb-6 flex flex-col gap-2 sm:flex-row">
        <Input
          name="state"
          list="rivers-states"
          defaultValue={state ?? ""}
          required
          autoComplete="off"
          className="flex-1"
          placeholder={`${ui.statePlaceholder} (${states.length})`}
        />
        <datalist id="rivers-states">
          {states.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        <Button type="submit">{ui.showStations}</Button>
      </form>

      {!state && <RiversOverviewMap />}

      {state && stations.length === 0 && (
        <EmptyState
          icon="⚠️"
          title={`${ui.noStations} "${state}"`}
        />
      )}

      {stations.length > 0 && (
        <StationsView state={state!} stations={stations} t={t} view={view} />
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        {String(meta.note ?? "")} Source: {String(meta.source ?? "CPCB")}.
      </p>
    </>
  );
}

function RiversOverviewMap() {
  const all = allStations();
  const markers = all.map((s) => {
    const c = classify(s);
    return {
      id: s.id,
      lat: s.lat,
      lng: s.lng,
      label: s.station,
      sub: `${s.river} · ${s.state}`,
      value: c.label,
      color: c.color,
    };
  });
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {all.length} CPCB stations across India, colored by water-quality class.
        Click a marker for details, or pick a state above for the full breakdown.
      </p>
      <StationMapClient markers={markers} height={520} />
    </div>
  );
}

function StationsView({
  state,
  stations,
  t,
  view,
}: {
  state: string;
  stations: RiverStation[];
  t: Dict;
  view: "list" | "map";
}) {
  const ui = t.modules.rivers.ui;
  const classCounts = new Map<string, number>();
  for (const s of stations) {
    const c = classify(s).label;
    classCounts.set(c, (classCounts.get(c) ?? 0) + 1);
  }
  const worstClass = [...classCounts.keys()].sort((a, b) => classRank(b) - classRank(a))[0];
  const shareText = `${state} river health: ${stations.length} CPCB stations, worst ${worstClass}. Check yours: govpulse.in/rivers`;

  return (
    <div className="space-y-6">
      <ResultCard title={`${state} — ${stations.length} station${stations.length === 1 ? "" : "s"}`}>
        <div className="flex flex-wrap gap-2">
          {[...classCounts.entries()].map(([label, n]) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs"
            >
              <span className="size-2 rounded-full" style={{ backgroundColor: classColorFor(label) }} />
              {label}: <span className="font-medium">{n}</span>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ViewSwitch state={state} active={view} listLabel={ui.listView} mapLabel={ui.mapView} />
          <WhatsAppShare text={shareText} label={t.actions.share} />
        </div>
      </ResultCard>

      {view === "map" && (
        <StationMapClient
          markers={stations.map((s) => {
            const c = classify(s);
            return {
              id: s.id,
              lat: s.lat,
              lng: s.lng,
              label: s.station,
              sub: s.river,
              value: c.label,
              color: c.color,
            };
          })}
        />
      )}

      {view === "list" && (
      <div className="grid gap-3 sm:grid-cols-2">
        {stations.map((s) => {
          const c = classify(s);
          const issue = worstParameter(s);
          return (
            <div key={s.id} className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold leading-tight break-words">{s.station}</div>
                  <div className="text-xs text-muted-foreground">{s.river}</div>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: c.color }}
                  title={c.bestUse}
                >
                  {c.label}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-1.5 text-center text-xs">
                <Param label="DO" value={s.do.toFixed(1)} unit="mg/L" />
                <Param label="BOD" value={s.bod.toFixed(1)} unit="mg/L" />
                <Param label="pH" value={s.ph.toFixed(1)} unit="" />
                <Param label="FC" value={fmtFc(s.fc)} unit="MPN" />
              </div>

              <div className="mt-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{ui.headlineIssue}:</span> {issue}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {ui.suitableFor}: <span className="font-medium text-foreground">{c.bestUse}</span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.station} ${s.river} river`)}`}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                {ui.openInMaps}
                <span aria-hidden>↗</span>
              </a>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}

function ViewSwitch({
  state,
  active,
  listLabel,
  mapLabel,
}: {
  state: string;
  active: "list" | "map";
  listLabel: string;
  mapLabel: string;
}) {
  const base = `/rivers?state=${encodeURIComponent(state)}`;
  const cls = (on: boolean) =>
    `rounded-full px-3 py-1 text-xs font-medium transition-colors ${
      on ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
    }`;
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-background p-0.5">
      <Link href={`${base}&view=list`} className={cls(active === "list")}>{listLabel}</Link>
      <Link href={`${base}&view=map`} className={cls(active === "map")}>{mapLabel}</Link>
    </div>
  );
}

function Param({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-md bg-muted px-1 py-1.5">
      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold leading-tight">{value}</div>
      {unit && <div className="text-[10px] text-muted-foreground">{unit}</div>}
    </div>
  );
}

function fmtFc(fc: number): string {
  if (fc >= 1_000_000) return `${(fc / 1_000_000).toFixed(1)}M`;
  if (fc >= 1_000) return `${(fc / 1_000).toFixed(0)}k`;
  return String(fc);
}

function classColorFor(label: string): string {
  if (label === "Class A") return "#10b981";
  if (label === "Class B") return "#3b82f6";
  if (label === "Class C") return "#f59e0b";
  if (label === "Class D") return "#a855f7";
  if (label === "Class E") return "#ef4444";
  return "#7f1d1d";
}

function classRank(label: string): number {
  const order: Record<string, number> = {
    "Class A": 1,
    "Class B": 2,
    "Class C": 3,
    "Class D": 4,
    "Class E": 5,
    "Below E": 6,
  };
  return order[label] ?? 0;
}
