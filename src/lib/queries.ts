import { getPayload, type Where } from 'payload'

import config from '@/payload.config'

import { locales, type Locale } from './locale'
import type { Article, Category, Tag, User } from '@/payload-types'

export const getClient = async () => getPayload({ config: await config })

export async function getHomepage(locale: Locale) {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'homepage', locale, depth: 2 })
}

export async function getCategories(locale: Locale): Promise<Category[]> {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'categories',
    locale,
    limit: 100,
    sort: 'name',
    depth: 0,
  })
  return docs
}

export async function getLatestArticles(
  locale: Locale,
  opts: { limit?: number; categorySlug?: string } = {},
): Promise<Article[]> {
  const payload = await getClient()
  const and: Where[] = [{ _status: { equals: 'published' } }]
  if (opts.categorySlug) and.push({ 'category.slug': { equals: opts.categorySlug } })
  const { docs } = await payload.find({
    collection: 'articles',
    locale,
    where: { and },
    sort: '-publishedAt',
    limit: opts.limit ?? 20,
    depth: 1,
  })
  return docs
}

export async function getArticle(
  locale: Locale,
  categorySlug: string,
  slug: string,
): Promise<Article | null> {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'articles',
    locale,
    where: {
      and: [
        { _status: { equals: 'published' } },
        { slug: { equals: slug } },
        { 'category.slug': { equals: categorySlug } },
      ],
    },
    depth: 2,
    limit: 1,
  })
  return docs[0] ?? null
}

export async function getBreakingArticle(locale: Locale): Promise<Article | null> {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'articles',
    locale,
    where: {
      and: [{ _status: { equals: 'published' } }, { breaking: { equals: true } }],
    },
    sort: '-publishedAt',
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
}

export async function getCategory(locale: Locale, slug: string): Promise<Category | null> {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'categories',
    locale,
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
  })
  return docs[0] ?? null
}

/**
 * Returns the article's path (category-slug/slug) in BOTH locales, used to build
 * hreflang alternates. Reads with locale: 'all' so localized fields come back as
 * { ml, en } objects.
 */
export async function getArticleAlternatePaths(
  id: number | string,
): Promise<Record<Locale, string> | null> {
  const payload = await getClient()
  const article = (await payload.findByID({
    collection: 'articles',
    id,
    locale: 'all',
    depth: 0,
  })) as unknown as { slug: Record<Locale, string>; category: number | string }

  const categoryId = typeof article.category === 'object' ? (article.category as { id: number }).id : article.category
  const category = (await payload.findByID({
    collection: 'categories',
    id: categoryId,
    locale: 'all',
    depth: 0,
  })) as unknown as { slug: Record<Locale, string> }

  const paths = {} as Record<Locale, string>
  for (const l of locales) {
    const catSlug = category.slug?.[l]
    const artSlug = article.slug?.[l]
    if (!catSlug || !artSlug) return null
    paths[l] = `/${catSlug}/${artSlug}`
  }
  return paths
}

// ---------- Authors ----------

export async function getAuthor(locale: Locale, slug: string): Promise<User | null> {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'users',
    locale,
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
}

export async function getArticlesByAuthor(
  locale: Locale,
  authorId: number | string,
  limit = 24,
): Promise<Article[]> {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'articles',
    locale,
    where: {
      and: [{ _status: { equals: 'published' } }, { authors: { in: [authorId] } }],
    },
    sort: '-publishedAt',
    limit,
    depth: 1,
  })
  return docs
}

// ---------- Tags ----------

export async function getTag(locale: Locale, slug: string): Promise<Tag | null> {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'tags',
    locale,
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
  })
  return docs[0] ?? null
}

export async function getArticlesByTag(
  locale: Locale,
  slug: string,
  limit = 24,
): Promise<Article[]> {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'articles',
    locale,
    where: {
      and: [{ _status: { equals: 'published' } }, { 'tags.slug': { equals: slug } }],
    },
    sort: '-publishedAt',
    limit,
    depth: 1,
  })
  return docs
}

export async function getTagAlternatePaths(
  id: number | string,
): Promise<Record<Locale, string> | null> {
  const payload = await getClient()
  const tag = (await payload.findByID({
    collection: 'tags',
    id,
    locale: 'all',
    depth: 0,
  })) as unknown as { slug: Record<Locale, string> }

  const paths = {} as Record<Locale, string>
  for (const l of locales) {
    const slug = tag.slug?.[l]
    if (!slug) return null
    paths[l] = `/tag/${slug}`
  }
  return paths
}

/** Articles published since a given ISO timestamp, in all locales (for the news sitemap). */
export async function getArticlesSince(sinceISO: string, limit = 1000) {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'articles',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { publishedAt: { greater_than_equal: sinceISO } },
      ],
    },
    locale: 'all',
    depth: 1,
    limit,
    sort: '-publishedAt',
  })
  return docs
}

export async function getVideoArticles(locale: Locale, limit = 24): Promise<Article[]> {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'articles',
    locale,
    where: {
      and: [{ _status: { equals: 'published' } }, { videoUrl: { exists: true } }],
    },
    sort: '-publishedAt',
    limit,
    depth: 1,
  })
  return docs
}

export async function getApprovedComments(articleId: number | string) {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'comments',
    where: {
      and: [{ article: { equals: articleId } }, { approved: { equals: true } }],
    },
    sort: '-createdAt',
    limit: 200,
    depth: 0,
  })
  return docs
}

export async function getMostRead(locale: Locale, limit = 5): Promise<Article[]> {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'articles',
    locale,
    where: {
      and: [{ _status: { equals: 'published' } }, { views: { greater_than: 0 } }],
    },
    sort: '-views',
    limit,
    depth: 1,
  })
  return docs
}

// ---------- Static params (for ISR of dynamic routes) ----------

/** Recent published articles as { category, slug } for generateStaticParams. */
export async function articleParams(locale: Locale): Promise<{ category: string; slug: string }[]> {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'articles',
    where: { _status: { equals: 'published' } },
    locale,
    depth: 1,
    limit: 200,
    sort: '-publishedAt',
  })
  const out: { category: string; slug: string }[] = []
  for (const a of docs) {
    const cat = typeof a.category === 'object' ? a.category : null
    if (cat?.slug && a.slug) out.push({ category: cat.slug, slug: a.slug })
  }
  return out
}

/** Categories as { category } for generateStaticParams. */
export async function categoryParams(locale: Locale): Promise<{ category: string }[]> {
  const payload = await getClient()
  const { docs } = await payload.find({ collection: 'categories', locale, limit: 100, depth: 0 })
  return docs.filter((c) => c.slug).map((c) => ({ category: c.slug }))
}

// ---------- Redirects ----------

export async function getRedirect(
  path: string,
): Promise<{ to: string; permanent: boolean } | null> {
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'redirects',
    where: { from: { equals: path } },
    limit: 1,
    depth: 0,
  })
  const r = docs[0]
  return r ? { to: r.to, permanent: r.permanent ?? true } : null
}

// ---------- Search ----------

export async function searchArticles(
  locale: Locale,
  q: string,
  limit = 30,
): Promise<Article[]> {
  if (!q.trim()) return []
  const payload = await getClient()
  const { docs } = await payload.find({
    collection: 'articles',
    locale,
    where: {
      and: [
        { _status: { equals: 'published' } },
        { or: [{ title: { like: q } }, { excerpt: { like: q } }] },
      ],
    },
    sort: '-publishedAt',
    limit,
    depth: 1,
  })
  return docs
}

// ---------- Related ----------

export async function getRelatedArticles(
  locale: Locale,
  article: Article,
  limit = 4,
): Promise<Article[]> {
  const payload = await getClient()
  const tagIds = (article.tags ?? []).map((t) => (typeof t === 'object' ? t.id : t))
  const cat = article.category
  const categoryId = cat == null ? undefined : typeof cat === 'object' ? cat.id : cat

  const or: Where[] = []
  if (tagIds.length) or.push({ tags: { in: tagIds } })
  if (categoryId) or.push({ category: { equals: categoryId } })
  if (!or.length) return []

  const { docs } = await payload.find({
    collection: 'articles',
    locale,
    where: {
      and: [
        { _status: { equals: 'published' } },
        { id: { not_equals: article.id } },
        { or },
      ],
    },
    sort: '-publishedAt',
    limit,
    depth: 1,
  })
  return docs
}

/** Category path (/slug) in both locales for hreflang alternates. */
export async function getCategoryAlternatePaths(
  id: number | string,
): Promise<Record<Locale, string> | null> {
  const payload = await getClient()
  const category = (await payload.findByID({
    collection: 'categories',
    id,
    locale: 'all',
    depth: 0,
  })) as unknown as { slug: Record<Locale, string> }

  const paths = {} as Record<Locale, string>
  for (const l of locales) {
    const slug = category.slug?.[l]
    if (!slug) return null
    paths[l] = `/${slug}`
  }
  return paths
}
