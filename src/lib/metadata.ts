import type { Metadata } from 'next'

import { t } from './i18n'
import { absoluteUrl, type Locale } from './locale'
import {
  getArticle,
  getArticleAlternatePaths,
  getAuthor,
  getCategory,
  getCategoryAlternatePaths,
  getTag,
  getTagAlternatePaths,
} from './queries'
import { buildAlternates } from './seo'

const SITE_NAME = 'NewsToday'
const DEFAULT_OG = '/og.png'

const mediaUrl = (m: unknown): string | undefined =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as { url?: string }).url === 'string'
    ? absoluteUrl((m as { url: string }).url)
    : undefined

export function homeMetadata(locale: Locale): Metadata {
  const title =
    locale === 'ml' ? 'ന്യൂസ് ടുഡേ — ഏറ്റവും പുതിയ വാർത്തകൾ' : 'NewsToday — Latest News'
  const description =
    locale === 'ml'
      ? 'കേരളവും ലോകവും — ഏറ്റവും പുതിയ വാർത്തകൾ.'
      : 'Kerala and the world — the latest news.'
  return {
    title,
    description,
    alternates: buildAlternates(locale, { ml: '/', en: '/' }),
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      locale,
      images: [DEFAULT_OG],
    },
  }
}

export async function categoryMetadata(locale: Locale, slug: string): Promise<Metadata> {
  const category = await getCategory(locale, slug)
  if (!category) return {}
  const alt = await getCategoryAlternatePaths(category.id)
  const title = `${category.name} — ${SITE_NAME}`
  return {
    title,
    description: category.description || undefined,
    alternates: alt ? buildAlternates(locale, alt) : undefined,
    openGraph: { title, type: 'website', siteName: SITE_NAME, locale, images: [DEFAULT_OG] },
  }
}

export function videosMetadata(locale: Locale): Metadata {
  const title = `${t(locale, 'videos')} — ${SITE_NAME}`
  return {
    title,
    alternates: buildAlternates(locale, { ml: '/videos', en: '/videos' }),
    openGraph: { title, type: 'website', siteName: SITE_NAME, locale, images: [DEFAULT_OG] },
  }
}

export function searchMetadata(locale: Locale): Metadata {
  return {
    title: `${t(locale, 'search')} — ${SITE_NAME}`,
    robots: { index: false, follow: true },
  }
}

export async function authorMetadata(locale: Locale, slug: string): Promise<Metadata> {
  const author = await getAuthor(locale, slug)
  if (!author) return {}
  const title = `${author.name} — ${SITE_NAME}`
  return {
    title,
    description: author.bio || undefined,
    alternates: buildAlternates(locale, { ml: `/author/${slug}`, en: `/author/${slug}` }),
    openGraph: { title, type: 'profile', siteName: SITE_NAME, locale, images: [DEFAULT_OG] },
  }
}

export async function tagMetadata(locale: Locale, slug: string): Promise<Metadata> {
  const tag = await getTag(locale, slug)
  if (!tag) return {}
  const alt = await getTagAlternatePaths(tag.id)
  const title = `${tag.name} — ${SITE_NAME}`
  return {
    title,
    alternates: alt ? buildAlternates(locale, alt) : undefined,
    openGraph: { title, type: 'website', siteName: SITE_NAME, locale, images: [DEFAULT_OG] },
  }
}

export async function articleMetadata(
  locale: Locale,
  categorySlug: string,
  slug: string,
): Promise<Metadata> {
  const article = await getArticle(locale, categorySlug, slug)
  if (!article) return {}
  const alt = await getArticleAlternatePaths(article.id)
  const description = article.meta?.description || article.excerpt || undefined
  const image = mediaUrl(article.meta?.image) || mediaUrl(article.heroImage)
  const title = article.meta?.title || `${article.title} — ${SITE_NAME}`
  return {
    title,
    description,
    alternates: alt ? buildAlternates(locale, alt) : undefined,
    openGraph: {
      title: article.meta?.title || article.title,
      description,
      type: 'article',
      siteName: SITE_NAME,
      locale,
      publishedTime: article.publishedAt || undefined,
      modifiedTime: article.updatedAt,
      images: [image ?? DEFAULT_OG],
    },
  }
}
