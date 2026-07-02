import { notFound } from 'next/navigation'

import { ArticleCard } from '@/components/ArticleCard'
import { SiteHeader } from '@/components/SiteHeader'
import { t } from '@/lib/i18n'
import { localePath, otherLocale, type Locale } from '@/lib/locale'
import { applyRedirect } from '@/lib/redirects'
import {
  getCategories,
  getCategory,
  getCategoryAlternatePaths,
  getLatestArticles,
} from '@/lib/queries'

export async function CategoryView({ locale, slug }: { locale: Locale; slug: string }) {
  const category = await getCategory(locale, slug)
  if (!category) {
    await applyRedirect(localePath(locale, `/${slug}`))
    notFound()
  }

  const [articles, categories, alt] = await Promise.all([
    getLatestArticles(locale, { limit: 24, categorySlug: slug }),
    getCategories(locale),
    getCategoryAlternatePaths(category.id),
  ])
  const other = otherLocale(locale)

  return (
    <>
      <SiteHeader locale={locale} categories={categories} altPath={alt?.[other] ?? '/'} />
      <main className="container">
        <h1 className="page-title">{category.name}</h1>
        {category.description && <p className="page-desc">{category.description}</p>}
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
