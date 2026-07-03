import Link from 'next/link'

import { localePath, type Locale } from '@/lib/locale'
import { youtubeThumb } from '@/lib/video'
import type { Article, Category } from '@/payload-types'

export function VideoCard({ locale, article }: { locale: Locale; article: Article }) {
  const category = typeof article.category === 'object' ? (article.category as Category) : null
  const href = category ? localePath(locale, `/${category.slug}/${article.slug}`) : '#'
  const thumb = article.videoUrl ? youtubeThumb(article.videoUrl) : null

  return (
    <article className="card video-card">
      <Link href={href} className="card-media video-thumb" aria-label={article.title}>
        {thumb && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" loading="lazy" />
        )}
        <span className="play-badge" aria-hidden="true">
          ▶
        </span>
      </Link>
      <div className="card-body">
        {category && <span className="card-cat">{category.name}</span>}
        <h2 className="card-title">
          <Link href={href}>{article.title}</Link>
        </h2>
      </div>
    </article>
  )
}
