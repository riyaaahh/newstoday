import { absoluteUrl, localePath, locales, type Locale } from '@/lib/locale'
import { getArticlesSince } from '@/lib/queries'
import { escapeXml } from '@/lib/xml'

export const revalidate = 300

const PUBLICATION_NAME = 'NewsToday'

// Google News sitemap: only articles from the last 48 hours.
export async function GET() {
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  const docs = (await getArticlesSince(since)) as unknown as Array<{
    slug: Record<Locale, string>
    title: Record<Locale, string>
    publishedAt?: string | null
    category: { slug?: Record<Locale, string> } | null
  }>

  const urls: string[] = []
  for (const a of docs) {
    for (const l of locales) {
      const catSlug = a.category?.slug?.[l]
      const artSlug = a.slug?.[l]
      const title = a.title?.[l]
      if (!catSlug || !artSlug || !title) continue
      const loc = absoluteUrl(localePath(l, `/${catSlug}/${artSlug}`))
      urls.push(
        `<url><loc>${escapeXml(loc)}</loc>` +
          `<news:news><news:publication>` +
          `<news:name>${escapeXml(PUBLICATION_NAME)}</news:name>` +
          `<news:language>${l}</news:language>` +
          `</news:publication>` +
          `<news:publication_date>${a.publishedAt}</news:publication_date>` +
          `<news:title>${escapeXml(title)}</news:title>` +
          `</news:news></url>`,
      )
    }
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ` +
    `xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">` +
    urls.join('') +
    `</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
