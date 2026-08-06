const CACHE_NAME = 'parilink-cache-v4';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap'
];

// --- INSTALL: Cache only truly static assets ---
self.addEventListener('install', event => {
  console.log('[SW] Installing PariLink Service Worker v4...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Some files failed to cache:', err);
      }))
  );
  self.skipWaiting();
});

// --- ACTIVATE: Delete ALL old caches ---
self.addEventListener('activate', event => {
  console.log('[SW] Activating new Service Worker v4...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// --- FETCH: Network-First for everything (prevents stale JS) ---
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests (POST API calls etc.)
  if (event.request.method !== 'GET') return;
  
  // Skip API calls entirely — let them go straight to network
  if (url.pathname.startsWith('/api')) return;

  // Network-first strategy: try network, fall back to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed — serve from cache
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // For HTML pages, return the shell
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// --- Background Sync ---
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({ type: 'NETWORK_RESTORED' });
  });
}

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] PariLink Service Worker v4 loaded.');
