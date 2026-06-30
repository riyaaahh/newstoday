import { categoryMetadata } from '@/lib/metadata'
import { CategoryView } from '@/views/CategoryView'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  return categoryMetadata('ml', category)
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  return <CategoryView locale="ml" slug={category} />
}
