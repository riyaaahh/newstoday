import { ArticleCard } from '@/components/ArticleCard'
import { SiteHeader } from '@/components/SiteHeader'
import { t } from '@/lib/i18n'
import type { Locale } from '@/lib/locale'
import { getCategories, getVideoArticles } from '@/lib/queries'

export async function VideoHubView({ locale }: { locale: Locale }) {
  const [videos, categories] = await Promise.all([
    getVideoArticles(locale),
    getCategories(locale),
  ])

  return (
    <>
      <SiteHeader locale={locale} categories={categories} altPath="/videos" />
      <main className="container">
        <h1 className="page-title">{t(locale, 'videos')}</h1>
        {videos.length === 0 ? (
          <p className="empty">{t(locale, 'empty')}</p>
        ) : (
          <div className="grid">
            {videos.map((a) => (
              <ArticleCard key={a.id} locale={locale} article={a} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
