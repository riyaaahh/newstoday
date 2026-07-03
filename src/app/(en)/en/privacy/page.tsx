import type { Metadata } from 'next'

import { buildAlternates } from '@/lib/seo'
import { PrivacyView } from '@/views/PrivacyView'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Privacy policy — NewsToday',
  alternates: buildAlternates('en', { ml: '/privacy', en: '/privacy' }),
}

export default function Page() {
  return <PrivacyView locale="en" />
}
