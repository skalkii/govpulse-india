import { ToolHeader } from "@/components/ToolHeader";
import { EmptyState } from "@/components/EmptyState";
import { ResultCard } from "@/components/ResultCard";
import { WhatsAppShare } from "@/components/WhatsAppShare";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { calculatePayback, type SolarResult } from "@/lib/solar/service";
import { getDict } from "@/lib/i18n/server";
import type { Dict } from "@/lib/i18n/dict";

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
  const ui = t.modules.solar.ui;

  return (
    <>
      <ToolHeader
        icon="☀️"
        title={t.modules.solar.title}
        tagline={t.modules.solar.tagline}
      />

      <form action="/solar" method="get" className="mb-6 grid gap-3 sm:grid-cols-3">
        <Field label={ui.pincode} name="pincode" defaultValue={sp.pincode} placeholder="560001" pattern="\d{6}" required />
        <Field label={ui.roofSqft} name="sqft" type="number" min="50" defaultValue={sp.sqft} placeholder="500" required />
        <Field label={ui.monthlyBill} name="bill" type="number" min="100" defaultValue={sp.bill} placeholder="3000" required />
        <div className="sm:col-span-3">
          <Button type="submit">{ui.calculate}</Button>
        </div>
      </form>

      {!submitted && (
        <EmptyState
          icon="☀️"
          title={ui.fillForm}
          hint={ui.fillHint}
        />
      )}

      {result && "error" in result && (
        <EmptyState icon="⚠️" title={ui.couldNotCompute} hint={result.error} />
      )}

      {result && !("error" in result) && <SolarView result={result} t={t} />}
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

function SolarView({ result, t }: { result: SolarResult; t: Dict }) {
  const ui = t.modules.solar.ui;
  const shareText = `${result.district}: ${result.capacityKw} kW, ${result.paybackYears} ${ui.years} ${ui.payback.toLowerCase()}, ${result.coverPct}% ${ui.billOffset.toLowerCase()} — govpulse.in/solar`;
  const fmtRs = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      <ResultCard title={result.district} source={result.source}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Headline label={ui.payback} value={`${result.paybackYears} ${ui.years}`} accent="#10b981" />
          <Headline label={ui.billOffset} value={`${result.coverPct}%`} accent="#3b82f6" />
          <Headline label={ui.netSavings25} value={fmtRs(result.lifetimeSavingsRs)} accent="#f59e0b" />
        </div>
        <div className="flex">
          <WhatsAppShare text={shareText} label={t.actions.share} />
        </div>
      </ResultCard>

      <ResultCard>
        <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <Stat label={ui.capacity} value={`${result.capacityKw} kW`} />
          <Stat label={ui.localGhi} value={`${result.ghi} kWh/m²/day`} />
          <Stat label={ui.annualGen} value={`${result.annualGenerationKwh.toLocaleString("en-IN")} kWh`} />
          <Stat label={ui.installCost} value={fmtRs(result.installCostRs)} />
          <Stat label={ui.annualSavings} value={fmtRs(result.annualSavingsRs)} />
          <Stat label={ui.monthlySavings} value={fmtRs(result.monthlySavingsRs)} />
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
