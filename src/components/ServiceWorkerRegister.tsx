'use client'

import { useEffect } from 'react'

// Registers the service worker on load for PWA install + offline fallback.
// (PushSubscribe reuses this registration via navigator.serviceWorker.ready.)
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])
  return null
}
