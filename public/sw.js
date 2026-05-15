// Minimal service worker for GovPulse India.
// - Pre-cache app shell on install.
// - Network-first for HTML / API (fresh data wins, fall back to cache offline).
// - Cache-first for static assets (images, fonts, JS, CSS).

const VERSION = "v1";
const SHELL_CACHE = `gp-shell-${VERSION}`;
const RUNTIME_CACHE = `gp-runtime-${VERSION}`;

const SHELL_URLS = ["/", "/aqi", "/rivers", "/rainfall", "/solar", "/about", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => Promise.all(SHELL_URLS.map((u) => cache.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isHtml(req) {
  const accept = req.headers.get("accept") || "";
  return req.mode === "navigate" || accept.includes("text/html");
}

function isApi(url) {
  return url.pathname.startsWith("/api/");
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin && !url.hostname.endsWith("openstreetmap.org")) return;

  // Network-first for HTML + API: keep fresh, fall back to cache when offline.
  if (isHtml(req) || isApi(url)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("/")))
    );
    return;
  }

  // Cache-first for everything else (CSS, JS, images, fonts, OSM tiles).
  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (!res || res.status !== 200) return res;
        const copy = res.clone();
        caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
        return res;
      });
    })
  );
});
