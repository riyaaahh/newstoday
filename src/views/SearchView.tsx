import { ArticleCard } from '@/components/ArticleCard'
import { SiteHeader } from '@/components/SiteHeader'
import { t } from '@/lib/i18n'
import type { Locale } from '@/lib/locale'
import { getCategories, searchArticles } from '@/lib/queries'

export async function SearchView({ locale, q }: { locale: Locale; q: string }) {
  const query = q.trim()
  const [results, categories] = await Promise.all([
    searchArticles(locale, query),
    getCategories(locale),
  ])
  const altPath = query ? `/search?q=${encodeURIComponent(query)}` : '/search'

  return (
    <>
      <SiteHeader locale={locale} categories={categories} altPath={altPath} />
      <main className="container">
        <h1 className="page-title">
          {t(locale, 'search')}
          {query ? `: “${query}”` : ''}
        </h1>
        {!query ? null : results.length === 0 ? (
          <p className="empty">{t(locale, 'noResults')}</p>
        ) : (
          <div className="grid">
            {results.map((a) => (
              <ArticleCard key={a.id} locale={locale} article={a} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
