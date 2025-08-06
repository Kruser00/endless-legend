const CACHE_NAME = 'gemini-rogue-v2';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700&display=swap'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

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
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Let the browser handle requests for scripts and assets, 
  // as Vite will handle caching via headers for production builds.
  // We only serve the main pages from cache for offline support.
  if (URLS_TO_CACHE.includes(new URL(event.request.url).pathname) || event.request.url.startsWith('https://fonts.googleapis.com')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  } else {
     event.respondWith(fetch(event.request));
  }
});
