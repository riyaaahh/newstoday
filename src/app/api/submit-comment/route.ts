import { NextResponse } from 'next/server'

import { getClient } from '@/lib/queries'

// NOTE: not /api/comments — that path is Payload's own REST endpoint for the
// comments collection (used by the admin moderation UI).
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    article?: unknown
    authorName?: unknown
    body?: unknown
  }
  const articleId = Number(body.article)
  const authorName = typeof body.authorName === 'string' ? body.authorName.trim() : ''
  const text = typeof body.body === 'string' ? body.body.trim() : ''

  if (!Number.isInteger(articleId) || articleId <= 0) {
    return NextResponse.json({ error: 'bad_article' }, { status: 400 })
  }
  if (authorName.length < 1 || authorName.length > 80 || text.length < 1 || text.length > 2000) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
  }

  const payload = await getClient()
  // Confirm the article exists and is published before accepting a comment.
  const article = await payload
    .findByID({ collection: 'articles', id: articleId, depth: 0 })
    .catch(() => null)
  if (!article || article._status !== 'published') {
    return NextResponse.json({ error: 'bad_article' }, { status: 400 })
  }

  try {
    // Local API create runs with overrideAccess, so this works even though the
    // collection blocks public REST/GraphQL creates.
    await payload.create({
      collection: 'comments',
      data: { article: articleId, authorName, body: text, approved: false },
    })
  } catch (err) {
    console.error('comment create failed:', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
  // Held for moderation.
  return NextResponse.json({ ok: true, moderated: true })
}
