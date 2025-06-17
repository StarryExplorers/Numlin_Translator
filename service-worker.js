const cacheName = 'numlin-v1';
const filesToCache = [
  './',
  './index.html',
  './what-is-numlin.html',
  './manifest.json',
  './icon-512.png',
  './icon-192.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(filesToCache))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
