let appVersion = 1;
let cacheName = `forever-ttt-v${appVersion}`;
let filesToBeCached = [
    'fabric.min.js',
    'lodash.core.min.js',
    'index.html',
    'build/index.js',
    '/',
    'style.css'
];

self.addEventListener('install', (e)=>{
    e.waitUntil(
        caches.open(cacheName).then((cache)=>{
            return cache.addAll(filesToBeCached)
        })
    );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});