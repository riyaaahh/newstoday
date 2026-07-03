'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Periodically re-fetches the RSC payload so new live-blog updates appear
// without a manual reload. Mounted only on live articles.
export function LiveRefresher({ intervalMs = 30000 }: { intervalMs?: number }) {
  const router = useRouter()
  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs)
    return () => clearInterval(id)
  }, [router, intervalMs])
  return null
}
