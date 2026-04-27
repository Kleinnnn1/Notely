const CACHE_NAME = 'notely-v1'

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/'])
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    })
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached

      return fetch(e.request)
        .then((response) => {
          // Cache all successful GET requests
          if (
            e.request.method === 'GET' &&
            (e.request.url.includes('/assets/') ||
              e.request.url.includes('.js') ||
              e.request.url.includes('.css') ||
              e.request.url.includes('.png') ||
              e.request.url.includes('.json'))
          ) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, clone)
            })
          }
          return response
        })
        .catch(() => {
          // Offline fallback — return cached index.html for navigation requests
          if (e.request.mode === 'navigate') {
            return caches.match('/')
          }
        })
    })
  )
})