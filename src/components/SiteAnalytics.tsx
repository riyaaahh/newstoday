import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { t } from '@/lib/i18n'
import type { Locale } from '@/lib/locale'

import { CookieConsent } from './CookieConsent'
import { ServiceWorkerRegister } from './ServiceWorkerRegister'

export function SiteAnalytics({ locale }: { locale: Locale }) {
  return (
    <>
      <ServiceWorkerRegister />
      {/* Cookieless — no consent required. */}
      <Analytics />
      <SpeedInsights />
      <CookieConsent
        gaId={process.env.NEXT_PUBLIC_GA_ID}
        adsenseClient={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        labels={{
          text: t(locale, 'consentText'),
          accept: t(locale, 'accept'),
          decline: t(locale, 'decline'),
        }}
      />
    </>
  )
}
