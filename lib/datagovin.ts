const BASE = "https://api.data.gov.in/resource";

export interface DataGovInOptions {
  resourceId: string;
  filters?: Record<string, string>;
  limit?: number;
  offset?: number;
}

export interface DataGovInResponse<T = Record<string, unknown>> {
  records: T[];
  total: number;
  count: number;
  offset: number;
  limit: number;
  status?: string;
  message?: string;
}

export async function fetchDataGovIn<T = Record<string, unknown>>(
  opts: DataGovInOptions
): Promise<DataGovInResponse<T>> {
  const { resourceId, filters = {}, limit = 1000, offset = 0 } = opts;
  const apiKey = process.env.DATAGOVIN_API_KEY;
  if (!apiKey) {
    throw new Error(
      "DATAGOVIN_API_KEY is not set. Add it to .env.local before calling data.gov.in."
    );
  }
  const params = new URLSearchParams({
    "api-key": apiKey,
    format: "json",
    limit: String(limit),
    offset: String(offset),
  });
  for (const [k, v] of Object.entries(filters)) {
    params.set(`filters[${k}]`, v);
  }
  const url = `${BASE}/${resourceId}?${params}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`data.gov.in ${res.status} for ${resourceId}`);
  }
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("json")) {
    throw new Error(`Non-JSON response from data.gov.in for ${resourceId}`);
  }
  return res.json() as Promise<DataGovInResponse<T>>;
}
