import Link from 'next/link'

import { localeLabels, localePath, otherLocale, type Locale } from '@/lib/locale'
import type { Category } from '@/payload-types'

export function SiteHeader({
  locale,
  categories,
  altPath = '/',
}: {
  locale: Locale
  categories: Category[]
  /** Locale-relative path of the equivalent page in the OTHER locale (for the language switcher). */
  altPath?: string
}) {
  const other = otherLocale(locale)
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={localePath(locale, '/')} className="brand">
          News<span>Today</span>
        </Link>
        <nav className="sections" aria-label="Sections">
          {categories.map((c) => (
            <Link key={c.id} href={localePath(locale, `/${c.slug}`)}>
              {c.name}
            </Link>
          ))}
        </nav>
        <Link className="lang-switch" href={localePath(other, altPath)} hrefLang={other}>
          {localeLabels[other]}
        </Link>
      </div>
    </header>
  )
}
