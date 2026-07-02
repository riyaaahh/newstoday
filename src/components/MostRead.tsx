import Link from 'next/link'

import { t } from '@/lib/i18n'
import { localePath, type Locale } from '@/lib/locale'
import type { Article, Category } from '@/payload-types'

export function MostRead({ locale, articles }: { locale: Locale; articles: Article[] }) {
  if (articles.length === 0) return null

  return (
    <section className="most-read">
      <h2 className="section-title">{t(locale, 'mostRead')}</h2>
      <ol className="most-read-list">
        {articles.map((a, i) => {
          const cat = typeof a.category === 'object' ? (a.category as Category) : null
          const href = cat ? localePath(locale, `/${cat.slug}/${a.slug}`) : '#'
          return (
            <li key={a.id}>
              <span className="rank">{i + 1}</span>
              <Link href={href}>{a.title}</Link>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
