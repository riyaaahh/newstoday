import Image from 'next/image'

import type { Media } from '@/payload-types'

/** Payload may return absolute same-origin URLs; next/image localPatterns need paths. */
function mediaSrc(url: string): string {
  if (url.startsWith('/')) return url
  try {
    const { pathname, search } = new URL(url)
    if (pathname.startsWith('/api/media/file/')) return `${pathname}${search}`
  } catch {
    // keep remote/blob URLs as-is
  }
  return url
}

export function MediaImage({
  media,
  sizes,
  priority,
  className,
}: {
  media?: Media | number | null
  sizes?: string
  priority?: boolean
  className?: string
}) {
  if (!media || typeof media === 'number' || !media.url) return null
  return (
    <Image
      src={mediaSrc(media.url)}
      alt={media.alt || ''}
      width={media.width || 1200}
      height={media.height || 675}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}
