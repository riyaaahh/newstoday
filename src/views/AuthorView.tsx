import { notFound } from 'next/navigation'

import { ArticleCard } from '@/components/ArticleCard'
import { MediaImage } from '@/components/MediaImage'
import { SiteHeader } from '@/components/SiteHeader'
import { t } from '@/lib/i18n'
import { localePath, type Locale } from '@/lib/locale'
import { applyRedirect } from '@/lib/redirects'
import { getArticlesByAuthor, getAuthor, getCategories } from '@/lib/queries'
import type { Media } from '@/payload-types'

export async function AuthorView({ locale, slug }: { locale: Locale; slug: string }) {
  const author = await getAuthor(locale, slug)
  if (!author) {
    await applyRedirect(localePath(locale, `/author/${slug}`))
    notFound()
  }

  const [articles, categories] = await Promise.all([
    getArticlesByAuthor(locale, author.id),
    getCategories(locale),
  ])
  const avatar = typeof author.avatar === 'object' ? (author.avatar as Media) : null

  return (
    <>
      <SiteHeader locale={locale} categories={categories} altPath={`/author/${slug}`} />
      <main className="container">
        <div className="author-head">
          {avatar && <MediaImage media={avatar} sizes="96px" className="author-avatar" />}
          <div>
            <h1 className="page-title">{author.name}</h1>
            {author.title && <p className="author-role">{author.title}</p>}
            {author.bio && <p className="author-bio">{author.bio}</p>}
          </div>
        </div>
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
