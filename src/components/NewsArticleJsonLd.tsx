import { absoluteUrl, localePath, type Locale } from '@/lib/locale'
import type { Article, User } from '@/payload-types'

export function NewsArticleJsonLd({
  locale,
  article,
  path,
}: {
  locale: Locale
  article: Article
  /** Locale-relative path of this article, e.g. '/kerala/foo'. */
  path: string
}) {
  const hero = typeof article.heroImage === 'object' ? article.heroImage : null
  const image = hero?.url ? [absoluteUrl(hero.url)] : undefined

  const authors = (article.authors ?? [])
    .filter((a): a is User => typeof a === 'object' && a !== null)
    .map((a) => ({ '@type': 'Person', name: a.name }))

  const data = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt || undefined,
    image,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt,
    inLanguage: locale,
    author: authors.length ? authors : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(localePath(locale, path)),
    },
  }

  // Escape '<' so editor content containing "</script>" cannot break out of the tag.
  const json = JSON.stringify(data).replace(/</g, '\\u003c')

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
