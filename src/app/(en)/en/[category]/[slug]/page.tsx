import { articleMetadata } from '@/lib/metadata'
import { ArticleView } from '@/views/ArticleView'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  return articleMetadata('en', category, slug)
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  return <ArticleView locale="en" categorySlug={category} slug={slug} />
}
