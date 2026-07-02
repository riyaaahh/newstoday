import { permanentRedirect, redirect } from 'next/navigation'

import { getRedirect } from './queries'

/**
 * Checks the redirects table for the given public path and issues a 308/307 if
 * found. Called from views right before notFound(), so the DB is only queried on
 * URLs that would otherwise 404 (dead/changed links) — not on every request.
 */
export async function applyRedirect(path: string): Promise<void> {
  const r = await getRedirect(path)
  if (!r) return
  if (r.permanent) permanentRedirect(r.to)
  redirect(r.to)
}
