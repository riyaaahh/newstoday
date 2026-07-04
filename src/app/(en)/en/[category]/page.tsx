import { categoryMetadata } from '@/lib/metadata'
import { categoryParams } from '@/lib/queries'
import { CategoryView } from '@/views/CategoryView'

export const revalidate = 60

export function generateStaticParams() {
  return categoryParams('en')
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  return categoryMetadata('en', category)
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  return <CategoryView locale="en" slug={category} />
}
