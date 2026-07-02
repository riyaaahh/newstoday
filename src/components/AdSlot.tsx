'use client'

import { useEffect, useRef } from 'react'

// Renders a Google AdSense unit when NEXT_PUBLIC_ADSENSE_CLIENT is set. The
// AdSense library itself is loaded only after cookie consent (see CookieConsent),
// so with no consent this slot stays empty and sets no cookies.
export function AdSlot({ slot, className }: { slot?: string; className?: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  const pushed = useRef(false)

  useEffect(() => {
    if (!client || !slot || pushed.current) return
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] }
      w.adsbygoogle = w.adsbygoogle || []
      w.adsbygoogle.push({})
      pushed.current = true
    } catch {
      /* library not loaded yet (no consent) — the push queues harmlessly */
    }
  }, [client])

  // A display ad unit needs both the client id and a slot id to render.
  if (!client || !slot) return null

  return (
    <div className={`ad-slot${className ? ` ${className}` : ''}`}>
      <span className="ad-label">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
