/**
 * Desafio Pilates de Parede - 28 Dias
 * Service Worker para funcionamento 100% Offline (PWA)
 */

const CACHE_NAME = 'pilates-parede-v2.0';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './css/animations.css',
  './js/data.js',
  './js/svg-exercises.js',
  './js/audio.js',
  './js/storage.js',
  './js/player.js',
  './js/app.js',
  './assets/avatar-beatriz.svg',
  './assets/icons/app-icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Ignora requisições de outras origens ou de extensões
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Estratégia Network-First: busca a versão mais recente na rede.
  // Se estiver sem conexão (offline), utiliza o cache local.
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          return cached || caches.match('./index.html');
        });
      })
  );
});
