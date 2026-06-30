import { getPayload, type Where } from 'payload'

import config from '@/payload.config'

import { locales, type Locale } from './locale'
import type { Article, Category } from '@/payload-types'

export const getClient = async () => getPayload({ config: await config })

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
