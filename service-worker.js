const CACHE_NAME="calcul-plancher-v5-logo-sncf";
const FILES=["./","./index.html","./css/style.css","./js/config.js","./js/storage.js","./js/algorithm.js","./js/ui.js","./js/app.js","./manifest.json","./favicon.png","./icons/logo-sncf.png","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener("install",event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(FILES)));});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))));self.clients.claim();});
self.addEventListener("fetch",event=>{event.respondWith(caches.match(event.request).then(response=>response||fetch(event.request)));});
