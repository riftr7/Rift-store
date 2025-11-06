const CACHE_NAME = 'rift-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/spinner.css',
  '/js/app.js',
  '/assets/rift-logo.jpg',
  '/assets/all/favicon.ico',
  // Add other static assets as needed, but not Google Sheets
];

// Install event: cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serve from cache if available, else fetch
self.addEventListener('fetch', event => {
  // Skip caching for Google Sheets requests
  if (event.request.url.includes('docs.google.com/spreadsheets')) {
    return; // Do not cache, always fetch live
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
