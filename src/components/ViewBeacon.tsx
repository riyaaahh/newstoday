'use client'

import { useEffect, useRef } from 'react'

// Fire-and-forget page-view ping. Uses sendBeacon so it survives navigation away.
export function ViewBeacon({ id }: { id: number }) {
  // Track the last id sent so navigation between articles (which reuses this
  // component instance in the App Router) still counts each distinct article.
  const lastSent = useRef<number | null>(null)

  useEffect(() => {
    if (lastSent.current === id) return
    lastSent.current = id
    const body = JSON.stringify({ id })
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/views', new Blob([body], { type: 'application/json' }))
      } else {
        void fetch('/api/views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        })
      }
    } catch {
      /* best effort */
    }
  }, [id])

  return null
}
