import { NextResponse } from 'next/server'

import { getClient } from '@/lib/queries'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string; locale?: string }
  const email = (body.email || '').trim().toLowerCase()
  const locale = body.locale === 'en' ? 'en' : 'ml'

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  }

  const payload = await getClient()
  try {
    await payload.create({ collection: 'subscribers', data: { email, locale } })
  } catch (err) {
    // A duplicate email is fine (idempotent). Anything else is a real failure
    // and must not be reported as success.
    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs.length === 0) {
      console.error('newsletter subscribe failed:', err)
      return NextResponse.json({ error: 'server_error' }, { status: 500 })
    }
  }
  return NextResponse.json({ ok: true })
}
