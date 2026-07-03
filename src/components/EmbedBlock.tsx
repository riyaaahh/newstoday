import { embedSrc } from '@/lib/video'

export function EmbedBlock({ url, caption }: { url: string; caption?: string | null }) {
  const src = embedSrc(url)
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
