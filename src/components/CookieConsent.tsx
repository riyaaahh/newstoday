'use client'

import Script from 'next/script'

import { useStoredValue, writeStoredValue } from '@/lib/clientStorage'

const KEY = 'cookie-consent'

// Loads Google Analytics only after explicit consent. Cookieless Vercel
// Analytics is handled separately and needs no banner.
export function CookieConsent({
  gaId,
  adsenseClient,
  labels,
}: {
  gaId?: string
  adsenseClient?: string
  labels: { text: string; accept: string; decline: string }
}) {
  const consent = useStoredValue('local', KEY)

  // Nothing to consent to if neither GA nor ads are configured.
  if (!gaId && !adsenseClient) return null

  return (
    <>
      {consent === 'yes' && gaId && (
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
      {consent === 'yes' && adsenseClient && (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
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
