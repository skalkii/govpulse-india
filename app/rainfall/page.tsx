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

export const metadata = { title: "Rainfall Anomaly — GovPulse India" };

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

  return (
    <>
      <ToolHeader
        icon="🌧️"
        title="Rainfall Anomaly"
        tagline="How this season's rainfall compares to a district's long-period average."
      />

      <form action="/rainfall" method="get" className="mb-6 grid gap-2 sm:grid-cols-[2fr_1fr_1fr_auto]">
        <Input
          name="district"
          list="rainfall-districts"
          defaultValue={district ?? ""}
          required
          autoComplete="off"
          placeholder={`Type a district (${districts.length} available)`}
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
          <option value="jjas">Monsoon (Jun-Sep)</option>
          <option value="annual">Annual</option>
        </select>
        <Input
          name="current"
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          defaultValue={currentRaw ?? ""}
          placeholder="Current mm (optional)"
        />
        <Button type="submit">Compare</Button>
      </form>

      {!district && (
        <EmptyState
          icon="🌧️"
          title="Pick a district to see its baseline"
          hint="Then add this season's rainfall total to see the anomaly."
        />
      )}

      {district && !baseline && (
        <EmptyState
          icon="⚠️"
          title={`No baseline for "${district}"`}
          hint="Run pnpm build-data:rainfall against an IMD CSV to expand coverage."
        />
      )}

      {baseline && (
        <BaselineView
          district={district!}
          baseline={baseline}
          period={period}
          anomaly={anomaly}
        />
      )}

      {meta && (
        <p className="mt-6 text-xs text-muted-foreground">
          Baselines: {String(meta.note ?? "")} Source: {String(meta.source ?? "IMD")}.
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
}: {
  district: string;
  baseline: DistrictBaseline;
  period: Period;
  anomaly: Anomaly | null;
}) {
  const mean = period === "annual" ? baseline.mean_annual : baseline.mean_jjas;
  const sd = period === "annual" ? baseline.sd_annual : baseline.sd_jjas;
  const periodLabel = period === "annual" ? "Annual" : "Monsoon (JJAS)";
  const shareText = anomaly
    ? `${district} rainfall is ${Math.abs(anomaly.pct).toFixed(0)}% ${anomaly.pct >= 0 ? "above" : "below"} normal — check yours: govpulse.in/rainfall`
    : "";

  return (
    <div className="space-y-6">
      <ResultCard title={`${district} — ${periodLabel} baseline`} source="IMD long-period averages">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Stat label="Mean rainfall" value={`${mean} mm`} />
          <Stat label="Std deviation" value={`±${sd} mm`} />
          <Stat label="Sample years" value={`${baseline.years_n}`} />
          <Stat label="Coefficient of variation" value={`${((sd / mean) * 100).toFixed(0)}%`} />
        </div>
      </ResultCard>

      {anomaly ? (
        <ResultCard title="This season">
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
                vs normal
              </div>
            </div>
            <div className="flex-1 space-y-1 text-sm">
              <div className="text-lg font-semibold capitalize">{anomaly.verdict}</div>
              <div className="text-muted-foreground">
                Current: <span className="font-medium text-foreground">{anomaly.current} mm</span>
                {" · "}
                Normal: <span className="font-medium text-foreground">{anomaly.mean} mm</span>
              </div>
              <div className="text-muted-foreground">
                Z-score: <span className="font-medium text-foreground">{anomaly.z.toFixed(2)}</span>
                {" · "}
                σ: <span className="font-medium text-foreground">{anomaly.sd} mm</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <WhatsAppShare text={shareText} />
          </div>
        </ResultCard>
      ) : (
        <ResultCard title="Add this season's rainfall">
          <p className="text-sm text-muted-foreground">
            Enter the {periodLabel.toLowerCase()} rainfall total in millimetres
            above to see whether this season is above or below normal. Source
            it from{" "}
            <a
              href="https://www.imdpune.gov.in/cmpg/Realtime/Rainfall/Statewise/Districtwise/Districtwise.html"
              target="_blank"
              rel="noreferrer noopener"
              className="underline"
            >
              IMD Pune district rainfall
            </a>
            .
          </p>
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
