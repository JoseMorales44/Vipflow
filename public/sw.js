// VipFlow Service Worker - Dev-safe version
// Clears all caches on activation to prevent stale chunk issues

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(cacheNames.map((name) => caches.delete(name)))
    ).then(() => self.clients.claim())
  );
});

// No fetch interception - let the browser handle all requests normally
