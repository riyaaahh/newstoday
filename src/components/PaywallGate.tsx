'use client'

import { useEffect } from 'react'

import { useStoredValue, writeStoredValue } from '@/lib/clientStorage'

const METER_KEY = 'premium-meter'
const SUB_KEY = 'subscribed'
const parsedLimit = Number(process.env.NEXT_PUBLIC_PAYWALL_FREE_LIMIT)
const FREE_LIMIT = Number.isFinite(parsedLimit) && parsedLimit >= 0 ? parsedLimit : 3

const parseIds = (v: string | null): number[] =>
  v
    ? v
        .split(',')
        .map(Number)
        .filter((n) => Number.isInteger(n))
    : []

type Labels = { title: string; text: string; cta: string }

export function PaywallGate({
  articleId,
  premium,
  labels,
  children,
}: {
  articleId: number
  premium: boolean
  labels: Labels
  children: React.ReactNode
}) {
  const meterRaw = useStoredValue('local', METER_KEY)
  const subscribed = useStoredValue('local', SUB_KEY) === 'yes'
  const ids = parseIds(meterRaw)
  const alreadyRead = ids.includes(articleId)
  const locked = premium && !subscribed && !alreadyRead && ids.length >= FREE_LIMIT

  useEffect(() => {
    // Consume one free read for this premium article (read fresh from storage
    // to avoid stale closures). No setState — storage write only.
    if (!premium || subscribed) return
    const cur = parseIds(window.localStorage.getItem(METER_KEY))
    if (!cur.includes(articleId) && cur.length < FREE_LIMIT) {
      writeStoredValue('local', METER_KEY, [...cur, articleId].join(','))
    }
  }, [premium, subscribed, articleId])

  if (!premium) return <>{children}</>

  return (
    <div className={locked ? 'paywall-gate locked' : 'paywall-gate'}>
      {children}
      {locked && (
        <div className="paywall">
          <h3>{labels.title}</h3>
          <p>{labels.text}</p>
          <button type="button" onClick={() => writeStoredValue('local', SUB_KEY, 'yes')}>
            {labels.cta}
          </button>
        </div>
      )}
    </div>
  )
}
