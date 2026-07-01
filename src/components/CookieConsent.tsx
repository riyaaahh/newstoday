'use client'

import Script from 'next/script'

import { useStoredValue, writeStoredValue } from '@/lib/clientStorage'

const KEY = 'cookie-consent'

// Loads Google Analytics only after explicit consent. Cookieless Vercel
// Analytics is handled separately and needs no banner.
export function CookieConsent({
  gaId,
  labels,
}: {
  gaId?: string
  labels: { text: string; accept: string; decline: string }
}) {
  const consent = useStoredValue('local', KEY)

  // Nothing to consent to if GA isn't configured.
  if (!gaId) return null

  return (
    <>
      {consent === 'yes' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
      {consent == null && (
        <div className="consent" role="dialog" aria-label="Cookie consent">
          <span>{labels.text}</span>
          <div className="consent-actions">
            <button type="button" onClick={() => writeStoredValue('local', KEY, 'yes')}>
              {labels.accept}
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() => writeStoredValue('local', KEY, 'no')}
            >
              {labels.decline}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
