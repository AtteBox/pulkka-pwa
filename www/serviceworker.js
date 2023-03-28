// @ts-nocheck
// The PWA service worker: https://web.dev/learn/pwa/service-workers/

importScripts("offlineFiles.js");
importScripts("version.js");

var cacheName = 'pulkkaPwa-v1';

self.addEventListener("install", (e) => {
  console.log("ServiceWorker: Install");
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      await cache.addAll(OFFLINE_FILES);
    })()
  );
});

self.addEventListener("activate", (e) => {
  console.log("ServiceWorker: Activate");
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      if (e.request.method === 'GET' && e.request.url.endsWith('/serviceworker.js/app-info')) {
        return new Response(JSON.stringify({ version: VERSION }));
      }
      const r = await caches.match(e.request);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      cache.put(e.request, response.clone());
      return response;
    })()
  );
});