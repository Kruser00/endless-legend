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
  // We only want to apply this strategy to navigation requests (i.e., for the HTML page)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        // 1. Serve from cache (stale)
        return cache.match(event.request).then(cachedResponse => {
          // 2. Fetch from network to revalidate (and update cache)
          const fetchPromise = fetch(event.request).then(networkResponse => {
            // Check if we received a valid response
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });

          // Return cached response immediately if available, otherwise wait for network
          return cachedResponse || fetchPromise;
        });
      })
    );
  } else if (APP_SHELL_URLS.includes(new URL(event.request.url).pathname)) {
    // For other app shell assets, use a cache-first strategy
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  } else {
    // For all other requests (API calls, images, etc.), just fetch from the network.
    return;
  }
});