import type { MetadataRoute } from 'next'

import { absoluteUrl, localePath, locales, type Locale } from '@/lib/locale'
import { getClient } from '@/lib/queries'

export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getClient()
  const entries: MetadataRoute.Sitemap = []

  for (const l of locales) {
    entries.push({ url: absoluteUrl(localePath(l, '/')), changeFrequency: 'hourly', priority: 1 })
  }

  const { docs } = await payload.find({
    collection: 'articles',
    where: { _status: { equals: 'published' } },
    locale: 'all',
    depth: 1,
    limit: 1000,
    sort: '-publishedAt',
  })

  for (const a of docs as unknown as Array<{
    slug: Record<Locale, string>
    category: { slug?: Record<Locale, string> } | null
    updatedAt: string
  }>) {
    for (const l of locales) {
      const catSlug = a.category?.slug?.[l]
      const artSlug = a.slug?.[l]
      if (!catSlug || !artSlug) continue
      entries.push({
        url: absoluteUrl(localePath(l, `/${catSlug}/${artSlug}`)),
        lastModified: a.updatedAt,
        changeFrequency: 'daily',
        priority: 0.7,
      })
    }
  }

  return entries
}
