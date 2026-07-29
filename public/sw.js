const CACHE = "sanket-cache-v2";
const STATIC_CACHE = "sanket-static-v2";
const API_CACHE = "sanket-api-v2";
const OFFLINE_URL = "/offline";

const STATIC_RESOURCES = [
  "/learn",
  "/curriculum",
  "/login",
  "/manifest.json",
  "/offline",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-192.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_RESOURCES)),
      caches.open(CACHE).then((cache) => cache.addAll(STATIC_RESOURCES)),
    ])
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE && k !== STATIC_CACHE && k !== API_CACHE)
            .map((k) => caches.delete(k))
        )
      ),
      self.clients.claim(),
    ])
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Mediapipe CDN — network-first with timeout
  if (url.hostname.includes("cdn.jsdelivr.net") || url.hostname.includes("googleapis.com") || url.hostname.includes("mediapipe")) {
    event.respondWith(networkFirstWithTimeout(request, 5000));
    return;
  }

  // API calls — network-first, fallback to cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Next.js static chunks — stale-while-revalidate
  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Static resources — cache-first
  if (STATIC_RESOURCES.includes(url.pathname) || url.pathname.startsWith("/icon-")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Everything else — network-first
  event.respondWith(networkFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const clone = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, clone));
    }
    return response;
  } catch {
    return caches.match(OFFLINE_URL) || new Response("Offline", { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const clone = response.clone();
      caches.open(API_CACHE).then((cache) => cache.put(request, clone));
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return caches.match(OFFLINE_URL) || new Response("Offline", { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, clone));
      }
      return response;
    })
    .catch(() => cached);
  return cached || fetchPromise;
}

async function networkFirstWithTimeout(request, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), timeoutMs)
  );
  try {
    const response = await Promise.race([fetch(request), timeoutPromise]);
    if (response.ok) {
      const clone = response.clone();
      caches.open(CACHE).then((cache) => cache.put(request, clone));
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response("Resource unavailable", { status: 503 });
  }
}
