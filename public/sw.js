/* NewsToday service worker: push + PWA offline fallback */
const CACHE = 'newstoday-v1'
const OFFLINE_URL = '/offline'

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open(CACHE).then((c) => c.add(OFFLINE_URL)))
})

self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

// Network-first for public page navigations; fall back to the cached offline
// page when truly offline. Non-navigation requests are left untouched (news must
// stay fresh). Admin and API navigations are never intercepted, so a network
// blip can't swap the Payload admin for the offline page.
self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET' || req.mode !== 'navigate') return
  const path = new URL(req.url).pathname
  if (path.startsWith('/admin') || path.startsWith('/api')) return
  event.respondWith(
    fetch(req).catch(() =>
      caches
        .match(OFFLINE_URL)
        .then((res) => res || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })),
    ),
  )
})

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = {}
  }
  const title = data.title || 'NewsToday'
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || '',
      tag: data.url || 'newstoday',
      data: { url: data.url || '/' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url === url && 'focus' in client) return client.focus()
      }
      return self.clients.openWindow(url)
    }),
  )
})
