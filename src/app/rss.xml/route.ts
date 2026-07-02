import { buildRssFeed } from '@/lib/rss'

export const revalidate = 300

export async function GET(req: Request) {
  const category = new URL(req.url).searchParams.get('category') || undefined
  const xml = await buildRssFeed('ml', category)
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
