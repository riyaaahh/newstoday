import { buildRssFeed } from '@/lib/rss'

export const revalidate = 300

export async function GET() {
  const xml = await buildRssFeed('en')
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
