import { articleMetadata } from '@/lib/metadata'
import { ArticleView } from '@/views/ArticleView'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  return articleMetadata('ml', category, slug)
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  return <ArticleView locale="ml" categorySlug={category} slug={slug} />
}
