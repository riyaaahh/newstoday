'use client'

import { useState } from 'react'

type Labels = {
  name: string
  comment: string
  post: string
  pending: string
  error: string
}

export function CommentForm({
  articleId,
  labels,
}: {
  articleId: number
  labels: Labels
}) {
  const [name, setName] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/submit-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article: articleId, authorName: name, body }),
      })
      if (res.ok) {
        setStatus('done')
        setName('')
        setBody('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') return <p className="comment-pending">{labels.pending}</p>

  return (
    <form className="comment-form" onSubmit={onSubmit}>
      <input
        type="text"
        required
        maxLength={80}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={labels.name}
        aria-label={labels.name}
      />
      <textarea
        required
        maxLength={2000}
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={labels.comment}
        aria-label={labels.comment}
      />
      <button type="submit" disabled={status === 'loading'}>
        {labels.post}
      </button>
      {status === 'error' && <p className="comment-error">{labels.error}</p>}
    </form>
  )
}
