/* Offline shell: caches first visit; updates when CACHE_VERSION changes. */
const CACHE_VERSION = "v11";
const CORE = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/config.js",
  "./js/app.js",
  "./manifest.json",
  "./assets/placeholder-heart.svg",
  "./assets/favicon-theme.svg",
  "./assets/theme-lily.svg",
  "./assets/theme-hydrangea.svg",
  "./assets/theme-mogu.svg",
  "./assets/theme-oishi.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const res = await fetch(request);
        if (res.ok && request.url.startsWith(self.location.origin)) {
          const cache = await caches.open(CACHE_VERSION);
          await cache.put(request, res.clone());
        }
        return res;
      } catch {
        if (request.mode === "navigate") {
          const fb = (await caches.match("index.html")) || (await caches.match("./index.html"));
          if (fb) return fb;
        }
        throw new Error("offline");
      }
    })()
  );
});
