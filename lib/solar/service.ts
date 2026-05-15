import "server-only";
import ghiJson from "@/data/solar-ghi-by-district.json";
import pincodeJson from "@/data/pincode-lookup.json";

interface GhiData {
  _meta?: Record<string, unknown>;
  [district: string]: number | Record<string, unknown> | undefined;
}
interface PincodeData {
  _meta?: Record<string, unknown>;
  prefix_to_district: Record<string, string>;
}

const ghi = ghiJson as unknown as GhiData;
const pincodes = pincodeJson as unknown as PincodeData;

// Indian residential rooftop solar parameters (2026 estimates).
const SQFT_PER_KW = 100;          // 100 sq ft of usable roof per 1 kW capacity
const SYSTEM_EFF = 0.75;          // DC→AC × inverter × dust × wiring losses
const COST_PER_KW = 60_000;       // ₹/kW installed (post 30% MNRE subsidy)
const TARIFF_PER_KWH = 7;         // ₹/kWh avg residential slab tariff
const PANEL_DEGRADATION_PER_YEAR = 0.005; // 0.5%/yr industry avg
const SYSTEM_LIFE_YEARS = 25;

export function lookupDistrictByPincode(pincode: string): string | null {
  const prefix = pincode.trim().slice(0, 3);
  return pincodes.prefix_to_district[prefix] ?? null;
}

const DIRECTIONALS = ["north", "south", "east", "west", "central", "greater", "old", "new", "north east", "north west", "south east", "south west"];

// Common rename / spelling aliases. Pincode dataset → GHI dataset key.
const ALIASES: Record<string, string> = {
  gurgaon: "Gurugram",
  bangalore: "Bengaluru Urban",
  bengaluru: "Bengaluru Urban",
  bombay: "Mumbai",
  calcutta: "Kolkata",
  madras: "Chennai",
  kachchh: "Bhuj",
  mysore: "Mysuru",
  belgaum: "Bengaluru Urban",
  kanpur: "Kanpur Nagar",
  cuddapah: "Cuddapah",
  poona: "Pune",
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")     // drop "(hp)", "(cgh)", etc.
    .replace(/[^a-z]+/g, " ")
    .trim();
}

function variants(district: string): string[] {
  const out = new Set<string>();
  out.add(district);
  const norm = normalize(district);
  out.add(norm);
  // Alias map (e.g. Gurgaon → Gurugram)
  const aliased = ALIASES[norm];
  if (aliased) {
    out.add(aliased);
    out.add(normalize(aliased));
  }
  // Strip leading directional words: "South West Delhi" → "Delhi"
  let stripped = norm;
  let changed = true;
  while (changed) {
    changed = false;
    for (const d of DIRECTIONALS) {
      if (stripped.startsWith(d + " ")) {
        stripped = stripped.slice(d.length + 1);
        changed = true;
      }
    }
  }
  out.add(stripped);
  // Add "Urban" variant: "Bengaluru" → "Bengaluru Urban"
  out.add(stripped + " urban");
  return [...out];
}

export function getGhi(district: string): number | null {
  // Build a normalized index of GHI dataset for fuzzy lookup.
  for (const variant of variants(district)) {
    // Direct match first
    const direct = ghi[variant];
    if (typeof direct === "number") return direct;
    // Normalized scan
    for (const key of Object.keys(ghi)) {
      if (key === "_meta") continue;
      if (normalize(key) === variant) {
        const v = ghi[key];
        if (typeof v === "number") return v;
      }
    }
  }
  return null;
}

export function listDistricts(): string[] {
  return Object.keys(ghi)
    .filter((k) => k !== "_meta")
    .sort();
}

export interface SolarInputs {
  pincode: string;
  roofSqft: number;
  monthlyBillRs: number;
}

export interface SolarResult {
  district: string;
  ghi: number;
  capacityKw: number;
  annualGenerationKwh: number;
  annualSavingsRs: number;
  monthlySavingsRs: number;
  installCostRs: number;
  paybackYears: number;
  lifetimeSavingsRs: number;       // 25-year savings net of install cost
  monthlyConsumptionKwh: number;
  coverPct: number;                // % of monthly bill covered
  source: string;
  updatedAt: string;
}

export function calculatePayback(inputs: SolarInputs): SolarResult | { error: string } {
  const { pincode, roofSqft, monthlyBillRs } = inputs;
  if (!/^\d{6}$/.test(pincode)) {
    return { error: "Pincode must be 6 digits." };
  }
  if (!Number.isFinite(roofSqft) || roofSqft <= 0) {
    return { error: "Roof area must be a positive number (sq ft)." };
  }
  if (!Number.isFinite(monthlyBillRs) || monthlyBillRs <= 0) {
    return { error: "Monthly bill must be a positive number (₹)." };
  }

  const district = lookupDistrictByPincode(pincode);
  if (!district) {
    return {
      error: `No GHI data for pincode prefix ${pincode.slice(0, 3)}. Try a metro pincode while we expand coverage.`,
    };
  }
  const ghiValue = getGhi(district);
  if (ghiValue === null) {
    return { error: `District "${district}" missing from GHI dataset.` };
  }

  const capacityKw = Math.round((roofSqft / SQFT_PER_KW) * 10) / 10;
  const annualGenerationKwh = Math.round(capacityKw * ghiValue * 365 * SYSTEM_EFF);
  const annualSavingsRs = Math.round(annualGenerationKwh * TARIFF_PER_KWH);
  const monthlySavingsRs = Math.round(annualSavingsRs / 12);
  const installCostRs = Math.round(capacityKw * COST_PER_KW);
  const paybackYears = annualSavingsRs > 0 ? installCostRs / annualSavingsRs : Infinity;

  // Lifetime savings net of install cost, accounting for panel degradation.
  let lifetimeGen = 0;
  for (let y = 0; y < SYSTEM_LIFE_YEARS; y++) {
    lifetimeGen += annualGenerationKwh * Math.pow(1 - PANEL_DEGRADATION_PER_YEAR, y);
  }
  const lifetimeSavingsRs = Math.round(lifetimeGen * TARIFF_PER_KWH - installCostRs);

  const monthlyConsumptionKwh = monthlyBillRs / TARIFF_PER_KWH;
  const monthlyGenKwh = annualGenerationKwh / 12;
  const coverPct = Math.min(100, Math.round((monthlyGenKwh / monthlyConsumptionKwh) * 100));

  return {
    district,
    ghi: ghiValue,
    capacityKw,
    annualGenerationKwh,
    annualSavingsRs,
    monthlySavingsRs,
    installCostRs,
    paybackYears: Math.round(paybackYears * 10) / 10,
    lifetimeSavingsRs,
    monthlyConsumptionKwh: Math.round(monthlyConsumptionKwh),
    coverPct,
    source: "MNRE Solar Atlas + India Post pincode",
    updatedAt: new Date().toISOString(),
  };
}
