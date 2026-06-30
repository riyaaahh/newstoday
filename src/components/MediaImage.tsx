import Image from 'next/image'

import type { Media } from '@/payload-types'

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
      src={media.url}
      alt={media.alt || ''}
      width={media.width || 1200}
      height={media.height || 675}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}
