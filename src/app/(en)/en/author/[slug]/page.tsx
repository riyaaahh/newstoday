import { authorMetadata } from '@/lib/metadata'
import { AuthorView } from '@/views/AuthorView'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return authorMetadata('en', slug)
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <AuthorView locale="en" slug={slug} />
}
