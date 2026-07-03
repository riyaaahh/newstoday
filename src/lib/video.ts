export const youtubeId = (url: string): string | null => {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  )
  return m?.[1] ?? null
}

export const vimeoId = (url: string): string | null => {
  const m = url.match(/vimeo\.com\/(\d+)/)
  return m?.[1] ?? null
}

/** Privacy-friendly embed src for a supported video URL, or null. */
export const embedSrc = (url: string): string | null => {
  const yt = youtubeId(url)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt}`
  const v = vimeoId(url)
  if (v) return `https://player.vimeo.com/video/${v}`
  return null
}

/** YouTube thumbnail (for the video hub), or null for non-YouTube URLs. */
export const youtubeThumb = (url: string): string | null => {
  const id = youtubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}
