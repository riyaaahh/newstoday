'use client'

import { useState } from 'react'

export function ShareButtons({
  url,
  title,
  labels,
}: {
  url: string
  title: string
  labels: { share: string; copy: string; copied: string }
}) {
  const [copied, setCopied] = useState(false)
  const enc = encodeURIComponent
  const whatsapp = `https://wa.me/?text=${enc(`${title} ${url}`)}`
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`
  const x = `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`

  return (
    <div className="share">
      <span className="share-label">{labels.share}</span>
      <a className="share-btn wa" href={whatsapp} target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
      <a className="share-btn fb" href={facebook} target="_blank" rel="noopener noreferrer">
        Facebook
      </a>
      <a className="share-btn x" href={x} target="_blank" rel="noopener noreferrer">
        X
      </a>
      <button
        type="button"
        className="share-btn copy"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          } catch {
            /* clipboard unavailable */
          }
        }}
      >
        {copied ? labels.copied : labels.copy}
      </button>
    </div>
  )
}
