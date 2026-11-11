// Версию меняем при каждом обновлении — телефон увидит новый sw.js и обновит приложение
const CACHE = 'turkce-quest-v1.7';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './data.js', './manifest.webmanifest',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' })))));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Сеть в приоритете и МИМО HTTP-кэша браузера — всегда свежая версия; без интернета — из кэша
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const sameOrigin = e.request.url.startsWith(self.location.origin);
  e.respondWith(
    (sameOrigin ? fetch(e.request.url, { cache: 'no-store', credentials: 'same-origin' }) : fetch(e.request)).then((r) => {
      if (r.ok && (sameOrigin || e.request.url.includes('fonts.g'))) {
        const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy));
      }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((m) => m || caches.match('./index.html')))
  );
});
