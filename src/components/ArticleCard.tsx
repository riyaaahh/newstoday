import Link from 'next/link'

import { formatDate } from '@/lib/i18n'
import { localePath, type Locale } from '@/lib/locale'
import type { Article, Category } from '@/payload-types'

import { MediaImage } from './MediaImage'

export function ArticleCard({
  locale,
  article,
  variant,
}: {
  locale: Locale
  article: Article
  variant?: 'lead'
}) {
  const category = typeof article.category === 'object' ? (article.category as Category) : null
  const href = category ? localePath(locale, `/${category.slug}/${article.slug}`) : '#'
  const isLead = variant === 'lead'

  return (
    <article className={isLead ? 'card card-lead' : 'card'}>
      <Link href={href} className="card-media" aria-label={article.title}>
        <MediaImage
          media={article.heroImage}
          sizes={isLead ? '100vw' : '(max-width: 700px) 100vw, 33vw'}
          priority={isLead}
        />
      </Link>
      <div className="card-body">
        {category && <span className="card-cat">{category.name}</span>}
        <h2 className="card-title">
          <Link href={href}>{article.title}</Link>
        </h2>
        {article.excerpt && <p className="card-excerpt">{article.excerpt}</p>}
        {article.publishedAt && (
          <time className="card-date" dateTime={article.publishedAt}>
            {formatDate(locale, article.publishedAt)}
          </time>
        )}
      </div>
    </article>
  )
}
