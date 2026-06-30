import { homeMetadata } from '@/lib/metadata'
import { HomeView } from '@/views/HomeView'

export const revalidate = 60

export function generateMetadata() {
  return homeMetadata('ml')
}

export default function Page() {
  return <HomeView locale="ml" />
}
