import Image from 'next/image'
import Link from 'next/link'

import { t } from '@/lib/i18n'
import { localeLabels, localePath, otherLocale, type Locale } from '@/lib/locale'
import { getBreakingArticle } from '@/lib/queries'
import type { Category } from '@/payload-types'

import { BreakingBanner } from './BreakingBanner'

export async function SiteHeader({
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
  const breaking = await getBreakingArticle(locale)
  const breakingCat =
    breaking && typeof breaking.category === 'object' ? breaking.category : null
  const breakingHref = breakingCat
    ? localePath(locale, `/${breakingCat.slug}/${breaking!.slug}`)
    : null

  return (
    <>
      {breaking && breakingHref && (
        <BreakingBanner href={breakingHref} label={t(locale, 'breaking')} headline={breaking.title} />
      )}
      <header className="site-header">
        <div className="container header-inner">
          <Link href={localePath(locale, '/')} className="brand" aria-label="News Today Malayalam">
            <Image
              src="/logo.png"
              alt="News Today Malayalam"
              width={413}
              height={220}
              priority
              className="brand-logo"
            />
          </Link>
          <nav className="sections" aria-label="Sections">
            {categories.map((c) => (
              <Link key={c.id} href={localePath(locale, `/${c.slug}`)}>
                {c.name}
              </Link>
            ))}
            <Link href={localePath(locale, '/videos')}>{t(locale, 'videos')}</Link>
          </nav>
          <form className="search-box" action={localePath(locale, '/search')} role="search">
            <input
              type="search"
              name="q"
              placeholder={t(locale, 'searchPlaceholder')}
              aria-label={t(locale, 'search')}
            />
          </form>
          <Link className="lang-switch" href={localePath(other, altPath)} hrefLang={other}>
            {localeLabels[other]}
          </Link>
        </div>
      </header>
    </>
  )
}
