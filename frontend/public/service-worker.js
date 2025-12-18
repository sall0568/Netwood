const CACHE_NAME = "netwood-v1";
const urlsToCache = [
  "/",
  "/static/css/main.css",
  "/static/js/main.js",
  "/static/js/bundle.js",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png",
];

// Installation du Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache ouvert");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Suppression du cache obsolète:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Stratégie de cache: Network First, fallback to Cache
self.addEventListener("fetch", (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== "GET") return;

  // Ignorer les requêtes vers l'API backend
  if (event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Vérifier si la réponse est valide
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Cloner la réponse
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Si le réseau échoue, essayer le cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          // Si pas dans le cache, retourner une page offline
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
        });
      })
  );
});

// Synchronisation en arrière-plan
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Synchroniser les données quand la connexion revient
  console.log("Synchronisation des données...");
}

// Notifications Push
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Nouveau contenu disponible !",
    icon: "/logo192.png",
    badge: "/logo192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Voir",
        icon: "/logo192.png",
      },
      {
        action: "close",
        title: "Fermer",
        icon: "/logo192.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("NetWood", options));
});

// Gestion des clics sur les notifications
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});
