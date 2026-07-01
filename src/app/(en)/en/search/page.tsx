import { searchMetadata } from '@/lib/metadata'
import { SearchView } from '@/views/SearchView'

export const dynamic = 'force-dynamic'

export function generateMetadata() {
  return searchMetadata('en')
}

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  return <SearchView locale="en" q={q ?? ''} />
}
