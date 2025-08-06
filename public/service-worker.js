const CACHE_NAME = 'gemini-rogue-v3'; // Incremented version
const APP_SHELL_URLS = [
  '/',
  '/manifest.json'
];

// Install: Cache the app shell
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching App Shell');
      return cache.addAll(APP_SHELL_URLS);
    })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch: Use stale-while-revalidate for navigation requests
self.addEventListener('fetch', event => {
  // Apply to navigation requests (i.e., for the HTML page)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        // 1. Serve from cache (stale)
        return cache.match(event.request).then(cachedResponse => {
          // 2. Fetch from network to revalidate (and update cache)
          const fetchPromise = fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(err => {
            console.error('Service Worker: Fetch failed; returning offline page instead.', err);
            return cachedResponse; // If fetch fails, return cached response
          });

          // Return cached response immediately if available, otherwise wait for network
          return cachedResponse || fetchPromise;
        });
      })
    );
  } else if (APP_SHELL_URLS.some(url => event.request.url.endsWith(url))) {
    // For other app shell assets, use a cache-first strategy
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
  // For all other requests (API calls, Vite assets), do nothing and let the browser handle it.
});