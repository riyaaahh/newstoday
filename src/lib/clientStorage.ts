import { useSyncExternalStore } from 'react'

// SSR-safe subscription to browser storage. Same-tab writes notify via a custom
// event ('storage' only fires cross-tab); returns null on the server.
const subscribe = (cb: () => void) => {
  window.addEventListener('storage', cb)
  window.addEventListener('client-storage-write', cb)
  return () => {
    window.removeEventListener('storage', cb)
    window.removeEventListener('client-storage-write', cb)
  }
}

export function useStoredValue(area: 'local' | 'session', key: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => (area === 'local' ? window.localStorage : window.sessionStorage).getItem(key),
    () => null,
  )
}

export function writeStoredValue(area: 'local' | 'session', key: string, value: string) {
  ;(area === 'local' ? window.localStorage : window.sessionStorage).setItem(key, value)
  window.dispatchEvent(new Event('client-storage-write'))
}
