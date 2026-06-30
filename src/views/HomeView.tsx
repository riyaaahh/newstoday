import { ArticleCard } from '@/components/ArticleCard'
import { SiteHeader } from '@/components/SiteHeader'
import { t } from '@/lib/i18n'
import type { Locale } from '@/lib/locale'
import { getCategories, getLatestArticles } from '@/lib/queries'

export async function HomeView({ locale }: { locale: Locale }) {
  const [articles, categories] = await Promise.all([
    getLatestArticles(locale, { limit: 13 }),
    getCategories(locale),
  ])
  const [lead, ...rest] = articles

  return (
    <>
      <SiteHeader locale={locale} categories={categories} altPath="/" />
      <main className="container">
        {articles.length === 0 ? (
          <p className="empty">{t(locale, 'empty')}</p>
        ) : (
          <>
            {lead && <ArticleCard locale={locale} article={lead} variant="lead" />}
            <h2 className="section-title">{t(locale, 'latest')}</h2>
            <div className="grid">
              {rest.map((a) => (
                <ArticleCard key={a.id} locale={locale} article={a} />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  )
}
