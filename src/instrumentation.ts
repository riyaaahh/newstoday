import type { Instrumentation } from 'next'

// Server/edge error monitoring — only active when SENTRY_DSN is set.
export async function register() {
  if (!process.env.SENTRY_DSN) return
  if (process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === 'edge') {
    const Sentry = await import('@sentry/nextjs')
    Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.1 })
  }
}

export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  if (!process.env.SENTRY_DSN) return
  const Sentry = await import('@sentry/nextjs')
  Sentry.captureRequestError(err, request, context)
}
