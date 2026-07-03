import type { Metadata } from 'next'

import { buildAlternates } from '@/lib/seo'
import { PrivacyView } from '@/views/PrivacyView'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'സ്വകാര്യതാ നയം — NewsToday',
  alternates: buildAlternates('ml', { ml: '/privacy', en: '/privacy' }),
}

export default function Page() {
  return <PrivacyView locale="ml" />
}
