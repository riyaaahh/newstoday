import type { Locale } from '@/lib/locale'
import { embedSrc, youtubeThumb } from '@/lib/video'
import type { Article } from '@/payload-types'

export function VideoObjectJsonLd({
  locale,
  article,
}: {
  locale: Locale
  article: Article
}) {
  if (!article.videoUrl) return null
  const embed = embedSrc(article.videoUrl)
  const thumb = youtubeThumb(article.videoUrl)

  const data = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: article.title,
    description: article.excerpt || article.title,
    thumbnailUrl: thumb ? [thumb] : undefined,
    uploadDate: article.publishedAt || article.createdAt,
    embedUrl: embed || undefined,
    inLanguage: locale,
  }
  const json = JSON.stringify(data).replace(/</g, '\\u003c')

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
