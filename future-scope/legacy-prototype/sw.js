/* ==========================================
   JEJE-OLA Properties - PWA Service Worker
   Offline Awareness & Caching Shell
   ========================================== */

const CACHE_NAME = 'jeje-ola-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/variables.css',
  '/css/base.css',
  '/css/components.css',
  '/css/views.css',
  '/js/app.js',
  '/js/onboarding.js',
  '/js/investor-dashboard.js',
  '/js/staff-dashboard.js',
  '/js/finance-dashboard.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
