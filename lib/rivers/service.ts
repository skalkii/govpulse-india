import "server-only";
import stationsJson from "@/data/river-stations.json";

export interface RiverStation {
  id: string;
  state: string;
  river: string;
  station: string;
  do: number;   // mg/L dissolved oxygen
  bod: number;  // mg/L biochemical oxygen demand
  ph: number;
  fc: number;   // MPN/100mL fecal coliform
}

interface StationsFile {
  _meta: Record<string, unknown>;
  stations: RiverStation[];
}

const data = stationsJson as StationsFile;

export type CpcbClass = "A" | "B" | "C" | "D" | "E" | "Below E";

export interface ClassRating {
  cls: CpcbClass;
  label: string;
  bestUse: string;
  color: string;
}

const RATINGS: Record<CpcbClass, ClassRating> = {
  A: { cls: "A", label: "Class A", bestUse: "Drinking, no treatment", color: "#10b981" },
  B: { cls: "B", label: "Class B", bestUse: "Bathing", color: "#3b82f6" },
  C: { cls: "C", label: "Class C", bestUse: "Drinking after conventional treatment", color: "#f59e0b" },
  D: { cls: "D", label: "Class D", bestUse: "Wildlife and fisheries", color: "#a855f7" },
  E: { cls: "E", label: "Class E", bestUse: "Irrigation / industrial cooling", color: "#ef4444" },
  "Below E": { cls: "Below E", label: "Below E", bestUse: "Not safe for any designated use", color: "#7f1d1d" },
};

// CPCB designated best-use criteria (DO, BOD, FC).
// Class is the BEST a station qualifies for when *all* limits are met.
export function classify(s: Pick<RiverStation, "do" | "bod" | "ph" | "fc">): ClassRating {
  const phOk = s.ph >= 6.5 && s.ph <= 8.5;
  if (phOk && s.do >= 6 && s.bod <= 2 && s.fc <= 50) return RATINGS.A;
  if (phOk && s.do >= 5 && s.bod <= 3 && s.fc <= 500) return RATINGS.B;
  if (phOk && s.do >= 4 && s.bod <= 3 && s.fc <= 5000) return RATINGS.C;
  if (s.ph >= 6.5 && s.ph <= 8.5 && s.do >= 4) return RATINGS.D;
  if (s.ph >= 6.0 && s.ph <= 8.5) return RATINGS.E;
  return RATINGS["Below E"];
}

export function listStates(): string[] {
  const set = new Set<string>();
  for (const s of data.stations) set.add(s.state);
  return [...set].sort();
}

export function stationsByState(state: string): RiverStation[] {
  return data.stations
    .filter((s) => s.state === state)
    .sort((a, b) => a.river.localeCompare(b.river) || a.station.localeCompare(b.station));
}

export function getMeta(): Record<string, unknown> {
  return data._meta;
}

export function worstParameter(s: RiverStation): string {
  // Pick the parameter most out-of-spec for Class B (bathing) as the headline issue.
  const issues: Array<{ key: string; severity: number }> = [];
  if (s.do < 5) issues.push({ key: `Low DO (${s.do} mg/L)`, severity: (5 - s.do) / 5 });
  if (s.bod > 3) issues.push({ key: `High BOD (${s.bod} mg/L)`, severity: (s.bod - 3) / 3 });
  if (s.fc > 500) issues.push({ key: `High coliform (${s.fc.toLocaleString("en-IN")} MPN)`, severity: Math.log10(s.fc / 500) });
  if (s.ph < 6.5 || s.ph > 8.5) issues.push({ key: `pH ${s.ph}`, severity: 1 });
  if (issues.length === 0) return "All parameters within bathing-class limits";
  issues.sort((a, b) => b.severity - a.severity);
  return issues[0].key;
}
