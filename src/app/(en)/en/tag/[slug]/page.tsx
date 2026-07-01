import { tagMetadata } from '@/lib/metadata'
import { TagView } from '@/views/TagView'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return tagMetadata('en', slug)
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <TagView locale="en" slug={slug} />
}
