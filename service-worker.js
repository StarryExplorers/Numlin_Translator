const CACHE_NAME = 'spark-numlin-v1';
const FILES_TO_CACHE = [
  'index.html',
  'manifest.json',
  'what-is-numlin.html',
  'service-worker.js',
  'icon-192.png',
  'icon-512.png'
];

// Cache essential files during install
self.addEventListener('install', event => {
  console.log('[SW] Installing and caching...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE).catch(err => {
        console.warn('[SW] Some files failed to cache', err);
      });
    })
  );
  self.skipWaiting();
});

// Remove old caches on activation
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log(`[SW] Deleting old cache: ${key}`);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResp => {
      return cachedResp || fetch(event.request);
    })
  );
});

// Listen for skip waiting message
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
