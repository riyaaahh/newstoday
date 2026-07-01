'use client'

import { useState } from 'react'

type Labels = {
  title: string
  cta: string
  placeholder: string
  subscribe: string
  subscribed: string
  error: string
}

export function NewsletterSignup({ locale, labels }: { locale: 'ml' | 'en'; labels: Labels }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })
      setStatus(res.ok ? 'done' : 'error')
      if (res.ok) setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="newsletter">
      <h3 className="newsletter-title">{labels.title}</h3>
      <p className="newsletter-cta">{labels.cta}</p>
      {status === 'done' ? (
        <p className="newsletter-done">{labels.subscribed}</p>
      ) : (
        <form className="newsletter-form" onSubmit={onSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={labels.placeholder}
            aria-label={labels.placeholder}
          />
          <button type="submit" disabled={status === 'loading'}>
            {labels.subscribe}
          </button>
        </form>
      )}
      {status === 'error' && <p className="newsletter-error">{labels.error}</p>}
    </div>
  )
}
