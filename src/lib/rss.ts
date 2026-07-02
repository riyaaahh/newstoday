import { absoluteUrl, localePath, type Locale } from './locale'
import { getCategory, getLatestArticles } from './queries'
import { escapeXml } from './xml'
import type { Category } from '@/payload-types'

export async function buildRssFeed(locale: Locale, categorySlug?: string): Promise<string> {
  const articles = await getLatestArticles(locale, { limit: 30, categorySlug })
  let title = locale === 'ml' ? 'ന്യൂസ് ടുഡേ' : 'NewsToday'
  let selfPath = '/rss.xml'
  if (categorySlug) {
    const cat = await getCategory(locale, categorySlug)
    if (cat) title = `${title} — ${cat.name}`
    selfPath = `/rss.xml?category=${encodeURIComponent(categorySlug)}`
  }
  const selfUrl = absoluteUrl(localePath(locale, selfPath))
  const siteUrl = absoluteUrl(localePath(locale, '/'))

  const items = articles
    .map((a) => {
      const cat = typeof a.category === 'object' ? (a.category as Category) : null
      if (!cat) return ''
      const link = absoluteUrl(localePath(locale, `/${cat.slug}/${a.slug}`))
      const pub = new Date(a.publishedAt || a.createdAt).toUTCString()
      return (
        `<item>` +
        `<title>${escapeXml(a.title)}</title>` +
        `<link>${escapeXml(link)}</link>` +
        `<guid isPermaLink="true">${escapeXml(link)}</guid>` +
        (a.excerpt ? `<description>${escapeXml(a.excerpt)}</description>` : '') +
        `<pubDate>${pub}</pubDate>` +
        `</item>`
      )
    })
    .join('')

  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>` +
    `<title>${escapeXml(title)}</title>` +
    `<link>${escapeXml(siteUrl)}</link>` +
    `<description>${escapeXml(title)}</description>` +
    `<language>${locale}</language>` +
    `<atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml"/>` +
    items +
    `</channel></rss>`
  )
}
