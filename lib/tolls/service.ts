import "server-only";
import plazasJson from "@/data/toll-plazas.json";
import citiesJson from "@/data/city-coords.json";

export type VehicleClass = "car" | "lcv" | "bus_truck" | "axle_3" | "axle_4plus";

export interface Plaza {
  id: string;
  name: string;
  state: string;
  highway: string;
  lat: number;
  lng: number;
  rates: Record<VehicleClass, number>;
}

interface PlazasFile {
  _meta: Record<string, unknown>;
  plazas: Plaza[];
}
interface CitiesFile {
  _meta: Record<string, unknown>;
  cities: Record<string, { lat: number; lng: number }>;
}

const plazasData = plazasJson as PlazasFile;
const citiesData = citiesJson as CitiesFile;

export function listCities(): string[] {
  return Object.keys(citiesData.cities).sort();
}

function toRad(d: number): number {
  return (d * Math.PI) / 180;
}

// Haversine great-circle distance in km.
function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// Cross-track distance from point P to great-circle line A→B (in km).
function crossTrackKm(
  p: { lat: number; lng: number },
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const d13 = haversine(a, p) / R;
  const bearing = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δλ = toRad(lng2 - lng1);
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    return Math.atan2(y, x);
  };
  const θ13 = bearing(a.lat, a.lng, p.lat, p.lng);
  const θ12 = bearing(a.lat, a.lng, b.lat, b.lng);
  return Math.abs(Math.asin(Math.sin(d13) * Math.sin(θ13 - θ12)) * R);
}

// Along-track distance from A toward B at the foot-of-perpendicular of P (in km).
function alongTrackKm(
  p: { lat: number; lng: number },
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const d13 = haversine(a, p) / R;
  const xt = crossTrackKm(p, a, b) / R;
  return Math.acos(Math.cos(d13) / Math.cos(xt)) * R;
}

const CORRIDOR_BUFFER_KM = 60;

export interface TollEstimate {
  from: string;
  to: string;
  vehicle: VehicleClass;
  routeKm: number;
  totalRs: number;
  plazas: Array<Plaza & { rate: number }>;
  source: string;
  updatedAt: string;
}

export function estimateToll(
  from: string,
  to: string,
  vehicle: VehicleClass
): TollEstimate | { error: string } {
  const a = citiesData.cities[from];
  const b = citiesData.cities[to];
  if (!a || !b) {
    return { error: `Unknown city: ${!a ? from : to}. Pick from the list.` };
  }
  if (from === to) {
    return { error: "Origin and destination are the same." };
  }
  const routeKm = Math.round(haversine(a, b) * 1.3); // road factor over crow-flies
  const corridorLength = haversine(a, b);

  const onCorridor: Array<Plaza & { rate: number; alongKm: number }> = [];
  for (const p of plazasData.plazas) {
    const xt = crossTrackKm(p, a, b);
    if (xt > CORRIDOR_BUFFER_KM) continue;
    const along = alongTrackKm(p, a, b);
    if (along < -10 || along > corridorLength + 10) continue;
    onCorridor.push({ ...p, rate: p.rates[vehicle], alongKm: along });
  }
  onCorridor.sort((x, y) => x.alongKm - y.alongKm);

  const totalRs = onCorridor.reduce((s, p) => s + p.rate, 0);

  return {
    from,
    to,
    vehicle,
    routeKm,
    totalRs,
    plazas: onCorridor.map(({ alongKm: _along, ...rest }) => rest),
    source: "NHAI Fee Notification 2025",
    updatedAt: new Date().toISOString(),
  };
}

export const VEHICLE_LABELS: Record<VehicleClass, string> = {
  car: "Car / Jeep / Van",
  lcv: "LCV / Mini-bus",
  bus_truck: "Bus / 2-axle Truck",
  axle_3: "3-axle Truck",
  axle_4plus: "4+ axle / HCM",
};
