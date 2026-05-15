// data.gov.in resource UUIDs. Add new IDs here as datasets are confirmed.
// Discover via https://www.data.gov.in/ catalog search.
export const RESOURCES = {
  // CPCB real-time AQI from monitoring stations across India.
  AQI_REALTIME: "3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69",
  // RIVER_QUALITY: "<TBD — search 'river water quality' on data.gov.in>",
  // ACCIDENT_BLACKSPOTS: "<TBD or fall back to bundled CSV>",
} as const;

export type ResourceKey = keyof typeof RESOURCES;
