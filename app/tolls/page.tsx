import { ToolHeader } from "@/components/ToolHeader";
import { EmptyState } from "@/components/EmptyState";
import { ResultCard } from "@/components/ResultCard";
import { WhatsAppShare } from "@/components/WhatsAppShare";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  estimateToll,
  listCities,
  VEHICLE_LABELS,
  type TollEstimate,
  type VehicleClass,
} from "@/lib/tolls/service";

export const metadata = { title: "Highway Toll Calculator — GovPulse India" };

interface PageProps {
  searchParams: Promise<{ from?: string; to?: string; vehicle?: string }>;
}

const VEHICLES = Object.keys(VEHICLE_LABELS) as VehicleClass[];

function isVehicle(v: string | undefined): v is VehicleClass {
  return !!v && (VEHICLES as string[]).includes(v);
}

export default async function TollsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const cities = listCities();
  const from = sp.from?.trim();
  const to = sp.to?.trim();
  const vehicle: VehicleClass = isVehicle(sp.vehicle) ? sp.vehicle : "car";
  const result = from && to ? estimateToll(from, to, vehicle) : null;

  return (
    <>
      <ToolHeader
        icon="🚗"
        title="Highway Toll Calculator"
        tagline="Estimate NHAI tolls between two cities for your vehicle class."
      />

      <form action="/tolls" method="get" className="mb-6 grid gap-3 sm:grid-cols-[2fr_2fr_2fr_auto]">
        <CitySelect label="From" name="from" defaultValue={from} cities={cities} />
        <CitySelect label="To" name="to" defaultValue={to} cities={cities} />
        <div className="space-y-1">
          <Label htmlFor="vehicle">Vehicle</Label>
          <select
            id="vehicle"
            name="vehicle"
            defaultValue={vehicle}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
          >
            {VEHICLES.map((v) => (
              <option key={v} value={v}>{VEHICLE_LABELS[v]}</option>
            ))}
          </select>
        </div>
        <div className="self-end">
          <Button type="submit">Estimate</Button>
        </div>
      </form>

      {!from && !to && (
        <EmptyState
          icon="🚗"
          title="Pick origin + destination"
          hint="We'll list every NHAI plaza on the corridor and sum your toll."
        />
      )}

      {result && "error" in result && (
        <EmptyState icon="⚠️" title="Couldn't estimate" hint={result.error} />
      )}

      {result && !("error" in result) && <TollView result={result} />}
    </>
  );
}

function CitySelect({
  label,
  name,
  defaultValue,
  cities,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  cities: string[];
}) {
  const listId = `cities-${name}`;
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <input
        id={name}
        name={name}
        list={listId}
        defaultValue={defaultValue ?? ""}
        required
        autoComplete="off"
        placeholder="Type a city…"
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      />
      <datalist id={listId}>
        {cities.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </div>
  );
}

function TollView({ result }: { result: TollEstimate }) {
  const fmtRs = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  const shareText = `${result.from} → ${result.to} (${VEHICLE_LABELS[result.vehicle]}): ~₹${result.totalRs} across ${result.plazas.length} plazas. govpulse.in/tolls`;

  return (
    <div className="space-y-6">
      <ResultCard
        title={`${result.from} → ${result.to}`}
        source={result.source}
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Headline label="Total toll" value={fmtRs(result.totalRs)} accent="#10b981" />
          <Headline label="Plazas on route" value={`${result.plazas.length}`} accent="#3b82f6" />
          <Headline label="Approx road" value={`${result.routeKm} km`} accent="#f59e0b" />
          <Headline label="Vehicle" value={VEHICLE_LABELS[result.vehicle]} accent="#7c3aed" />
        </div>
        <div className="flex">
          <WhatsAppShare text={shareText} />
        </div>
      </ResultCard>

      <ResultCard title={`Plazas (${result.plazas.length})`}>
        {result.plazas.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No plazas in our dataset on this corridor. Either it's a free
            stretch or we don't yet have plaza coverage there — run{" "}
            <code className="font-mono text-xs">pnpm build-data:tolls</code>{" "}
            with an NHAI fee CSV to expand.
          </p>
        ) : (
          <ul className="divide-y text-sm">
            {result.plazas.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.highway} · {p.state}</div>
                </div>
                <div className="font-semibold">{fmtRs(p.rate)}</div>
              </li>
            ))}
          </ul>
        )}
      </ResultCard>

      <p className="text-xs text-muted-foreground">
        Single-trip rates per the latest NHAI Fee Notification. Return-trip
        and monthly-pass discounts not modeled. Drive time and detours not
        included — road km is crow-flies × 1.3.
      </p>
    </div>
  );
}

function Headline({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      className="rounded-2xl px-4 py-3 text-white shadow-md"
      style={{ backgroundColor: accent }}
    >
      <div className="text-xs font-medium uppercase tracking-wide opacity-90">{label}</div>
      <div className="mt-1 text-lg font-bold leading-tight">{value}</div>
    </div>
  );
}
