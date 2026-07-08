import type { Article } from '@/payload-types'

/** Hero image for cards and article header; falls back to SEO image when unset. */
export function articleCoverImage(article: Article) {
  return article.heroImage ?? article.meta?.image ?? null
}
