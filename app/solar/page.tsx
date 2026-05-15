import { ToolHeader } from "@/components/ToolHeader";
import { EmptyState } from "@/components/EmptyState";
import { ResultCard } from "@/components/ResultCard";
import { WhatsAppShare } from "@/components/WhatsAppShare";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { calculatePayback, type SolarResult } from "@/lib/solar/service";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "Solar ROI Calculator" };

interface PageProps {
  searchParams: Promise<{ pincode?: string; sqft?: string; bill?: string }>;
}

export default async function SolarPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const submitted = sp.pincode && sp.sqft && sp.bill;
  const result = submitted
    ? calculatePayback({
        pincode: sp.pincode!.trim(),
        roofSqft: Number(sp.sqft),
        monthlyBillRs: Number(sp.bill),
      })
    : null;
  const t = await getDict();

  return (
    <>
      <ToolHeader
        icon="☀️"
        title={t.modules.solar.title}
        tagline={t.modules.solar.tagline}
      />

      <form action="/solar" method="get" className="mb-6 grid gap-3 sm:grid-cols-3">
        <Field label="Pincode" name="pincode" defaultValue={sp.pincode} placeholder="e.g. 560001" pattern="\d{6}" required />
        <Field label="Roof area (sq ft)" name="sqft" type="number" min="50" defaultValue={sp.sqft} placeholder="e.g. 500" required />
        <Field label="Monthly bill (₹)" name="bill" type="number" min="100" defaultValue={sp.bill} placeholder="e.g. 3000" required />
        <div className="sm:col-span-3">
          <Button type="submit">Calculate payback</Button>
        </div>
      </form>

      {!submitted && (
        <EmptyState
          icon="☀️"
          title="Fill the form to see your payback"
          hint="Estimates only — get a professional installer quote before committing."
        />
      )}

      {result && "error" in result && (
        <EmptyState icon="⚠️" title="Couldn't compute" hint={result.error} />
      )}

      {result && !("error" in result) && <SolarView result={result} />}
    </>
  );
}

function Field(props: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  min?: string;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={props.name}>{props.label}</Label>
      <Input id={props.name} {...props} />
    </div>
  );
}

function SolarView({ result }: { result: SolarResult }) {
  const shareText = `Rooftop solar payback in ${result.district}: ~${result.paybackYears} yrs (${result.capacityKw} kW, ${result.coverPct}% bill offset). Check yours: govpulse.in/solar`;
  const fmtRs = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <ResultCard
        title={`${result.district} — your rooftop estimate`}
        source={result.source}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Headline label="Payback" value={`${result.paybackYears} yrs`} accent="#10b981" />
          <Headline label="Bill offset" value={`${result.coverPct}%`} accent="#3b82f6" />
          <Headline label="25-yr net savings" value={fmtRs(result.lifetimeSavingsRs)} accent="#f59e0b" />
        </div>
        <div className="flex">
          <WhatsAppShare text={shareText} />
        </div>
      </ResultCard>

      <ResultCard title="System details">
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <Stat label="Capacity" value={`${result.capacityKw} kW`} />
          <Stat label="Local GHI" value={`${result.ghi} kWh/m²/day`} />
          <Stat label="Annual generation" value={`${result.annualGenerationKwh.toLocaleString("en-IN")} kWh`} />
          <Stat label="Install cost" value={fmtRs(result.installCostRs)} />
          <Stat label="Annual savings" value={fmtRs(result.annualSavingsRs)} />
          <Stat label="Monthly savings" value={fmtRs(result.monthlySavingsRs)} />
        </div>
        <p className="text-xs text-muted-foreground">
          Assumptions: 100 sq ft/kW, 75% system efficiency, ₹60k/kW installed
          (post 30% MNRE subsidy), ₹7/kWh tariff, 0.5%/yr panel degradation,
          25-year life. Estimates only — not a quote.
        </p>
      </ResultCard>
    </div>
  );
}

function Headline({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      className="rounded-2xl px-5 py-4 text-white shadow-md"
      style={{ backgroundColor: accent }}
    >
      <div className="text-xs font-medium uppercase tracking-wide opacity-90">{label}</div>
      <div className="mt-1 text-2xl font-bold leading-tight">{value}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-base font-semibold">{value}</div>
    </div>
  );
}
