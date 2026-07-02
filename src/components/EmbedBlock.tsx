const youtubeId = (url: string): string | null => {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  )
  return m?.[1] ?? null
}

const vimeoId = (url: string): string | null => {
  const m = url.match(/vimeo\.com\/(\d+)/)
  return m?.[1] ?? null
}

export function EmbedBlock({ url, caption }: { url: string; caption?: string | null }) {
  const yt = youtubeId(url)
  const vimeo = yt ? null : vimeoId(url)
  const src = yt
    ? `https://www.youtube-nocookie.com/embed/${yt}`
    : vimeo
      ? `https://player.vimeo.com/video/${vimeo}`
      : null

  // Only treat http(s) URLs as clickable — blocks javascript:/data: URI XSS.
  const isHttp = /^https?:\/\//i.test(url)

  return (
    <figure className="embed">
      {src ? (
        <div className="embed-video">
          <iframe
            src={src}
            title={caption || 'Embedded media'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      ) : isHttp ? (
        <a className="embed-link" href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      ) : (
        <span className="embed-link">{url}</span>
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
