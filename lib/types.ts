// Shared, module-agnostic types. Module-specific types live next to their route.

export type ToolSlug =
  | "aqi"
  | "rivers"
  | "rainfall"
  | "tolls"
  | "black-spots"
  | "solar";

export interface ApiError {
  error: string;
  source?: string;
}

export interface ApiSuccess<T> {
  data: T;
  source: string;
  updatedAt: string;
}

export type ApiResult<T> = ApiSuccess<T> | ApiError;
