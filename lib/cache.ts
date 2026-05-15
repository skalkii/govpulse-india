import { LRUCache } from "lru-cache";

const caches = new Map<string, LRUCache<string, NonNullable<unknown>>>();

export function getCache(name: string, ttlMs: number): LRUCache<string, NonNullable<unknown>> {
  let cache = caches.get(name);
  if (!cache) {
    cache = new LRUCache<string, NonNullable<unknown>>({ max: 500, ttl: ttlMs });
    caches.set(name, cache);
  }
  return cache;
}

export async function cached<T extends NonNullable<unknown>>(
  cacheName: string,
  key: string,
  ttlMs: number,
  fn: () => Promise<T>
): Promise<T> {
  const cache = getCache(cacheName, ttlMs);
  const hit = cache.get(key);
  if (hit !== undefined) return hit as T;
  const fresh = await fn();
  cache.set(key, fresh);
  return fresh;
}

export const TTL = {
  AQI_MS: 10 * 60 * 1000,
  RIVERS_MS: 24 * 60 * 60 * 1000,
} as const;
