import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleBody } from '@/components/ArticleBody'
import { MediaImage } from '@/components/MediaImage'
import { NewsArticleJsonLd } from '@/components/NewsArticleJsonLd'
import { SiteHeader } from '@/components/SiteHeader'
import { formatDate, t } from '@/lib/i18n'
import { localePath, otherLocale, type Locale } from '@/lib/locale'
import { getArticle, getArticleAlternatePaths, getCategories } from '@/lib/queries'
import type { Category, Media, User } from '@/payload-types'

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
  if (!article) notFound()

  const [categories, alt] = await Promise.all([
    getCategories(locale),
    getArticleAlternatePaths(article.id),
  ])
  const other = otherLocale(locale)
  const category = typeof article.category === 'object' ? (article.category as Category) : null
  const hero = typeof article.heroImage === 'object' ? (article.heroImage as Media) : null
  const path = `/${categorySlug}/${slug}`
  const authors = (article.authors ?? []).filter(
    (a): a is User => typeof a === 'object' && a !== null,
  )

  return (
    <>
      <NewsArticleJsonLd locale={locale} article={article} path={path} />
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
                {t(locale, 'by')} {authors.map((a) => a.name).join(', ')}
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
        </article>
      </main>
    </>
  )
}
