import type { ForecastBucket } from "./forecast";
import type { AqiBucket, Pollutant } from "./breakpoints";

export interface StationReading {
  station: string;
  state: string;
  aqi: number;
  dominantPollutant: Pollutant;
  pollutants: Array<{ pollutant: Pollutant; concentration: number; subIndex: number }>;
  lastUpdate: string;
}

export interface AqiResult {
  city: string;
  aqi: number;
  bucket: AqiBucket;
  dominantPollutant: Pollutant | null;
  stations: StationReading[];
  forecast: ForecastBucket[];
  source: string;
  updatedAt: string;
}
