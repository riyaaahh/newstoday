export const locales = ['ml', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'ml'

export const localeLabels: Record<Locale, string> = {
  ml: 'മലയാളം',
  en: 'English',
}

export const otherLocale = (l: Locale): Locale => (l === 'ml' ? 'en' : 'ml')

/** Malayalam is the default locale and lives at the root with no prefix; English is under /en. */
export const localePrefix = (l: Locale): string => (l === defaultLocale ? '' : `/${l}`)

/** Build a public path for a locale: localePath('ml', '/kerala/foo') -> '/kerala/foo'; ('en', ...) -> '/en/kerala/foo'. */
export const localePath = (l: Locale, path = '/'): string => {
  const prefix = localePrefix(l)
  if (path === '/') return prefix || '/'
  return `${prefix}${path.startsWith('/') ? '' : '/'}${path}`
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3210').replace(/\/$/, '')

export const absoluteUrl = (path: string): string => `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
