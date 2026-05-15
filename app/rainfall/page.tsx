import { ToolHeader } from "@/components/ToolHeader";
import { EmptyState } from "@/components/EmptyState";
import { ResultCard } from "@/components/ResultCard";
import { WhatsAppShare } from "@/components/WhatsAppShare";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  computeAnomaly,
  getBaseline,
  getMeta,
  listDistricts,
  type Anomaly,
  type DistrictBaseline,
  type Period,
} from "@/lib/rainfall/baseline";
import { getDict } from "@/lib/i18n/server";
import type { Dict } from "@/lib/i18n/dict";

export const metadata = { title: "Rainfall Anomaly" };

interface PageProps {
  searchParams: Promise<{ district?: string; current?: string; period?: string }>;
}

export default async function RainfallPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const district = sp.district?.trim();
  const period: Period = sp.period === "annual" ? "annual" : "jjas";
  const currentRaw = sp.current?.trim();
  const currentMm = currentRaw ? Number(currentRaw) : null;
  const baseline = district ? getBaseline(district) : null;
  const anomaly =
    baseline && currentMm !== null && Number.isFinite(currentMm)
      ? computeAnomaly(baseline, currentMm, period)
      : null;
  const districts = listDistricts();
  const meta = getMeta();
  const t = await getDict();
  const ui = t.modules.rainfall.ui;

  return (
    <>
      <ToolHeader
        icon="🌧️"
        title={t.modules.rainfall.title}
        tagline={t.modules.rainfall.tagline}
      />

      <form action="/rainfall" method="get" className="mb-6 grid gap-2 sm:grid-cols-[2fr_1fr_1fr_auto]">
        <Input
          name="district"
          list="rainfall-districts"
          defaultValue={district ?? ""}
          required
          autoComplete="off"
          placeholder={`${ui.districtPlaceholder} (${districts.length})`}
        />
        <datalist id="rainfall-districts">
          {districts.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>
        <select
          name="period"
          defaultValue={period}
          className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
        >
          <option value="jjas">{ui.monsoon}</option>
          <option value="annual">{ui.annual}</option>
        </select>
        <Input
          name="current"
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          defaultValue={currentRaw ?? ""}
          placeholder={ui.currentMm}
        />
        <Button type="submit">{ui.compare}</Button>
      </form>

      {!district && (
        <EmptyState
          icon="🌧️"
          title={ui.pickDistrict}
          hint={ui.pickHint}
        />
      )}

      {district && !baseline && (
        <EmptyState
          icon="⚠️"
          title={`${ui.pickDistrict} — "${district}"`}
        />
      )}

      {baseline && (
        <BaselineView
          district={district!}
          baseline={baseline}
          period={period}
          anomaly={anomaly}
          t={t}
        />
      )}

      {meta && (
        <p className="mt-6 text-xs text-muted-foreground">
          {String(meta.note ?? "")} Source: {String(meta.source ?? "IMD")}.
        </p>
      )}
    </>
  );
}

function BaselineView({
  district,
  baseline,
  period,
  anomaly,
  t,
}: {
  district: string;
  baseline: DistrictBaseline;
  period: Period;
  anomaly: Anomaly | null;
  t: Dict;
}) {
  const ui = t.modules.rainfall.ui;
  const mean = period === "annual" ? baseline.mean_annual : baseline.mean_jjas;
  const sd = period === "annual" ? baseline.sd_annual : baseline.sd_jjas;
  const periodLabel = period === "annual" ? ui.annual : ui.monsoon;
  const verdictText = anomaly ? ui.verdicts[anomaly.verdict] : "";
  const shareText = anomaly
    ? `${district}: ${anomaly.pct >= 0 ? "+" : ""}${anomaly.pct.toFixed(0)}% ${verdictText} — govpulse.in/rainfall`
    : "";

  return (
    <div className="space-y-6">
      <ResultCard title={`${district} — ${periodLabel} ${ui.baseline}`} source="IMD long-period averages">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Stat label={ui.meanRainfall} value={`${mean} mm`} />
          <Stat label={ui.stdDeviation} value={`±${sd} mm`} />
          <Stat label={ui.sampleYears} value={`${baseline.years_n}`} />
          <Stat label={ui.cov} value={`${((sd / mean) * 100).toFixed(0)}%`} />
        </div>
      </ResultCard>

      {anomaly && (
        <ResultCard title={ui.thisSeason}>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-stretch sm:gap-6">
            <div
              className="flex min-w-[10rem] flex-col items-center justify-center rounded-2xl px-6 py-4 text-white shadow-md"
              style={{ backgroundColor: anomaly.color }}
            >
              <div className="text-3xl font-bold leading-none">
                {anomaly.pct >= 0 ? "+" : ""}
                {anomaly.pct.toFixed(0)}%
              </div>
              <div className="mt-1 text-xs font-medium tracking-wide uppercase">
                {ui.vsNormal}
              </div>
            </div>
            <div className="flex-1 space-y-1 text-sm">
              <div className="text-lg font-semibold capitalize">{verdictText}</div>
              <div className="text-muted-foreground">
                <span className="font-medium text-foreground">{anomaly.current} mm</span>
                {" · "}
                <span className="font-medium text-foreground">{anomaly.mean} mm</span> ({ui.meanRainfall.toLowerCase()})
              </div>
              <div className="text-muted-foreground">
                Z: <span className="font-medium text-foreground">{anomaly.z.toFixed(2)}</span>
                {" · "}
                σ: <span className="font-medium text-foreground">{anomaly.sd} mm</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <WhatsAppShare text={shareText} label={t.actions.share} />
          </div>
        </ResultCard>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-lg font-semibold">{value}</div>
    </div>
  );
}
