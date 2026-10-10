/* Netwells PWA service worker — network-first with an offline cache fallback.
   Deliberately simple and safe: never caches /api/ calls, always prefers the
   network when online (so updates land), and serves the cached app shell when
   offline. */
const CACHE = 'netwell-shell-v1';
const SHELL = ['/', '/index.html', '/manifest.json', '/favicon.png'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Never intercept the API — reports/auth must always hit the network.
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(() =>
        caches
          .match(request)
          .then((cached) => cached || (request.mode === 'navigate' ? caches.match('/index.html') : undefined))
      )
  );
});
