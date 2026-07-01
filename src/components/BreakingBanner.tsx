'use client'

import Link from 'next/link'

import { useStoredValue, writeStoredValue } from '@/lib/clientStorage'

const KEY = 'breaking-dismissed'

export function BreakingBanner({
  href,
  label,
  headline,
}: {
  href: string
  label: string
  headline: string
}) {
  // Dismissal is keyed by headline, so a new breaking story re-appears.
  const dismissed = useStoredValue('session', KEY)
  if (dismissed === headline) return null

  return (
    <div className="breaking" role="alert">
      <div className="container breaking-inner">
        <span className="breaking-label">{label}</span>
        <Link href={href} className="breaking-headline">
          {headline}
        </Link>
        <button
          type="button"
          aria-label="Dismiss"
          className="breaking-close"
          onClick={() => writeStoredValue('session', KEY, headline)}
        >
          ×
        </button>
      </div>
    </div>
  )
}
