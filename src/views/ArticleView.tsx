import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AdSlot } from '@/components/AdSlot'
import { ArticleBody } from '@/components/ArticleBody'
import { ArticleCard } from '@/components/ArticleCard'
import { MediaImage } from '@/components/MediaImage'
import { NewsArticleJsonLd } from '@/components/NewsArticleJsonLd'
import { ShareButtons } from '@/components/ShareButtons'
import { SiteHeader } from '@/components/SiteHeader'
import { ViewBeacon } from '@/components/ViewBeacon'
import { formatDate, t } from '@/lib/i18n'
import { absoluteUrl, localePath, otherLocale, type Locale } from '@/lib/locale'
import { applyRedirect } from '@/lib/redirects'
import {
  getArticle,
  getArticleAlternatePaths,
  getCategories,
  getRelatedArticles,
} from '@/lib/queries'
import type { Category, Media, Tag, User } from '@/payload-types'

export async function ArticleView({
  locale,
  categorySlug,
  slug,
}: {
  locale: Locale
  categorySlug: string
  slug: string
}) {
  const article = await getArticle(locale, categorySlug, slug)
  if (!article) {
    await applyRedirect(localePath(locale, `/${categorySlug}/${slug}`))
    notFound()
  }

  const [categories, alt, related] = await Promise.all([
    getCategories(locale),
    getArticleAlternatePaths(article.id),
    getRelatedArticles(locale, article),
  ])
  const other = otherLocale(locale)
  const category = typeof article.category === 'object' ? (article.category as Category) : null
  const hero = typeof article.heroImage === 'object' ? (article.heroImage as Media) : null
  const path = `/${categorySlug}/${slug}`
  const authors = (article.authors ?? []).filter(
    (a): a is User => typeof a === 'object' && a !== null,
  )
  const tags = (article.tags ?? []).filter((tg): tg is Tag => typeof tg === 'object' && tg !== null)

  return (
    <>
      <NewsArticleJsonLd locale={locale} article={article} path={path} />
      <ViewBeacon id={article.id} />
      <SiteHeader locale={locale} categories={categories} altPath={alt?.[other] ?? '/'} />
      <main className="container article-page">
        <article>
          {category && (
            <Link className="article-cat" href={localePath(locale, `/${category.slug}`)}>
              {category.name}
            </Link>
          )}
          <h1 className="article-title">{article.title}</h1>
          {article.excerpt && <p className="article-excerpt">{article.excerpt}</p>}
          <div className="article-meta">
            {authors.length > 0 && (
              <span>
                {t(locale, 'by')}{' '}
                {authors.map((a, i) => (
                  <span key={a.id}>
                    {i > 0 && ', '}
                    <Link className="author-link" href={localePath(locale, `/author/${a.slug}`)}>
                      {a.name}
                    </Link>
                  </span>
                ))}
              </span>
            )}
            {article.publishedAt && (
              <time dateTime={article.publishedAt}>{formatDate(locale, article.publishedAt)}</time>
            )}
          </div>
          {hero && (
            <figure className="article-hero">
              <MediaImage media={hero} sizes="(max-width: 800px) 100vw, 800px" priority />
              {hero.alt && <figcaption>{hero.alt}</figcaption>}
            </figure>
          )}
          <ArticleBody content={article.content} />

          <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE} className="ad-inarticle" />

          {tags.length > 0 && (
            <div className="tag-list">
              {tags.map((tg) => (
                <Link key={tg.id} className="tag-chip" href={localePath(locale, `/tag/${tg.slug}`)}>
                  {tg.name}
                </Link>
              ))}
            </div>
          )}

          <ShareButtons
            url={absoluteUrl(localePath(locale, path))}
            title={article.title}
            labels={{ share: t(locale, 'share'), copy: t(locale, 'copy'), copied: t(locale, 'copied') }}
          />
        </article>

        {related.length > 0 && (
          <section className="related">
            <h2 className="section-title">{t(locale, 'relatedNews')}</h2>
            <div className="grid">
              {related.map((a) => (
                <ArticleCard key={a.id} locale={locale} article={a} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  )
}
