import { videosMetadata } from '@/lib/metadata'
import { VideoHubView } from '@/views/VideoHubView'

export const revalidate = 60

export function generateMetadata() {
  return videosMetadata('ml')
}

export default function Page() {
  return <VideoHubView locale="ml" />
}
