import { NextResponse } from 'next/server'

import { isAllowedPushEndpoint } from '@/lib/push'
import { getClient } from '@/lib/queries'

type Body = {
  subscription?: { endpoint?: string; keys?: { p256dh?: string; auth?: string } }
  locale?: string
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Body
  const sub = body.subscription
  const endpoint = sub?.endpoint
  const p256dh = sub?.keys?.p256dh
  const auth = sub?.keys?.auth
  const locale = body.locale === 'en' ? 'en' : 'ml'

  if (!endpoint || !p256dh || !auth || !isAllowedPushEndpoint(endpoint)) {
    return NextResponse.json({ error: 'invalid_subscription' }, { status: 400 })
  }

  const payload = await getClient()
  const existing = await payload.find({
    collection: 'push-subscriptions',
    where: { endpoint: { equals: endpoint } },
    limit: 1,
    depth: 0,
  })

  try {
    if (existing.docs[0]) {
      await payload.update({
        collection: 'push-subscriptions',
        id: existing.docs[0].id,
        data: { p256dh, auth, locale },
      })
    } else {
      await payload.create({
        collection: 'push-subscriptions',
        data: { endpoint, p256dh, auth, locale },
      })
    }
  } catch (err) {
    // A concurrent subscribe for the same endpoint can lose the unique-index
    // race; if the row exists now, that's success.
    const recheck = await payload
      .find({ collection: 'push-subscriptions', where: { endpoint: { equals: endpoint } }, limit: 1 })
      .catch(() => null)
    if (recheck?.docs.length) return NextResponse.json({ ok: true })
    console.error('push subscribe failed:', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
