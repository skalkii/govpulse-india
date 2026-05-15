import { ToolHeader } from "@/components/ToolHeader";
import { EmptyState } from "@/components/EmptyState";
import { ResultCard } from "@/components/ResultCard";
import { WhatsAppShare } from "@/components/WhatsAppShare";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  classify,
  getMeta,
  listStates,
  stationsByState,
  worstParameter,
  type RiverStation,
} from "@/lib/rivers/service";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "River Health Check" };

interface PageProps {
  searchParams: Promise<{ state?: string }>;
}

export default async function RiversPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const state = sp.state?.trim();
  const states = listStates();
  const stations = state ? stationsByState(state) : [];
  const t = await getDict();
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
          placeholder={`Type a state (${states.length} available)`}
        />
        <datalist id="rivers-states">
          {states.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        <Button type="submit">Show stations</Button>
      </form>

      {!state && (
        <EmptyState
          icon="🌊"
          title="Pick a state to see CPCB monitoring stations"
          hint="Each station rated against CPCB designated best-use classes."
        />
      )}

      {state && stations.length === 0 && (
        <EmptyState
          icon="⚠️"
          title={`No bundled stations for "${state}"`}
          hint="Run pnpm build-data:rivers against a CPCB CSV to expand."
        />
      )}

      {stations.length > 0 && <StationsView state={state!} stations={stations} />}

      <p className="mt-6 text-xs text-muted-foreground">
        {String(meta.note ?? "")} Source: {String(meta.source ?? "CPCB")}.
      </p>
    </>
  );
}

function StationsView({ state, stations }: { state: string; stations: RiverStation[] }) {
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
        <div className="flex">
          <WhatsAppShare text={shareText} />
        </div>
      </ResultCard>

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
                <span className="font-medium text-foreground">Headline issue:</span> {issue}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                Suitable for: <span className="font-medium text-foreground">{c.bestUse}</span>
              </div>
            </div>
          );
        })}
      </div>
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
