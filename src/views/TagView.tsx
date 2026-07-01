import { notFound } from 'next/navigation'

import { ArticleCard } from '@/components/ArticleCard'
import { SiteHeader } from '@/components/SiteHeader'
import { t } from '@/lib/i18n'
import { otherLocale, type Locale } from '@/lib/locale'
import { getArticlesByTag, getCategories, getTag, getTagAlternatePaths } from '@/lib/queries'

export async function TagView({ locale, slug }: { locale: Locale; slug: string }) {
  const tag = await getTag(locale, slug)
  if (!tag) notFound()

  const [articles, categories, alt] = await Promise.all([
    getArticlesByTag(locale, slug),
    getCategories(locale),
    getTagAlternatePaths(tag.id),
  ])
  const other = otherLocale(locale)

  return (
    <>
      <SiteHeader locale={locale} categories={categories} altPath={alt?.[other] ?? '/'} />
      <main className="container">
        <p className="tag-eyebrow">{t(locale, 'tag')}</p>
        <h1 className="page-title">{tag.name}</h1>
        {articles.length === 0 ? (
          <p className="empty">{t(locale, 'empty')}</p>
        ) : (
          <div className="grid">
            {articles.map((a) => (
              <ArticleCard key={a.id} locale={locale} article={a} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
