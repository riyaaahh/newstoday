import { NextResponse } from 'next/server'

import { getClient } from '@/lib/queries'

// Atomic view increment via raw SQL — bypasses Payload hooks so it does NOT
// trigger revalidation, and avoids the read-modify-write race of an update().
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { id?: unknown }
  const id = Number(body.id)
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'bad_id' }, { status: 400 })
  }

  const payload = await getClient()
  try {
    const pool = (payload.db as { pool?: { query: (q: string, v: unknown[]) => Promise<unknown> } })
      .pool
    await pool?.query(
      "UPDATE articles SET views = COALESCE(views, 0) + 1 WHERE id = $1 AND _status = 'published'",
      [id],
    )
  } catch (err) {
    console.error('view increment failed:', err)
  }
  return NextResponse.json({ ok: true })
}
