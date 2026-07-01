import Link from 'next/link'

import { t } from '@/lib/i18n'
import { localePath, type Locale } from '@/lib/locale'

import { NewsletterSignup } from './NewsletterSignup'

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <NewsletterSignup
          locale={locale}
          labels={{
            title: t(locale, 'newsletterTitle'),
            cta: t(locale, 'newsletterCta'),
            placeholder: t(locale, 'emailPlaceholder'),
            subscribe: t(locale, 'subscribe'),
            subscribed: t(locale, 'subscribed'),
            error: t(locale, 'subscribeError'),
          }}
        />
        <div className="footer-meta">
          <Link href={localePath(locale, '/')} className="brand">
            News<span>Today</span>
          </Link>
          <p>© 2026 NewsToday</p>
        </div>
      </div>
    </footer>
  )
}
