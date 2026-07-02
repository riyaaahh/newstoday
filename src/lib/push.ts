import type { BasePayload } from 'payload'
import webpush from 'web-push'

import { absoluteUrl, localePath } from './locale'
import type { Article, Category } from '@/payload-types'

// Known Web Push service hosts. Validating the endpoint before we ever store or
// POST to it prevents SSRF (a subscriber can otherwise point the endpoint at an
// internal/arbitrary host that the server would then request on publish).
const ALLOWED_ENDPOINT_HOSTS = [
  'fcm.googleapis.com', // Chrome / FCM
  'updates.push.services.mozilla.com', // Firefox
  '.push.services.mozilla.com', // Firefox autopush nodes (suffix)
  '.notify.windows.com', // Edge / WNS (suffix)
  '.push.apple.com', // Safari (suffix)
]

export function isAllowedPushEndpoint(endpoint: unknown): boolean {
  if (typeof endpoint !== 'string') return false
  let url: URL
  try {
    url = new URL(endpoint)
  } catch {
    return false
  }
  if (url.protocol !== 'https:') return false
  const host = url.hostname.toLowerCase()
  return ALLOWED_ENDPOINT_HOSTS.some((h) =>
    h.startsWith('.') ? host.endsWith(h) : host === h,
  )
}

let configured: boolean | null = null

/** Configure web-push from env once. Returns false if VAPID keys are missing. */
function ensureConfigured(): boolean {
  if (configured !== null) return configured
  const publicKey = process.env.VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  if (!publicKey || !privateKey) {
    configured = false
    return false
  }
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:news@newstoday.test',
    publicKey,
    privateKey,
  )
  configured = true
  return true
}

/** Send a breaking-news push for an article to all subscriptions. No-op without VAPID keys. */
export async function sendBreakingPush(payload: BasePayload, articleId: number): Promise<void> {
  // Called fire-and-forget from an afterChange hook — never let it reject
  // (an unhandled rejection could crash the process).
  try {
    if (!ensureConfigured()) return

    // Fetch in the default locale to build the notification.
    const article = (await payload.findByID({
      collection: 'articles',
      id: articleId,
      locale: 'ml',
      depth: 1,
    })) as Article | null
    if (!article) return

    const cat = typeof article.category === 'object' ? (article.category as Category) : null
    if (!cat) return
    const url = absoluteUrl(localePath('ml', `/${cat.slug}/${article.slug}`))
    const body = JSON.stringify({ title: article.title, body: article.excerpt || '', url })

    const { docs: subs } = await payload.find({
      collection: 'push-subscriptions',
      limit: 5000,
      depth: 0,
    })

    await Promise.all(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            body,
          )
        } catch (err) {
          // Prune dead subscriptions (410 Gone / 404 Not Found).
          const statusCode = (err as { statusCode?: number }).statusCode
          if (statusCode === 410 || statusCode === 404) {
            await payload.delete({ collection: 'push-subscriptions', id: s.id }).catch(() => {})
          }
        }
      }),
    )
  } catch (err) {
    console.error('sendBreakingPush failed:', err)
  }
}
