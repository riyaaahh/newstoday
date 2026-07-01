import { ArticleCard } from '@/components/ArticleCard'
import { SiteHeader } from '@/components/SiteHeader'
import { t } from '@/lib/i18n'
import type { Locale } from '@/lib/locale'
import { getCategories, getHomepage, getLatestArticles } from '@/lib/queries'
import type { Article } from '@/payload-types'

const isPublished = (a: unknown): a is Article =>
  typeof a === 'object' && a !== null && (a as Article)._status === 'published'

export async function HomeView({ locale }: { locale: Locale }) {
  const [homepage, latest, categories] = await Promise.all([
    getHomepage(locale),
    getLatestArticles(locale, { limit: 20 }),
    getCategories(locale),
  ])

  // Editor-curated lead + featured, with graceful auto-fill from latest.
  const lead = isPublished(homepage.leadArticle) ? homepage.leadArticle : latest[0]
  const curated = (homepage.featuredArticles ?? []).filter(isPublished)

  const seen = new Set<number>()
  if (lead) seen.add(lead.id)
  const rest: Article[] = []
  for (const a of [...curated, ...latest]) {
    if (!isPublished(a) || seen.has(a.id)) continue
    seen.add(a.id)
    rest.push(a)
  }

  return (
    <>
      <SiteHeader locale={locale} categories={categories} altPath="/" />
      <main className="container">
        {!lead ? (
          <p className="empty">{t(locale, 'empty')}</p>
        ) : (
          <>
            <ArticleCard locale={locale} article={lead} variant="lead" />
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
